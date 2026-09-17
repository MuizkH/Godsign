import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import { requestId, requestLogger } from './middleware/requestLogger.js';
import { apiLimiter, authLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { protect, authorize } from './middleware/auth.js';

// Ensure env is loaded (startup validation happens in server.js)
dotenv.config();

const app = express();

// 1. Request ID attachment
app.use(requestId);

// 2. Security Headers (Helmet)
app.use(helmet());

// 3. CORS Configuration
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. server-to-server or testing scripts)
      if (!origin) return callback(null, true);

      if (origin === allowedOrigin) {
        return callback(null, true);
      }

      const corsError = new Error(`Origin ${origin} is not allowed by CORS`);
      corsError.statusCode = 403;
      corsError.code = 'FORBIDDEN';
      return callback(corsError);
    },
    credentials: true,
  })
);

// 4. Request Body Size Limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 5. Rate Limiting
// General rate limiter applied globally
app.use(apiLimiter);

// Stricter rate limiter applied specifically to authentication paths
app.use('/api/auth', authLimiter);

// 6. Safe Audit Logging
app.use(requestLogger);

// Health Check / Base Route
app.get('/', (req, res) => {
  res.json({ message: 'GodSign ISL API (Supabase Integration) is running safely' });
});

// 7. Mount Routers
app.use('/api/auth', authRoutes);

// Data Stores for ISL content, progress tracking and kiosk feedback
const SERVICES_DATA = [
  {
    id: "serv_1",
    department_id: "police",
    category: "FIR",
    title: "File FIR / Complaint",
    description: "ISL sign translation for filing a police complaint.",
    vocabularies: [
      {
        id: "vocab_1",
        word: "Police",
        sign_key: "police_sign",
        media_type: "video",
        media_url: "https://awfcnolsokkjbrclgiuf.supabase.co/storage/v1/object/public/videos/WhatsApp%20Video%202026-08-23%20at%2023.54.47.mp4",
        instruction_text: "Extend index finger at chin and sweep downward twice."
      }
    ]
  },
  {
    id: "serv_2",
    department_id: "health",
    category: "Emergency",
    title: "Hospital Admission / Medical Emergency",
    description: "ISL guide for emergency medical assistance.",
    vocabularies: [
      {
        id: "vocab_2",
        word: "Hospital / Medical Emergency",
        sign_key: "hospital_sign",
        media_type: "video",
        media_url: "https://awfcnolsokkjbrclgiuf.supabase.co/storage/v1/object/public/videos/hospital.mp4",
        instruction_text: "Form cross on upper arm and gesture emergency assistance."
      }
    ]
  },
  {
    id: "serv_3",
    department_id: "transport",
    category: "Licensing",
    title: "Driving License & RC Renewal",
    description: "ISL assistance for vehicle registration and driving license.",
    vocabularies: [
      {
        id: "vocab_3",
        word: "Driving License",
        sign_key: "driving_license_sign",
        media_type: "video",
        media_url: "https://awfcnolsokkjbrclgiuf.supabase.co/storage/v1/object/public/videos/driving%20license.mp4",
        instruction_text: "Imitate steering wheel grip and show card gesture."
      }
    ]
  },
  {
    id: "serv_4",
    department_id: "general",
    category: "Courtesy",
    title: "Thank You / Feedback",
    description: "ISL sign gesture for expressing gratitude.",
    vocabularies: [
      {
        id: "vocab_4",
        word: "Thank You",
        sign_key: "thank_you_sign",
        media_type: "video",
        media_url: "https://awfcnolsokkjbrclgiuf.supabase.co/storage/v1/object/public/videos/thank%20you.mp4",
        instruction_text: "Touch lips with fingertips of open flat hand and move outward."
      }
    ]
  }
];

const LESSONS_DATA = [
  { 
    id: 1, 
    name: "Letter A", 
    sign: "👍", 
    instruction: "Make a closed fist with thumb pointing upwards.",
    video_url: "https://awfcnolsokkjbrclgiuf.supabase.co/storage/v1/object/public/videos/WhatsApp%20Video%202026-08-23%20at%2023.56.19.mp4"
  },
  { 
    id: 2, 
    name: "Letter B", 
    sign: "✋", 
    instruction: "Open palm with fingers held tightly together.",
    video_url: "https://awfcnolsokkjbrclgiuf.supabase.co/storage/v1/object/public/videos/WhatsApp%20Video%202026-08-23%20at%2023.57.56.mp4"
  },
  { 
    id: 3, 
    name: "Letter C", 
    sign: "🤏", 
    instruction: "Curved hand forming C shape.",
    video_url: "https://awfcnolsokkjbrclgiuf.supabase.co/storage/v1/object/public/videos/WhatsApp%20Video%202026-08-23%20at%2023.54.52.mp4"
  },
  { id: 4, name: "Letter D", sign: "☝️", instruction: "Point index finger straight up with thumb touching middle finger." },
  { id: 5, name: "Letter E", sign: "✊", instruction: "Curl all fingers tightly against the palm." }
];

