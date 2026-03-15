import React from 'react';
import { Link } from 'react-router-dom';

const CustomerAccount = ({ orders = [] }) => {
  // We'll simulate a logged-in user since we haven't built a full login backend yet
  const userName = "Guest Collector"; 

  return (
    <div className="min-h-screen bg-stone-50 py-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-2">Member Dashboard</p>
          <h1 className="text-4xl font-serif text-stone-900 uppercase tracking-widest">Welcome, {userName}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order History List */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-[10px] font-bold text-stone-900 uppercase tracking-widest border-b pb-4">Order History</h3>
            
            {orders.length === 0 ? (
              <div className="bg-white p-12 text-center border border-stone-200">
                <p className="text-xs text-stone-400 uppercase tracking-widest mb-6">No scent journeys recorded yet.</p>
                <Link to="/products" className="text-[10px] font-bold uppercase tracking-widest text-stone-900 border-b-2 border-stone-900 pb-1">Begin Browsing</Link>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white p-8 border border-stone-200 shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-[10px] font-bold text-stone-900 uppercase mb-1">{order.id}</p>
                      <p className="text-[10px] text-stone-400 uppercase">{order.date}</p>
                    </div>
                    <span className="text-[8px] font-black px-3 py-1 bg-stone-50 text-stone-400 uppercase border border-stone-100">
                      {order.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm font-serif">
                        <span className="text-stone-600">{item.name}</span>
                        <span className="text-stone-900">Rs.{item.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-stone-50 flex justify-between items-center">
                    <p className="text-[10px] uppercase tracking-widest font-bold">Total Paid</p>
                    <p className="text-lg font-serif">Rs.{order.total.toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sidebar Info */}
          <div className="md:col-span-1 space-y-8">
            <div className="bg-white p-8 border border-stone-200">
              <h4 className="text-[10px] font-bold uppercase tracking-widest mb-4 border-b pb-2">Your Profile</h4>
              <p className="text-xs text-stone-500 mb-1">Status: Platinum Member</p>
              <p className="text-xs text-stone-500">Points: 1,250</p>
            </div>
            <div className="bg-stone-900 p-8 text-white">
              <h4 className="text-[10px] font-bold uppercase tracking-widest mb-2">Concierge</h4>
              <p className="text-[11px] leading-relaxed text-stone-400">Need help with a scent profile? Contact our experts for a private consultation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAccount;