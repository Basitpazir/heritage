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

  if (adminExists === null && !errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[10px] uppercase tracking-widest text-stone-400 animate-pulse">Connecting to Heritage Vault...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-10 shadow-sm border border-stone-200 text-center">
        <h2 className="text-3xl font-serif text-stone-900 mb-2 uppercase tracking-widest">
          {adminExists ? 'Admin Login' : 'Create Admin Account'}
        </h2>
        <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-8">
          {adminExists ? 'Secure Portal' : 'No admin detected. Register yourself as the master admin.'}
        </p>

        {errorMsg && (
          <div className="mb-6 border border-red-100 bg-red-50 py-3 px-4">
            <p className="text-red-800 text-[9px] uppercase tracking-widest font-black">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6 text-left">
          {!adminExists && (
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-2">Full Name</label>
              <input type="text" className="w-full border-b border-stone-200 py-2 outline-none focus:border-stone-900"
                placeholder="e.g. Basit Pazir" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-2">Email Address</label>
            <input type="email" className="w-full border-b border-stone-200 py-2 outline-none focus:border-stone-900"
              placeholder="admin@heritage.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-2">Password</label>
            <input type="password" className="w-full border-b border-stone-200 py-2 outline-none focus:border-stone-900"
              placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="w-full bg-stone-900 text-white py-4 uppercase tracking-[0.3em] text-[11px] hover:bg-black transition-all">
            {adminExists ? 'Verify & Enter' : 'Initialize Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAuth;