import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { socket, TABLET_ID } from '../utils/socketClient';

const translations = {
  en: {
    brandName: "GodSign",
    brandSubtitle: "ISL Accessibility",
    officerRole: "Desk Officer",
    officerDept: "Police — Kolar Road Station",
    navDashboard: "Dashboard",
    navSendTablet: "Send to Tablet",
    navLearning: "Learning Module",
    navCert: "My Certification",
    navReports: "Reports",
    navLogout: "Logout",
    tabletStatusConnected: "Tablet: Connected (ID: GS-T-402)",
    headerDashboard: "Dashboard",
    searchPlaceholder: "Search ISL phrase or service… e.g. 'File a Complaint'",
    gridTitle: "Frequently Used — Police Counter",
    cardSendBtn: "Send",
    toastSentText: "Sent to Tablet",
    notificationsTitle: "Notifications",
    notif1: "Tablet GS-T-402 connected successfully.",
    notif2: "New learning module available for sign: 'Bail'.",
    notif3: "Your monthly certification progress is at 80%."
  },
  hi: {
    brandName: "गॉडसाइन",
    brandSubtitle: "आईएसएल सुगमता",
    officerRole: "डेस्क अधिकारी",
    officerDept: "पुलिस — कोलार रोड थाना",
    navDashboard: "डैशबोर्ड",
    navSendTablet: "टैबलेट पर भेजें",
    navLearning: "शिक्षण मॉड्यूल",
    navCert: "मेरा प्रमाणन",
    navReports: "रिपोर्ट्स",
    navLogout: "लॉगआउट",
    tabletStatusConnected: "टैबलेट: जुड़ा हुआ है (ID: GS-T-402)",
    headerDashboard: "डैशबोर्ड",
    searchPlaceholder: "आईएसएल वाक्यांश या सेवा खोजें... उदा. 'शिकायत दर्ज करें'",
    gridTitle: "अक्सर उपयोग किए जाने वाले — पुलिस काउंटर",
    cardSendBtn: "भेजें",
    toastSentText: "टैबलेट पर भेजा गया",
    notificationsTitle: "सूचनाएं",
    notif1: "टैबलेट GS-T-402 सफलतापूर्वक कनेक्ट हो गया है।",
    notif2: "नया प्रशिक्षण मॉड्यूल 'जमानत' उपलब्ध है।",
    notif3: "आपकी मासिक प्रमाणन प्रगति 80% पर है।"
  }
};



const roleConfig = {
  police: {
    name: "Ravi Kumar",
    role: "Desk Officer",
    dept: "Police — Kolar Road Station",
    deptHi: "पुलिस — कोलार रोड थाना",
    icon: "local_police",
    gridTitle: "Frequently Used — Police Counter",
    gridTitleHi: "अक्सर उपयोग किए जाने वाले — पुलिस काउंटर",
  },
  health: {
    name: "Priya Sharma",
    role: "Reception Nurse",
    dept: "Health — District Hospital",
    deptHi: "स्वास्थ्य — जिला अस्पताल",
    icon: "local_hospital",
    gridTitle: "Frequently Used — Hospital Counter",
    gridTitleHi: "अक्सर उपयोग किए जाने वाले — अस्पताल काउंटर",
  },
  revenue: {
    name: "Anil Verma",
    role: "Revenue Clerk",
    dept: "Revenue — Tehsil Office",
    deptHi: "राजस्व — तहसील कार्यालय",
    icon: "receipt_long",
    gridTitle: "Frequently Used — Revenue Counter",
    gridTitleHi: "अक्सर उपयोग किए जाने वाले — राजस्व काउंटर",
  },
  transport: {
    name: "Suman Yadav",
    role: "RTO Officer",
    dept: "Transport — RTO Bhopal",
    deptHi: "परिवहन — RTO भोपाल",
    icon: "directions_bus",
    gridTitle: "Frequently Used — Transport Counter",
    gridTitleHi: "अक्सर उपयोग किए जाने वाले — परिवहन काउंटर",
  },
  admin: {
    name: "Admin User",
    role: "Administrator",
    dept: "Administration Desk",
    deptHi: "प्रशासन डेस्क",
    icon: "admin_panel_settings",
    gridTitle: "Frequently Used — Admin Desk",
    gridTitleHi: "अक्सर उपयोग किए जाने वाले — प्रशासन डेस्क",
  },
  citizen: {
    name: "Citizen Kiosk",
    role: "Self-Service",
    dept: "Citizen Services",
    deptHi: "नागरिक सेवाएं",
    icon: "person",
    gridTitle: "Frequently Used — Citizen Services",
    gridTitleHi: "अक्सर उपयोग किए जाने वाले — नागरिक सेवाएं",
  },
};

