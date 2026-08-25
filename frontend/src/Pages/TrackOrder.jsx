import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

const API = `${import.meta.env.VITE_API_URL}/api`;

const TrackOrder = () => {
  const query = new URLSearchParams(useLocation().search);
  const orderId = query.get('id');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!orderId) { setLoading(false); return; }
    fetch(`${API}/orders/track/${orderId}`)
      .then(r => r.json())
      .then(data => { if (data.error) setNotFound(true); else setOrder(data); setLoading(false); })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [orderId]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-[10px] uppercase tracking-[0.8em] text-white/20 animate-pulse">Locating Order...</p>
    </div>
  );

  const steps = ['Confirmed', 'In Transit', 'Delivered'];
  const statusIndex = order?.status === 'Processing' ? 0 : order?.status === 'Shipped' ? 1 : 2;

  return (
    <div className="min-h-screen bg-black text-white py-16 sm:py-24 px-4 sm:px-6 font-sans">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-12 sm:mb-16">
          <Link to="/">
            <h1 className="font-serif text-white uppercase tracking-[0.6em] text-xl mb-4">OBSIDIAN</h1>
          </Link>
          <p className="text-[9px] text-white/30 uppercase tracking-[0.4em]">Order Tracking</p>
        </div>

        <div className="border border-white/5 p-6 sm:p-10 md:p-12">

          {notFound || !order ? (
            <div className="text-center py-12">
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-4">No order found</p>
              <p className="text-[10px] text-white/20 uppercase tracking-widest mb-8">Reference: <span className="text-white/40">{orderId || 'N/A'}</span></p>
              <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors border-b border-white/10 pb-1">
                Return Home
              </Link>
            </div>
          ) : (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-12 sm:mb-16">
                <div>
                  <p className="text-[8px] text-white/25 uppercase tracking-widest mb-2">Status</p>
                  <h3 className={`text-xl sm:text-2xl font-serif uppercase tracking-widest ${order.status === 'Delivered' ? 'text-white' : 'text-white'}`}>
                    {order.status}
                  </h3>
                </div>
                <div className="sm:text-right">
                  <p className="text-[8px] text-white/25 uppercase tracking-widest mb-2">Date</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">{order.date}</p>
                </div>
              </div>

              {/* Progress */}
              <div className="relative mb-12 sm:mb-16">
                <div className="h-[1px] w-full bg-white/5 absolute top-[5px]" />
                <div className="h-[1px] bg-white absolute top-[5px] transition-all duration-1000"
                  style={{ width: statusIndex === 0 ? '0%' : statusIndex === 1 ? '50%' : '100%' }} />
                <div className="relative flex justify-between">
                  {steps.map((step, i) => (
                    <div key={step} className="flex flex-col items-center gap-3 bg-black px-2">
                      <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-500 ${i <= statusIndex ? 'bg-white' : 'bg-white/10'}`} />
                      <span className={`text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-center ${i <= statusIndex ? 'text-white/60' : 'text-white/20'}`}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="border border-white/5 p-5 sm:p-6 space-y-4">
                {[
                  { label: 'Reference', value: order.orderId },
                  { label: 'Name', value: order.customer?.name },
                  { label: 'City', value: order.customer?.city },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center text-[10px] uppercase tracking-widest border-b border-white/5 pb-4">
                    <span className="text-white/25">{label}</span>
                    <span className="text-white/70 font-bold text-right ml-4">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest pt-2">
                  <span className="text-white/25">Total</span>
                  <span className="font-serif text-white text-sm">Rs. {order.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;