import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isVisible, setIsVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const from = location.state?.from?.pathname || '/products';
  const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

  useEffect(() => { setIsVisible(true); }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  return (
    <div className={`min-h-screen bg-black flex items-center justify-center px-6 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-12">
          <Link to="/">
            <h1 className="font-serif text-white uppercase tracking-[0.6em] text-2xl mb-2">OBSIDIAN</h1>
          </Link>
          <p className="text-[9px] text-white/30 uppercase tracking-[0.4em]">Sign In to Continue</p>
        </div>

        {errorMsg && (
          <div className="mb-6 border border-red-500/20 bg-red-500/5 py-3 px-4 text-center">
            <p className="text-red-400 text-[9px] uppercase tracking-widest">{errorMsg}</p>
          </div>
        )}

        {/* Google */}
        <button onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-white/10 py-4 mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 hover:text-white hover:border-white/30 transition-all">
          <svg width="16" height="16" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19.1 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.5 0 10.4-2 14.1-5.4l-6.5-5.5C29.6 35 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.1C9.4 38.3 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6.5 5.5C41.5 35.7 44 30.3 44 24c0-1.3-.1-2.7-.4-3.9z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-[1px] bg-white/5" />
          <span className="text-[8px] text-white/20 uppercase tracking-widest">or</span>
          <div className="flex-1 h-[1px] bg-white/5" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[9px] uppercase tracking-[0.3em] text-white/30 mb-3">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              className="w-full bg-white/3 border-b border-white/10 py-3 focus:border-white/40 outline-none transition-all text-white text-sm placeholder:text-white/15"
              placeholder="your@email.com" required />
          </div>
          <div>
            <label className="block text-[9px] uppercase tracking-[0.3em] text-white/30 mb-3">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange}
              className="w-full bg-white/3 border-b border-white/10 py-3 focus:border-white/40 outline-none transition-all text-white text-sm placeholder:text-white/15"
              placeholder="••••••••" required />
          </div>

          <button type="submit"
            className="w-full bg-white text-black py-4 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white/90 transition-all mt-4">
            Sign In
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[9px] text-white/20 uppercase tracking-widest">
            New to OBSIDIAN?{' '}
            <Link to="/signup" className="text-white/50 hover:text-white transition-colors ml-1">Join</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;