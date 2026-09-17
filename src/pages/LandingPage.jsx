import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Heart, Landmark, Car, Building2, HelpCircle } from "lucide-react";

const translations = {
  en: {
    brandName: "GodSign",
    navSolution: "Solution",
    navHowItWorks: "How It Works",
    navDepartments: "For Departments",
    navKiosk: "Citizen Kiosk",
    btnSignIn: "Sign In",
    heroTitle1: "One Platform.",
    heroTitle2: "Infinite Inclusion.",
    heroSubtitle: "Eliminate communication barriers at government counters via real-time offline ISL instruction and operator support.",
    heroSupportText: "Under the aegis of Ministry of Electronics & IT and Digital India Mission.",
    btnLoginPortal: "Login to Portal",
    btnViewKiosk: "View Kiosk Terminal",
    liveCounterBadge: "Live Counter",
    liveCounterTitle: "Counter 2 Live Tablet",
    viewKioskFlow: "View Kiosk Flow",
    stat1Val: "50K+",
    stat1Lbl: "Resolved Queries",
    stat2Val: "12K+",
    stat2Lbl: "Certified Officers",
    stat3Val: "98%",
    stat3Lbl: "Positive Feedback",
    stat4Val: "15sec",
    stat4Lbl: "Avg. Response Time",
    featuresSectionBadge: "Core Capabilities",
    featuresSectionTitle: "Everything accessibility needs, in one place",
    featuresSectionSub: "Built for offices and municipal departments to coordinate civic accessibility without barriers.",
    cap1Title: "AI Gesture & Sign Recognition",
    cap1Desc: "Interactive learning modules featuring hand-tracking point coordinates to evaluate basic gestures.",
    cap2Title: "Offline ISL Video Loop",
    cap2Desc: "Pre-recorded, certified offline ISL instructions for immediate counter assistance without internet delays.",
    cap3Title: "Interactive Training Portal",
    cap3Desc: "Comprehensive 30-day course with streak logs and XP tracking to incentivize and certify counter staff.",
    cap4Title: "Bilingual Operator Desk",
    cap4Desc: "Unified operator desktop to filter complaints, trigger notifications, and monitor tablet status.",
    howItWorksTitle: "How Inclusive Assistance Works",
    howItWorksSub: "Our automated system guides citizens through queries, visual indicators, and operator feedback.",
    step1Title: "Citizen Selects Service",
    step1Desc: "The visitor taps the large touch cards on the table kiosk to select their department query category.",
    step2Title: "Tablet Plays ISL Video",
    step2Desc: "The kiosk displays a certified offline ISL tutorial explaining the next instructions clearly.",
    step3Title: "Operator Response",
    step3Desc: "The desk officer receives automated toast cues and manages the interaction on their dashboard.",
    step4Title: "Experience Feedback",
    step4Desc: "Upon completion, the visitor rates their visit via touch smileys, which auto-resets the screen.",
    deptTitle: "Integrated Counter Departments",
    deptSub: "Real-time query pipelines and training sync across Indian municipal and administrative offices.",
    dept1: "Police Stations",
    dept2: "Civil Hospitals",
    dept3: "Revenue Desks",
    dept4: "Transport Offices",
    dept5: "CSC / Banks",
    dept6: "General Help Desks",
    empowerTitle: "Empowering Operators. Ensuring Accountable Access.",
    empowerDesc: "GodSign coordinates district accessibility. Track operator training, inspect counter audit logs, or manage kiosk templates from a unified institutional dashboard.",
    btnEnterDashboard: "Enter Dashboard",
    bento1Title: "Live Counter Status",
    bento1Desc: "Check active counter terminals.",
    bento2Title: "Interactive Learning",
    bento2Desc: "Basic ISL sign syllabus.",
    bento3Title: "Operator Directory",
    bento3Desc: "Staff roster & certifications.",
    ctaTitle: "Ready to communicate smarter?",
    ctaSub: "Join government departments across India using GodSign to create barrier-free public counters.",
    footerMission: "Empowering citizens through technology.",
    footerQuickTitle: "Quick Links",
    footerResTitle: "Resources",
    footerGovtTitle: "Govt. Departments",
    footerContactTitle: "Contact Us"
  },
  hi: {
    brandName: "गॉडसाइन",
    navSolution: "समाधान",
    navHowItWorks: "यह कैसे काम करता है",
    navDepartments: "विभागों के लिए",
    navKiosk: "नागरिक कियोस्क",
    btnSignIn: "लॉगिन करें",
    heroTitle1: "एक मंच।",
    heroTitle2: "अनंत समावेशन।",
    heroSubtitle: "वास्तविक समय ऑफ़लाइन आईएसएल निर्देश और ऑपरेटर सहायता के माध्यम से सरकारी काउंटरों पर संचार बाधाओं को समाप्त करें।",
    heroSupportText: "इलेक्ट्रॉनिक्स एवं आईटी मंत्रालय और डिजिटल इंडिया मिशन के तत्वावधान में।",
    btnLoginPortal: "पोर्टल में लॉगिन करें",
    btnViewKiosk: "कियोस्क टर्मिनल देखें",
    liveCounterBadge: "लाइव काउंटर",
    liveCounterTitle: "काउंटर 2 लाइव टैबलेट",
    viewKioskFlow: "कियोस्क फ्लो देखें",
    stat1Val: "50K+",
    stat1Lbl: "सुलझाए गए प्रश्न",
    stat2Val: "12K+",
    stat2Lbl: "प्रमाणित अधिकारी",
    stat3Val: "98%",
    stat3Lbl: "सकारात्मक प्रतिक्रिया",
    stat4Val: "15सेकंड",
    stat4Lbl: "औसत प्रतिक्रिया समय",
    featuresSectionBadge: "मुख्य क्षमताएं",
    featuresSectionTitle: "सुगमता की सभी ज़रूरतें, एक ही स्थान पर",
    featuresSectionSub: "कार्यालयों और सरकारी विभागों के लिए बाधाओं के बिना सुगमता का समन्वय करने के लिए निर्मित।",
    cap1Title: "एआई हाव-भाव और संकेत पहचान",
    cap1Desc: "बुनियादी संकेतों का मूल्यांकन करने के लिए हैंड-ट्रैकिंग पॉइंट निर्देशांकों वाले इंटरैक्टिव लर्निंग मॉड्यूल।",
    cap2Title: "ऑफलाइन आईएसएल वीडियो लूप",
    cap2Desc: "बिना इंटरनेट विलंब के तत्काल काउंटर सहायता के लिए पूर्व-रिकॉर्डेड, प्रमाणित ऑफ़लाइन आईएसएल निर्देश।",
    cap3Title: "इंटरैक्टिव प्रशिक्षण पोर्टल",
    cap3Desc: "काउंटर कर्मचारियों को बुनियादी आईएसएल में प्रशिक्षित और प्रमाणित करने के लिए 30-दिवसीय कोर्स।",
    cap4Title: "द्विभाषी ऑपरेटर डेस्क",
    cap4Desc: "शिकायतों को फिल्टर करने, सूचनाएं भेजने और टैबलेट स्थिति की निगरानी करने के लिए एकीकृत ऑपरेटर डेस्कटॉप।",
    howItWorksTitle: "समावेशी सहायता कैसे काम करती है",
    howItWorksSub: "हमारा स्वचालित सिस्टम प्रश्नों, दृश्य संकेतकों और ऑपरेटर फीडबैक के माध्यम से नागरिकों का मार्गदर्शन करता है।",
    step1Title: "नागरिक सेवा का चयन करता है",
    step1Desc: "आगंतुक अपने विभाग प्रश्न श्रेणी का चयन करने के लिए कियोस्क पर बड़े टच कार्ड पर टैप करता है।",
    step2Title: "टैबलेट आईएसएल वीडियो चलाता है",
    step2Desc: "कियोस्क एक प्रमाणित ऑफ़लाइन आईएसएल ट्यूटोरियल प्रदर्शित करता है जो अगले निर्देशों को स्पष्ट रूप से समझाता है।",
    step3Title: "ऑपरेटर प्रतिक्रिया",
    step3Desc: "डेस्क अधिकारी स्वचालित टोस्ट संकेत प्राप्त करता है और अपने डैशबोर्ड पर बातचीत का प्रबंधन करता है।",
    step4Title: "अनुभव फीडबैक",
    step4Desc: "पूरा होने पर, आगंतुक टच स्माइली के माध्यम से अपनी प्रतिक्रिया देता है, जो स्क्रीन को स्वतः रीसेट कर देता है।",
    deptTitle: "एकीकृत काउंटर विभाग",
    deptSub: "भारतीय नगर पालिकाओं और प्रशासनिक कार्यालयों में वास्तविक समय में प्रश्नों और प्रशिक्षण का समन्वय।",
    dept1: "पुलिस स्टेशन",
    dept2: "सिविल अस्पताल",
    dept3: "राजस्व काउंटर",
    dept4: "परिवहन कार्यालय",
    dept5: "सीएससी / बैंक",
    dept6: "सामान्य सहायता डेस्क",
    empowerTitle: "ऑपरेटरों को सशक्त बनाना। जवाबदेह पहुंच सुनिश्चित करना।",
    empowerDesc: "गॉडसाइन जिला स्तर पर सुगमता का समन्वय करता है। एक एकीकृत संस्थागत डैशबोर्ड से ऑपरेटर प्रशिक्षण को ट्रैक करें, काउंटर ऑडिट लॉग का निरीक्षण करें, या कियोस्क टेम्पलेट्स का प्रबंधन करें।",
    btnEnterDashboard: "डैशबोर्ड दर्ज करें",
    bento1Title: "लाइव काउंटर स्थिति",
    bento1Desc: "सक्रिय काउंटर टर्मिनलों की जाँच करें।",
    bento2Title: "इंटरैक्टिव लर्निंग",
    bento2Desc: "बुनियादी आईएसएल संकेत पाठ्यक्रम।",
    bento3Title: "ऑपरेटर निर्देशिका",
    bento3Desc: "कर्मचारी रोस्टर और प्रमाणपत्र।",
    ctaTitle: "स्मार्ट संवाद के लिए तैयार हैं?",
    ctaSub: "बाधा मुक्त सार्वजनिक काउंटर बनाने के लिए पूरे भारत में गॉडसाइन का उपयोग करने वाले सरकारी विभागों में शामिल हों।",
    footerMission: "प्रौद्योगिकी के माध्यम से नागरिकों को सशक्त बनाना।",
    footerQuickTitle: "त्वरित लिंक",
    footerResTitle: "संसाधन",
    footerGovtTitle: "सरकारी विभाग",
    footerContactTitle: "संपर्क करें"
  }
};

