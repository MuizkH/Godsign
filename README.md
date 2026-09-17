# 🤟 GodSign ISL — Indian Sign Language Accessibility Platform

**GodSign ISL** is an end-to-end accessibility platform designed to bridge communication gaps for the Deaf and Hard-of-Hearing community across government public service offices (Police, Health, Transport, Revenue) and citizen touchpoints.

It combines real-time **Socket.IO kiosk-to-officer pairing**, **MediaPipe AI hand landmark recognition**, **gamified ISL learning modules**, and a **Supabase-backed analytics & reporting audit suite**.

---

## 🌟 Key Features

### 🏛️ 1. Real-Time Kiosk & Officer Dashboard Pairing
- **Dual-Screen Communication**: Enables public service officers to communicate with deaf citizens at physical kiosks/tablets in real-time.
- **Bilingual Phrase Delivery**: Instant transmission of essential phrases (English & Hindi) paired with ISL video demonstrations directly to citizen kiosk screens.
- **WebSocket Synchronization**: Powered by Socket.IO (`kiosk_join`, `send_to_tablet`, `receive_phrase`, `operator_kiosk_alert`).

### 🤖 2. AI-Powered ISL Gesture Recognition
- **MediaPipe Hands Integration**: Camera-based real-time 21-point hand landmark extraction directly in the browser.
- **Gesture Verification & Practice**: Practice hand signs for letters (A-E) and government service vocabulary (FIR filing, Hospital emergency, Driving License renewal) with immediate visual feedback.

### 📚 3. Gamified ISL Learning & Certification
- **Interactive Lessons**: Step-by-step video instruction, visual sign guides, and interactive camera practice.
- **Gamification Engine**: Earn XP points, maintain daily streaks, unlock badges, and receive celebratory confetti upon lesson completion.
- **Downloadable Certificates**: Dynamic PDF certificate generation (`jsPDF` & `html2canvas`) upon course completion.

### 📊 4. Department Analytics & Compliance Audits
- **Officer & Kiosk Metrics**: Real-time stats on monthly citizen interactions, average department ratings, and popular phrase queries.
- **Staff Training Roster**: Track officer training progress (Certified, In Progress, Not Started) across police stations, hospitals, RTOs, and revenue centers.
- **Certification Tiering**: Track government accessibility compliance (Bronze, Silver, Gold thresholds).

---

## 📁 Repository Structure

```text
├── backend/
│   ├── src/
│   │   ├── config/         # Supabase client & environment validation
│   │   ├── controllers/    # Authentication & API business logic
│   │   ├── middleware/     # Auth guard, rate limiting, request logging, Zod validation
│   │   ├── routes/         # Express API routes (/api/auth, /api/services, etc.)
│   │   ├── scripts/        # Database seed scripts
│   │   ├── app.js          # Express app configuration & REST routes
│   │   └── server.js       # HTTP & Socket.IO WebSockets server
│   ├── .env.example        # Backend environment template
│   └── package.json        # Backend dependencies & scripts
│
├── src/
│   ├── assets/             # Media & graphic assets
│   ├── components/         # Reusable React components & Protected Routes
│   ├── context/            # AuthContext & global state management
│   ├── hooks/              # Custom React hooks (camera, gestures, socket)
│   ├── pages/              # Application views (Dashboard, Kiosk, Learning, Reports)
│   │   ├── DashboardPage.jsx       # Officer interaction dashboard
│   │   ├── KioskIdlePage.jsx       # Kiosk attract screen
│   │   ├── KioskInteractivePage.jsx# Kiosk real-time citizen screen
│   │   ├── KioskSelectionPage.jsx  # Department & service selection
│   │   ├── KioskFeedbackPage.jsx   # Citizen satisfaction rating
│   │   ├── LandingPage.jsx         # Home portal
│   │   ├── LearningPage.jsx        # ISL curriculum
│   │   ├── Practice.jsx            # MediaPipe camera sign practice
│   │   ├── LearningCompletePage.jsx# Course completion & PDF certificate generator
│   │   └── ReportsPage.jsx         # Executive analytics & staff rosters
│   ├── utils/              # MediaPipe draw utilities & sign reference matchers
│   ├── App.jsx             # React Router structure
│   └── main.jsx            # App entrypoint
│
├── supabase/
│   └── migrations/         # SQL schema & Row Level Security (RLS) policies
├── index.html              # HTML shell
├── tailwind.config.js      # Custom theme styling & colors
└── vite.config.js          # Vite build config
```

