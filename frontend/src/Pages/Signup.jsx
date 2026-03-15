import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isVisible, setIsVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => { setIsVisible(true); }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/products');
      } else {
        setErrorMsg(data.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setErrorMsg('Cannot reach the server. Please check your connection.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className={`min-h-[80vh] flex items-center justify-center px-6 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="max-w-md w-full bg-white p-12 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-stone-100 relative">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-stone-200" />

        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif text-stone-900 mb-4 uppercase tracking-[0.25em] leading-tight">
            Join <br/> Heritage
          </h2>
          <div className="w-8 h-[1px] bg-stone-300 mx-auto mb-4" />
          <p className="text-stone-400 text-[10px] uppercase tracking-[0.2em] font-light">
            Enter the world of artisanal scents
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 text-center border border-red-100 bg-red-50 py-3 px-4">
            <p className="text-red-800 text-[9px] uppercase tracking-widest font-black">{errorMsg}</p>
          </div>
        )}

        {/* Google Signup Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-stone-200 py-4 mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-stone-700 hover:bg-stone-50 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19.1 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.5 0 10.4-2 14.1-5.4l-6.5-5.5C29.6 35 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.1C9.4 38.3 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6.5 5.5C41.5 35.7 44 30.3 44 24c0-1.3-.1-2.7-.4-3.9z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-[1px] bg-stone-100" />
          <span className="text-[9px] text-stone-300 uppercase tracking-widest">or</span>
          <div className="flex-1 h-[1px] bg-stone-100" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="group">
            <label className="block text-[9px] uppercase tracking-[0.3em] text-stone-400 mb-1 font-black">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange}
              className="w-full border-b border-stone-100 py-3 focus:border-stone-900 outline-none transition-all duration-500 text-stone-800 font-light placeholder:text-stone-200"
              placeholder="THEODORE HERITAGE" required />
          </div>
          <div className="group">
            <label className="block text-[9px] uppercase tracking-[0.3em] text-stone-400 mb-1 font-black">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              className="w-full border-b border-stone-100 py-3 focus:border-stone-900 outline-none transition-all duration-500 text-stone-800 font-light placeholder:text-stone-200"
              placeholder="CLIENT@HERITAGE.COM" required />
          </div>
          <div className="group">
            <label className="block text-[9px] uppercase tracking-[0.3em] text-stone-400 mb-1 font-black">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange}
              className="w-full border-b border-stone-100 py-3 focus:border-stone-900 outline-none transition-all duration-500 text-stone-800 font-light placeholder:text-stone-200"
              placeholder="••••••••" required minLength="6" />
          </div>
          <button type="submit" className="w-full bg-stone-900 text-white py-5 mt-6 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black transition-all duration-500 shadow-xl active:scale-[0.98]">
            Create Account
          </button>
        </form>

        <div className="mt-12 text-center pt-8 border-t border-stone-50">
          <p className="text-stone-400 text-[9px] uppercase tracking-widest font-light">
            Already a member?
            <Link to="/login" className="text-stone-900 font-black hover:text-stone-500 ml-2 underline-offset-4 hover:underline transition-all">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;