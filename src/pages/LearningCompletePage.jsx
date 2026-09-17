import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import confetti from "canvas-confetti";
import { getProgress, markLessonComplete, resetProgress } from "../utils/progress";

const translations = {
  en: {
    brandName: "GodSign",
    brandSubtitle: "GovTech ISL Platform",
    navDashboard: "Dashboard",
    navSendTablet: "Send to Tablet",
    navLearning: "Learning",
    navCert: "ISL Certification",
    navReports: "Reports",
    navLogout: "Logout",
    officerRole: "Public Relations Officer",
    tabletStatusConnected: "Kiosk Status: Connected",
    headerTitle: "Course Completion & Certification",
    subtitle: "Track your progress and unlock your official ISL proficiency certificate.",
    progressTitle: "Your Progress",
    certLockedTitle: "Certificate Locked",
    certLockedDesc: "Complete all lessons in the Practice/Learning page to unlock your PDF Certificate. The certificate will verify your proficiency in basic ISL communication for government service delivery.",
    certUnlockedTitle: "Certificate Unlocked 🎉",
    certUnlockedDesc: "Congratulations! You have successfully completed all ISL training modules. Enter your name below to generate your official PDF Certificate.",
    inputNamePlaceholder: "Enter your full name for certificate",
    btnDownloadCert: "Download Official PDF Certificate",
    btnGenerating: "Generating PDF...",
    btnBackDashboard: "Back to Dashboard",
    btnPracticeMore: "Practice More",
    footerCopyright: "© 2026 Digital India | GodSign ISL Platform",
    footerPrivacy: "Privacy Policy",
    footerTerms: "Terms of Service",
    footerAccessibility: "Accessibility Help",
    notificationsTitle: "Notifications"
  },
  hi: {
    brandName: "गॉडसाइन",
    brandSubtitle: "सरकारी तकनीकी आईएसएल प्लेटफॉर्म",
    navDashboard: "डैशबोर्ड",
    navSendTablet: "टैबलेट पर भेजें",
    navLearning: "शिक्षण",
    navCert: "आईएसएल प्रमाणन",
    navReports: "रिपोर्ट्स",
    navLogout: "लॉगआउट",
    officerRole: "जनसंपर्क अधिकारी",
    tabletStatusConnected: "किओस्क स्थिति: कनेक्टेड",
    headerTitle: "पाठ्यक्रम पूर्णता एवं प्रमाणन",
    subtitle: "अपनी प्रगति को ट्रैक करें और अपना आधिकारिक आईएसएल प्रवीणता प्रमाणपत्र अनलॉक करें।",
    progressTitle: "आपकी प्रगति",
    certLockedTitle: "प्रमाणपत्र लॉक है",
    certLockedDesc: "अपना पीडीएफ प्रमाणपत्र अनलॉक करने के लिए अभ्यास/शिक्षण पृष्ठ में सभी पाठ पूरे करें। प्रमाणपत्र सरकारी सेवा वितरण के लिए बुनियादी आईएसएल संचार में आपकी प्रवीणता को सत्यापित करेगा।",
    certUnlockedTitle: "प्रमाणपत्र अनलॉक हो गया 🎉",
    certUnlockedDesc: "बधाई हो! आपने सभी आईएसएल प्रशिक्षण मॉड्यूल सफलतापूर्वक पूरे कर लिए हैं। अपना आधिकारिक पीडीएफ प्रमाणपत्र बनाने के लिए नीचे अपना नाम दर्ज करें।",
    inputNamePlaceholder: "प्रमाणपत्र के लिए अपना पूरा नाम दर्ज करें",
    btnDownloadCert: "आधिकारिक पीडीएफ प्रमाणपत्र डाउनलोड करें",
    btnGenerating: "पीडीएफ बन रहा है...",
    btnBackDashboard: "डैशबोर्ड पर वापस जाएं",
    btnPracticeMore: "और अभ्यास करें",
    footerCopyright: "© 2026 डिजिटल इंडिया | गॉडसाइन आईएसएल प्लेटफॉर्म",
    footerPrivacy: "गोपनीयता नीति",
    footerTerms: "सेवा की शर्तें",
    footerAccessibility: "सुगमता सहायता",
    notificationsTitle: "सूचनाएं"
  }
};

export default function LearningCompletePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [lang, setLang] = useState('en');
  const [userName, setUserName] = useState(user?.name || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userId = user?.email || user?.id || user?.department;
  const [progressState, setProgressState] = useState(() => getProgress(userId));
  const certRef = useRef(null);

  const t = translations[lang];

  useEffect(() => {
    if (user?.name && !userName) {
      setUserName(user.name);
    }
    setProgressState(getProgress(userId));
  }, [user, userId]);

  useEffect(() => {
    if (progressState.isCourseComplete) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    }
  }, [progressState.isCourseComplete]);

  const getDepartmentDisplay = () => {
    if (!user) return 'Police — Kolar Road Station';
    if (user.role === 'citizen') return lang === 'en' ? '🇮🇳 Public Citizen' : '🇮🇳 आम नागरिक';
    if (user.role === 'admin') return lang === 'en' ? 'Administration' : 'प्रशासन';

    const depts = {
      police: lang === 'en' ? 'Police — Kolar Road Station' : 'पुलिस — कोलार रोड थाना',
      health: lang === 'en' ? 'Health — Bhopal General Hospital' : 'स्वास्थ्य — भोपाल जनरल अस्पताल',
      revenue: lang === 'en' ? 'Revenue — City Office' : 'राजस्व — नगर कार्यालय',
      transport: lang === 'en' ? 'Transport — RTO Office' : 'परिवहन — आरटीओ कार्यालय'
    };
    return depts[user.department] || user.department;
  };

  const getUserRoleDisplay = () => {
    if (user?.role === 'citizen') return lang === 'en' ? 'Citizen Learner' : 'नागरिक शिक्षार्थी';
    if (user?.role === 'admin') return lang === 'en' ? 'System Administrator' : 'सिस्टम प्रशासक';
    return t.officerRole;
  };

  const handleDownloadPDF = async () => {
    if (!userName.trim()) {
      alert("Please enter your name for the certificate.");
      return;
    }

    setIsGenerating(true);
    const element = certRef.current;

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${userName.replace(/\s+/g, "_")}_GodSign_ISL_Certificate.pdf`);
    } catch (error) {
      console.error("Error generating certificate PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUnlockDemo = () => {
    for (let i = 1; i <= 5; i++) {
      markLessonComplete(i, userId);
    }
    setProgressState(getProgress(userId));
  };

  const handleResetDemo = () => {
    resetProgress(userId);
    setProgressState(getProgress(userId));
  };

  return (
    <div className="bg-surface text-on-surface h-screen overflow-hidden flex font-sans transition-colors duration-300">
      
      {/* Dashboard Main Sidebar */}
      <aside className="w-[240px] bg-surface-container-lowest border-r border-outline-variant flex flex-col h-full shrink-0 select-none">
        
        {/* Brand Header */}
        <div 
          onClick={() => navigate('/')}
          className="p-lg border-b border-outline-variant flex items-center gap-sm cursor-pointer hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-[32px] text-primary select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
            sign_language
          </span>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md text-navy font-bold leading-tight">
              {t.brandName}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {t.brandSubtitle}
            </span>
          </div>
        </div>

        {/* Profile Card */}
        <div className="p-md flex flex-col gap-sm border-b border-outline-variant bg-surface-container-low/40">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-outline-variant shrink-0">
              <span className="font-bold text-primary text-sm select-none">
                {(user?.name || 'A M').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-label-md text-label-md font-bold text-navy truncate">{user?.name || 'Aarav Mehta'}</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant truncate">
                {getUserRoleDisplay()}
              </div>
            </div>
          </div>
          <div className="bg-surface-container py-1 px-2 rounded-lg flex items-center gap-1 text-xs border border-outline-variant/30">
            <span>🏛️</span>
            <span className="font-label-sm text-label-sm text-on-surface truncate font-medium">
              {getDepartmentDisplay()}
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-sm flex flex-col gap-unit overflow-y-auto mt-sm">
          {user?.role === 'citizen' ? (
            <>
              <a 
                onClick={() => navigate('/learning')}
                className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined select-none">school</span>
                <span className="font-label-md text-label-md">{lang === 'en' ? 'ISL Learning' : 'आईएसएल शिक्षण'}</span>
              </a>
              
              <a 
                onClick={() => navigate('/learning-complete')}
                className="flex items-center gap-md px-md py-sm rounded-lg bg-primary/10 text-primary font-bold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined select-none" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                <span className="font-label-md text-label-md">{lang === 'en' ? 'My Certificate' : 'मेरा प्रमाण पत्र'}</span>
              </a>
            </>
          ) : (
            <>
              <a 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined select-none">dashboard</span>
                <span className="font-label-md text-label-md">{t.navDashboard}</span>
              </a>
              
              <a 
                onClick={() => navigate('/kiosk-idle')}
                className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined select-none">send_to_mobile</span>
                <span className="font-label-md text-label-md">{t.navSendTablet}</span>
              </a>
              
              <a 
                onClick={() => navigate('/learning')}
                className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined select-none">school</span>
                <span className="font-label-md text-label-md">{t.navLearning}</span>
              </a>
              
              <a 
                onClick={() => navigate('/learning-complete')}
                className="flex items-center gap-md px-md py-sm rounded-lg bg-primary/10 text-primary font-bold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined select-none" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                <span className="font-label-md text-label-md">{t.navCert}</span>
              </a>
              
              <a 
                onClick={() => navigate('/reports')}
                className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined select-none">bar_chart</span>
                <span className="font-label-md text-label-md">{t.navReports}</span>
              </a>
            </>
          )}
          
          <div className="h-px bg-outline-variant my-sm mx-md"></div>
          
          <a 
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-error-container hover:text-error transition-colors mt-auto cursor-pointer"
          >
            <span className="material-symbols-outlined select-none">logout</span>
            <span className="font-label-md text-label-md font-semibold">{t.navLogout}</span>
          </a>
        </nav>

        {/* Tablet Status bottom (Only for Operator/Admin) */}
        {user?.role !== 'citizen' && (
          <div className="p-md border-t border-outline-variant bg-surface-container-lowest select-none">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#138808] animate-pulse"></div>
              <div className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                {t.tabletStatusConnected}
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-custom-bg/30">
        
        {/* Dashboard Header Bar */}
        <header className="bg-surface border-b border-outline-variant flex justify-between items-center w-full px-lg py-md z-10 select-none shrink-0">
          <div className="font-headline-md text-headline-md text-navy font-bold">
            {t.headerTitle}
          </div>
          
          <div className="flex items-center gap-lg">
            {/* Language Switcher */}
            <div className="flex items-center bg-surface-container rounded-lg p-xs border border-outline-variant/30">
              <button 
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded font-label-sm text-label-sm font-semibold transition-all cursor-pointer ${lang === 'en' ? 'bg-navy text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('hi')}
                className={`px-3 py-1 rounded font-label-sm text-label-sm font-semibold transition-all cursor-pointer ${lang === 'hi' ? 'bg-navy text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                हिं
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(prev => !prev)}
                className={`text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-1 rounded-full hover:bg-surface-container cursor-pointer ${showNotifications ? 'bg-surface-container text-primary' : ''}`}
              >
                <span className="material-symbols-outlined select-none">notifications</span>
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-saffron rounded-full border-2 border-surface animate-bounce"></span>
              </button>
              
              {/* Notifications Dropdown Panel */}
              {showNotifications && (
                <div className="absolute right-0 mt-md w-[280px] bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg py-md flex flex-col z-50 animate-fadeIn select-none">
                  <div className="px-md pb-xs border-b border-outline-variant flex justify-between items-center">
                    <span className="font-label-md text-label-md font-bold text-navy">{t.notificationsTitle}</span>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-primary hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="p-md text-xs text-on-surface-variant">
                    No new system notifications.
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Canvas Body */}
        <main className="flex-1 p-lg overflow-y-auto">
          <div className="max-w-4xl mx-auto flex flex-col gap-lg py-md">
            
            {/* Page Subtitle Banner */}
            <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-md shadow-xs">
              <p className="font-body-md text-body-md text-on-surface-variant font-medium">
                {t.subtitle}
              </p>
            </div>

            {/* Card 1: Your Progress */}
            <div className="bg-white border border-[#D1E4F8] rounded-2xl p-xl shadow-sm flex flex-col gap-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-headline-md text-headline-md font-bold text-navy">{t.progressTitle}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                    Completed {progressState.completedCount} of {progressState.totalLessons} Lessons
                  </p>
                </div>
                <div className="font-display-md text-display-md font-black text-primary">
                  {progressState.percentage}%
                </div>
              </div>

              {/* Segmented Progress Bar */}
              <div className="grid grid-cols-5 gap-sm pt-xs">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <div
                    key={idx}
                    className={`h-3 rounded-full transition-all duration-500 ${
                      idx <= progressState.completedCount
                        ? 'bg-primary shadow-xs'
                        : 'bg-surface-container-high border border-outline-variant/40'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Card 2: Certificate Status */}
            <div className="bg-white border border-[#D1E4F8] rounded-2xl p-xl shadow-sm">
              {progressState.isCourseComplete ? (
                <div className="flex flex-col gap-md">
                  <div className="flex items-start gap-md">
                    <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 border border-outline-variant/40">
                      <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-headline-md text-headline-md font-bold text-[#138808]">{t.certUnlockedTitle}</h3>
                        <button 
                          onClick={handleResetDemo}
                          className="text-xs text-on-surface-variant hover:text-error hover:underline font-semibold cursor-pointer"
                        >
                          (Demo: Reset Progress)
                        </button>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-xs leading-relaxed">{t.certUnlockedDesc}</p>
                    </div>
                  </div>

                  <div className="pt-sm flex flex-col sm:flex-row gap-md">
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder={t.inputNamePlaceholder}
                      className="flex-1 px-md py-sm rounded-xl border border-outline-variant focus:outline-none focus:border-primary text-on-surface font-medium bg-surface-container-lowest"
                    />
                    <button
                      onClick={handleDownloadPDF}
                      disabled={isGenerating}
                      className="px-lg py-sm bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-xs cursor-pointer active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[20px]">download</span>
                      {isGenerating ? t.btnGenerating : t.btnDownloadCert}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-md">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                    <span className="material-symbols-outlined text-[28px]">info</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-headline-md text-headline-md font-bold text-navy">{t.certLockedTitle}</h3>
                      {/* Demo unlock helper button for testing */}
                      <button 
                        onClick={handleUnlockDemo}
                        className="text-xs text-primary hover:underline font-semibold cursor-pointer"
                      >
                        (Demo: Unlock All)
                      </button>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-xs leading-relaxed">
                      {t.certLockedDesc}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-md pt-xs">
              <button
                onClick={() => {
                  if (user?.role === 'citizen') {
                    navigate('/learning');
                  } else {
                    navigate('/dashboard');
                  }
                }}
                className="px-lg py-sm border border-outline-variant hover:bg-surface-container text-on-surface font-bold rounded-xl transition shadow-xs bg-white cursor-pointer active:scale-95"
              >
                {t.btnBackDashboard}
              </button>

              <button
                onClick={() => navigate('/practice/1')}
                className="px-lg py-sm bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-xs cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">school</span>
                {t.btnPracticeMore}
              </button>
            </div>

          </div>
        </main>

        {/* Footer Bar */}
        <footer className="bg-surface-container-lowest border-t border-outline-variant py-xs px-lg flex flex-col sm:flex-row justify-between items-center text-xs text-on-surface-variant font-medium select-none shrink-0">
          <div>{t.footerCopyright}</div>
          <div className="flex gap-md mt-xs sm:mt-0">
            <a href="#" className="hover:text-primary transition">{t.footerPrivacy}</a>
            <a href="#" className="hover:text-primary transition">{t.footerTerms}</a>
            <a href="#" className="hover:text-primary transition">{t.footerAccessibility}</a>
          </div>
        </footer>

      </div>

      {/* Hidden Certificate Canvas for PDF Generation */}
      <div className="overflow-hidden h-0 w-0 absolute top-0 left-0">
        <div
          ref={certRef}
          className="w-[1123px] h-[794px] bg-white text-slate-900 p-16 flex flex-col justify-between border-[20px] border-[#0B3D62]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <div className="text-center space-y-2">
            <span className="text-[#2C7BE5] font-extrabold text-2xl tracking-widest uppercase block">GodSign ISL</span>
            <h2 className="text-5xl font-extrabold tracking-tight uppercase text-[#0B3D62]">Certificate of Completion</h2>
          </div>
          <div className="text-center space-y-6 my-auto">
            <p className="text-xl text-slate-600">This certificate is proudly awarded to</p>
            <h3 className="text-5xl font-black text-[#0B3D62] border-b-2 border-slate-300 inline-block pb-2 px-12">
              {userName || "Learner Name"}
            </h3>
            <p className="text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed">
              For successfully completing the Indian Sign Language (ISL) Interactive Learning Program on GodSign ISL.
            </p>
          </div>
          <div className="flex justify-between items-end mb-6 px-8">
            <div>
              <p className="font-semibold text-slate-800">{new Date().toLocaleDateString()}</p>
              <p className="text-xs text-slate-500 uppercase font-bold">Date Issued</p>
            </div>
            <div>
              <span className="font-serif italic text-2xl text-[#0B3D62] font-bold block">GodSign Team</span>
              <p className="text-xs text-slate-500 uppercase font-bold">Authorized Signature</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}