export default function LandingPage() {
  const [lang, setLang] = useState('en');
  const navigate = useNavigate();
  const t = translations[lang];

  return (
    <div className="bg-[#f9f9ff] text-on-surface min-h-screen flex flex-col font-sans transition-colors duration-300 antialiased selection:bg-secondary-container selection:text-on-secondary-container">
      
      {/* Navbar Section */}
      <nav className="bg-white border-b border-[#D1E4F8] fixed top-0 w-full z-50 py-4 select-none shadow-sm">
        <div className="w-full max-w-container-max mx-auto px-lg flex items-center justify-between">
          {/* Logo brand */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-sm cursor-pointer hover:opacity-90"
          >
            <div className="w-10 h-10 bg-[#0B3D62] rounded-xl flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-white text-2xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                sign_language
              </span>
            </div>
            <div>
              <span className="font-headline-md text-headline-md font-black text-[#0B3D62]">
                {t.brandName}
              </span>
            </div>
          </div>

          {/* Menu links */}
          <div className="hidden md:flex items-center gap-lg">
            <a href="#features" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-all font-semibold">
              {t.navSolution}
            </a>
            <a href="#how-it-works" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-all font-semibold">
              {t.navHowItWorks}
            </a>
            <a href="#departments" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-all font-semibold">
              {t.navDepartments}
            </a>
            <a 
              onClick={() => navigate('/kiosk-idle')}
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-all font-semibold cursor-pointer"
            >
              {t.navKiosk}
            </a>
          </div>

          {/* Language Selector + CTA Sign in */}
          <div className="flex items-center gap-md">
            
            {/* Language switches */}
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

            <button 
              onClick={() => navigate('/login')}
              className="bg-white border-2 border-[#2C7BE5] text-[#2C7BE5] hover:bg-[#2C7BE5] hover:text-white px-md py-sm rounded-lg font-label-md text-label-md flex items-center gap-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              {t.btnSignIn}
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>

          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-28 pb-16 bg-gradient-to-b from-[#EAF3FC]/50 to-transparent flex items-center select-none">
        <div className="w-full max-w-container-max mx-auto px-lg grid grid-cols-1 lg:grid-cols-12 gap-xl items-center">
          
          {/* Hero Left Column Text */}
          <div className="lg:col-span-7 space-y-md">
            <div className="inline-flex items-center gap-sm bg-white border border-[#D1E4F8] px-md py-sm rounded-full shadow-sm text-[#0B3D62] font-label-md text-label-md font-bold">
              <svg className="w-5 h-3.5 rounded-[2px] shadow-sm shrink-0 border border-neutral-200/30" viewBox="0 0 900 600">
                <rect width="900" height="200" fill="#FF9933"/>
                <rect y="200" width="900" height="200" fill="#FFFFFF"/>
                <rect y="400" width="900" height="200" fill="#138808"/>
                <g transform="translate(450, 300)">
                  <circle r="80" fill="none" stroke="#000080" strokeWidth="6"/>
                  <circle r="15" fill="#000080"/>
                  {Array.from({ length: 24 }).map((_, i) => {
                    const angle = (i * 360) / 24;
                    return (
                      <line
                        key={i}
                        x1="0"
                        y1="0"
                        x2={80 * Math.cos((angle * Math.PI) / 180)}
                        y2={80 * Math.sin((angle * Math.PI) / 180)}
                        stroke="#000080"
                        strokeWidth="3.5"
                      />
                    );
                  })}
                </g>
              </svg>
              {t.heroSupportText}
            </div>
            
            <h1 className="text-[54px] font-black text-[#0B3D62] leading-[1.1] tracking-tight">
              {t.heroTitle1}<br/>
              <span className="text-[#2C7BE5]">{t.heroTitle2}</span>
            </h1>
            
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
              {t.heroSubtitle}
            </p>

            <div className="flex flex-wrap gap-md pt-sm">
              <button 
                onClick={() => navigate('/login')}
                className="bg-[#0B3D62] hover:bg-[#07263F] text-white font-label-md text-label-md px-lg py-4 rounded-xl flex items-center gap-sm shadow-md transition-all active:scale-95 cursor-pointer font-bold"
              >
                {t.btnLoginPortal}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button 
                onClick={() => navigate('/kiosk-idle')}
                className="bg-white border border-[#D1E4F8] hover:border-primary text-on-surface font-label-md text-label-md px-lg py-4 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer font-bold"
              >
                {t.btnViewKiosk}
              </button>
            </div>
          </div>

          {/* Hero Right Column Kiosk representation */}
          <div className="lg:col-span-5">
            <div 
              onClick={() => navigate('/kiosk-idle')}
              className="bg-white border border-[#D1E4F8] rounded-xl p-md shadow-lg flex flex-col gap-sm hover:shadow-xl transition-all cursor-pointer group transform hover:-translate-y-1 duration-300"
            >
              <div className="flex justify-between items-center select-none pb-xs border-b border-[#D1E4F8]/60">
                <div className="flex items-center gap-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#138808] animate-pulse"></span>
                  <span className="font-label-sm text-label-sm text-[#0B3D62] font-black uppercase tracking-wider">
                    {t.liveCounterBadge}
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                  Counter 2
                </span>
              </div>

              {/* Simulated tablet webcam image view */}
              <div className="aspect-video relative rounded-lg overflow-hidden bg-[#0F0F0F] flex items-center justify-center">
                <img 
                  alt="Kiosk Live Preview" 
                  className="w-full h-full object-cover opacity-85 group-hover:scale-102 transition-transform duration-500" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpeQiHlBiMjmAwv0Gk7MVmQVPYPjLGcWhfgQ2URt4Vl--iCQBXi8t8tmCTGv1VbGFnAK0QiO2TTuXm0J1W68bKkfB1ooWmoQWyG9p7psdOwyzTDly-51boZVN6Olg8MIkjr7xOHnJGS6sUg2zefUQz6iEKHBEAbIphNlbekHpzo2DkQigL5uwSBllpWKLZItOf_-L7mIECg1f7ECK4tXrscrj8GgjDInhsYsw-IYnnVLuKqXiXoIFp"
                />
                <div className="absolute inset-0 bg-black/35 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-[#0B3D62] text-white px-md py-sm rounded-full font-label-md text-label-md font-bold shadow flex items-center gap-xs">
                    {t.viewKioskFlow} <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-xs">
                <span className="font-label-md text-label-md text-navy font-bold">{t.liveCounterTitle}</span>
                <span className="text-on-surface-variant text-sm font-medium">Offline Mode</span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Stats Section Bar */}
      <section className="bg-white border-y border-[#D1E4F8] py-lg select-none">
        <div className="w-full max-w-container-max mx-auto px-lg grid grid-cols-2 md:grid-cols-4 gap-md md:divide-x divide-[#D1E4F8] text-center">
          <div className="space-y-xs">
            <p className="text-[#2C7BE5] text-[40px] font-black tracking-tight">{t.stat1Val}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">{t.stat1Lbl}</p>
          </div>
          <div className="space-y-xs">
            <p className="text-[#2C7BE5] text-[40px] font-black tracking-tight">{t.stat2Val}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">{t.stat2Lbl}</p>
          </div>
          <div className="space-y-xs">
            <p className="text-[#2C7BE5] text-[40px] font-black tracking-tight">{t.stat3Val}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">{t.stat3Lbl}</p>
          </div>
          <div className="space-y-xs">
            <p className="text-[#2C7BE5] text-[40px] font-black tracking-tight">{t.stat4Val}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">{t.stat4Lbl}</p>
          </div>
        </div>
      </section>

      {/* Capabilities Features Grid Section */}
      <section id="features" className="py-xl select-none">
        <div className="w-full max-w-container-max mx-auto px-lg">
          
          {/* Header titles */}
          <div className="text-center max-w-3xl mx-auto space-y-sm mb-20">
            <div className="inline-flex items-center gap-sm bg-white border border-[#D1E4F8] px-md py-sm rounded-full text-[#2C7BE5] font-label-md text-label-md font-bold shadow-sm">
              {t.featuresSectionBadge}
            </div>
            <h2 className="text-[44px] font-black text-[#0B3D62] tracking-tight leading-none">
              {t.featuresSectionTitle}
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {t.featuresSectionSub}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg max-w-5xl mx-auto">
            {/* Card 1 */}
            <div className="bg-white border border-[#D1E4F8] rounded-2xl p-xl space-y-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
              <div className="w-12 h-12 rounded-xl bg-[#EAF3FC] flex items-center justify-center text-[#2C7BE5]">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  accessibility_new
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md font-bold text-[#0B3D62]">{t.cap1Title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{t.cap1Desc}</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-[#D1E4F8] rounded-2xl p-xl space-y-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
              <div className="w-12 h-12 rounded-xl bg-[#EAF3FC] flex items-center justify-center text-[#2C7BE5]">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  video_library
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md font-bold text-[#0B3D62]">{t.cap2Title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{t.cap2Desc}</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-[#D1E4F8] rounded-2xl p-xl space-y-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
              <div className="w-12 h-12 rounded-xl bg-[#EAF3FC] flex items-center justify-center text-[#2C7BE5]">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  school
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md font-bold text-[#0B3D62]">{t.cap3Title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{t.cap3Desc}</p>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-[#D1E4F8] rounded-2xl p-xl space-y-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
              <div className="w-12 h-12 rounded-xl bg-[#EAF3FC] flex items-center justify-center text-[#2C7BE5]">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  desktop_windows
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md font-bold text-[#0B3D62]">{t.cap4Title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{t.cap4Desc}</p>
            </div>
          </div>

        </div>
      </section>

      {/* How it works progressions */}
      <section id="how-it-works" className="py-xl bg-[#EAF3FC]/30 border-y border-[#D1E4F8] select-none">
        <div className="w-full max-w-container-max mx-auto px-lg">
          
          <div className="text-center max-w-3xl mx-auto space-y-sm mb-20">
            <h2 className="text-[44px] font-black text-[#0B3D62] tracking-tight leading-none">
              {t.howItWorksTitle}
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {t.howItWorksSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="bg-white border border-[#D1E4F8] rounded-2xl p-lg relative hover:shadow-md transition-all">
              <div className="absolute top-sm right-sm text-outline-variant font-mono text-2xl font-black">01</div>
              <div className="w-10 h-10 rounded-lg bg-[#EAF3FC] flex items-center justify-center text-[#2C7BE5] mb-md">
                <span className="material-symbols-outlined text-[22px]">touch_app</span>
              </div>
              <h4 className="font-label-md text-label-md font-bold text-[#0B3D62] mb-sm">{t.step1Title}</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{t.step1Desc}</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-[#D1E4F8] rounded-2xl p-lg relative hover:shadow-md transition-all">
              <div className="absolute top-sm right-sm text-outline-variant font-mono text-2xl font-black">02</div>
              <div className="w-10 h-10 rounded-lg bg-[#EAF3FC] flex items-center justify-center text-[#2C7BE5] mb-md">
                <span className="material-symbols-outlined text-[22px]">play_circle</span>
              </div>
              <h4 className="font-label-md text-label-md font-bold text-[#0B3D62] mb-sm">{t.step2Title}</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{t.step2Desc}</p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-[#D1E4F8] rounded-2xl p-lg relative hover:shadow-md transition-all">
              <div className="absolute top-sm right-sm text-outline-variant font-mono text-2xl font-black">03</div>
              <div className="w-10 h-10 rounded-lg bg-[#EAF3FC] flex items-center justify-center text-[#2C7BE5] mb-md">
                <span className="material-symbols-outlined text-[22px]">notification_important</span>
              </div>
              <h4 className="font-label-md text-label-md font-bold text-[#0B3D62] mb-sm">{t.step3Title}</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{t.step3Desc}</p>
            </div>

            {/* Step 4 */}
            <div className="bg-white border border-[#D1E4F8] rounded-2xl p-lg relative hover:shadow-md transition-all">
              <div className="absolute top-sm right-sm text-outline-variant font-mono text-2xl font-black">04</div>
              <div className="w-10 h-10 rounded-lg bg-[#EAF3FC] flex items-center justify-center text-[#2C7BE5] mb-md">
                <span className="material-symbols-outlined text-[22px]">sentiment_satisfied</span>
              </div>
              <h4 className="font-label-md text-label-md font-bold text-[#0B3D62] mb-sm">{t.step4Title}</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{t.step4Desc}</p>
            </div>
          </div>

        </div>
      </section>

      {/* Integrated Departments badges
      <section id="departments" className="py-xl select-none">
        <div className="w-full max-w-container-max mx-auto px-lg">
          
          <div className="text-center max-w-3xl mx-auto space-y-sm mb-16">
            <h2 className="text-[44px] font-black text-[#0B3D62] tracking-tight leading-none">
              {t.deptTitle}
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {t.deptSub}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-md max-w-5xl mx-auto">
            <div className="bg-white border border-[#D1E4F8] rounded-xl py-md px-lg text-center flex flex-col items-center gap-xs hover:shadow-sm transition-shadow">
              <span className="text-2xl">👮</span>
              <span className="font-label-md text-label-md text-[#0B3D62] font-black">{t.dept1}</span>
            </div>
            <div className="bg-white border border-[#D1E4F8] rounded-xl py-md px-lg text-center flex flex-col items-center gap-xs hover:shadow-sm transition-shadow">
              <span className="text-2xl">🏥</span>
              <span className="font-label-md text-label-md text-[#0B3D62] font-black">{t.dept2}</span>
            </div>
            <div className="bg-white border border-[#D1E4F8] rounded-xl py-md px-lg text-center flex flex-col items-center gap-xs hover:shadow-sm transition-shadow">
              <span className="text-2xl">🏛️</span>
              <span className="font-label-md text-label-md text-[#0B3D62] font-black">{t.dept3}</span>
            </div>
            <div className="bg-white border border-[#D1E4F8] rounded-xl py-md px-lg text-center flex flex-col items-center gap-xs hover:shadow-sm transition-shadow">
              <span className="text-2xl">🚗</span>
              <span className="font-label-md text-label-md text-[#0B3D62] font-black">{t.dept4}</span>
            </div>
            <div className="bg-white border border-[#D1E4F8] rounded-xl py-md px-lg text-center flex flex-col items-center gap-xs hover:shadow-sm transition-shadow">
              <span className="text-2xl">🏦</span>
              <span className="font-label-md text-label-md text-[#0B3D62] font-black">{t.dept5}</span>
            </div>
            <div className="bg-white border border-[#D1E4F8] rounded-xl py-md px-lg text-center flex flex-col items-center gap-xs hover:shadow-sm transition-shadow">
              <span className="text-2xl">❓</span>
              <span className="font-label-md text-label-md text-[#0B3D62] font-black">{t.dept6}</span>
            </div>
          </div>

        </div>
      </section> */}
      {/* Integrated Departments badges */}

{/* then in JSX: */}
<section id="departments" className="py-xl select-none">
  <div className="w-full max-w-container-max mx-auto px-lg">

    <div className="text-center max-w-3xl mx-auto space-y-sm mb-16">
      <h2 className="text-[44px] font-black text-[#0B3D62] tracking-tight leading-none">
        {t.deptTitle}
      </h2>
      <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
        {t.deptSub}
      </p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-md max-w-5xl mx-auto">
      <div className="bg-white border border-[#D1E4F8] rounded-xl py-md px-lg text-center flex flex-col items-center gap-xs hover:shadow-sm transition-shadow">
        <Shield size={28} className="text-[#1D6FA4]" />
        <span className="font-label-md text-label-md text-[#0B3D62] font-black">{t.dept1}</span>
      </div>
      <div className="bg-white border border-[#D1E4F8] rounded-xl py-md px-lg text-center flex flex-col items-center gap-xs hover:shadow-sm transition-shadow">
        <Heart size={28} className="text-[#1D6FA4]" />
        <span className="font-label-md text-label-md text-[#0B3D62] font-black">{t.dept2}</span>
      </div>
      <div className="bg-white border border-[#D1E4F8] rounded-xl py-md px-lg text-center flex flex-col items-center gap-xs hover:shadow-sm transition-shadow">
        <Landmark size={28} className="text-[#1D6FA4]" />
        <span className="font-label-md text-label-md text-[#0B3D62] font-black">{t.dept3}</span>
      </div>
      <div className="bg-white border border-[#D1E4F8] rounded-xl py-md px-lg text-center flex flex-col items-center gap-xs hover:shadow-sm transition-shadow">
        <Car size={28} className="text-[#1D6FA4]" />
        <span className="font-label-md text-label-md text-[#0B3D62] font-black">{t.dept4}</span>
      </div>
      <div className="bg-white border border-[#D1E4F8] rounded-xl py-md px-lg text-center flex flex-col items-center gap-xs hover:shadow-sm transition-shadow">
        <Building2 size={28} className="text-[#1D6FA4]" />
        <span className="font-label-md text-label-md text-[#0B3D62] font-black">{t.dept5}</span>
      </div>
      <div className="bg-white border border-[#D1E4F8] rounded-xl py-md px-lg text-center flex flex-col items-center gap-xs hover:shadow-sm transition-shadow">
        <HelpCircle size={28} className="text-[#1D6FA4]" />
        <span className="font-label-md text-label-md text-[#0B3D62] font-black">{t.dept6}</span>
      </div>
    </div>

  </div>
</section>

      {/* Empowering sections / Bento */}
      <section className="py-xl bg-[#EAF3FC]/30 border-t border-[#D1E4F8] select-none">
        <div className="w-full max-w-container-max mx-auto px-lg grid grid-cols-1 lg:grid-cols-12 gap-xl items-center">
          
          {/* Empower Left Info */}
          <div className="lg:col-span-6 space-y-md">
            <div className="inline-flex items-center gap-sm bg-white border border-[#D1E4F8] px-md py-sm rounded-full text-[#138808] font-label-md text-label-md font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#138808]"></span>
              Public Accessibility Audits
            </div>
            <h2 className="text-[44px] font-black text-[#0B3D62] leading-tight tracking-tight">
              {t.empowerTitle}
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {t.empowerDesc}
            </p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-[#2C7BE5] hover:bg-[#1A5BB5] text-white font-label-md text-label-md px-lg py-sm rounded-lg flex items-center gap-xs shadow-sm transition-all active:scale-95 cursor-pointer font-bold"
            >
              {t.btnEnterDashboard}
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

          {/* Empower Right Bento boxes */}
          <div className="lg:col-span-6 flex flex-col gap-md">
            <div 
              onClick={() => navigate('/dashboard')}
              className="bg-white border border-[#D1E4F8] p-md rounded-xl flex items-center justify-between hover:shadow-md cursor-pointer transition-all"
            >
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 rounded-lg bg-[#EAF3FC] flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">checklist</span>
                </div>
                <div>
                  <h4 className="font-label-md text-label-md text-navy font-bold">{t.bento1Title}</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{t.bento1Desc}</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline text-[20px]">chevron_right</span>
            </div>

            <div 
              onClick={() => navigate('/learning')}
              className="bg-white border border-[#D1E4F8] p-md rounded-xl flex items-center justify-between hover:shadow-md cursor-pointer transition-all"
            >
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 rounded-lg bg-[#EAF3FC] flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">school</span>
                </div>
                <div>
                  <h4 className="font-label-md text-label-md text-navy font-bold">{t.bento2Title}</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{t.bento2Desc}</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline text-[20px]">chevron_right</span>
            </div>

            <div 
              onClick={() => navigate('/reports')}
              className="bg-white border border-[#D1E4F8] p-md rounded-xl flex items-center justify-between hover:shadow-md cursor-pointer transition-all"
            >
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 rounded-lg bg-[#EAF3FC] flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">contact_page</span>
                </div>
                <div>
                  <h4 className="font-label-md text-label-md text-navy font-bold">{t.bento3Title}</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{t.bento3Desc}</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline text-[20px]">chevron_right</span>
            </div>
          </div>

        </div>
      </section>

      {/* Boxed CTA banner */}
      <section className="py-xl select-none">
        <div className="w-full max-w-4xl mx-auto px-lg">
          <div className="bg-[#0B3D62] rounded-2xl py-10 px-8 text-center text-white space-y-md shadow-md relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
            
            <h2 className="text-3xl font-black tracking-tight">{t.ctaTitle}</h2>
            <p className="font-body-md text-body-sm text-primary-fixed-dim/90 max-w-lg mx-auto leading-relaxed">
              {t.ctaSub}
            </p>
            
            <div className="flex flex-wrap gap-md justify-center pt-xs">
              <button 
                onClick={() => navigate('/login')}
                className="bg-[#2C7BE5] hover:bg-[#1C60BD] text-white px-md py-2.5 rounded-lg font-label-md text-label-md font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                {t.btnLoginPortal}
              </button>
              <button 
                onClick={() => navigate('/kiosk-idle')}
                className="bg-white/10 hover:bg-white/20 border border-white/25 text-white px-md py-2.5 rounded-lg font-label-md text-label-md font-bold transition-all active:scale-95 cursor-pointer"
              >
                {t.btnViewKiosk}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer link lists */}
      <footer className="bg-[#0B3D62] text-white border-t border-white/10 py-xl select-none mt-auto">
        <div className="w-full max-w-container-max mx-auto px-lg grid grid-cols-1 md:grid-cols-12 gap-xl pb-lg border-b border-white/10">
          
          {/* Logo description */}
          <div className="md:col-span-4 space-y-md">
            <div className="flex items-center gap-sm">
              <div className="w-8 h-8 bg-white text-[#0B3D62] rounded-lg flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[18px] font-black" style={{ fontVariationSettings: "'FILL' 1" }}>
                  sign_language
                </span>
              </div>
              <span className="font-headline-md text-headline-md font-black">{t.brandName}</span>
            </div>
            <p className="font-body-sm text-body-sm text-primary-fixed-dim leading-relaxed max-w-xs">
              {t.footerMission}
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-sm">
            <h4 className="font-label-md text-label-md font-black text-white/50 uppercase tracking-wider">
              {t.footerQuickTitle}
            </h4>
            <div className="flex flex-col gap-xs font-body-sm text-body-sm text-primary-fixed-dim">
              <a onClick={() => navigate('/login')} className="hover:text-white cursor-pointer transition-colors">Operator Login</a>
              <a onClick={() => navigate('/kiosk-idle')} className="hover:text-white cursor-pointer transition-colors">Kiosk Welcome</a>
              <a onClick={() => navigate('/learning')} className="hover:text-white cursor-pointer transition-colors">Learning Desk</a>
              <a onClick={() => navigate('/reports')} className="hover:text-white cursor-pointer transition-colors">Audit Reports</a>
            </div>
          </div>

          {/* Resources */}
          <div className="md:col-span-2 space-y-sm">
            <h4 className="font-label-md text-label-md font-black text-white/50 uppercase tracking-wider">
              {t.footerResTitle}
            </h4>
            <div className="flex flex-col gap-xs font-body-sm text-body-sm text-primary-fixed-dim">
              <a className="hover:text-white cursor-pointer transition-colors">Guidelines</a>
              <a className="hover:text-white cursor-pointer transition-colors">Privacy Policy</a>
              <a className="hover:text-white cursor-pointer transition-colors">Terms of Service</a>
              <a className="hover:text-white cursor-pointer transition-colors">RTI Portal</a>
            </div>
          </div>

          {/* Gov Departments */}
          <div className="md:col-span-2 space-y-sm">
            <h4 className="font-label-md text-label-md font-black text-white/50 uppercase tracking-wider">
              {t.footerGovtTitle}
            </h4>
            <div className="flex flex-col gap-xs font-body-sm text-body-sm text-primary-fixed-dim">
              <a className="hover:text-white cursor-pointer transition-colors">MeitY</a>
              <a className="hover:text-white cursor-pointer transition-colors">Digital India</a>
              <a className="hover:text-white cursor-pointer transition-colors">Min. of Social Justice</a>
              <a className="hover:text-white cursor-pointer transition-colors">Smart Cities</a>
            </div>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-2 space-y-sm">
            <h4 className="font-label-md text-label-md font-black text-white/50 uppercase tracking-wider">
              {t.footerContactTitle}
            </h4>
            <div className="flex flex-col gap-xs font-body-sm text-body-sm text-primary-fixed-dim leading-relaxed">
              <p>Ministry of Electronics & IT</p>
              <p>New Delhi - 110003</p>
              <p className="hover:text-white cursor-pointer transition-colors">support@godsign.gov.in</p>
            </div>
          </div>

        </div>

        <div className="w-full max-w-container-max mx-auto px-lg pt-lg flex flex-col md:flex-row justify-between items-center gap-md select-none text-primary-fixed-dim font-label-sm text-label-sm">
          <p>© 2026 GodSign. All rights reserved.</p>
          <p>Made with ❤️ for every citizen of India</p>
        </div>
      </footer>

    </div>
  );
}