let userProgressStore = {
  xp: 120,
  streakCount: 3,
  completedLessons: [1, 2]
};

let feedbackStore = [];

// Validation Schemas for teammate routes
import { z } from 'zod';
import { validateRequest } from './middleware/validator.js';

const completeLessonSchema = z.object({
  lessonId: z.number().int().positive("lessonId must be a positive integer"),
  xpGained: z.number().int().nonnegative().optional(),
});

const feedbackSchema = z.object({
  rating: z.number().int().min(1).max(5).default(5),
  comments: z.string().max(1000).optional(),
  kioskId: z.string().min(1).optional(),
  department: z.string().min(1).optional(),
});

import { supabaseAdmin } from './config/supabase.js';

// REST API ROUTES
app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('profiles').select('*');
    if (!error && data && data.length > 0) {
      const formatted = data.map(p => ({
        id: p.id,
        name: p.name,
        email: `${p.name.toLowerCase().replace(/\s+/g, '.')}@godsign.gov.in`,
        role: p.role ? (p.role.charAt(0).toUpperCase() + p.role.slice(1)) : 'Operator',
        status: p.is_active ? 'Active' : 'Inactive'
      }));
      return res.json(formatted);
    }
  } catch (err) {
    console.warn("Supabase profiles query note:", err.message);
  }
  res.json(usersStore);
});

app.get('/api/services', async (req, res) => {
  try {
    const { department } = req.query;
    let query = supabaseAdmin.from('services').select(`*, vocabularies (*)`);
    if (department) {
      query = query.eq('department_id', department);
    }
    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return res.json(data);
    }
  } catch (err) {
    console.warn("Supabase services query note:", err.message);
  }
  const { department } = req.query;
  if (department) {
    return res.json(SERVICES_DATA.filter(s => s.department_id === department));
  }
  res.json(SERVICES_DATA);
});

app.get('/api/lessons', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('lessons').select('*');
    if (!error && data && data.length > 0) {
      return res.json(data);
    }
  } catch (err) {
    console.warn("Supabase lessons query note:", err.message);
  }
  res.json(LESSONS_DATA);
});

app.get('/api/progress', (req, res) => {
  res.json({
    xp: userProgressStore.xp,
    streakCount: userProgressStore.streakCount,
    completedLessons: userProgressStore.completedLessons,
    totalLessons: LESSONS_DATA.length,
    percentage: Math.round((userProgressStore.completedLessons.length / LESSONS_DATA.length) * 100)
  });
});

app.post('/api/progress/complete-lesson', validateRequest(completeLessonSchema), (req, res) => {
  const { lessonId, xpGained = 10 } = req.body;
  if (lessonId && !userProgressStore.completedLessons.includes(lessonId)) {
    userProgressStore.completedLessons.push(lessonId);
    userProgressStore.xp += xpGained;
  }
  res.json({
    message: "Progress updated successfully",
    progress: userProgressStore
  });
});

app.post('/api/feedback', validateRequest(feedbackSchema), async (req, res) => {
  const { rating, comments, kioskId, department } = req.body;
  const newFeedback = {
    id: `fb_${Date.now()}`,
    rating: rating || 5,
    comments: comments || "No comments",
    kioskId: kioskId || "kiosk_01",
    department: department || "general",
    createdAt: new Date().toISOString()
  };

  feedbackStore.push(newFeedback);

  try {
    await supabaseAdmin.from('feedback').insert([{
      id: newFeedback.id,
      rating: newFeedback.rating,
      comments: newFeedback.comments,
      kiosk_id: newFeedback.kioskId,
      department: newFeedback.department,
      created_at: newFeedback.createdAt
    }]);
  } catch (err) {
    console.warn("Supabase feedback insert note:", err.message);
  }

  // Broadcast using Socket.IO instance attached to app
  const io = req.app.get('io');
  if (io) {
    io.emit('new_feedback_received', newFeedback);
  }

  res.status(201).json({
    message: "Feedback recorded successfully",
    feedback: newFeedback
  });
});

app.get('/api/feedback', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('feedback').select('*');
    if (!error && data && data.length > 0) {
      return res.json(data);
    }
  } catch (err) {
    console.warn("Supabase feedback fetch note:", err.message);
  }
  res.json(feedbackStore);
});

