import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API = `${import.meta.env.VITE_API_URL}/api`;

const CustomerAccount = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    // Fetch user info
    fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { if (data._id) setUser(data); })
      .catch(() => {});

    // Fetch orders
    fetch(`${API}/orders/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));

    // Also get user from localStorage as fallback
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const statusColor = (status) => {
    if (status === 'Delivered') return 'text-white/70';
    if (status === 'Shipped') return 'text-white/55';
    return 'text-white/40';
  };

  return (
    <div className="min-h-screen text-white px-4 sm:px-6 lg:px-12 py-12 sm:py-20 font-body" style={{ backgroundColor: '#050506' }}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 border-b border-white/10 pb-8 animate-fade-up">
          <div>
            <p className="text-[8px] text-white/35 uppercase tracking-[0.5em] mb-2 font-display">OBSIDIAN Member</p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight">
              {user?.name || 'Welcome Back'}
            </h1>
            {user?.email && (
              <p className="text-[9px] text-white/30 mt-2 tracking-widest lowercase">{user.email}</p>
            )}
          </div>
          <button onClick={handleLogout}
            className="mt-4 sm:mt-0 border border-white/15 rounded-full text-white/50 hover:text-white hover:border-white/40 px-6 py-3 text-[9px] font-bold uppercase tracking-widest transition-all duration-300">
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">

          {/* Orders */}
          <div className="md:col-span-2 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="font-display text-[9px] font-bold text-white/40 uppercase tracking-[0.4em] mb-6 border-b border-white/10 pb-4">Order History</h3>

            {loading ? (
              <p className="text-[10px] text-white/25 uppercase tracking-widest animate-pulse font-display">Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="rounded-2xl border border-white/10 p-12 text-center" style={{ backgroundColor: '#101012' }}>
                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-6">No orders yet.</p>
                <Link to="/products" className="text-[9px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors border-b border-white/15 pb-1">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, i) => (
                  <div key={order._id}
                    className="rounded-2xl border border-white/10 p-5 sm:p-6 hover:border-white/25 transition-colors duration-300 animate-fade-up"
                    style={{ backgroundColor: '#101012', animationDelay: `${0.15 + i * 0.05}s` }}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[9px] font-bold text-white/70 uppercase tracking-widest mb-1">{order.orderId}</p>
                        <p className="text-[8px] text-white/30 uppercase tracking-widest">{order.date}</p>
                      </div>
                      <span className={`text-[8px] font-bold uppercase tracking-widest border border-white/15 rounded-full px-3 py-1 ${statusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex justify-between text-[10px]">
                          <span className="text-white/45 uppercase tracking-widest truncate mr-4">{item.name}</span>
                          <span className="font-display text-white/60 flex-shrink-0">Rs. {item.price?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                      <p className="text-[9px] text-white/30 uppercase tracking-widest">Total</p>
                      <p className="font-display text-white font-bold">Rs. {order.total?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="rounded-2xl border border-white/10 p-6" style={{ backgroundColor: '#101012' }}>
              <h4 className="font-display text-[9px] font-bold text-white/40 uppercase tracking-[0.4em] mb-4">Profile</h4>
              <div className="space-y-2">
                <p className="text-[10px] text-white/70 uppercase tracking-widest">{user?.name || '—'}</p>
                <p className="text-[9px] text-white/30 tracking-widest lowercase">{user?.email || '—'}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-white text-black p-6 relative overflow-hidden">
              <h4 className="font-display text-[9px] font-black uppercase tracking-[0.4em] mb-3">Inner Circle</h4>
              <p className="text-[10px] leading-relaxed text-black/60 mb-4">
                Exclusive access to new drops, limited editions and private sales.
              </p>
              <Link to="/products" className="block text-center rounded-full border border-black/20 py-3 text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300">
                Shop Now
              </Link>
            </div>

            <div className="rounded-2xl border border-white/10 p-6" style={{ backgroundColor: '#101012' }}>
              <h4 className="font-display text-[9px] font-bold text-white/40 uppercase tracking-[0.4em] mb-3">Track Order</h4>
              <Link to="/track-order" className="block text-center rounded-full border border-white/15 py-3 text-[9px] font-bold uppercase tracking-widest text-white/50 hover:text-white hover:border-white/40 transition-all duration-300">
                Track Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAccount;