import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json());

// 📍 Fix Path: Uploads directory at Project Root (1 level up from src/)
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static uploaded media files
app.use('/uploads', express.static(uploadDir));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// Health Check Root Route
app.get('/', (req, res) => {
  res.json({
    message: "GodSign ISL Backend API & WebSocket Server Active!",
    location: "src/server.js",
    endpoints: [
      "/api/lessons",
      "/api/services",
      "/api/progress",
      "/api/feedback",
      "/api/users",
      "/api/upload"
    ]
  });
});

// =========================================
// IN-MEMORY DATA STORES
// =========================================

let usersStore = [
  { id: "usr_1", name: "Rahul Sharma", email: "rahul@godsign.gov.in", role: "Operator", status: "Active" },
  { id: "usr_2", name: "Priya Patel", email: "priya@godsign.gov.in", role: "Admin", status: "Active" }
];

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
  }
];

let userProgressStore = { xp: 120, streakCount: 3, completedLessons: [1] };
let feedbackStore = [];

// =========================================
// REST API ROUTES
// =========================================

// User Management
app.get('/api/users', (req, res) => res.json(usersStore));

app.post('/api/users', (req, res) => {
  const { name, email, role = "Operator" } = req.body;
  const newUser = {
    id: `usr_${Date.now()}`,
    name: name || "New User",
    email: email || "user@godsign.gov.in",
    role,
    status: "Active"
  };
  usersStore.push(newUser);
  res.status(201).json({ message: "User created successfully", user: newUser });
});

app.patch('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { role, status } = req.body;
  const user = usersStore.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: "User not found" });
  if (role) user.role = role;
  if (status) user.status = status;
  res.json({ message: "User updated successfully", user });
});

// File Upload
app.post('/api/upload', upload.single('media'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(201).json({
    message: "File uploaded successfully",
    fileName: req.file.filename,
    mediaUrl: fileUrl,
    mimeType: req.file.mimetype
  });
});

// Services, Lessons & Progress
app.get('/api/services', (req, res) => res.json(SERVICES_DATA));
app.get('/api/lessons', (req, res) => res.json(LESSONS_DATA));
app.get('/api/progress', (req, res) => res.json(userProgressStore));

app.post('/api/progress/complete-lesson', (req, res) => {
  const { lessonId, xpGained = 10 } = req.body;
  if (lessonId && !userProgressStore.completedLessons.includes(lessonId)) {
    userProgressStore.completedLessons.push(lessonId);
    userProgressStore.xp += xpGained;
  }
  res.json({ message: "Progress updated", progress: userProgressStore });
});

// Feedback System
app.post('/api/feedback', (req, res) => {
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
  io.emit('new_feedback_received', newFeedback);
  res.status(201).json({ message: "Feedback recorded", feedback: newFeedback });
});

app.get('/api/feedback', (req, res) => res.json(feedbackStore));

app.get('/api/reports/summary', (req, res) => {
  const totalFeedbackCount = feedbackStore.length;
  
  let avgRating = 4.2;
  if (totalFeedbackCount > 0) {
    const sum = feedbackStore.reduce((acc, fb) => acc + (Number(fb.rating) || 5), 0);
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
  const staffRoster = departmentRosters[reqDept] || departmentRosters.police;

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

// WebSocket Events
io.on('connection', (socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);
  socket.on('kiosk_session_start', (data) => {
    io.emit('operator_kiosk_alert', {
      event: 'CITIZEN_INTERACTING',
      kioskId: data?.kioskId || 'Kiosk-01',
      department: data?.department || 'Police',
      timestamp: new Date()
    });
  });
  socket.on('disconnect', () => console.log(`🔥 Client disconnected: ${socket.id}`));
});

const PORT = 5000;
httpServer.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));