app.get('/api/reports/summary', async (req, res) => {
  let dbFeedbacks = feedbackStore;
  try {
    const { data, error } = await supabaseAdmin.from('feedback').select('*');
    if (!error && data && data.length > 0) {
      dbFeedbacks = data;
    }
  } catch (err) {
    console.warn("Supabase reports summary feedback fetch note:", err.message);
  }

  const totalFeedbackCount = dbFeedbacks.length;
  
  let avgRating = 4.2;
  if (totalFeedbackCount > 0) {
    const sum = dbFeedbacks.reduce((acc, fb) => acc + (Number(fb.rating) || 5), 0);
    avgRating = Number((sum / totalFeedbackCount).toFixed(1));
  }

  const baseInteractions = 342;
  const totalInteractions = baseInteractions + totalFeedbackCount;

  const departmentRosters = {
    police: [
      { name: "Rajesh Kumar", role: "Inspector", lessons: "30/30", lastActive: "Today", status: "certified" },
      { name: "Anita Singh", role: "Sub-Inspector", lessons: "24/30", lastActive: "Yesterday", status: "progress" },
      { name: "Amit Patel", role: "Constable", lessons: "12/30", lastActive: "3 days ago", status: "progress" },
      { name: "Priya Verma", role: "Desk Officer", lessons: "2/30", lastActive: "1 week ago", status: "progress" },
      { name: "Suresh Rao", role: "Assistant", lessons: "0/30", lastActive: "Never", status: "not_started" }
    ],
    health: [
      { name: "Dr. Sunita Sharma", role: "Chief Medical Officer", lessons: "30/30", lastActive: "Today", status: "certified" },
      { name: "Dr. Vikram Adani", role: "Senior Resident Doctor", lessons: "26/30", lastActive: "Today", status: "progress" },
      { name: "Meena Kumari", role: "Head Nurse", lessons: "18/30", lastActive: "Yesterday", status: "progress" },
      { name: "Alok Verma", role: "Triage Officer", lessons: "5/30", lastActive: "4 days ago", status: "progress" },
      { name: "Sunita Roy", role: "Ward Assistant", lessons: "0/30", lastActive: "Never", status: "not_started" }
    ],
    revenue: [
      { name: "Rajesh Patel", role: "Tehsildar", lessons: "30/30", lastActive: "Today", status: "certified" },
      { name: "Sunita Sharma", role: "Naib Tehsildar", lessons: "22/30", lastActive: "Yesterday", status: "progress" },
      { name: "Sanjay Gupta", role: "Revenue Inspector", lessons: "14/30", lastActive: "2 days ago", status: "progress" },
      { name: "Kavita Joshi", role: "Patwari / Desk Officer", lessons: "4/30", lastActive: "5 days ago", status: "progress" },
      { name: "Ramesh Chand", role: "Record Assistant", lessons: "0/30", lastActive: "Never", status: "not_started" }
    ],
    transport: [
      { name: "Vikram Singh", role: "RTO Inspector", lessons: "30/30", lastActive: "Today", status: "certified" },
      { name: "Pooja Sharma", role: "Assistant RTO", lessons: "25/30", lastActive: "Today", status: "progress" },
      { name: "Manoj Verma", role: "Licensing Officer", lessons: "15/30", lastActive: "Yesterday", status: "progress" },
      { name: "Deepa Nair", role: "Vehicle Inspector", lessons: "3/30", lastActive: "1 week ago", status: "progress" },
      { name: "Rahul Saxena", role: "Counter Assistant", lessons: "0/30", lastActive: "Never", status: "not_started" }
    ]
  };

  const reqDept = req.query.department || 'police';
  let staffRoster = departmentRosters[reqDept] || departmentRosters.police;

  try {
    const { data: staffData, error: staffErr } = await supabaseAdmin.from('staff_roster').select('*');
    if (!staffErr && staffData && staffData.length > 0) {
      staffRoster = staffData;
    }
  } catch (err) {
    console.warn("Supabase staff roster fetch note:", err.message);
  }

  const monthlyData = [
    { month: "Jul", value: 120, height: "h-[40%]" },
    { month: "Aug", value: 165, height: "h-[55%]" },
    { month: "Sep", value: 135, height: "h-[45%]" },
    { month: "Oct", value: 210, height: "h-[70%]" },
    { month: "Nov", value: 255, height: "h-[85%]" },
    { month: "Dec", value: 342 + totalFeedbackCount, height: "h-[100%]", highlight: true }
  ];

  const topPhrase = {
    title: "How can I help you?",
    count: 87 + totalFeedbackCount
  };

  const certification = {
    progressPercentage: 62,
    badgeText: "Bronze Threshold Met — Audit Eligible",
    tier: "Bronze"
  };

  res.json({
    totalInteractions,
    avgRating,
    feedbackCount: totalFeedbackCount,
    monthlyData,
    staffRoster,
    topPhrase,
    certification
  });
});

// Test endpoints for verification suite (only active in test environment)
if (process.env.NODE_ENV === 'test') {
  app.get('/test-api', apiLimiter, (req, res) => {
    res.json({ message: 'api success' });
  });

  app.get('/test-auth-limiter', authLimiter, (req, res) => {
    res.json({ message: 'auth success' });
  });

  const testLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  app.post('/test-validate', validateRequest(testLoginSchema), (req, res) => {
    res.json({ success: true, data: req.body });
  });

  app.get('/test-protected', protect, (req, res) => {
    res.json({ success: true, user: req.user });
  });

  app.get('/test-admin', protect, authorize('admin'), (req, res) => {
    res.json({ success: true });
  });
}

// 8. 404 Handler for undefined routes
app.use((req, res, next) => {
  const error = new Error(`Route ${req.method} ${req.path} not found`);
  error.statusCode = 404;
  error.code = 'NOT_FOUND';
  next(error);
});

// 9. Centralized Error Handler (Must be registered last)
app.use(errorHandler);

export default app;
