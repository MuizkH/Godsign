import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const translations = {
  en: {
    stationLabel: "Kolar Road Police Station — Counter 2",
    pageTitle: "How was your experience?",
    pageSub: "आपका अनुभव कैसा था?",
    skipBtn: "Skip",
    thankYouTitle: "Thank You!",
    thankYouMsg1: "Your feedback has been recorded.",
    thankYouMsg2: "आपकी प्रतिक्रिया दर्ज कर ली गई है।",
    returnBtn: "Return Home",
    errorMsg: "Unable to record feedback right now. Please try again."
  },
  hi: {
    stationLabel: "कोलार रोड पुलिस थाना — काउंटर 2",
    pageTitle: "How was your experience?",
    pageSub: "आपका अनुभव कैसा था?",
    skipBtn: "छोड़ें",
    thankYouTitle: "धन्यवाद!",
    thankYouMsg1: "Your feedback has been recorded.",
    thankYouMsg2: "आपकी प्रतिक्रिया दर्ज कर ली गई है।",
    returnBtn: "मुख्यपृष्ठ पर जाएं",
    errorMsg: "प्रतिक्रिया दर्ज करने में असमर्थ। कृपया पुन: प्रयास करें।"
  }
};

const ratings = [
  { id: 'very_dissatisfied', icon: 'sentiment_very_dissatisfied', label: 'Very Dissatisfied', score: 1 },
  { id: 'dissatisfied', icon: 'sentiment_dissatisfied', label: 'Dissatisfied', score: 2 },
  { id: 'neutral', icon: 'sentiment_neutral', label: 'Neutral', score: 3 },
  { id: 'satisfied', icon: 'sentiment_satisfied', label: 'Satisfied', score: 4 },
  { id: 'very_satisfied', icon: 'sentiment_very_satisfied', label: 'Very Satisfied', score: 5 }
];

