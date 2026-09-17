import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const translations = {
  en: {
    headerStation: "Kolar Road Police Station",
    categoryBadge: "Police Services",
    pageTitle: "What do you need help with?",
    pageSub: "आपको किस सेवा की जरूरत है?",
    backBtn: "Back",
    langToggle: "EN | हिं"
  },
  hi: {
    headerStation: "कोलार रोड पुलिस थाना",
    categoryBadge: "पुलिस सेवाएं",
    pageTitle: "What do you need help with?",
    pageSub: "आपको किस सेवा की जरूरत है?",
    backBtn: "पीछे जाएं",
    langToggle: "हिं | EN"
  }
};

const services = [
  { id: 'complaint', icon: '📋', en: "File a Complaint", hi: "शिकायत दर्ज करें" },
  { id: 'fir', icon: '🔍', en: "Check FIR Status", hi: "FIR स्थिति जांचें" },
  { id: 'verify', icon: '📄', en: "Document Verification", hi: "दस्तावेज़ सत्यापन" },
  { id: 'missing', icon: '🔎', en: "Missing Person", hi: "लापता व्यक्ति" },
  { id: 'lost', icon: '📦', en: "Lost & Found", hi: "खोया और पाया" },
  { id: 'enquiry', icon: '❓', en: "General Enquiry", hi: "सामान्य पूछताछ" }
];

export default function KioskSelectionPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve initial language passed from welcome screen (default to Hindi)
  const requestedLang = location.state?.selectedLang || 'hi';
  const initialLang = translations[requestedLang] ? requestedLang : 'en';
  const [lang, setLang] = useState(initialLang);
  
  const t = translations[lang];

  const handleLanguageToggle = () => {
    setLang(prev => prev === 'en' ? 'hi' : 'en');
  };

  const handleServiceSelect = (service) => {
    // Route to video playback screen, passing selected service details
    navigate('/kiosk-interactive', { 
      state: { 
        serviceName: service.en, 
        serviceNameHi: service.hi,
        selectedLang: lang
      } 
    });
  };

  return (
    <div className="bg-[#EAF3FC] min-h-screen flex flex-col antialiased select-none font-sans transition-colors duration-300">
      
      {/* Top Navigation Bar */}
      <header className="flex justify-between items-center w-full px-xl py-lg select-none">
        <div className="flex items-center gap-sm bg-white/70 backdrop-blur px-md py-sm rounded-full border border-[#D1E4F8] shadow-sm">
          <span className="material-symbols-outlined text-primary select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
            local_police
          </span>
          <span className="font-label-md text-label-md text-navy font-bold">
            {t.headerStation}
          </span>
        </div>
        
        <div className="flex items-center bg-white/70 backdrop-blur rounded-full border border-[#D1E4F8] p-xs shadow-sm">
          <button 
            onClick={() => setLang('en')}
            className={`px-md py-sm rounded-full font-label-md text-label-md font-bold transition-all cursor-pointer ${lang === 'en' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant'}`}
          >
            EN
          </button>
          <button 
            onClick={() => setLang('hi')}
            className={`px-md py-sm rounded-full font-label-md text-label-md font-bold transition-all cursor-pointer ${lang === 'hi' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant'}`}
          >
            हिं
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center px-gutter w-full max-w-container-max mx-auto py-xl">
        
        {/* Header Section */}
        <div className="text-center mb-xl select-none">
          <div className="inline-flex items-center gap-sm bg-white border border-[#D1E4F8] px-md py-sm rounded-full mb-md shadow-sm">
            <span className="text-xl">🏛️</span>
            <span className="font-label-md text-label-md text-navy font-bold">
              {t.categoryBadge}
            </span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-navy mb-sm font-bold tracking-tight">
            {t.pageTitle}
          </h1>
          <h2 className="font-headline-lg text-headline-lg text-navy opacity-80 font-semibold">
            {t.pageSub}
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter w-full max-w-5xl">
          {services.map(service => {
            const title = lang === 'en' ? service.en : service.hi;
            return (
              <button 
                key={service.id}
                onClick={() => handleServiceSelect(service)}
                className="bg-white border border-[#D1E4F8] hover:border-primary hover:bg-primary hover:text-white rounded-xl p-xl flex flex-col items-center justify-center gap-md text-navy shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <span className="text-5xl select-none">{service.icon}</span>
                <span className="font-headline-md text-headline-md text-center font-bold">
                  {title}
                </span>
              </button>
            );
          })}
        </div>
      </main>

      {/* Footer Area with Back Button */}
      <footer className="w-full px-xl py-lg flex justify-start select-none">
        <button 
          onClick={() => navigate('/kiosk-idle')}
          className="flex items-center gap-sm px-lg py-sm bg-white border border-primary text-primary rounded-xl font-label-md text-label-md hover:bg-primary/5 active:scale-95 transition-all shadow-sm cursor-pointer font-semibold"
        >
          <span className="material-symbols-outlined select-none" data-icon="arrow_back">
            arrow_back
          </span>
          {t.backBtn}
        </button>
      </footer>

    </div>
  );
}