const phrasesByRole = {
  police: [
    { id: 'help', en: "How can I help you?", hi: "मैं आपकी क्या मदद कर सकता हूँ?", icon: 'help_center' },
    { id: 'complaint', en: "File a Complaint", hi: "शिकायत दर्ज करें", icon: 'assignment' },
    { id: 'lost', en: "Lost and Found", hi: "खोया और पाया", icon: 'find_in_page' },
    { id: 'verify', en: "Verify Document", hi: "दस्तावेज़ सत्यापित करें", icon: 'verified_user' },
    { id: 'emergency', en: "Emergency Assistance", hi: "आपातकालीन सहायता", icon: 'warning' },
    { id: 'feedback', en: "Submit Feedback", hi: "प्रतिक्रिया दें", icon: 'thumbs_up_down' }
  ],
  health: [
    { id: 'help', en: "How can I help you?", hi: "मैं आपकी क्या मदद कर सकता हूँ?", icon: 'help_center' },
    { id: 'symptoms', en: "Describe Your Symptoms", hi: "अपने लक्षण बताएं", icon: 'stethoscope' },
    { id: 'appointment', en: "Book Appointment", hi: "अपॉइंटमेंट बुक करें", icon: 'calendar_month' },
    { id: 'wait', en: "Please Wait", hi: "कृपया प्रतीक्षा करें", icon: 'schedule' },
    { id: 'emergency', en: "Emergency Assistance", hi: "आपातकालीन सहायता", icon: 'warning' },
    { id: 'feedback', en: "Submit Feedback", hi: "प्रतिक्रिया दें", icon: 'thumbs_up_down' }
  ],
  revenue: [
    { id: 'help', en: "How can I help you?", hi: "मैं आपकी क्या मदद कर सकता हूँ?", icon: 'help_center' },
    { id: 'certificate', en: "Apply for Certificate", hi: "प्रमाण पत्र के लिए आवेदन करें", icon: 'description' },
    { id: 'land', en: "Land Record Query", hi: "भूमि रिकॉर्ड पूछताछ", icon: 'landscape' },
    { id: 'token', en: "Take This Token", hi: "यह टोकन लें", icon: 'confirmation_number' },
    { id: 'wait', en: "Please Wait", hi: "कृपया प्रतीक्षा करें", icon: 'schedule' },
    { id: 'feedback', en: "Submit Feedback", hi: "प्रतिक्रिया दें", icon: 'thumbs_up_down' }
  ],
  transport: [
    { id: 'help', en: "How can I help you?", hi: "मैं आपकी क्या मदद कर सकता हूँ?", icon: 'help_center' },
    { id: 'license', en: "License Application", hi: "लाइसेंस आवेदन", icon: 'badge' },
    { id: 'registration', en: "Vehicle Registration", hi: "वाहन पंजीकरण", icon: 'directions_car' },
    { id: 'token', en: "Take This Token", hi: "यह टोकन लें", icon: 'confirmation_number' },
    { id: 'wait', en: "Please Wait", hi: "कृपया प्रतीक्षा करें", icon: 'schedule' },
    { id: 'feedback', en: "Submit Feedback", hi: "प्रतिक्रिया दें", icon: 'thumbs_up_down' }
  ],
  admin: [
    { id: 'help', en: "How can I help you?", hi: "मैं आपकी क्या मदद कर सकता हूँ?", icon: 'help_center' },
    { id: 'idverify', en: "Verify Document", hi: "दस्तावेज़ सत्यापित करें", icon: 'verified_user' },
    { id: 'wait', en: "Please Wait", hi: "कृपया प्रतीक्षा करें", icon: 'schedule' },
    { id: 'feedback', en: "Submit Feedback", hi: "प्रतिक्रिया दें", icon: 'thumbs_up_down' }
  ],
  citizen: [
    { id: 'help', en: "How can I help you?", hi: "मैं आपकी क्या मदद कर सकता हूँ?", icon: 'help_center' },
    { id: 'directions', en: "Where Do I Go?", hi: "मुझे कहाँ जाना है?", icon: 'directions' },
    { id: 'wait', en: "Please Wait", hi: "कृपया प्रतीक्षा करें", icon: 'schedule' },
    { id: 'feedback', en: "Submit Feedback", hi: "प्रतिक्रिया दें", icon: 'thumbs_up_down' }
  ],
};

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const currentRole = user?.department || 'police';
  const phraseList = phrasesByRole[currentRole] || phrasesByRole.police;
  const [lang, setLang] = useState('en');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null); // String or null
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const toastTimerRef = useRef(null);

  const navigate = useNavigate();
  const t = translations[lang];

  const getDepartmentDisplay = () => {
    if (!user) return t.officerDept;
    if (user.role === 'admin') return lang === 'en' ? 'Administration' : 'प्रशासन';
    
    const depts = {
      police: lang === 'en' ? 'Police — Kolar Road Station' : 'पुलिस — कोलार रोड थाना',
      health: lang === 'en' ? 'Health — Bhopal General Hospital' : 'स्वास्थ्य — भोपाल जनरल अस्पताल',
      revenue: lang === 'en' ? 'Revenue — City Office' : 'राजस्व — नगर कार्यालय',
      transport: lang === 'en' ? 'Transport — RTO Office' : 'परिवहन — आरटीओ कार्यालय'
    };
    return depts[user.department] || user.department;
  };

  const getDepartmentGridTitle = () => {
    if (!user) return t.gridTitle;
    const titles = {
      police: lang === 'en' ? 'Frequently Used — Police Counter' : 'अक्सर उपयोग किए जाने वाले — पुलिस काउंटर',
      health: lang === 'en' ? 'Frequently Used — Health Counter' : 'अक्सर उपयोग किए जाने वाले — स्वास्थ्य काउंटर',
      revenue: lang === 'en' ? 'Frequently Used — Revenue Counter' : 'अक्सर उपयोग किए जाने वाले — राजस्व काउंटर',
      transport: lang === 'en' ? 'Frequently Used — Transport Counter' : 'अक्सर उपयोग किए जाने वाले — परिवहन काउंटर',
      none: lang === 'en' ? 'Frequently Used — Admin Panel' : 'अक्सर उपयोग किए जाने वाले — एडमिन पैनल'
    };
    return titles[user.department] || t.gridTitle;
  };

  const getDepartmentIcon = () => {
    if (!user) return 'local_police';
    const icons = {
      police: 'local_police',
      health: 'medical_services',
      revenue: 'payments',
      transport: 'directions_car',
      none: 'admin_panel_settings'
    };
    return icons[user.department] || 'local_police';
  };

  // Format date and time
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      const options = { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      };
      setCurrentTime(date.toLocaleDateString(lang === 'en' ? 'en-US' : 'hi-IN', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => {
      clearInterval(interval);
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, [lang]);

  const handleSendToTablet = (phraseText) => {
    const phrase = phraseList.find(item => item.en === phraseText || item.hi === phraseText);

    if (!socket.connected || !phrase) {
      setToastMessage('Unable to reach tablet');
      return;
    }

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    socket.timeout(3000).emit('send_to_tablet', {
      tabletId: TABLET_ID,
      phrase: {
        phraseId: phrase.id,
        textEn: phrase.en,
        textHi: phrase.hi,
        icon: phrase.icon,
        sentAt: new Date().toISOString(),
      },
    }, (error, response) => {
      setToastMessage(error || !response?.ok ? 'Unable to reach tablet' : `'${phraseText}'`);
      toastTimerRef.current = setTimeout(() => {
        setToastMessage(null);
        toastTimerRef.current = null;
      }, 3000);
    });
  };

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  // Filter phrases based on search input
  const filteredPhrases = phraseList.filter(phrase => {
    const query = searchQuery.toLowerCase();
    return (
      phrase.en.toLowerCase().includes(query) ||
      phrase.hi.includes(query)
    );
  });

  return (
    <div className="bg-surface text-on-surface h-screen overflow-hidden flex font-sans transition-colors duration-300">
      
      {/* Sidebar */}
      <aside className="w-[240px] bg-surface-container-lowest border-r border-outline-variant flex flex-col h-full shrink-0 select-none">
        
        {/* Brand */}
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
                {(user?.name || 'R K').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
 <div className="font-label-md text-label-md font-bold text-navy">{user?.name || 'Ravi Kumar'}</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant">
                {user?.role === 'admin' ? (lang === 'en' ? 'System Administrator' : 'सिस्टम प्रशासक') : t.officerRole}
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

        {/* Navigation */}
        <nav className="flex-1 p-sm flex flex-col gap-unit overflow-y-auto mt-sm">
          <a className="flex items-center gap-md px-md py-sm rounded-lg bg-primary/10 text-primary font-bold" href="#">
            <span className="material-symbols-outlined select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
              dashboard
            </span>
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
            className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined select-none">workspace_premium</span>
            <span className="font-label-md text-label-md">{t.navCert}</span>
          </a>
          
          <a 
            onClick={() => navigate('/reports')}
            className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined select-none">bar_chart</span>
            <span className="font-label-md text-label-md">{t.navReports}</span>
          </a>
          
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

        {/* Tablet Status bottom */}
        <div className="p-md border-t border-outline-variant bg-surface-container-lowest select-none">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#138808] animate-pulse"></div>
            <div className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              {t.tabletStatusConnected}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-custom-bg/30">
        
        {/* Top Header */}
        <header className="bg-surface border-b border-outline-variant flex justify-between items-center w-full px-lg py-md z-10 select-none">
          <div className="font-headline-md text-headline-md text-navy font-bold">
            {t.headerDashboard}
          </div>
          
          <div className="flex items-center gap-lg">
            {/* Language Switcher */}
            <div className="flex items-center bg-surface-container rounded-lg p-xs border border-outline-variant/30">
              <button 
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded font-label-sm text-label-sm font-semibold transition-all ${lang === 'en' ? 'bg-navy text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('hi')}
                className={`px-3 py-1 rounded font-label-sm text-label-sm font-semibold transition-all ${lang === 'hi' ? 'bg-navy text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                हिं
              </button>
            </div>
            
            {/* Timestamp */}
            <div className="font-label-sm text-label-sm text-on-surface-variant font-medium hidden md:block">
              {currentTime}
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
                      className="text-xs text-primary hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-col text-xs mt-xs divide-y divide-outline-variant/30">
                    <div className="p-md hover:bg-surface-container transition-colors leading-relaxed">
                      🔔 {t.notif1}
                    </div>
                    <div className="p-md hover:bg-surface-container transition-colors leading-relaxed">
                      📚 {t.notif2}
                    </div>
                    <div className="p-md hover:bg-surface-container transition-colors leading-relaxed">
                      🏅 {t.notif3}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Main Content Dashboard */}
        <main className="flex-1 overflow-y-auto p-lg lg:p-xl flex flex-col gap-xl">
          <div className="max-w-container-max mx-auto w-full flex flex-col gap-xl relative">
            
            {/* Sent-to-Tablet Toast notification */}
            {toastMessage && (
              <div className="absolute -top-4 right-0 bg-[#e8f5e9] border border-[#138808] text-[#138808] px-md py-sm rounded-lg shadow flex items-center gap-sm z-30 animate-slideDown">
                <span className="material-symbols-outlined select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <span className="font-label-md text-label-md font-bold">
                  {t.toastSentText} — {toastMessage}
                </span>
              </div>
            )}

            {/* Search Input bar */}
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant select-none">
                search
              </span>
              <input 
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 pl-12 pr-16 font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm" 
                placeholder={t.searchPlaceholder} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
              />
              <div className="absolute right-sm top-1/2 -translate-y-1/2 flex items-center gap-1 bg-surface-container px-2 py-1 rounded border border-outline-variant/30 select-none">
                <span className="text-label-sm text-on-surface-variant font-mono">⌘K</span>
              </div>
            </div>

            {/* Interactive Grid Phrase section */}
            <section className="flex flex-col gap-md">
              <h2 className="font-headline-md text-headline-md text-navy flex items-center gap-sm select-none font-bold">
<span className="material-symbols-outlined select-none">{getDepartmentIcon()}</span>
                {getDepartmentGridTitle()}
              </h2>
              
              {filteredPhrases.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md">
                  {filteredPhrases.map((phrase) => {
                    const text = lang === 'en' ? phrase.en : phrase.hi;
                    return (
                      <div 
                        key={phrase.id}
                        onClick={() => handleSendToTablet(text)}
                        className="group bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex items-start gap-md hover:shadow-md hover:border-primary transition-all cursor-pointer relative h-[105px] overflow-hidden"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary group-hover:scale-105 transition-transform duration-300">
                          <span className="material-symbols-outlined select-none">{phrase.icon}</span>
                        </div>
                        <div className="flex flex-col flex-1 pr-6">
                          <span className="font-label-md text-label-md font-bold text-navy group-hover:text-primary transition-colors leading-snug">
                            {text}
                          </span>
                        </div>
                        {/* Hover Send badge */}
                        <div className="absolute bottom-2 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary flex items-center gap-0.5 select-none animate-fadeIn font-semibold text-xs">
                          <span>{t.cardSendBtn}</span>
                          <span className="material-symbols-outlined text-[14px]">send</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-surface-container-lowest border border-outline-variant border-dashed rounded-lg p-xl text-center select-none">
                  <span className="material-symbols-outlined text-[40px] text-outline mb-sm">search_off</span>
                  <p className="font-body-md text-body-md text-on-surface-variant font-medium">
                    No results found for "{searchQuery}"
                  </p>
                </div>
              )}
            </section>

          </div>
        </main>
      </div>

    </div>
  );
}
