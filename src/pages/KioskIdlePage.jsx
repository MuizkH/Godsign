import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket, TABLET_ID } from '../utils/socketClient';

const welcomes = [
  { text: "Welcome", sub: "This counter supports Indian Sign Language 🤟" },
  { text: "स्वागत है", sub: "यह काउंटर भारतीय सांकेतिक भाषा (ISL) का समर्थन करता है 🤟" },
  { text: "ਸੁਆਗਤ ਹੈ", sub: "ਇਹ ਕਾਊਂਟਰ ਭਾਰਤੀ ਸੰਕੇਤ ਭਾਸ਼ਾ (ISL) ਦਾ ਸਮਰਥਨ ਕਰਦਾ ਹੈ 🤟" }
];

const extraLanguages = [
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
  { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' }
];

export default function KioskIdlePage() {
  const [welcomeIndex, setWelcomeIndex] = useState(0);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const navigate = useNavigate();

  useEffect(() => {
    const handleConnect = () => {
      setConnectionStatus('connected');
      socket.emit('kiosk_join', { tabletId: TABLET_ID });
    };
    const handleDisconnect = () => setConnectionStatus('disconnected');
    const handleReceivePhrase = (phrase) => {
      if (!phrase?.phraseId || !phrase.textEn || !phrase.textHi) return;

      navigate('/kiosk-interactive', {
        state: {
          serviceName: phrase.textEn,
          serviceNameHi: phrase.textHi,
          selectedLang: 'hi',
          source: 'operator',
          phraseId: phrase.phraseId,
        },
      });
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('receive_phrase', handleReceivePhrase);

    if (socket.connected) {
      handleConnect();
    } else {
      socket.connect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('receive_phrase', handleReceivePhrase);
      socket.disconnect();
    };
  }, [navigate]);

  // Cycle welcome message index every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setWelcomeIndex(prev => (prev + 1) % welcomes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLanguageSelect = (langCode) => {
    // Navigate to kiosk-selection screen with selected language state
    navigate('/kiosk-selection', { state: { selectedLang: langCode } });
  };

  return (
    <div className="bg-custom-bg/30 min-h-screen flex flex-col items-center justify-between p-xl overflow-hidden select-none antialiased font-sans">
      
      {/* Top Header Badge */}
      <header className="w-full max-w-container-max mx-auto flex justify-center mt-lg select-none">
        <div className="bg-white/75 backdrop-blur-sm px-6 py-3 rounded-full border border-navy/10 shadow-sm flex items-center gap-xs">
          <span className="material-symbols-outlined text-[16px] text-[#0b3d62]">location_on</span>
          <h1 className="text-navy font-label-md text-label-md tracking-wider uppercase font-semibold">
            Kolar Road Police Station — Counter 2
          </h1>
        </div>
      </header>

      {/* Center Welcome Area */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-3xl mx-auto space-y-8 text-center px-lg">
        {/* Logo Icon */}
        <div 
          onClick={() => navigate('/')}
          className="w-20 h-20 bg-navy rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          <span className="material-symbols-outlined text-white text-5xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
            accessibility_new
          </span>
        </div>

        {/* Dynamic cycling text with smooth translations */}
        <div className="w-full h-32 flex flex-col items-center justify-center relative">
          {welcomes.map((item, idx) => (
            <div
              key={idx}
              className={`absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center transition-all duration-700 transform ${
                idx === welcomeIndex
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
              }`}
            >
              <h2 className="text-[52px] font-bold text-navy leading-tight tracking-tight">
                {item.text}
              </h2>
              <p className="text-navy/80 font-body-lg text-body-lg max-w-xl mx-auto mt-4 font-medium transition-all duration-700">
                {item.sub}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Area Actions */}
      <footer className="w-full max-w-container-max mx-auto flex flex-col items-center space-y-12 mb-lg">
        
        {/* Language Selection Grid */}
        <div className="flex flex-wrap justify-center gap-4 w-full">
          <button 
            onClick={() => handleLanguageSelect('en')}
            className="bg-primary hover:bg-navy text-white font-headline-md text-headline-md py-4 px-10 rounded-full shadow hover:shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer font-bold"
          >
            English
          </button>
          
          <button 
            onClick={() => handleLanguageSelect('hi')}
            className="bg-primary hover:bg-navy text-white font-headline-md text-headline-md py-4 px-10 rounded-full shadow hover:shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer font-bold"
          >
            हिंदी
          </button>
          
          <button 
            onClick={() => handleLanguageSelect('pa')}
            className="bg-primary hover:bg-navy text-white font-headline-md text-headline-md py-4 px-10 rounded-full shadow hover:shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer font-bold"
          >
            ਪੰਜਾਬੀ
          </button>
          
          <button 
            onClick={() => setShowLanguageModal(true)}
            className="bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-headline-md text-headline-md py-4 px-10 rounded-full shadow-sm hover:shadow transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer font-bold"
          >
            + More
          </button>
        </div>

        {/* Kiosk status indicator */}
        <div className="flex items-center space-x-3 bg-white/95 backdrop-blur px-5 py-2.5 rounded-full shadow-sm border border-navy/10 select-none">
          <div className="w-2.5 h-2.5 bg-saffron rounded-full animate-pulse"></div>
          <span className="text-navy/70 font-label-md text-label-md font-semibold">
            {connectionStatus === 'connected' ? 'Waiting for operator...' : connectionStatus === 'connecting' ? 'Connecting to operator...' : 'Reconnecting...'}
          </span>
        </div>
      </footer>

      {/* Extra Languages Dialog Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl shadow-lg max-w-md w-full flex flex-col gap-md m-4">
            <div className="flex justify-between items-center pb-xs border-b border-outline-variant">
              <h3 className="font-headline-md text-headline-md font-bold text-navy">Select Language / भाषा चुनें</h3>
              <button 
                onClick={() => setShowLanguageModal(false)}
                className="text-on-surface-variant hover:text-navy cursor-pointer flex items-center justify-center p-1 rounded-full hover:bg-surface-container"
              >
                <span className="material-symbols-outlined select-none">close</span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-sm py-sm">
              {extraLanguages.map(item => (
                <button
                  key={item.code}
                  onClick={() => {
                    setShowLanguageModal(false);
                    handleLanguageSelect(item.code);
                  }}
                  className="bg-surface hover:bg-surface-container border border-outline-variant p-md rounded-lg text-left text-sm font-semibold hover:text-primary transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
