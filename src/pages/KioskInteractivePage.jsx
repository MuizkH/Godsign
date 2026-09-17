import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { socket, TABLET_ID } from '../utils/socketClient';

const translations = {
  en: {
    stationLabel: "Kolar Road Police Station — Counter 2",
    captionEn: "How can I help you?",
    captionHi: "आपकी क्या सेवा करें?",
    tapHint: "Tap anywhere to replay",
    movingText: "Moving to services…"
  },
  hi: {
    stationLabel: "कोलार रोड पुलिस थाना — काउंटर 2",
    captionEn: "How can I help you?",
    captionHi: "आपकी क्या सेवा करें?",
    tapHint: "पुनः देखने के लिए कहीं भी टैप करें",
    movingText: "सेवाओं पर जा रहे हैं…"
  }
};

export default function KioskInteractivePage() {
  const location = useLocation();
  const serviceName = location.state?.serviceName || null;
  const serviceNameHi = location.state?.serviceNameHi || null;
  const selectedLang = location.state?.selectedLang || 'hi';
  const source = location.state?.source || 'citizen';

  const [lang, setLang] = useState(selectedLang === 'en' ? 'en' : 'hi');
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [replayKey, setReplayKey] = useState(0);
  const langRef = useRef(lang);
  
  const navigate = useNavigate();
  const t = translations[lang];

  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  useEffect(() => {
    const handleReceivePhrase = (phrase) => {
      if (phrase?.tabletId !== TABLET_ID || !phrase.phraseId || !phrase.textEn || !phrase.textHi) return;

      navigate('/kiosk-interactive', {
        state: {
          serviceName: phrase.textEn,
          serviceNameHi: phrase.textHi,
          selectedLang: langRef.current,
          source: 'operator',
          phraseId: phrase.phraseId,
        },
      });
    };

    socket.on('receive_phrase', handleReceivePhrase);
    if (!socket.connected) {
      socket.connect();
    }

    return () => socket.off('receive_phrase', handleReceivePhrase);
  }, [navigate]);

  // Progress and countdown animation loop
  useEffect(() => {
    const totalDuration = 5000; // 5 seconds
    let startTime = null;
    let animationFrameId = null;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / totalDuration) * 100, 100);
      const remainingSecs = Math.max(0, Math.ceil((totalDuration - elapsed) / (totalDuration / 3)));
      const countdown = remainingSecs;

      setProgress(progress);
      setCountdown(countdown);

      if (elapsed >= totalDuration) {
        cancelAnimationFrame(animationFrameId);
        // Citizen requests continue to feedback; operator prompts return to the idle kiosk.
        if (serviceName && source !== 'operator') {
          navigate('/kiosk-feedback', { state: { selectedLang: langRef.current } });
        } else {
          navigate('/kiosk-idle');
        }
      } else {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    const start = () => {
      startTime = Date.now();
      animationFrameId = requestAnimationFrame(tick);
    };

    start();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [navigate, replayKey, serviceName, source]);

  const handleReplay = () => {
    setReplayKey(prev => prev + 1);
  };

  const getActiveVideoSrc = () => {
    const key = ((location.state?.phraseId || '') + ' ' + (serviceName || '')).toLowerCase();
    if (key.includes('hospital') || key.includes('symptom') || key.includes('emergency') || key.includes('medical') || key.includes('doctor')) {
      return 'https://awfcnolsokkjbrclgiuf.supabase.co/storage/v1/object/public/videos/hospital.mp4';
    }
    if (key.includes('license') || key.includes('driving') || key.includes('vehicle') || key.includes('registration')) {
      return 'https://awfcnolsokkjbrclgiuf.supabase.co/storage/v1/object/public/videos/driving%20license.mp4';
    }
    if (key.includes('thank') || key.includes('feedback')) {
      return 'https://awfcnolsokkjbrclgiuf.supabase.co/storage/v1/object/public/videos/thank%20you.mp4';
    }
    return 'https://awfcnolsokkjbrclgiuf.supabase.co/storage/v1/object/public/videos/WhatsApp%20Video%202026-08-23%20at%2023.54.47.mp4';
  };

  const activeVideoSrc = getActiveVideoSrc();

  return (
    <div className="bg-[#EAF3FC] min-h-screen flex flex-col items-center justify-center p-md overflow-hidden select-none antialiased font-sans transition-colors duration-300">
      
      {/* Top Label & Controls Area */}
      <div className="w-full max-w-container-max flex justify-between items-center mb-md px-lg select-none">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-navy select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
            location_on
          </span>
          <span className="font-label-md text-label-md text-navy font-semibold uppercase tracking-wider">
            {t.stationLabel}
          </span>
        </div>
        
        {/* Language Switcher */}
        <div className="flex bg-surface-container-high rounded-lg p-xs border border-outline-variant/30">
          <button 
            onClick={(e) => { e.stopPropagation(); setLang('en'); }}
            className={`px-sm py-xs rounded font-label-md text-label-md font-bold transition-all ${lang === 'en' ? 'bg-navy text-white shadow-sm' : 'text-on-surface'}`}
          >
            EN
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setLang('hi'); }}
            className={`px-sm py-xs rounded font-label-md text-label-md font-bold transition-all ${lang === 'hi' ? 'bg-navy text-white shadow-sm' : 'text-on-surface'}`}
          >
            HI
          </button>
        </div>
      </div>

      {/* Main Kiosk Layout Card */}
      <main 
        onClick={handleReplay}
        className="w-full max-w-container-max flex-grow flex flex-col bg-surface-container-lowest rounded-xl shadow-[0px_4px_12px_rgba(11,61,98,0.08)] border border-[#D1E4F8] overflow-hidden relative group cursor-pointer transition-shadow"
      >
        {/* 75% Height Video/GIF Display Area */}
        <div className="h-[75%] flex-shrink-0 relative bg-[#0F0F0F] overflow-hidden flex items-center justify-center">
          <video 
            key={`${replayKey}-${activeVideoSrc}`}
            className="w-full h-full object-cover opacity-90 select-none pointer-events-none" 
            autoPlay 
            muted 
            loop 
            playsInline
            src={activeVideoSrc}
          />
          
          {/* Subtle Hover Play Circle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-end pb-lg px-lg">
            <span className="material-symbols-outlined text-white text-5xl select-none">
              play_circle
            </span>
          </div>

          {/* Top Right ISL active indicator badge */}
          <div className="absolute top-lg right-lg bg-black/40 backdrop-blur-md rounded-full px-md py-sm border border-white/20 flex items-center gap-sm select-none">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-white font-label-sm text-label-sm font-semibold">ISL</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-200 h-2 w-full flex-shrink-0">
          <div 
            className="bg-[#2C7BE5] h-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Bilingual Captions Area (25% Height) */}
        <div className="flex-grow bg-white flex flex-col justify-center items-center p-xl text-center relative z-10 select-none">
          <h1 className="text-on-surface mb-sm font-headline-xl font-bold leading-tight select-none">
            {serviceName || t.captionEn}
          </h1>
          <h2 className="text-on-surface-variant font-headline-xl font-semibold leading-tight select-none">
            {serviceNameHi || t.captionHi}
          </h2>
        </div>

        {/* Replay Overlay & Countdown Indicators */}
        <div className="absolute bottom-lg right-lg flex flex-col items-end gap-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 select-none">
          <div className="bg-surface-container-lowest border border-[#D1E4F8] shadow-lg rounded-full px-md py-sm flex items-center gap-xs animate-pulse">
            <span className="font-label-md text-label-md text-on-surface-variant font-semibold">
              {t.tapHint}
            </span>
            <span className="material-symbols-outlined text-on-surface-variant text-lg select-none">
              replay
            </span>
          </div>
          <div className="bg-[#2C7BE5] text-white rounded-full px-md py-sm flex items-center gap-xs shadow-md">
            <span className="font-label-sm text-label-sm font-bold">
              {t.movingText} <span className="font-mono text-base ml-1">{countdown}</span>
            </span>
          </div>
        </div>

      </main>
    </div>
  );
}
