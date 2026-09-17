import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    headerStation: "Kolar Road Police Station",
    headerSub: "Operator Reports & Certification",
    searchPlaceholder: "Search reports...",
    certTitle: "ISL-Friendly Certification",
    certSub: "Kolar Road Police Station Progress",
    certBadge: "Bronze Threshold Met — Audit Eligible",
    btnRequestAudit: "Request Bronze Audit",
    btnAuditRequested: "Audit Requested ✓",
    staffTitle: "Staff Performance & Training",
    rosterLink: "View Full Roster",
    thName: "Name",
    thRole: "Role",
    thLessons: "Lessons",
    thLastActive: "Last Active",
    thStatus: "Status",
    statusCertified: "Certified",
    statusInProgress: "In Progress",
    statusNotStarted: "Not Started",
    chartTitle: "Monthly Counter Interactions",
    statInteractions: "Total Interactions",
    statInteractionsSub: "This Month",
    statRating: "Avg. Rating",
    statRatingSub: "From deaf citizens",
    phraseTitle: "Phrase Most Sent",
    phraseUsage: "87x used",
    phraseLink: "View All"
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
    headerStation: "कोलार रोड पुलिस थाना",
    headerSub: "ऑपरेटर रिपोर्ट्स और प्रमाणन",
    searchPlaceholder: "रिपोर्ट्स खोजें...",
    certTitle: "आईएसएल-अनुकूल प्रमाणन",
    certSub: "कोलार रोड पुलिस थाना प्रगति",
    certBadge: "कांस्य सीमा पार — ऑडिट योग्य",
    btnRequestAudit: "कांस्य ऑडिट का अनुरोध करें",
    btnAuditRequested: "ऑडिट अनुरोधित ✓",
    staffTitle: "कर्मचारी प्रदर्शन और प्रशिक्षण",
    rosterLink: "पूर्ण रोस्टर देखें",
    thName: "नाम",
    thRole: "भूमिका",
    thLessons: "पाठ",
    thLastActive: "अंतिम सक्रिय",
    thStatus: "स्थिति",
    statusCertified: "प्रमाणित",
    statusInProgress: "प्रगति पर है",
    statusNotStarted: "शुरू नहीं हुआ",
    chartTitle: "मासिक काउंटर वार्तालाप",
    statInteractions: "कुल वार्तालाप",
    statInteractionsSub: "इस महीने",
    statRating: "औसत रेटिंग",
    statRatingSub: "बधिर नागरिकों से",
    phraseTitle: "सबसे अधिक भेजा गया वाक्यांश",
    phraseUsage: "87x उपयोग किया गया",
    phraseLink: "सभी देखें"
  }
};

const staffRostersByDepartment = {
  police: {
    en: [
      { name: "Rajesh Kumar", role: "Inspector", lessons: "24/30", lastActive: "Today", status: "progress" },
      { name: "Anita Singh", role: "Sub-Inspector", lessons: "20/30", lastActive: "Yesterday", status: "progress" },
      { name: "Amit Patel", role: "Constable", lessons: "12/30", lastActive: "3 days ago", status: "progress" },
      { name: "Priya Verma", role: "Desk Officer", lessons: "2/30", lastActive: "1 week ago", status: "progress" },
      { name: "Suresh Rao", role: "Assistant", lessons: "0/30", lastActive: "Never", status: "not_started" }
    ],
    hi: [
      { name: "राजेश कुमार", role: "निरीक्षक (Inspector)", lessons: "24/30", lastActive: "आज", status: "progress" },
      { name: "अनिता सिंह", role: "उप-निरीक्षक (Sub-Inspector)", lessons: "20/30", lastActive: "कल", status: "progress" },
      { name: "अमित पटेल", role: "कांस्टेबल (Constable)", lessons: "12/30", lastActive: "3 दिन पहले", status: "progress" },
      { name: "प्रिया वर्मा", role: "डेस्क अधिकारी (Desk Officer)", lessons: "2/30", lastActive: "1 सप्ताह पहले", status: "progress" },
      { name: "सुरेश राव", role: "सहायक (Assistant)", lessons: "0/30", lastActive: "कभी नहीं", status: "not_started" }
    ]
  },
  health: {
    en: [
      { name: "Dr. Sunita Sharma", role: "Chief Medical Officer", lessons: "18/30", lastActive: "Today", status: "progress" },
      { name: "Dr. Vikram Adani", role: "Senior Resident Doctor", lessons: "15/30", lastActive: "Today", status: "progress" },
      { name: "Meena Kumari", role: "Head Nurse", lessons: "10/30", lastActive: "Yesterday", status: "progress" },
      { name: "Alok Verma", role: "Triage Officer", lessons: "5/30", lastActive: "4 days ago", status: "progress" },
      { name: "Sunita Roy", role: "Ward Assistant", lessons: "0/30", lastActive: "Never", status: "not_started" }
    ],
    hi: [
      { name: "डॉ. सुनिता शर्मा", role: "मुख्य चिकित्सा अधिकारी", lessons: "18/30", lastActive: "आज", status: "progress" },
      { name: "डॉ. विक्रम अडानी", role: "वरिष्ठ रेजिडेंट डॉक्टर", lessons: "15/30", lastActive: "आज", status: "progress" },
      { name: "मीना कुमारी", role: "हेड नर्स", lessons: "10/30", lastActive: "कल", status: "progress" },
      { name: "आलोक वर्मा", role: "ट्राइएज अधिकारी", lessons: "5/30", lastActive: "4 दिन पहले", status: "progress" },
      { name: "सुनीता रॉय", role: "वॉर्ड सहायक", lessons: "0/30", lastActive: "कभी नहीं", status: "not_started" }
    ]
  },
  revenue: {
    en: [
      { name: "Rajesh Patel", role: "Tehsildar", lessons: "24/30", lastActive: "Today", status: "progress" },
      { name: "Sunita Sharma", role: "Naib Tehsildar", lessons: "18/30", lastActive: "Yesterday", status: "progress" },
      { name: "Sanjay Gupta", role: "Revenue Inspector", lessons: "12/30", lastActive: "2 days ago", status: "progress" },
      { name: "Kavita Joshi", role: "Patwari / Desk Officer", lessons: "4/30", lastActive: "5 days ago", status: "progress" },
      { name: "Ramesh Chand", role: "Record Assistant", lessons: "0/30", lastActive: "Never", status: "not_started" }
    ],
    hi: [
      { name: "राजेश पटेल", role: "तहसीलदार", lessons: "24/30", lastActive: "आज", status: "progress" },
      { name: "सुनीता शर्मा", role: "नायब तहसीलदार", lessons: "18/30", lastActive: "कल", status: "progress" },
      { name: "संजय गुप्ता", role: "राजस्व निरीक्षक", lessons: "12/30", lastActive: "2 दिन पहले", status: "progress" },
      { name: "कविता जोशी", role: "पटवारी / डेस्क अधिकारी", lessons: "4/30", lastActive: "5 दिन पहले", status: "progress" },
      { name: "रमेश चंद", role: "रिकॉर्ड सहायक", lessons: "0/30", lastActive: "कभी नहीं", status: "not_started" }
    ]
  },
  transport: {
    en: [
      { name: "Vikram Singh", role: "RTO Inspector", lessons: "18/30", lastActive: "Today", status: "progress" },
      { name: "Pooja Sharma", role: "Assistant RTO", lessons: "14/30", lastActive: "Today", status: "progress" },
      { name: "Manoj Verma", role: "Licensing Officer", lessons: "10/30", lastActive: "Yesterday", status: "progress" },
      { name: "Deepa Nair", role: "Vehicle Inspector", lessons: "3/30", lastActive: "1 week ago", status: "progress" },
      { name: "Rahul Saxena", role: "Counter Assistant", lessons: "0/30", lastActive: "Never", status: "not_started" }
    ],
    hi: [
      { name: "विक्रम सिंह", role: "आरटीओ निरीक्षक", lessons: "18/30", lastActive: "आज", status: "progress" },
      { name: "पूजा शर्मा", role: "सहायक आरटीओ", lessons: "14/30", lastActive: "आज", status: "progress" },
      { name: "मनोज वर्मा", role: "लाइसेंसिंग अधिकारी", lessons: "10/30", lastActive: "कल", status: "progress" },
      { name: "दीपा नायर", role: "वाहन निरीक्षक", lessons: "3/30", lastActive: "1 सप्ताह पहले", status: "progress" },
      { name: "राहुल सक्सेना", role: "काउंटर सहायक", lessons: "0/30", lastActive: "कभी नहीं", status: "not_started" }
    ]
  },
  admin: {
    en: [
      { name: "Admin Officer", role: "System Administrator", lessons: "30/30", lastActive: "Today", status: "certified" },
      { name: "Ravi Kumar", role: "Police Dept Lead", lessons: "30/30", lastActive: "Today", status: "certified" },
      { name: "Dr. Sunita Sharma", role: "Health Dept Lead", lessons: "26/30", lastActive: "Yesterday", status: "progress" },
      { name: "Rajesh Patel", role: "Revenue Dept Lead", lessons: "22/30", lastActive: "2 days ago", status: "progress" },
      { name: "Vikram Singh", role: "Transport Dept Lead", lessons: "15/30", lastActive: "3 days ago", status: "progress" }
    ],
    hi: [
      { name: "एडमिन अधिकारी", role: "सिस्टम प्रशासक", lessons: "30/30", lastActive: "आज", status: "certified" },
      { name: "रवि कुमार", role: "पुलिस विभाग प्रमुख", lessons: "30/30", lastActive: "आज", status: "certified" },
      { name: "डॉ. सुनिता शर्मा", role: "स्वास्थ्य विभाग प्रमुख", lessons: "26/30", lastActive: "कल", status: "progress" },
      { name: "राजेश पटेल", role: "राजस्व विभाग प्रमुख", lessons: "22/30", lastActive: "2 दिन पहले", status: "progress" },
      { name: "विक्रम सिंह", role: "परिवहन विभाग प्रमुख", lessons: "15/30", lastActive: "3 दिन पहले", status: "progress" }
    ]
  }
};

