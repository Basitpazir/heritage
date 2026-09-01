import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Unified Login / Signup component. One card, two absolutely-positioned panels
// (form + cinematic) that crossfade/slide based on mode — simpler and more
// robust than a wide flex wrapper with a translateX trick, which was causing
// a one-frame flash before snapping to the wrong panel.
const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // The URL is the single source of truth for which form is showing.
  const mode = location.pathname === '/signup' ? 'signup' : 'login';
  const [isVisible, setIsVisible] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const from = location.state?.from?.pathname || '/products';
  const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

  useEffect(() => { setIsVisible(true); }, []);

  const switchMode = (next) => {
    if (next === mode) return;
    setErrorMsg('');
    navigate(next === 'signup' ? '/signup' : '/login');
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };
  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate(from, { replace: true });
      } else {
        setErrorMsg(data.error || 'Login failed.');
      }
    } catch {
      setErrorMsg('Cannot reach the server.');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/products');
      } else {
        setErrorMsg(data.error || 'Registration failed.');
      }
    } catch {
      setErrorMsg('Cannot reach the server.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  const GoogleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19.1 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-2 14.1-5.4l-6.5-5.5C29.6 35 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.1C9.4 38.3 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6.5 5.5C41.5 35.7 44 30.3 44 24c0-1.3-.1-2.7-.4-3.9z"/>
    </svg>
  );

  const inputClass = "w-full bg-white/[0.03] border-b border-white/15 py-3 focus:border-white/50 outline-none transition-colors text-white text-sm placeholder:text-white/20";
  const labelClass = "block text-[9px] uppercase tracking-[0.3em] text-white/40 mb-3";

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#050506' }}>

      {/* ── Full-bleed background image + sweep/glow, behind everything ── */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[#0a0a0b]" />
        <div
          className="absolute -inset-y-1/2 -inset-x-[20%] pointer-events-none"
          style={{
            background: 'conic-gradient(from 200deg at 50% 50%, transparent 0deg, rgba(255,255,255,0.1) 40deg, transparent 90deg, transparent 360deg)',
            animation: 'campaign-sweep 12s linear infinite',
          }}
        />
        <div
          className="absolute top-[40%] left-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(255,255,255,0.14) 0%, rgba(220,220,225,0.06) 45%, transparent 75%)',
            animation: 'campaign-glow-pulse 5s ease-in-out infinite',
          }}
        />
        <img
          src="/images/collections/Auth.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'contrast(1.15) brightness(2.1) saturate(0.9)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.25) 65%, rgba(0,0,0,0.6) 100%)' }}
        />
      </div>

      {/* ── Minimal top bar for this page only — just the wordmark, no full site navbar ── */}
      <div className="relative z-20 flex justify-center pt-10 pb-4">
        <Link to="/">
          <h1 className="font-serif text-white uppercase tracking-[0.6em] text-xl">OBSIDIAN</h1>
        </Link>
      </div>

      {/* ── Two glass cards, side by side, the active one highlighted; form swaps instantly with mode (URL-driven, no separate animation state to fall out of sync) ── */}
      <div className={`relative z-10 min-h-[calc(100vh-100px)] flex items-center justify-center px-4 py-10 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full max-w-md">

          {/* ── FORM CARD ── */}
          <div
            className="glass-card rounded-[1.75rem] px-6 sm:px-10 py-10 sm:py-12"
            style={{
              background: 'rgba(10,10,12,0.55)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 25px 60px -15px rgba(0,0,0,0.6)',
            }}
          >
            <div className="text-center mb-10 animate-fade-up" style={{ animationDelay: '0.05s' }} key={`title-${mode}`}>
              <p className="text-[9px] text-white/50 uppercase tracking-[0.4em] font-display">
                {mode === 'login' ? 'Sign In to Continue' : 'Join the Inner Circle'}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 border border-red-500/20 bg-red-500/5 py-3 px-4 text-center animate-fade-up">
                <p className="text-red-400 text-[9px] uppercase tracking-widest">{errorMsg}</p>
              </div>
            )}

            <button onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-white/15 rounded-full py-3.5 mb-5 text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 hover:text-white hover:border-white/40 transition-all duration-300">
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="flex items-center gap-4 mb-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[8px] text-white/30 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-5" key="login-form">
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" name="email" value={loginData.email} onChange={handleLoginChange}
                    className={inputClass} placeholder="your@email.com" required />
                </div>
                <div>
                  <label className={labelClass}>Password</label>
                  <input type="password" name="password" value={loginData.password} onChange={handleLoginChange}
                    className={inputClass} placeholder="••••••••" required />
                </div>
                <button type="submit"
                  className="w-full bg-white text-black py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white/90 transition-all mt-2">
                  Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-5" key="signup-form">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input type="text" name="name" value={signupData.name} onChange={handleSignupChange}
                    className={inputClass} placeholder="Your Name" required />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" name="email" value={signupData.email} onChange={handleSignupChange}
                    className={inputClass} placeholder="your@email.com" required />
                </div>
                <div>
                  <label className={labelClass}>Password</label>
                  <input type="password" name="password" value={signupData.password} onChange={handleSignupChange}
                    className={inputClass} placeholder="Min. 6 characters" required minLength="6" />
                </div>
                <button type="submit"
                  className="w-full bg-white text-black py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white/90 transition-all mt-2">
                  Create Account
                </button>
              </form>
            )}

            <div className="mt-8 text-center">
              <p className="text-[9px] text-white/30 uppercase tracking-widest">
                {mode === 'login' ? (
                  <>New to OBSIDIAN?{' '}
                    <button type="button" onClick={() => switchMode('signup')} className="text-white/60 hover:text-white transition-colors ml-1">Join</button>
                  </>
                ) : (
                  <>Already a member?{' '}
                    <button type="button" onClick={() => switchMode('login')} className="text-white/60 hover:text-white transition-colors ml-1">Sign In</button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;