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
    if (status === 'Delivered') return 'text-white/60';
    if (status === 'Shipped') return 'text-white/50';
    return 'text-white/40';
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-12 py-12 sm:py-20 font-sans">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 border-b border-white/5 pb-8">
          <div>
            <p className="text-[8px] text-white/25 uppercase tracking-[0.5em] mb-2">OBSIDIAN Member</p>
            <h1 className="text-2xl sm:text-3xl font-serif uppercase tracking-widest">
              {user?.name || 'Welcome Back'}
            </h1>
            {user?.email && (
              <p className="text-[9px] text-white/25 mt-2 tracking-widest lowercase">{user.email}</p>
            )}
          </div>
          <button onClick={handleLogout}
            className="mt-4 sm:mt-0 border border-white/10 text-white/40 hover:text-white hover:border-white/30 px-6 py-3 text-[9px] font-bold uppercase tracking-widest transition-all">
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">

          {/* Orders */}
          <div className="md:col-span-2">
            <h3 className="text-[9px] font-bold text-white/25 uppercase tracking-[0.4em] mb-6 border-b border-white/5 pb-4">Order History</h3>

            {loading ? (
              <p className="text-[10px] text-white/20 uppercase tracking-widest animate-pulse">Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="border border-white/5 p-12 text-center">
                <p className="text-[10px] text-white/20 uppercase tracking-widest mb-6">No orders yet.</p>
                <Link to="/products" className="text-[9px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors border-b border-white/10 pb-1">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order._id} className="border border-white/5 p-5 sm:p-6 hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest mb-1">{order.orderId}</p>
                        <p className="text-[8px] text-white/20 uppercase tracking-widest">{order.date}</p>
                      </div>
                      <span className={`text-[8px] font-bold uppercase tracking-widest border border-white/10 px-3 py-1 ${statusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex justify-between text-[10px]">
                          <span className="text-white/40 uppercase tracking-widest truncate mr-4">{item.name}</span>
                          <span className="font-serif text-white/50 flex-shrink-0">Rs. {item.price?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <p className="text-[9px] text-white/25 uppercase tracking-widest">Total</p>
                      <p className="font-serif text-white">Rs. {order.total?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="border border-white/5 p-6">
              <h4 className="text-[9px] font-bold text-white/25 uppercase tracking-[0.4em] mb-4">Profile</h4>
              <div className="space-y-2">
                <p className="text-[10px] text-white/60 uppercase tracking-widest">{user?.name || '—'}</p>
                <p className="text-[9px] text-white/25 tracking-widest lowercase">{user?.email || '—'}</p>
              </div>
            </div>

            <div className="bg-white text-black p-6">
              <h4 className="text-[9px] font-bold uppercase tracking-[0.4em] mb-3">Inner Circle</h4>
              <p className="text-[10px] leading-relaxed text-black/60 mb-4">
                Exclusive access to new drops, limited editions and private sales.
              </p>
              <Link to="/products" className="block text-center border border-black/20 py-3 text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                Shop Now
              </Link>
            </div>

            <div className="border border-white/5 p-6">
              <h4 className="text-[9px] font-bold text-white/25 uppercase tracking-[0.4em] mb-3">Track Order</h4>
              <Link to="/track-order" className="block text-center border border-white/10 py-3 text-[9px] font-bold uppercase tracking-widest text-white/40 hover:text-white hover:border-white/30 transition-all">
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