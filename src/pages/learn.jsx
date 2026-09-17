import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Video, Sparkles, RefreshCw, Trophy } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { markLessonComplete, getProgress } from "../utils/progress";
import confetti from "canvas-confetti";

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
  { id: 5, name: "Letter E", sign: "✊", instruction: "Curl all fingers tightly against the palm." },
];

export default function Practice() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.email || user?.id || user?.department;
  const { id } = useParams(); // URL se lesson ID read karne ke liye
  const lessonId = parseInt(id, 10) || 1;

  const videoRef = useRef(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentLesson = LESSONS_DATA.find((l) => l.id === lessonId) || LESSONS_DATA[0];

  // Webcam Access Setup
  useEffect(() => {
    async function setupWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsWebcamActive(true);
        }
      } catch (err) {
        console.error("Webcam access denied or error:", err);
      }
    }
    setupWebcam();

    return () => {
      // Cleanup Webcam Stream on Unmount
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Practice Complete Handler
  const handleVerifySign = () => {
    setIsVerifying(true);

    // Simulate AI/ML Model Gesture Detection Delay (2 seconds)
    setTimeout(() => {
      setIsVerifying(false);
      setIsCompleted(true);
      
      // Save progress to LocalStorage via helper
      markLessonComplete(currentLesson.id, userId);
      
      // Trigger Confetti Celebration
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    }, 2000);
  };

  const handleNext = () => {
    const progress = getProgress(userId);

    // Agar saare lessons complete ho chuke hain -> Redirection to Complete Page
    if (progress.isCourseComplete || lessonId >= LESSONS_DATA.length) {
      navigate("/complete");
    } else {
      // Agle lesson par move karein
      setIsCompleted(false);
      navigate(`/practice/${lessonId + 1}`);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 sm:p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-6">
        
        {/* Top Bar Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/learn")}
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Modules</span>
          </button>
          
          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-4 py-1.5 rounded-full text-xs font-semibold text-indigo-400">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Module {currentLesson.id} of {LESSONS_DATA.length}</span>
          </div>
        </div>

        {/* Practice Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Target Sign Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Target Gesture</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-2">{currentLesson.name}</h2>
              <p className="text-neutral-400 text-sm leading-relaxed">{currentLesson.instruction}</p>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden aspect-video relative flex items-center justify-center">
              {currentLesson.video_url ? (
                <video 
                  key={currentLesson.id}
                  src={currentLesson.video_url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-8xl select-none animate-pulse">{currentLesson.sign}</span>
              )}
            </div>

            {isCompleted ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-bold">Sign Matched Successfully!</p>
                  <p className="text-emerald-500/80 text-xs">Progress updated in dashboard.</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-neutral-500 text-center">
                Perform the gesture in front of your camera to match.
              </p>
            )}
          </div>

          {/* Live Camera View Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-medium">
                  <Video className="w-3.5 h-3.5" />
                  <span>Live Feed</span>
                </div>
                <span className="text-xs text-neutral-500">
                  {isWebcamActive ? "Camera Active" : "Initializing Camera..."}
                </span>
              </div>

              {/* Video Element */}
              <div className="relative w-full aspect-video bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
                {!isWebcamActive && (
                  <p className="text-xs text-neutral-600 absolute">Requesting Camera Permissions...</p>
                )}
              </div>
            </div>

            {/* Actions / Verification Button */}
            <div className="space-y-3">
              {!isCompleted ? (
                <button
                  onClick={handleVerifySign}
                  disabled={isVerifying || !isWebcamActive}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Detecting Gesture...</span>
                    </>
                  ) : (
                    <span>Validate Sign Gesture</span>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span>Continue to Next Step</span>
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}