---

## 💻 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, MediaPipe Hands (`@mediapipe/hands`), Lucide Icons, Socket.IO Client, Canvas-Confetti, jsPDF, html2canvas
- **Backend**: Node.js, Express, Socket.IO, Zod Validation, Express Rate Limit, Helmet Security
- **Database & Storage**: Supabase PostgreSQL, Supabase Auth, Supabase Storage (for ISL video hosting)

---

## 🛠️ Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Supabase Account**: (Optional for local mockup fallback, required for live DB persistence)

---

## 🚀 Environment Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Harsh20056/GodSign_ISL.git
cd GodSign_ISL
```

### 2. Configure Environment Variables

#### Frontend Configuration (`.env` in root)
Copy `.env.example` to `.env`:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_SOCKET_URL=http://localhost:5000
```

#### Backend Configuration (`backend/.env`)
Copy `backend/.env.example` to `backend/.env`:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SECRET_KEY=your_supabase_service_role_key
NODE_ENV=development
```

---

## ⚡ Running the Application

Start both the backend server and frontend development server in separate terminals:

### Terminal 1: Backend Server (Express + Socket.IO)
```bash
cd backend
npm install
npm run dev
```
*The backend server will run on `http://localhost:5000`.*

### Terminal 2: Frontend Client (Vite + React)
```bash
# In project root directory
npm install
npm run dev
```
*The web interface will run on `http://localhost:5173`.*

---

## 🔑 Demo Access Credentials

All demo accounts share the standard password: **`password123`**

| Role / Department | Email | Default Password | Access Level & Landing View |
| :--- | :--- | :--- | :--- |
| 🚓 **Police Operator** | `police@godsign.gov.in` | `password123` | Police Kiosk Officer Dashboard (`/dashboard`) |
| 🏥 **Health Operator** | `health@godsign.gov.in` | `password123` | Hospital Kiosk Officer Dashboard (`/dashboard`) |
| 📜 **Revenue Operator** | `revenue@godsign.gov.in` | `password123` | Revenue Kiosk Officer Dashboard (`/dashboard`) |
| 🚗 **Transport Operator**| `transport@godsign.gov.in` | `password123` | RTO Kiosk Officer Dashboard (`/dashboard`) |
| ⚙️ **System Admin** | `admin@godsign.gov.in` | `password123` | Full Admin Access, Reports & Analytics (`/reports`) |
| 👤 **Citizen User** | `citizen@godsign.gov.in` | `password123` | ISL Learning & Interactive Practice (`/learning`) |

> 💡 **Quick Fill**: You can also click the **Demo Credentials** floating widget on the [`/login`](http://localhost:5173/login) screen to auto-fill any of these credentials with one click.

---

## 🔌 Socket.IO Real-time Pairing Protocol

| Event | Direction | Description |
| :--- | :--- | :--- |
| `kiosk_join` | Kiosk ➔ Server | Registers tablet with a specific `tabletId` room (e.g. `GS-T-402`) |
| `send_to_tablet` | Dashboard ➔ Server | Officer sends bilingual phrase & video metadata to target `tabletId` |
| `receive_phrase` | Server ➔ Kiosk | Delivers phrase payload to citizen tablet display |
| `kiosk_session_start` | Kiosk ➔ Server | Alerts officer dashboard when citizen starts interactive kiosk session |
| `new_feedback_received` | Server ➔ Dashboard | Broadcasts citizen feedback rating to officer monitoring view |

---

## 📡 REST API Summary

- `GET /api/services` — Fetch government service categories & ISL sign vocabularies
- `GET /api/lessons` — List ISL training curriculum modules
- `GET /api/progress` — Fetch user XP points, streak counters, and completed lesson IDs
- `POST /api/progress/complete-lesson` — Record completed lesson & award XP
- `POST /api/feedback` — Submit citizen feedback rating and comments
- `GET /api/reports/summary` — Retrieve aggregated interaction metrics, monthly charts, and staff rosters

---

## 🛡️ Security & Quality Standards

- **Row Level Security (RLS)**: Enforced via Supabase for user profiles, progress, and feedback tables.
- **Input Validation**: Schema verification powered by `zod` for all HTTP request bodies.
- **Rate Limiting**: Express rate limit protections against brute force authentication and API spamming.
- **Helmet Security**: HTTP security headers enabled on all backend responses.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit pull requests.

---

## 📄 License

This project is created for **Yuva 6.0 Hackathon**. Distributed under the MIT License.
