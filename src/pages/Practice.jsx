import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Home, 
  Video, 
  BookOpen, 
  Award, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  ChevronLeft, 
  Camera as CameraIcon, 
  StopCircle 
} from "lucide-react";
import confetti from "canvas-confetti";

import useHandTracking from "../hooks/useHandTracking";

const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17]
];

export default function Practice() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const {
    cameraActive,
    landmarks,
    error: cameraError,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera
  } = useHandTracking();

  // Dynamic States from Backend API
  const [lessons, setLessons] = useState([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [userProgress, setUserProgress] = useState({ xp: 0, streakCount: 0, completedLessons: [] });

  const [confidence, setConfidence] = useState(0);
  const [handsDetected, setHandsDetected] = useState("No Hand");
  const [feedbackMsg, setFeedbackMsg] = useState("Align hand inside frame to begin...");

  // Start Camera on mount, stop on unmount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  // 1. Fetch Lessons & Initial Progress from Backend API
  useEffect(() => {
    // Fetch Lessons
    fetch("http://localhost:5000/api/lessons")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLessons(data);
        }
      })
      .catch((err) => console.error("Error fetching lessons from API:", err));

    // Fetch User Progress
    fetch("http://localhost:5000/api/progress")
      .then((res) => res.json())
      .then((data) => setUserProgress(data))
      .catch((err) => console.error("Error fetching progress from API:", err));
  }, []);

  // Current Lesson Object
  const currentLesson = lessons[currentLessonIndex] || {
    id: 1,
    name: "Loading...",
    sign: "✋",
    instruction: "Fetching lesson details from server..."
  };

  // Extract detected hand landmarks array
  const hands = (landmarks || []).filter((hand) => hand && hand.length >= 21);

  // Update status feedback when hand detection changes
  useEffect(() => {
    if (cameraActive && hands.length > 0) {
      setHandsDetected(`${hands.length} Hand Detected`);
      setConfidence(88);
      setFeedbackMsg("Hand detected! Perform the gesture clearly.");
    } else {
      setHandsDetected("No Hand");
      setConfidence(0);
      setFeedbackMsg(cameraActive ? "Align hand inside frame to begin..." : "Camera is offline");
    }
  }, [cameraActive, hands.length]);

  // 3. Post Progress Completion to Backend API
  const syncProgressToBackend = async (lessonId) => {
    try {
      const response = await fetch("http://localhost:5000/api/progress/complete-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, xpGained: 15 }),
      });
      const data = await response.json();
      if (data.progress) {
        setUserProgress(data.progress);
      }
    } catch (err) {
      console.error("Failed to update progress on backend API:", err);
    }
  };

  const handleNextLesson = () => {
    // Sync current lesson completion with API
    syncProgressToBackend(currentLesson.id);

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      console.log("Confetti trigger");
    }

    if (currentLessonIndex + 1 >= lessons.length) {
      navigate("/complete");
    } else {
      setCurrentLessonIndex((prev) => prev + 1);
      setFeedbackMsg(`Lesson ${currentLessonIndex + 2} - Align hand to begin...`);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      
      {/* 1. Left Sidebar Navigation */}
      <aside className="w-56 bg-white border-r border-slate-200 flex flex-col justify-between p-4 flex-shrink-0">
        <div className="space-y-6">
          <div className="px-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">GodSign</h1>
            <p className="text-[11px] text-slate-400 font-medium">Unified ISL Platform</p>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => navigate(user?.role === 'citizen' ? '/learning' : '/dashboard')}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              <Home className="w-4 h-4 text-slate-500" /> Home
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-400 cursor-not-allowed opacity-60 rounded-lg transition">
              <Video className="w-4 h-4 text-slate-300" /> Live Translation
            </button>
            <button 
              onClick={() => navigate('/learning')}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold bg-sky-100 text-sky-600 rounded-lg transition"
            >
              <BookOpen className="w-4 h-4 text-sky-600" /> Learning
            </button>
            {user?.role !== 'citizen' && (
              <button 
                onClick={() => navigate('/reports')}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                <Award className="w-4 h-4 text-slate-500" /> Reports
              </button>
            )}
          </nav>

          {/* Real-time Operator XP Counter from API */}
          <div className="p-3 bg-slate-900 text-white rounded-lg text-xs space-y-1">
            <div className="text-[10px] text-slate-400">OPERATOR XP</div>
            <div className="font-bold text-sky-400 text-base">{userProgress.xp || 0} XP</div>
            <div className="text-[10px] text-emerald-400">🔥 {userProgress.streakCount || 1} Day Streak</div>
          </div>

          <button 
            onClick={() => navigate("/complete")}
            className="w-full py-2.5 px-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg text-xs transition shadow-sm"
          >
            Start Certification
          </button>
        </div>

        <div className="space-y-1 pt-4 border-t border-slate-200">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-500 hover:bg-slate-100 rounded-lg">
            <HelpCircle className="w-4 h-4" /> Help
          </button>
          <button 
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* 2. Main Workspace Layout */}
      <main className="flex-1 flex p-4 gap-4 overflow-hidden bg-slate-100">
        
        {/* Left Side: Live Camera Feed */}
        <div className="flex-1 flex flex-col justify-between space-y-3">
          <div className="relative w-full flex-1 bg-black rounded-xl overflow-hidden shadow-sm flex items-center justify-center">
            
            <div className={`absolute top-3 right-3 z-10 text-white text-[11px] font-medium px-2.5 py-1 rounded flex items-center gap-1.5 shadow ${cameraActive ? 'bg-emerald-600/90' : 'bg-red-600/90'}`}>
              <span className={`w-1.5 h-1.5 rounded-full bg-white ${cameraActive ? 'animate-pulse' : ''}`}></span>
              {cameraActive ? 'Camera Active' : 'Camera Offline'}
            </div>

            <video 
              ref={videoRef} 
              playsInline 
              muted 
              className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 ${cameraActive ? '' : 'hidden'}`} 
            />
            {!cameraActive && (
              <div className="flex flex-col items-center gap-2 text-white/50 select-none">
                <Video className="w-12 h-12 opacity-50" />
                <p className="text-xs font-semibold">{cameraError || 'Camera is offline'}</p>
              </div>
            )}
            <canvas 
              ref={canvasRef} 
              className="hidden" 
              aria-hidden="true" 
            />

            {/* Dynamic Hand Tracking SVG Overlay */}
            {cameraActive && hands.length > 0 && (
              <svg
                className="absolute inset-0 h-full w-full -scale-x-100 pointer-events-none z-10"
                viewBox="0 0 1 1"
                preserveAspectRatio="none"
                aria-label="Detected hand landmarks"
              >
                {hands.map((hand, handIndex) => (
                  <g key={handIndex}>
                    {HAND_CONNECTIONS.map(([start, end]) => (
                      <line
                        key={`${handIndex}-${start}-${end}`}
                        x1={hand[start].x}
                        y1={hand[start].y}
                        x2={hand[end].x}
                        y2={hand[end].y}
                        stroke="#22c55e"
                        strokeWidth="0.006"
                        strokeLinecap="round"
                      />
                    ))}
                    {hand.map((landmark, index) => (
                      <circle
                        key={`${handIndex}-${index}`}
                        cx={landmark.x}
                        cy={landmark.y}
                        r="0.014"
                        fill="#22c55e"
                        stroke="#ffffff"
                        strokeWidth="0.003"
                      />
                    ))}
                  </g>
                ))}
              </svg>
            )}

            {/* Bottom Floating Bar */}
            <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 text-white rounded-lg p-3 backdrop-blur-md flex items-center justify-between border border-slate-800 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border-2 border-slate-600 flex items-center justify-center font-bold text-xs text-white bg-slate-900">
                  {confidence}%
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2">
                    <span>Feedback</span>
                    <span className="text-emerald-400 font-medium">Hands: {handsDetected}</span>
                  </div>
                  <div className="font-semibold text-xs text-slate-100 mt-0.5">{feedbackMsg}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <button 
              onClick={() => stopCamera()}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer active:scale-95"
            >
              <StopCircle className="w-4 h-4" /> Stop Camera
            </button>
            <button 
              onClick={() => startCamera()}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer active:scale-95"
            >
              <CameraIcon className="w-4 h-4 text-slate-500" /> Start Camera
            </button>
          </div>
        </div>

        {/* Right Side: Dynamic Lesson Details */}
        <div className="w-[380px] flex flex-col justify-between space-y-4 flex-shrink-0">
          <div className="space-y-4">
            
            {/* Dynamic Lesson Title */}
            <div className="bg-sky-900 text-white p-3 rounded-lg text-xs font-bold tracking-wider uppercase shadow-sm">
              LESSON {currentLessonIndex + 1} / {lessons.length || 5} — {currentLesson.name || "POLICE VOCABULARY"}
            </div>

            {/* Target Gesture Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 text-center space-y-3 shadow-sm overflow-hidden">
              {currentLesson.video_url ? (
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-950 relative flex items-center justify-center">
                  <video 
                    key={currentLesson.id}
                    src={currentLesson.video_url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="text-6xl animate-pulse">{currentLesson.sign || "👍"}</div>
              )}
              <h3 className="font-bold text-slate-800 text-base">{currentLesson.name}</h3>
            </div>

            {/* Instruction Description */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <Video className="w-3.5 h-3.5" /> Instructions
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentLesson.instruction}
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <button 
              onClick={handlePrevLesson}
              disabled={currentLessonIndex === 0}
              className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-4 h-4" /> Previous Lesson
            </button>
            <button 
              onClick={handleNextLesson}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              Next Lesson <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </main>
    </div>
  );
}