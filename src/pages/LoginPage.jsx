import React, { useState } from 'react';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const translations = {
  en: {
    brandName: "GodSign",
    brandSub: "GovTech ISL Portal",
    leftTitle: "Empowering Citizens Through Technology",
    leftDesc: "Learn Indian Sign Language, translate counter queries, and certify department staff—all in one place.",
    leftStat1Val: "50K+",
    leftStat1Lbl: "Queries Resolved",
    leftStat2Val: "12K+",
    leftStat2Lbl: "Certified Officers",
    backToHome: "Back to Home",
    welcomeBack: "Welcome back",
    signInSubtitle: "Sign in to continue to GodSign",
    emailLabel: "Email",
    emailPlaceholder: "Enter your email",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    btnSignIn: "Sign In",
    noAccountText: "Don't have an account?",
    signUpLinkText: "Sign Up",
    demoBtn: "Demo Credentials",
    demoAccessTitle: "DEMO ACCESS CREDENTIALS",
    demoAccessSub: "Click credentials to auto-fill details (Bhopal, Madhya Pradesh)",
    errorInvalid: "Invalid email or password. Please verify credentials."
  },
  hi: {
    brandName: "गॉडसाइन",
    brandSub: "समाधान",
    leftTitle: "प्रौद्योगिकी के माध्यम से नागरिकों को सशक्त बनाना",
    leftDesc: "भारतीय सांकेतिक भाषा सीखें, काउंटर प्रश्नों का अनुवाद करें, और विभाग के कर्मचारियों को प्रमाणित करें - सब एक ही स्थान पर।",
    leftStat1Val: "50K+",
    leftStat1Lbl: "सुलझाए गए प्रश्न",
    leftStat2Val: "12K+",
    leftStat2Lbl: "प्रमाणित अधिकारी",
    backToHome: "मुख्यपृष्ठ पर वापस",
    welcomeBack: "स्वागत है",
    signInSubtitle: "गॉडसाइन पर जारी रखने के लिए लॉगिन करें",
    emailLabel: "ईमेल",
    emailPlaceholder: "अपना ईमेल दर्ज करें",
    passwordLabel: "पासवर्ड",
    passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
    btnSignIn: "लॉगिन करें",
    noAccountText: "खाता नहीं है?",
    signUpLinkText: "साइन अप करें",
    demoBtn: "डेमो क्रेडेंशियल्स",
    demoAccessTitle: "डेमो एक्सेस क्रेडेंशियल्स",
    demoAccessSub: "क्रेडेंशियल पर क्लिक करके विवरण ऑटो-फिल करें (भोपाल, मध्य प्रदेश)",
    errorInvalid: "अमान्य ईमेल या पासवर्ड। कृपया विवरण सत्यापित करें।"
  }
};

const demoOperators = [
  { id: 'police', email: 'police@godsign.gov.in', label: 'police@godsign.gov.in' },
  { id: 'health', email: 'health@godsign.gov.in', label: 'health@godsign.gov.in' },
  { id: 'revenue', email: 'revenue@godsign.gov.in', label: 'revenue@godsign.gov.in' },
  { id: 'transport', email: 'transport@godsign.gov.in', label: 'transport@godsign.gov.in' },
  { id: 'admin', email: 'admin@godsign.gov.in', label: 'admin@godsign.gov.in' },
  { id: 'citizen', email: 'citizen@godsign.gov.in', label: 'citizen@godsign.gov.in' }
];

