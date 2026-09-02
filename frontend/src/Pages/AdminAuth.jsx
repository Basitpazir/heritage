import React, { useState, useEffect } from 'react';

// This safely checks if the Vercel variable exists first
const base_url = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API = `${base_url}/api`;

const AdminAuth = ({ onAdminLogin }) => {
  const [adminExists, setAdminExists] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // We use a timestamp to prevent the browser from "caching" a failed response
    fetch(`${API}/admin/exists?t=${Date.now()}`)
      .then(r => {
        if (!r.ok) throw new Error('Server not responding');
        return r.json();
      })
      .then(data => setAdminExists(data.exists))
      .catch((err) => {
        console.error("API Error:", err);
        setErrorMsg('Cannot reach server. Check VITE_API_URL in Vercel settings.');
        setAdminExists(false); // Fallback to register if server check fails
      });
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const endpoint = adminExists ? '/admin/login' : '/admin/register';
    const body = adminExists ? { email, password } : { name, email, password };

    try {
      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error?.includes('already exists')) {
          setAdminExists(true);
          setErrorMsg('Admin already exists. Please login.');
        } else {
          setErrorMsg(data.error || 'Authentication failed.');
        }
        return;
      }

      localStorage.setItem('adminToken', data.token);

      if (typeof onAdminLogin === 'function') {
        onAdminLogin(data.token);
      }

      window.location.href = '/admin';

    } catch (err) {
      setErrorMsg('Connection lost. Is the backend URL correct?');
    }
  };

  const inp = "w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 outline-none text-white text-sm focus:border-white/30 transition-colors placeholder:text-white/25";

  if (adminExists === null && !errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#050506' }}>
        <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 animate-pulse font-display">Connecting to OBSIDIAN Vault...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 font-body" style={{ backgroundColor: '#050506' }}>
      <div className="max-w-md w-full rounded-2xl border border-white/10 p-8 sm:p-10 text-center" style={{ backgroundColor: '#0a0a0b' }}>
        <p className="text-[9px] text-white/35 uppercase tracking-[0.4em] mb-3 font-display">OBSIDIAN</p>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2 uppercase tracking-widest">
          {adminExists ? 'Admin Login' : 'Create Admin Account'}
        </h2>
        <p className="text-[9px] text-white/35 uppercase tracking-widest mb-8">
          {adminExists ? 'Secure Portal' : 'No admin detected. Register yourself as the master admin.'}
        </p>

        {errorMsg && (
          <div className="mb-6 border border-red-500/20 bg-red-500/10 rounded-xl py-3 px-4">
            <p className="text-red-400 text-[9px] uppercase tracking-widest font-black">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5 text-left">
          {!adminExists && (
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-white/40 font-bold mb-2">Full Name</label>
              <input type="text" className={inp}
                placeholder="e.g. Basit Pazir" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div>
            <label className="block text-[9px] uppercase tracking-widest text-white/40 font-bold mb-2">Email Address</label>
            <input type="email" className={inp}
              placeholder="admin@obsidian.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-[9px] uppercase tracking-widest text-white/40 font-bold mb-2">Password</label>
            <input type="password" className={inp}
              placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="w-full bg-white text-black py-4 rounded-full uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-white/90 transition-all font-display">
            {adminExists ? 'Verify & Enter' : 'Initialize Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAuth;