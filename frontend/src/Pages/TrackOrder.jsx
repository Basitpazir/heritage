import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

const API = 'http://localhost:5000/api';

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
      .then(data => {
        if (data.error) setNotFound(true);
        else setOrder(data);
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [orderId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-[10px] uppercase tracking-widest text-stone-400 animate-pulse">Locating Order...</p>
    </div>
  );

  const steps = ['Confirmed', 'In Transit', 'Delivered'];
  const statusIndex = order?.status === 'Processing' ? 0 : order?.status === 'Shipped' ? 1 : 2;

  return (
    <div className="min-h-screen bg-stone-50 py-12 sm:py-24 px-4 sm:px-6 font-sans">
      <div className="max-w-2xl mx-auto bg-white border border-stone-200 shadow-sm p-6 sm:p-10 md:p-16">
        <h2 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em] mb-8 sm:mb-10 border-b border-stone-100 pb-6">
          Live Tracking Portal
        </h2>

        {notFound || !order ? (
          <div className="text-center py-12">
            <p className="text-xs text-stone-500 uppercase tracking-widest mb-8">
              No order found with reference: <span className="text-stone-900 font-black block mt-2">{orderId || 'N/A'}</span>
            </p>
            <Link to="/" className="text-[10px] font-black uppercase tracking-widest border-b border-stone-900 pb-1 hover:text-stone-400 transition-all">
              Return Home
            </Link>
          </div>
        ) : (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-12 sm:mb-16">
              <div>
                <p className="text-[9px] text-stone-400 uppercase tracking-widest mb-2">Current Status</p>
                <h3 className={`text-xl sm:text-2xl font-serif uppercase tracking-widest ${order.status === 'Delivered' ? 'text-green-700' : 'text-stone-900'}`}>
                  {order.status}
                </h3>
              </div>
              <div className="sm:text-right">
                <p className="text-[9px] text-stone-400 uppercase tracking-widest mb-2">Order Date</p>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-900">{order.date}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative mb-16 sm:mb-20">
              <div className="h-[1px] w-full bg-stone-100 absolute top-[6px]" />
              <div className="h-[1px] bg-stone-900 absolute top-[6px] transition-all duration-1000"
                style={{ width: statusIndex === 0 ? '0%' : statusIndex === 1 ? '50%' : '100%' }} />
              <div className="relative flex justify-between">
                {steps.map((step, i) => (
                  <div key={step} className="flex flex-col items-center gap-3 bg-white px-1 sm:px-2">
                    <div className={`w-3 h-3 rounded-full ring-4 ring-white transition-colors duration-500 ${i <= statusIndex ? 'bg-stone-900' : 'bg-stone-200'}`} />
                    <span className={`text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-center ${i <= statusIndex ? 'text-stone-900' : 'text-stone-300'}`}>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-stone-50 p-5 sm:p-8 border border-stone-100 space-y-4 sm:space-y-6">
              {[
                { label: 'Order Reference', value: order.orderId },
                { label: 'Recipient', value: order.customer?.name },
                { label: 'Destination', value: order.customer?.city },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                  <span className="text-stone-400">{label}</span>
                  <span className="text-stone-900 font-bold text-right ml-4">{value}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-stone-200 flex justify-between items-center text-[10px] uppercase tracking-widest">
                <span className="text-stone-400">Total Amount</span>
                <span className="text-stone-900 font-bold">Rs.{order.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;