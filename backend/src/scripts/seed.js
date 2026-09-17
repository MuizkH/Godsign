import { supabaseAdmin } from '../config/supabase.js';

const usersToSeed = [
  {
    name: 'Admin Officer',
    email: 'admin@godsign.gov.in',
    role: 'admin',
    department: null,
  },
  {
    name: 'Ravi Kumar',
    email: 'police@godsign.gov.in',
    role: 'operator',
    department: 'police',
  },
  {
    name: 'Dr. Sunita Sharma',
    email: 'health@godsign.gov.in',
    role: 'operator',
    department: 'health',
  },
  {
    name: 'Rajesh Patel',
    email: 'revenue@godsign.gov.in',
    role: 'operator',
    department: 'revenue',
  },
  {
    name: 'Vikram Singh',
    email: 'transport@godsign.gov.in',
    role: 'operator',
    department: 'transport',
  },
  {
    name: 'Aarav Mehta',
    email: 'citizen@godsign.gov.in',
    role: 'citizen',
    department: null,
  },
];

const servicesToSeed = [
  {
    id: "serv_1",
    department_id: "police",
    category: "FIR",
    title: "File FIR / Complaint",
    description: "ISL sign translation for filing a police complaint."
  },
  {
    id: "serv_2",
    department_id: "health",
    category: "Emergency",
    title: "Hospital Admission",
    description: "ISL guide for emergency medical assistance."
  },
  {
    id: "serv_3",
    department_id: "revenue",
    category: "Taxation",
    title: "Land Record & Tax Queries",
    description: "ISL guidance for revenue tax and property certificates."
  },
  {
    id: "serv_4",
    department_id: "transport",
    category: "Licensing",
    title: "Driving License & RC Renewal",
    description: "ISL assistance for vehicle registration and driving license."
  }
];

const vocabulariesToSeed = [
  {
    id: "vocab_1",
    service_id: "serv_1",
    word: "Police",
    sign_key: "police_sign",
    media_type: "video",
    media_url: "https://awfcnolsokkjbrclgiuf.supabase.co/storage/v1/object/public/videos/WhatsApp%20Video%202026-08-23%20at%2023.54.47.mp4",
    instruction_text: "Extend index finger at chin and sweep downward twice."
  },
  {
    id: "vocab_2",
    service_id: "serv_2",
    word: "Hospital / Medical Emergency",
    sign_key: "hospital_sign",
    media_type: "video",
    media_url: "https://awfcnolsokkjbrclgiuf.supabase.co/storage/v1/object/public/videos/hospital.mp4",
    instruction_text: "Form cross on upper arm and gesture emergency assistance."
  },
  {
    id: "vocab_3",
    service_id: "serv_4",
    word: "Driving License",
    sign_key: "driving_license_sign",
    media_type: "video",
    media_url: "https://awfcnolsokkjbrclgiuf.supabase.co/storage/v1/object/public/videos/driving%20license.mp4",
    instruction_text: "Imitate steering wheel grip and show card gesture."
  },
  {
    id: "vocab_4",
    service_id: "serv_1",
    word: "Thank You",
    sign_key: "thank_you_sign",
    media_type: "video",
    media_url: "https://awfcnolsokkjbrclgiuf.supabase.co/storage/v1/object/public/videos/thank%20you.mp4",
    instruction_text: "Touch lips with fingertips of open flat hand and move outward."
  }
];

const feedbackToSeed = [
  {
    id: "fb_101",
    rating: 5,
    comments: "Excellent service and quick ISL translation at counter!",
    kiosk_id: "kiosk_01",
    department: "police",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "fb_102",
    rating: 4,
    comments: "Very clear sign language instructions provided by officer.",
    kiosk_id: "kiosk_02",
    department: "health",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: "fb_103",
    rating: 5,
    comments: "Smooth experience filing my application.",
    kiosk_id: "kiosk_01",
    department: "revenue",
    created_at: new Date().toISOString()
  }
];

const lessonsToSeed = [
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

const staffRosterToSeed = [
  { name: "Rajesh Kumar", role: "Inspector", lessons: "30/30", lastActive: "Today", status: "certified" },
  { name: "Anita Singh", role: "Sub-Inspector", lessons: "24/30", lastActive: "Yesterday", status: "progress" },
  { name: "Amit Patel", role: "Constable", lessons: "12/30", lastActive: "3 days ago", status: "progress" },
  { name: "Priya Verma", role: "Desk Officer", lessons: "2/30", lastActive: "1 week ago", status: "progress" },
  { name: "Suresh Rao", role: "Assistant", lessons: "0/30", lastActive: "Never", status: "not_started" }
];

const seedDB = async () => {
  try {
    console.log('Fetching existing users from Supabase Auth to clean up old test accounts...');
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 100
    });

    if (listError) {
      console.warn(`Warning listing users: ${listError.message}`);
    } else if (users) {
      const testUsersToDelete = users.filter(u => u.email && u.email.endsWith('@godsign.gov.in'));
      console.log(`Found ${testUsersToDelete.length} matching test users to prune.`);
      for (const u of testUsersToDelete) {
        await supabaseAdmin.auth.admin.deleteUser(u.id);
      }
    }

    console.log('Pruning complete. Creating fresh development users...');
    for (const u of usersToSeed) {
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: u.email,
        password: 'password123',
        email_confirm: true,
      });

      if (authError || !authUser?.user) {
        console.warn(`Auth user creation issue for ${u.email}:`, authError?.message);
        continue;
      }

      await supabaseAdmin
        .from('profiles')
        .upsert({
          id: authUser.user.id,
          name: u.name,
          role: u.role,
          department: u.department,
        });
      console.log(`Successfully seeded user: ${u.email}`);
    }

    console.log('Seeding Services & Vocabularies in Supabase...');
    const { error: servErr } = await supabaseAdmin.from('services').upsert(servicesToSeed);
    if (servErr) console.warn('Services seed table note:', servErr.message);

    const { error: vocabErr } = await supabaseAdmin.from('vocabularies').upsert(vocabulariesToSeed);
    if (vocabErr) console.warn('Vocabularies seed table note:', vocabErr.message);

    console.log('Seeding Feedback records in Supabase...');
    const { error: fbErr } = await supabaseAdmin.from('feedback').upsert(feedbackToSeed);
    if (fbErr) console.warn('Feedback seed table note:', fbErr.message);

    console.log('Seeding Lessons in Supabase...');
    const { error: lessonErr } = await supabaseAdmin.from('lessons').upsert(lessonsToSeed);
    if (lessonErr) console.warn('Lessons seed table note:', lessonErr.message);

    console.log('Seeding Staff Roster in Supabase...');
    const { error: staffErr } = await supabaseAdmin.from('staff_roster').upsert(staffRosterToSeed);
    if (staffErr) console.warn('Staff Roster seed table note:', staffErr.message);

    console.log('All dummy data successfully pushed to Supabase Database!');
    process.exit(0);
  } catch (error) {
    console.error(`Error during database seed execution: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
