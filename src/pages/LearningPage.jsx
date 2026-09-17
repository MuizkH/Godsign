import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useHandTracking from '../hooks/useHandTracking';
import { normalizeLandmarks, normalizeReferenceVector, findBestMatch, getFeedbackText } from '../utils/scoring';
import signRefsJson from '../signRefs.json';

const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17]
];

const translations = {
  en: {
    brandName: "GodSign",
    brandSub: "GovTech ISL Platform",
    navHome: "Home",
    navTranslation: "Live Translation",
    navLearning: "Learning",
    navReports: "Reports",
    navHelp: "Help",
    navLogout: "Logout",
    btnStartCert: "Start Certification",
    topHeading: "Operator Desktop",
    dayLabel: "Day 12 of 30",
    todayGoal: "Today: 5 min module",
    streak: "12-day streak",
    xp: "340 XP",
    nextBadge: "Next: Silver Badge (62%)",
    statusCameraActive: "Camera Active",
    statusCameraInactive: "Camera Offline",
    btnStopCamera: "Stop Camera",
    btnStartCamera: "Start Camera",
    feedbackLabel: "Feedback",
    feedbackNeutral: "Align hand inside box to begin...",
    feedbackSuccess: "Excellent sign match! Ready to proceed!",
    feedbackActive: "Adjust wrist angle slightly",
    lessonTitle: "Lesson 14 / 30 — Police Vocabulary",
    signTitle: "How to Sign: \"File a Complaint\"",
    instructionsTitle: "Instructions",
    instructionsDesc: "Extend index finger, place at chin, sweep outward twice. Palm faces left. Ensure a firm, formal expression suitable for legal vocabulary.",
    tryItNow: "Try It Now",
    prevLesson: "Previous Lesson",
    nextLesson: "Next Lesson",
    todaysLessons: "Today's Police ISL Lessons",
    lesson1: "How to greet",
    lesson2: "File a Complaint",
    lesson3: "Request document",
    lesson4: "Emergency signal"
  },
  hi: {
    brandName: "गॉडसाइन",
    brandSub: "सरकारी तकनीकी आईएसएल प्लेटफॉर्म",
    navHome: "मुख्यपृष्ठ",
    navTranslation: "लाइव अनुवाद",
    navLearning: "शिक्षण",
    navReports: "रिपोर्ट्स",
    navHelp: "सहायता",
    navLogout: "लॉगआउट",
    btnStartCert: "प्रमाणन शुरू करें",
    topHeading: "ऑपरेटर डेस्कटॉप",
    dayLabel: "दिन 12 का 30",
    todayGoal: "आज: 5 मिनट का मॉड्यूल",
    streak: "12-दिन की निरंतरता",
    xp: "340 एक्सपी",
    nextBadge: "अगला: सिल्वर बैच (62%)",
    statusCameraActive: "कैमरा सक्रिय",
    statusCameraInactive: "कैमरा ऑफलाइन",
    btnStopCamera: "कैमरा रोकें",
    btnStartCamera: "कैमरा चालू करें",
    feedbackLabel: "फीडबैक",
    feedbackNeutral: "शुरू करने के लिए हाथ बॉक्स के अंदर लाएं...",
    feedbackSuccess: "उत्कृष्ट संकेत मिलान! आगे बढ़ने के लिए तैयार!",
    feedbackActive: "कलाई के कोण को थोड़ा समायोजित करें",
    lessonTitle: "पाठ 14 / 30 — पुलिस शब्दावली",
    signTitle: "कैसे संकेत करें: \"शिकायत दर्ज करें\"",
    instructionsTitle: "निर्देश",
    instructionsDesc: "तर्जनी उंगली फैलाएं, ठोड़ी पर रखें, दो बार बाहर की ओर झाड़ू की तरह घुमाएं। हथेली बाईं ओर रहेगी। कानूनी शब्दावली के अनुकूल दृढ़ और औपचारिक अभिव्यक्ति सुनिश्चित करें।",
    tryItNow: "अभी प्रयास करें",
    prevLesson: "पिछला पाठ",
    nextLesson: "अगला पाठ",
    todaysLessons: "आज के पुलिस आईएसएल पाठ",
    lesson1: "अभिवादन कैसे करें",
    lesson2: "शिकायत दर्ज करें",
    lesson3: "दस्तावेज़ का अनुरोध",
    lesson4: "आपातकालीन संकेत"
  }
};