const monthlyData = [
  { month: "Jul", value: 120, height: "h-[40%]" },
  { month: "Aug", value: 165, height: "h-[55%]" },
  { month: "Sep", value: 135, height: "h-[45%]" },
  { month: "Oct", value: 210, height: "h-[70%]" },
  { month: "Nov", value: 255, height: "h-[85%]" },
  { month: "Dec", value: 342, height: "h-[100%]", highlight: true }
];

export default function ReportsPage() {
  const { user, logout } = useAuth();
  const [lang, setLang] = useState('en');
  const [auditRequested, setAuditRequested] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  const t = translations[lang];

  const getDepartmentStation = () => {
    if (!user) return t.headerStation;
    if (user.role === 'admin') return lang === 'en' ? 'Central GovTech Command' : 'केंद्रीय गॉवटेक कमांड';

    const stations = {
      police: lang === 'en' ? 'Kolar Road Police Station' : 'कोलार रोड पुलिस थाना',
      health: lang === 'en' ? 'Bhopal General Hospital' : 'भोपाल जनरल अस्पताल',
      revenue: lang === 'en' ? 'City Revenue Office' : 'नगर राजस्व कार्यालय',
      transport: lang === 'en' ? 'Bhopal RTO Office' : 'भोपाल आरटीओ कार्यालय'
    };
    return stations[user.department] || user.department;
  };

  const getStaffRoster = () => {
    const deptKey = user?.role === 'admin' ? 'admin' : (user?.department || 'police');
    const rosterObj = staffRostersByDepartment[deptKey] || staffRostersByDepartment.police;
    return rosterObj[lang] || rosterObj.en;
  };

  // Filter staff by search term
  const filteredStaff = getStaffRoster().filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <a
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-container-highest rounded-xl font-label-md text-label-md transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined select-none">home</span>
            {t.navHome}
          </a>

          <a className="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-container-highest rounded-xl font-label-md text-label-md transition-all cursor-not-allowed opacity-60">
            <span className="material-symbols-outlined select-none">translate</span>
            {t.navTranslation}
          </a>

          <a
            onClick={() => navigate('/learning')}
            className="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-container-highest rounded-xl font-label-md text-label-md transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined select-none">school</span>
            {t.navLearning}
          </a>

          <a className="flex items-center gap-md bg-secondary-container text-on-secondary-container rounded-xl px-md py-sm font-label-md text-label-md font-bold scale-95 transition-all select-none">
            <span className="material-symbols-outlined select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
              analytics
            </span>
            {t.navReports}
          </a>

          <div className="mt-xl px-sm">
            <button
              onClick={() => navigate('/learning')}
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

        {/* Top App Bar Header */}
        <header className="bg-surface border-b border-outline-variant flex justify-between items-center w-full px-lg h-16 z-40 shrink-0 select-none">
          <div>
            <h2 className="font-headline-md text-headline-md font-bold text-[#0B3D62] leading-tight">
              {getDepartmentStation()}
            </h2>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-[2px]">
              {t.headerSub}
            </p>
          </div>

          <div className="flex items-center gap-lg">
            {/* Search inputs */}
            <div className="relative hidden lg:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px] select-none">
                search
              </span>
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#D1E4F8] rounded-lg focus:outline-none focus:border-[#2C7BE5] focus:ring-1 focus:ring-[#2C7BE5] text-sm transition-colors w-64 text-on-surface font-sans"
                placeholder={t.searchPlaceholder}
                type="text"
              />
            </div>

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
          </div>
        </header>

        {/* Reports Canvas */}
        <div className="flex-1 p-lg max-w-[1200px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">

            {/* Left Column (Wide) */}
            <div className="lg:col-span-8 flex flex-col gap-lg">

              {/* Certification Progress Card */}
              <section className="bg-white rounded-xl border border-[#D1E4F8] p-lg shadow-sm relative overflow-hidden">
                {/* Background subtle visual element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#cfe5ff] to-transparent opacity-25 rounded-bl-full pointer-events-none"></div>

                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md mb-lg select-none">
                  <div>
                    <h3 className="font-headline-md text-headline-md font-bold text-[#0B3D62]">
                      {t.certTitle}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                      {getDepartmentStation()} {lang === 'en' ? 'Progress' : 'प्रगति'}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 border border-[#138808]/30 bg-[#138808]/5 text-[#138808] px-3 py-1.5 rounded-full font-label-sm text-label-sm font-bold">
                    <span className="material-symbols-outlined text-[16px] select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                      workspace_premium
                    </span>
                    {t.certBadge}
                  </div>
                </div>

                {/* Progress markers visual scale tracks */}
                <div className="relative pt-6 pb-12 z-10 select-none">
                  <div className="h-4 bg-surface-container-highest rounded-full w-full relative">
                    <div
                      className="absolute top-0 left-0 h-full bg-[#2C7BE5] rounded-full transition-all duration-1000 ease-out"
                      style={{ width: "62%" }}
                    ></div>

                    {/* Markers */}
                    <div className="absolute top-1/2 left-[33%] -translate-y-1/2 -translate-x-1/2 flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-white border-4 border-[#2C7BE5] z-20 shadow-sm flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-[#2C7BE5] rounded-full"></div>
                      </div>
                      <span className="absolute top-8 font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap font-bold">
                        Bronze (33%)
                      </span>
                    </div>

                    <div className="absolute top-1/2 left-[66%] -translate-y-1/2 -translate-x-1/2 flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-white border-4 border-outline-variant z-20 shadow-sm flex items-center justify-center"></div>
                      <span className="absolute top-8 font-label-sm text-label-sm text-outline-variant whitespace-nowrap font-medium">
                        Silver (66%)
                      </span>
                    </div>

                    <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-white border-4 border-outline-variant z-20 shadow-sm flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px] text-outline-variant select-none">
                          emoji_events
                        </span>
                      </div>
                      <span className="absolute top-10 font-label-sm text-label-sm text-outline-variant whitespace-nowrap pr-4 font-semibold">
                        Gold (100%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Audit trigger buttons */}
                <div className="flex justify-end mt-md z-10 relative select-none">
                  <button
                    onClick={() => setAuditRequested(prev => !prev)}
                    className={`px-lg py-sm rounded-lg font-label-md text-label-md flex items-center gap-2 active:scale-95 transition-all shadow-sm cursor-pointer font-bold ${auditRequested ? 'bg-[#138808] text-white' : 'bg-[#2C7BE5] hover:bg-[#1A5BB5] text-white'}`}
                  >
                    {auditRequested ? t.btnAuditRequested : t.btnRequestAudit}
                    <span className="material-symbols-outlined text-[18px] select-none">
                      {auditRequested ? 'check' : 'arrow_forward'}
                    </span>
                  </button>
                </div>
              </section>

              {/* Staff Training Tables */}
              <section className="bg-white rounded-xl border border-[#D1E4F8] shadow-sm overflow-hidden flex flex-col">
                <div className="p-lg border-b border-[#D1E4F8] flex justify-between items-center bg-surface-bright select-none">
                  <h3 className="font-headline-md text-headline-md font-bold text-[#0B3D62] flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary select-none">
                      groups
                    </span>
                    {t.staffTitle}
                  </h3>
                  <button className="text-[#2C7BE5] font-label-md text-label-md hover:underline flex items-center gap-1 cursor-pointer font-bold">
                    {t.rosterLink}
                    <span className="material-symbols-outlined text-[16px] select-none">
                      open_in_new
                    </span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse font-sans">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-[#D1E4F8] select-none">
                        <th className="px-md py-sm font-label-sm text-label-sm text-on-surface-variant font-bold">{t.thName}</th>
                        <th className="px-md py-sm font-label-sm text-label-sm text-on-surface-variant font-bold">{t.thRole}</th>
                        <th className="px-md py-sm font-label-sm text-label-sm text-on-surface-variant font-bold text-center">{t.thLessons}</th>
                        <th className="px-md py-sm font-label-sm text-label-sm text-on-surface-variant font-bold">{t.thLastActive}</th>
                        <th className="px-md py-sm font-label-sm text-label-sm text-on-surface-variant font-bold">{t.thStatus}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D1E4F8]/50">
                      {filteredStaff.map((member, i) => (
                        <tr
                          key={i}
                          className={`hover:bg-[#EAF3FC]/20 transition-all ${member.status === 'not_started' ? 'bg-[#ffdad6]/10' : ''}`}
                        >
                          <td className="px-md py-3 font-label-md text-label-md text-on-surface font-semibold">{member.name}</td>
                          <td className="px-md py-3 font-body-md text-body-md text-on-surface-variant">{member.role}</td>
                          <td className="px-md py-3 font-body-md text-body-md text-on-surface-variant text-center">
                            <span className="font-bold text-on-surface">{member.lessons.split('/')[0]}</span>/{member.lessons.split('/')[1]}
                          </td>
                          <td className="px-md py-3 font-body-md text-body-md text-on-surface-variant">{member.lastActive}</td>
                          <td className="px-md py-3 select-none">
                            {member.status === 'certified' && (
                              <span className="inline-flex items-center gap-1 bg-[#138808]/10 text-[#138808] px-2 py-1 rounded-full font-label-sm text-label-sm border border-[#138808]/20 font-bold">
                                <span className="material-symbols-outlined text-[14px] select-none" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                {t.statusCertified}
                              </span>
                            )}
                            {member.status === 'progress' && (
                              <span className="inline-flex items-center gap-1 bg-[#2C7BE5]/10 text-[#2C7BE5] px-2 py-1 rounded-full font-label-sm text-label-sm border border-[#2C7BE5]/20 font-bold">
                                <span className="material-symbols-outlined text-[14px] select-none" style={{ fontVariationSettings: "'FILL' 1" }}>sync</span>
                                {t.statusInProgress}
                              </span>
                            )}
                            {member.status === 'not_started' && (
                              <span className="inline-flex items-center gap-1 bg-[#FF9933]/10 text-[#FF9933] px-2 py-1 rounded-full font-label-sm text-label-sm border border-[#FF9933]/30 font-bold animate-pulse">
                                <span className="material-symbols-outlined text-[14px] select-none">warning</span>
                                {t.statusNotStarted}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

            </div>

            {/* Right Column (Narrow) */}
            <div className="lg:col-span-4 flex flex-col gap-lg select-none">

              {/* Monthly Counter Interactions chart */}
              <section className="bg-white rounded-xl border border-[#D1E4F8] p-lg shadow-sm">
                <h3 className="font-headline-md text-headline-md font-bold text-[#0B3D62] mb-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary select-none">
                    bar_chart
                  </span>
                  {t.chartTitle}
                </h3>

                {/* CSS Bar Chart Layout */}
                <div className="h-48 flex items-end justify-between gap-2 pt-4 relative border-b border-[#D1E4F8] pb-2 font-sans">
                  {/* Grid background markers */}
                  <div className="absolute left-0 w-full top-0 h-px bg-[#D1E4F8]/50"></div>
                  <div className="absolute left-0 w-full top-1/2 h-px bg-[#D1E4F8]/50"></div>

                  {monthlyData.map((data, idx) => (
                    <div key={idx} className="w-full flex flex-col items-center gap-2 group relative z-10">
                      <div className={`w-full rounded-t-md transition-all cursor-pointer relative ${data.highlight ? 'bg-[#2C7BE5] shadow-[0_0_8px_rgba(44,123,229,0.4)]' : 'bg-primary-fixed-dim hover:bg-[#2C7BE5]'} ${data.height}`}>
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0B3D62] text-white text-xs font-bold py-1 px-2 rounded pointer-events-none transition-all shadow-sm">
                          {data.value}
                        </div>
                      </div>
                      <span className={`font-label-sm text-label-sm ${data.highlight ? 'text-[#0B3D62] font-bold' : 'text-on-surface-variant'}`}>
                        {data.month}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* KPI Metrics Cards */}
              <section className="flex flex-col gap-md">

                {/* Total Interactions */}
                <div className="bg-white rounded-xl border border-[#D1E4F8] p-md flex items-center gap-md shadow-sm border-l-4 border-l-[#2C7BE5]">
                  <div className="w-12 h-12 rounded-full bg-[#EAF3FC] flex items-center justify-center text-[#2C7BE5] shrink-0">
                    <span className="material-symbols-outlined text-[24px] select-none">
                      front_hand
                    </span>
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">
                      {t.statInteractions}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <h4 className="font-headline-lg text-headline-lg font-black text-[#0B3D62]">342</h4>
                      <span className="font-label-sm text-label-sm text-[#138808] flex items-center font-bold">
                        <span className="material-symbols-outlined text-[14px] select-none">arrow_upward</span> 12%
                      </span>
                    </div>
                    <p className="font-label-sm text-label-sm text-outline-variant font-medium">
                      {t.statInteractionsSub}
                    </p>
                  </div>
                </div>

                {/* Avg rating */}
                <div className="bg-white rounded-xl border border-[#D1E4F8] p-md flex items-center gap-md shadow-sm border-l-4 border-l-[#FF9933]">
                  <div className="w-12 h-12 rounded-full bg-[#EAF3FC] flex items-center justify-center text-[#FF9933] shrink-0">
                    <span className="material-symbols-outlined text-[24px] select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">
                      {t.statRating}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <h4 className="font-headline-lg text-headline-lg font-black text-[#0B3D62]">
                        4.2 <span className="text-sm font-normal text-outline-variant">/ 5</span>
                      </h4>
                    </div>
                    <p className="font-label-sm text-label-sm text-outline-variant font-medium">
                      {t.statRatingSub}
                    </p>
                  </div>
                </div>

                {/* Phrase bento */}
                <div className="bg-[#0B3D62] rounded-xl border border-outline-variant/10 p-md flex flex-col gap-sm shadow-sm text-white relative overflow-hidden">
                  <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[100px] text-white/10 pointer-events-none select-none">
                    translate
                  </span>
                  <div className="relative z-10">
                    <p className="font-label-sm text-label-sm text-primary-fixed-dim uppercase tracking-wider mb-2 flex items-center gap-1 font-bold">
                      <span className="material-symbols-outlined text-[16px] select-none">
                        record_voice_over
                      </span>
                      {t.phraseTitle}
                    </p>
                    <h4 className="font-headline-md text-headline-md font-bold leading-tight italic">
                      "How can I help you?"
                    </h4>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="bg-white/20 text-white px-2 py-1 rounded font-label-sm text-label-sm font-bold">
                        {t.phraseUsage}
                      </span>
                      <button className="text-primary-fixed-dim hover:text-white font-label-sm text-label-sm ml-auto flex items-center gap-1 transition-all cursor-pointer font-semibold">
                        {t.phraseLink}
                        <span className="material-symbols-outlined text-[14px] select-none">
                          arrow_forward
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

              </section>

            </div>

          </div>
        </div>

      </main>

    </div>
  );
}