export default function LoginPage() {
  const [lang, setLang] = useState('en');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoBox, setShowDemoBox] = useState(false);
  const [alertError, setAlertError] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const t = translations[lang];

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAlertError(false);

    try {
      const user = await login(email, password);
      if (user.role === 'citizen') {
        navigate('/learning');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setAlertError(true);
    }
  };

  const handleDemoFill = (selectedEmail) => {
    setEmail(selectedEmail);
    setPassword('password123');
    setAlertError(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row bg-white text-on-surface antialiased font-sans select-none overflow-hidden relative">

      {/* Left Column (Branding & Stats) */}
      <div className="hidden lg:flex lg:w-[42%] bg-[#0B3D62] text-white flex-col justify-between p-8 relative overflow-hidden shrink-0 select-none">

        {/* Subtle grid pattern background overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px"
          }}
        ></div>

        {/* Brand header */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-sm cursor-pointer hover:opacity-90 relative z-10"
        >
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
            <span className="material-symbols-outlined text-white text-2xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
              sign_language
            </span>
          </div>
          <div>
            <h1 className="font-label-md text-label-md font-black tracking-tight leading-none text-white text-lg">
              {t.brandName}
            </h1>
            <p className="text-[9px] text-primary-fixed-dim uppercase tracking-wider mt-[2px] font-bold">
              {t.brandSub}
            </p>
          </div>
        </div>

        {/* Middle Heading - tightly formatted for compact screens */}
        <div className="relative z-10 space-y-sm my-auto max-w-sm">
          <h2 className="text-[32px] font-black leading-[1.15] tracking-tight">
            {t.leftTitle}
          </h2>
          <p className="font-body-sm text-body-sm text-primary-fixed-dim/90 leading-relaxed">
            {t.leftDesc}
          </p>
        </div>

        {/* Bottom stats row */}
        <div className="relative z-10 flex items-center gap-lg select-none">
          <div className="space-y-xs">
            <p className="text-white text-[28px] font-black leading-none">{t.leftStat1Val}</p>
            <p className="font-label-sm text-label-sm text-primary-fixed-dim uppercase tracking-wider font-bold">
              {t.leftStat1Lbl}
            </p>
          </div>
          <div className="w-px bg-white/20 h-8 shrink-0"></div>
          <div className="space-y-xs">
            <p className="text-white text-[28px] font-black leading-none">{t.leftStat2Val}</p>
            <p className="font-label-sm text-label-sm text-primary-fixed-dim uppercase tracking-wider font-bold">
              {t.leftStat2Lbl}
            </p>
          </div>
        </div>

      </div>

      {/* Right Column (Form Panel) */}
      <div className="flex-1 flex flex-col justify-between p-6 relative overflow-y-auto min-h-screen bg-white">

        {/* Top Navbar items */}
        <header className="flex justify-between items-center w-full select-none mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-on-surface-variant hover:text-navy font-label-md text-label-md flex items-center gap-xs cursor-pointer font-bold"
          >
            <span className="material-symbols-outlined text-[20px] select-none">arrow_back</span>
            {t.backToHome}
          </button>

          {/* Language Toggle */}
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
        </header>

        {/* Center welcome back form */}
        <main className="w-full max-w-md mx-auto my-auto flex flex-col gap-md py-4">

          {/* Headline details */}
          <div className="text-center space-y-xs select-none">
            <h2 className="text-[28px] text-navy font-black tracking-tight leading-tight">
              {t.welcomeBack}
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant font-medium">
              {t.signInSubtitle}
            </p>
          </div>

          {/* Alert messages */}
          {alertError && (
            <div className="bg-[#ffdad6] border border-[#ba1a1a]/20 p-md rounded-xl text-[#ba1a1a] flex items-start gap-sm select-none">
              <span className="material-symbols-outlined text-[20px] select-none shrink-0 mt-[2px]">error</span>
              <p className="font-label-sm text-label-sm font-bold leading-normal">
                {t.errorInvalid}
              </p>
            </div>
          )}

          {/* Submit form container */}
          <form onSubmit={handleLoginSubmit} className="space-y-md">

            {/* Email Field */}
            <div className="space-y-xs">
              <label className="font-label-sm text-label-sm text-navy font-bold select-none">
                {t.emailLabel}
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline select-none text-[20px]">
                  mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setAlertError(false); }}
                  placeholder={t.emailPlaceholder}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#D1E4F8] rounded-xl focus:outline-none focus:border-[#2C7BE5] focus:ring-1 focus:ring-[#2C7BE5] text-sm text-on-surface font-sans"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-xs">
              <label className="font-label-sm text-label-sm text-navy font-bold select-none">
                {t.passwordLabel}
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline select-none text-[20px]">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setAlertError(false); }}
                  placeholder={t.passwordPlaceholder}
                  required
                  className="w-full pl-10 pr-10 py-3 bg-white border border-[#D1E4F8] rounded-xl focus:outline-none focus:border-[#2C7BE5] focus:ring-1 focus:ring-[#2C7BE5] text-sm text-on-surface font-sans"
                />
                <span
                  onClick={() => setShowPassword(prev => !prev)}
                  className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline cursor-pointer select-none text-[20px] hover:text-[#0B3D62]"
                >
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </div>
            </div>

            {/* Sign in Trigger button */}
            <div className="pt-sm">
              <button
                type="submit"
                className="w-full bg-[#2C7BE5] hover:bg-[#1A5BB5] text-white font-label-md text-label-md py-3 rounded-xl flex items-center justify-center gap-xs font-bold transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] select-none">vpn_key</span>
                {t.btnSignIn}
              </button>
            </div>

          </form>

          {/* Sign up details footer */}
          <div className="text-center pt-xs select-none">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              {t.noAccountText}
            </span>
            <NavLink
              to="/signup"
              className="font-label-sm text-label-sm text-navy hover:text-[#0B3D62] cursor-pointer font-black ml-1 transition-all underline decoration-transparent hover:decoration-[#0B3D62] p-1 inline-block relative z-100 ml-1"
            >
              {t.signUpLinkText}
            </NavLink>
          </div>

        </main>

        {/* Floating Demo overlay container inside the right side boundaries */}
        <div className="absolute bottom-4 right-4 z-40 flex flex-col items-end gap-2 select-none">

          {/* Floating demo box drawer popover */}
          <div className={`bg-white border border-[#D1E4F8] rounded-xl p-md shadow-lg transition-all duration-300 w-80 sm:w-96 ${showDemoBox ? 'opacity-100 scale-100 pointer-events-auto shadow-xl' : 'opacity-0 scale-95 pointer-events-none h-0 overflow-hidden'}`}>
            <h4 className="font-label-sm text-label-sm text-navy uppercase tracking-wider font-bold mb-xs text-center border-b border-[#D1E4F8]/60 pb-1">
              {t.demoAccessTitle}
            </h4>
            <div className="flex flex-wrap justify-center gap-xs py-sm">
              {demoOperators.map(op => (
                <button
                  key={op.id}
                  onClick={() => handleDemoFill(op.email)}
                  className="bg-[#EAF3FC]/50 hover:bg-[#EAF3FC] border border-[#D1E4F8] px-md py-1 rounded-full text-xs font-semibold text-[#2C7BE5] transition-colors cursor-pointer"
                >
                  {op.label}
                </button>
              ))}
            </div>
            <p className="font-label-sm text-[10px] text-on-surface-variant/80 text-center font-medium italic mt-xs">
              {t.demoAccessSub}
            </p>
          </div>

          {/* Floating trigger key button */}
          <button
            onClick={() => setShowDemoBox(prev => !prev)}
            className="bg-[#B85C00] hover:bg-[#9E4D00] text-white px-md py-sm rounded-full flex items-center gap-xs font-label-sm text-label-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] select-none">vpn_key</span>
            {t.demoBtn}
          </button>

        </div>

      </div>

    </div>
  );
}