export default function LearningPage() {
  const { user, logout } = useAuth();
  const [lang, setLang] = useState('en');
  const [practiceTriggered, setPracticeTriggered] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  const navigate = useNavigate();
  const t = translations[lang];

  // Initialize MediaPipe hand tracking when component mounts
  const handTracking = useHandTracking();
  const { cameraActive, error: cameraError, videoRef, canvasRef, startCamera, stopCamera } = handTracking;

  // Start camera when component mounts
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  // Load reference vectors from JSON (memoized)
  const signReferenceData = useMemo(() => {
    const vectors = [];
    const labels = [];

    Object.keys(signRefsJson.signRefs || {}).forEach((key) => {
      const reference = signRefsJson.signRefs[key];
      [reference.slice(0, 63), reference.slice(63, 126)].forEach((vector) => {
        const normalizedReference = normalizeReferenceVector(vector);
        if (normalizedReference) {
          vectors.push(normalizedReference);
          labels.push(signRefsJson.labels?.[Number(key)] || `Sign ${key}`);
        }
      });
    });

    return { vectors, labels };
  }, []);
  const signRefs = signReferenceData.vectors;

  // Get landmarks from hand tracking hook
  const landmarks = handTracking.landmarks;

  // Compute recognition results
  const hands = (landmarks || []).filter((hand) => hand && hand.length >= 21);
  const handResults = hands
    .map((hand) => {
      const normalized = normalizeLandmarks(hand);
      return normalized ? findBestMatch(normalized, signRefs) : null;
    })
    .filter(Boolean);
  const results = handResults.length
    ? handResults.reduce((best, current) => current.score > best.score ? current : best)
    : null;
  const feedbackText = results ? getFeedbackText(results.score) : t.feedbackNeutral;
  const score = handResults.length
    ? Math.round(handResults.reduce((total, result) => total + result.score, 0) / handResults.length)
    : 0;
  const matchedSign = results ? signReferenceData.labels[results.target] : null;

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'hi' : 'en');
  };

  const getTopHeading = () => {
    if (!user) return t.topHeading;
    if (user.role === 'citizen') {
      return lang === 'en' ? 'Citizen Learning Portal' : 'नागरिक शिक्षण पोर्टल';
    }
    return user.role === 'admin' 
      ? (lang === 'en' ? 'Admin Learning Desk' : 'प्रशासक शिक्षण डेस्क')
      : t.topHeading;
  };

  const getLessonTitle = () => {
    if (user && user.role === 'citizen') {
      return lang === 'en' ? 'Lesson 14 / 30 — General Vocabulary' : 'पाठ 14 / 30 — सामान्य शब्दावली';
    }
    return t.lessonTitle;
  };

  const getTodaysLessons = () => {
    if (user && user.role === 'citizen') {
      return lang === 'en' ? "Today's General ISL Lessons" : 'आज के सामान्य आईएसएल पाठ';
    }
    return t.todaysLessons;
  };

  return (
    <div className="bg-surface font-body-md text-on-surface h-screen flex overflow-hidden transition-colors duration-300">
      
      {/* Sidebar Navigation */}
      <nav className="bg-surface-container-low border-r border-outline-variant fixed left-0 top-0 h-full flex flex-col z-50 w-64 select-none">
        
        {/* Sidebar Brand Header */}
        <div 
          onClick={() => navigate('/')}
          className="p-lg border-b border-outline-variant flex items-center gap-sm cursor-pointer hover:opacity-90"
        >
          <span className="material-symbols-outlined text-primary text-3xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
            sign_language
          </span>
          <div>
            <h1 className="font-headline-md text-headline-md font-black text-on-surface leading-tight">
              {t.brandName}
            </h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              {t.brandSub}
            </p>
          </div>
        </div>

        {/* Sidebar Links */}
        <div className="flex-1 py-md flex flex-col gap-xs px-sm overflow-y-auto">
          {user?.role !== 'citizen' && (
            <a 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-container-highest rounded-xl font-label-md text-label-md transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined select-none">home</span>
              {t.navHome}
            </a>
          )}
          
          <a className="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-container-highest rounded-xl font-label-md text-label-md transition-all cursor-not-allowed opacity-60">
            <span className="material-symbols-outlined select-none">translate</span>
            {t.navTranslation}
          </a>
          
          <a className="flex items-center gap-md bg-secondary-container text-on-secondary-container rounded-xl px-md py-sm font-label-md text-label-md font-bold scale-95 transition-all select-none">
            <span className="material-symbols-outlined select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
              school
            </span>
            {t.navLearning}
          </a>
          
          <a 
            onClick={() => navigate('/learning-complete')}
            className="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-container-highest rounded-xl font-label-md text-label-md transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined select-none">workspace_premium</span>
            {lang === 'en' ? 'My Certificate' : 'मेरा प्रमाण पत्र'}
          </a>
          
          {user?.role !== 'citizen' && (
            <a 
              onClick={() => navigate('/reports')}
              className="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-container-highest rounded-xl font-label-md text-label-md transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined select-none">analytics</span>
              {t.navReports}
            </a>
          )}
          
          <div className="mt-xl px-sm">
            <button 
              onClick={() => navigate('/learning-complete')}
              className="w-full bg-primary text-on-primary font-label-md text-label-md py-sm rounded-xl hover:bg-primary-container active:scale-95 transition-all cursor-pointer font-semibold shadow-sm"
            >
              {t.btnStartCert}
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="p-sm border-t border-outline-variant flex flex-col gap-xs">
          <a className="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-container-highest rounded-xl font-label-md text-label-md transition-all cursor-pointer">
            <span className="material-symbols-outlined select-none">help</span>
            {t.navHelp}
          </a>
          <a 
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            className="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-error-container hover:text-error rounded-xl font-label-md text-label-md transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined select-none">logout</span>
            {t.navLogout}
          </a>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 flex flex-col h-full bg-[#EAF3FC] overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="bg-surface border-b border-outline-variant flex justify-between items-center w-full px-lg h-16 z-40 shrink-0 select-none">
          <div className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-sm">
            <span className="text-on-surface-variant font-label-md text-label-md font-normal">
              {getTopHeading()}
            </span>
          </div>

          <div className="flex items-center gap-lg">
            {/* Language Switcher */}
            <div className="flex items-center bg-surface-container-high rounded-full p-1 border border-outline-variant/30">
              <button 
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold transition-all ${lang === 'en' ? 'bg-[#0B3D62] text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('hi')}
                className={`px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold transition-all ${lang === 'hi' ? 'bg-[#0B3D62] text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                हिं
              </button>
            </div>

            {/* Profile Avatar */}
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-outline-variant shrink-0">
              <span className="font-bold text-primary text-xs select-none">
                {(user?.name || 'R K').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Lesson Dashboard Panel */}
        <div className="flex-1 p-lg flex flex-col gap-lg max-w-[1200px] mx-auto w-full">
          
          {/* Top Progress Block */}
          <section className="bg-white rounded-xl border border-[#D1E4F8] p-md flex flex-col md:flex-row justify-between items-center gap-md shadow-sm select-none">
            <div className="flex-1 w-full">
              <div className="flex justify-between items-end mb-sm">
                <h2 className="font-label-md text-label-md text-navy font-bold">
                  {t.dayLabel}
                </h2>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {t.todayGoal}
                </span>
              </div>
              <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#2C7BE5] rounded-full transition-all duration-500"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>

            {/* Badges block */}
            <div className="flex items-center gap-md flex-wrap justify-end">
              <div className="flex items-center gap-xs bg-surface-container-low px-sm py-xs rounded-lg border border-outline-variant">
                <span className="text-lg">🔥</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                  {t.streak}
                </span>
              </div>
              <div className="flex items-center gap-xs bg-surface-container-low px-sm py-xs rounded-lg border border-outline-variant">
                <span className="text-lg">⚡</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                  {t.xp}
                </span>
              </div>
              <div className="flex items-center gap-xs bg-surface-container-low px-sm py-xs rounded-lg border border-[#D1E4F8]">
                <span className="text-lg">🏅</span>
                <span className="font-label-sm text-label-sm text-[#0B3D62] font-semibold">
                  {t.nextBadge}
                </span>
              </div>
            </div>
          </section>

          {/* 50/50 Screen Splitting layout */}
          <div className="flex flex-col lg:flex-row gap-lg flex-1 min-h-0">
            
            {/* Left Webcam Practice Section */}
            <section className="flex-1 flex flex-col gap-md">
              <div className="bg-[#1A1A2E] rounded-xl flex-1 relative overflow-hidden flex flex-col min-h-[400px] shadow-sm border border-navy/20">
                
                {/* Active Camera Status Overlay */}
                <div className={`absolute top-sm right-sm backdrop-blur-sm border px-sm py-xs rounded-md flex items-center gap-xs z-20 transition-all select-none ${cameraActive ? 'bg-[#138808]/20 border-[#138808] text-white' : 'bg-error/20 border-error text-white'}`}>
                  <div className={`w-2 h-2 rounded-full ${cameraActive ? 'bg-[#138808] animate-pulse' : 'bg-error'}`}></div>
                  <span className="font-label-sm text-label-sm font-semibold">
                    {cameraActive ? t.statusCameraActive : t.statusCameraInactive}
                  </span>
                </div>

                {/* Webcam Feed & Processing */}
                <div className="flex-1 relative bg-black/60 flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`absolute inset-0 h-full w-full object-cover -scale-x-100 ${cameraActive ? '' : 'hidden'}`}
                    aria-label="Live camera feed"
                  />
                  {!cameraActive && (
                    <div className="flex flex-col items-center gap-sm text-white/50 select-none">
                      <span className="material-symbols-outlined text-[64px]">videocam_off</span>
                      <p className="font-label-md text-label-md font-semibold">{cameraError || 'Camera is offline'}</p>
                    </div>
                  )}

                  <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

                  {/* Hand tracking overlay */}
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
                              stroke="#39ff88"
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
                              fill="#39ff88"
                              stroke="#073b22"
                              strokeWidth="0.005"
                            />
                          ))}
                        </g>
                      ))}
                    </svg>
                  )}
                </div>

                {/* Feedback status strip */}
                {cameraActive ? (
                  <div className="bg-[#111122] p-md border-t border-white/10 flex items-center justify-between gap-md select-none">
                    {/* Score Overview */}
                    <div className="flex items-center gap-md">
                      <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path className="text-white/20" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                          <path 
                            className="text-[#138808] transition-all duration-500" 
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeDasharray={`${score}, 100`} 
                            strokeWidth="3"
                          />
                        </svg>
                        <span className="absolute text-white font-label-sm text-label-sm text-[10px] font-bold">
                          {score}%
                        </span>
                      </div>
                      <div className="text-white flex-1">
                        <div className="flex items-center justify-between gap-sm">
                          <p className="font-label-sm text-label-sm text-white/50">{t.feedbackLabel}</p>
                          <span className="font-label-sm text-label-sm text-[#39ff88] font-bold">
                            {handResults.length > 1 ? `Hands: ${handResults.map((result) => `${result.score}%`).join(' / ')}` : `Score: ${score}%`}
                          </span>
                        </div>
                        <p className="font-label-md text-label-md text-sm font-semibold transition-colors duration-300">
                          {matchedSign ? `${matchedSign} - ` : ''}{feedbackText}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Webcam Control buttons */}
              <div className="flex justify-center gap-md">
                <button 
                  onClick={() => handTracking.stopCamera()}
                  disabled={!cameraActive}
                  className="bg-[#BA1A1A] hover:bg-red-800 disabled:opacity-40 disabled:hover:bg-[#BA1A1A] text-white px-lg py-sm rounded-lg font-label-md text-label-md flex items-center gap-sm transition-all shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">stop_circle</span>
                  {t.btnStopCamera}
                </button>
                <button 
                  onClick={() => handTracking.startCamera()}
                  disabled={cameraActive}
                  className="bg-white hover:bg-surface-container-low disabled:opacity-40 disabled:hover:bg-white text-on-surface border border-outline-variant px-lg py-sm rounded-lg font-label-md text-label-md flex items-center gap-sm transition-all shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">videocam</span>
                  {t.btnStartCamera}
                </button>
              </div>
            </section>

            {/* Right Column Lesson Sign Detail */}
            <section className="flex-1 bg-white rounded-xl border border-[#D1E4F8] shadow-sm flex flex-col overflow-hidden">
              {/* Card Header title */}
              <div className="bg-[#0B3D62] p-md text-white select-none">
                <span className="font-label-sm text-label-sm text-white/80 uppercase tracking-wider font-semibold">
                  {t.lessonTitle}
                </span>
                <h2 className="font-headline-md text-headline-md text-navy font-bold leading-snug">
                  {getLessonTitle()}
                </h2>
              </div>
              
              <div className="p-lg flex-1 flex flex-col gap-lg overflow-y-auto">
                {/* Sign Video Player demonstration */}
                <div className="bg-surface-container-low rounded-xl border border-[#D1E4F8] aspect-video min-h-[280px] relative overflow-hidden flex items-center justify-center group select-none">
                  {isVideoPlaying ? (
                    <div className="absolute inset-0 bg-black flex items-center justify-center">
                      <video 
                        src="https://awfcnolsokkjbrclgiuf.supabase.co/storage/v1/object/public/videos/WhatsApp%20Video%202026-08-23%20at%2023.54.47.mp4"
                        controls
                        autoPlay
                        className="w-full h-full object-cover"
                        onEnded={() => setIsVideoPlaying(false)}
                      />
                    </div>
                  ) : (
                    <>
                      <video 
                        src="https://awfcnolsokkjbrclgiuf.supabase.co/storage/v1/object/public/videos/WhatsApp%20Video%202026-08-23%20at%2023.54.47.mp4"
                        className="w-full h-full object-cover transition-all duration-300 opacity-95 group-hover:scale-[1.02]"
                        preload="metadata"
                      />
                      <button 
                        onClick={() => setIsVideoPlaying(true)}
                        className="bg-[#0B3D62]/85 hover:bg-[#0B3D62] text-white p-sm rounded-full backdrop-blur-sm transition-all z-10 flex items-center justify-center w-14 h-14 shadow-lg group-hover:scale-110 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          play_arrow
                        </span>
                      </button>
                    </>
                  )}
                </div>

                {/* Instructions Text block */}
                <div className="bg-[#F8FAFC] p-md rounded-xl border border-outline-variant/50">
                  <h3 className="font-label-md text-label-md font-bold text-[#0B3D62] mb-sm flex items-center gap-sm select-none">
                    <span className="material-symbols-outlined text-[18px]">menu_book</span>
                    {t.instructionsTitle}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    {t.instructionsDesc}
                  </p>
                </div>

                {/* Try It Now Trigger with score-based feedback */}
                {cameraActive && (
                  <div className="flex items-center justify-center my-md">
                    <button 
                      onClick={() => setPracticeTriggered(prev => !prev)}
                      className={`font-label-md text-label-md px-lg py-sm rounded-full border flex items-center gap-sm active:scale-95 transition-all shadow-sm cursor-pointer font-bold ${practiceTriggered 
                        ? (score >= 80 
                          ? 'bg-[#138808]/10 border-[#138808]/20 text-[#138808]' 
                          : 'bg-error/20 text-error border-error/30') 
                        : 'bg-primary-fixed border-[#2C7BE5]/20 text-[#2C7BE5] animate-pulse'}`}
                    >
                      {practiceTriggered ? "✓" : "👋"}
                    </button>
                  </div>
                )}
              </div>

              {/* Lesson Footer Navigation Buttons */}
              <div className="p-md border-t border-[#D1E4F8] flex justify-between items-center bg-surface-bright select-none">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-on-surface-variant hover:text-primary font-label-md text-label-md flex items-center gap-xs px-sm py-2 rounded-md hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  {t.prevLesson}
                </button>
                <button 
                  onClick={() => navigate('/learning-complete')}
                  className="bg-[#2C7BE5] hover:bg-[#1A5BB5] text-white font-label-md text-label-md flex items-center gap-xs px-lg py-sm rounded-lg transition-colors shadow-sm cursor-pointer font-bold"
                >
                  {t.nextLesson}
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </section>
          </div>

          {/* Bottom Lesson list Selector section */}
          <section className="bg-white rounded-xl border border-[#D1E4F8] p-md shadow-sm select-none">
            <h4 className="font-label-sm text-label-sm text-on-surface-variant mb-sm uppercase tracking-wider font-bold">
              {getTodaysLessons()}
            </h4>
            <div className="flex gap-sm overflow-x-auto pb-xs scrollbar-hide">
              <button className="whitespace-nowrap bg-surface-container-low hover:bg-surface-container border border-outline-variant text-on-surface font-label-md text-label-md px-md py-sm rounded-full transition-colors flex items-center gap-sm cursor-pointer">
                <span className="material-symbols-outlined text-[#138808] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                {t.lesson1}
              </button>
              
              <button className="whitespace-nowrap bg-[#2C7BE5] text-white border border-[#2C7BE5] font-label-md text-label-md px-md py-sm rounded-full transition-colors flex items-center gap-sm shadow-sm font-semibold select-none">
                <span className="material-symbols-outlined text-[16px]">play_circle</span>
                {t.lesson2}
              </button>
              
              <button className="whitespace-nowrap bg-surface-container-low hover:bg-surface-container border border-outline-variant text-on-surface font-label-md text-label-md px-md py-sm rounded-full transition-all cursor-not-allowed opacity-60 flex items-center gap-sm">
                <span className="material-symbols-outlined text-outline text-[16px]">lock</span>
                {t.lesson3}
              </button>
              
              <button className="whitespace-nowrap bg-surface-container-low hover:bg-surface-container border border-outline-variant text-on-surface font-label-md text-label-md px-md py-sm rounded-full transition-all cursor-not-allowed opacity-60 flex items-center gap-sm">
                <span className="material-symbols-outlined text-outline text-[16px]">lock</span>
                {t.lesson4}
              </button>
            </div>
          </section>

        </div>
      </main>

      {/* Embedded style to hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