export default function KioskFeedbackPage() {
  const location = useLocation();
  const [lang, setLang] = useState(location.state?.selectedLang === 'hi' ? 'hi' : 'en');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedRatingId, setSelectedRatingId] = useState(null);
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  
  const t = translations[lang];

  // Auto-return to idle loop once submitted
  useEffect(() => {
    if (submitted) {
      timeoutRef.current = setTimeout(() => {
        navigate('/kiosk-idle');
      }, 4000); // Auto reset after 4 seconds
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [submitted, navigate]);

  const handleSubmit = async (rating) => {
    if (isSubmitting || submitted) return;

    setErrorMessage(null);
    setSelectedRatingId(rating.id);
    setIsSubmitting(true);

    const payload = {
      rating: rating.score,
      comments: `Citizen rating: ${rating.label}`,
      kioskId: "kiosk_01",
      department: "police"
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || data?.message || t.errorMsg);
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Feedback submission error:", err);
      setErrorMessage(err.message || t.errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    navigate('/kiosk-idle');
  };

  const handleReturnImmediate = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    navigate('/kiosk-idle');
  };

  return (
    <div className="bg-[#EAF3FC] h-screen w-screen flex flex-col items-center justify-center font-sans text-on-surface antialiased select-none overflow-hidden relative transition-colors duration-300">
      
      {/* Top Navigation Bar */}
      <header className="absolute top-0 w-full px-md h-16 flex justify-between items-center border-b border-[#D1E4F8] bg-surface-container-highest select-none z-10 shadow-sm">
        <div className="flex items-center gap-xs">
          <span className="material-symbols-outlined text-navy select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
            local_police
          </span>
          <span className="font-label-md text-label-md text-navy tracking-wide uppercase font-bold">
            {t.stationLabel}
          </span>
        </div>
        
        {/* Language Selection */}
        <div className="flex items-center gap-sm">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Language:</span>
          <div className="flex gap-xs bg-[#EAF3FC] rounded-full p-xs border border-outline-variant/30">
            <button 
              onClick={() => setLang('en')}
              className={`font-label-sm text-label-sm rounded-full px-sm py-[2px] font-bold transition-all cursor-pointer ${lang === 'en' ? 'bg-navy text-white shadow-sm' : 'text-on-surface-variant'}`}
            >
              English
            </button>
            <button 
              onClick={() => setLang('hi')}
              className={`font-label-sm text-label-sm rounded-full px-sm py-[2px] font-bold transition-all cursor-pointer ${lang === 'hi' ? 'bg-navy text-white shadow-sm' : 'text-on-surface-variant'}`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`w-full max-w-[1000px] px-lg mt-16 transition-opacity duration-300 ${submitted ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Rating Panel Card */}
        <div className="bg-white rounded-xl border border-[#D1E4F8] p-xl shadow-sm flex flex-col items-center gap-xl hover:shadow-[0px_4px_12px_rgba(11,61,98,0.08)] transition-all">
          
          {/* Header titles */}
          <div className="text-center space-y-sm select-none">
            <h1 className="font-headline-xl text-headline-xl text-navy font-bold tracking-tight">
              {t.pageTitle}
            </h1>
            <h2 className="font-headline-lg text-headline-lg text-navy opacity-80 font-normal">
              {t.pageSub}
            </h2>
          </div>

          {/* User-friendly Error Alert if any */}
          {errorMessage && (
            <div className="w-full max-w-[600px] bg-red-50 text-red-600 border border-red-200 px-md py-sm rounded-lg text-center font-medium text-body-md flex items-center justify-center gap-xs">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Emoji row grid */}
          <div className="flex flex-row justify-center items-center gap-md sm:gap-lg w-full py-lg select-none">
            {ratings.map(rating => (
              <button 
                key={rating.id}
                onClick={() => handleSubmit(rating)}
                disabled={isSubmitting}
                aria-label={rating.label}
                className={`feedback-icon-btn text-primary hover:text-navy hover:bg-[#F0F6FC] transition-all p-sm rounded-full cursor-pointer flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
                } ${selectedRatingId === rating.id && isSubmitting ? 'bg-[#F0F6FC] ring-2 ring-primary animate-pulse' : ''}`}
              >
                <span className="material-symbols-outlined text-[72px] hover-fill select-none">
                  {rating.icon}
                </span>
              </button>
            ))}
          </div>

          {/* Bottom actions row */}
          <div className="w-full flex justify-end mt-md pt-lg border-t border-[#D1E4F8] select-none">
            <button 
              onClick={handleSkip}
              disabled={isSubmitting}
              className="font-label-md text-label-md text-on-surface-variant hover:text-navy px-lg py-sm flex items-center gap-xs transition-colors rounded-lg hover:bg-surface-container cursor-pointer font-semibold disabled:opacity-50"
            >
              {t.skipBtn}
              <span className="material-symbols-outlined text-[18px] select-none">
                arrow_forward
              </span>
            </button>
          </div>

        </div>
      </main>

      {/* Success Overlay / Transition Card State */}
      <div className={`absolute inset-0 flex items-center justify-center bg-[#EAF3FC] z-50 transition-opacity duration-300 ${submitted ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-white rounded-xl border border-[#D1E4F8] p-xl shadow-lg flex flex-col items-center justify-center gap-md max-w-[600px] w-[90%] text-center">
          <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-md border border-[#D1E4F8] bg-black my-xs flex items-center justify-center">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              src="https://awfcnolsokkjbrclgiuf.supabase.co/storage/v1/object/public/videos/thank%20you.mp4" 
              className="w-full h-full object-cover" 
            />
          </div>
          <h2 className="font-headline-lg text-headline-lg text-navy font-bold">
            {t.thankYouTitle}
          </h2>
          <div className="space-y-xs mt-xs text-on-surface font-body-lg text-body-lg font-medium">
            <p>{t.thankYouMsg1}</p>
            <p>{t.thankYouMsg2}</p>
          </div>
          <div className="mt-xl">
            <button 
              onClick={handleReturnImmediate}
              className="bg-[#2C7BE5] hover:bg-[#1A5BB5] text-white font-label-md text-label-md px-[24px] py-[12px] rounded-lg shadow-sm active:scale-95 transition-all cursor-pointer font-bold"
            >
              {t.returnBtn}
            </button>
          </div>
        </div>
      </div>

      {/* Internal Custom Hover Rules */}
      <style>{`
        .hover-fill:hover {
          font-variation-settings: 'FILL' 1, 'wght' 400;
        }
        .feedback-icon-btn {
          width: 110px;
          height: 110px;
        }
      `}</style>

    </div>
  );
}
