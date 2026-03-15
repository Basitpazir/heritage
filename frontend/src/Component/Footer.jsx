import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ storeInfo }) => {
  const [viewingPolicy, setViewingPolicy] = useState(null);

  const info = storeInfo || {
    email: "contact@heritage.com",
    phone: "0303-4334000",
    address: "Pakistan",
    shippingPolicy: "Standard shipping applies.",
    returnPolicy: "Returns accepted within 14 days."
  };

  return (
    <footer className="relative bg-white border-t border-stone-200 pt-12 sm:pt-16 pb-8 px-6 sm:px-8 lg:px-16 text-stone-800">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-16">

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-4 italic text-stone-400">Discover</h4>
          <ul className="space-y-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">
            <li><Link to="/products" className="hover:text-stone-900">Our Collection</Link></li>
            <li><Link to="/products?search=men" className="hover:text-stone-900">Men's Scents</Link></li>
            <li><Link to="/products?search=women" className="hover:text-stone-900">Women's Scents</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-4 italic text-stone-400">Service</h4>
          <ul className="space-y-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">
            <li>
              <button onClick={() => setViewingPolicy({ title: "Shipping & Delivery", text: info.shippingPolicy })}
                className="hover:text-stone-900 text-left uppercase tracking-[0.2em]">Shipping & Delivery</button>
            </li>
            <li>
              <button onClick={() => setViewingPolicy({ title: "Returns Policy", text: info.returnPolicy })}
                className="hover:text-stone-900 text-left uppercase tracking-[0.2em]">Returns Policy</button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-4 italic text-stone-400">Contact</h4>
          <div className="space-y-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">
            <p className="font-bold text-stone-900">{info.phone}</p>
            <p className="lowercase tracking-widest break-all">{info.email}</p>
            <p>{info.address}</p>
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1">
          <h4 className="text-xs font-bold uppercase tracking-widest mb-4 italic text-stone-400">Updates</h4>
          <p className="text-[10px] text-stone-500 mb-4 tracking-wider">Join our niche perfume community.</p>
          <div className="flex border-b border-stone-300 pb-2">
            <input type="email" placeholder="YOUR EMAIL" className="w-full bg-transparent outline-none text-[10px] tracking-[0.2em]" />
          </div>
        </div>
      </div>

      <div className="text-center border-t border-stone-100 pt-6 flex flex-col items-center gap-4">
        <p className="text-[9px] text-stone-400 tracking-[0.4em] uppercase">
          © 2026 Heritage — Curated by Muhammad Basit
        </p>
      </div>

      {viewingPolicy && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white max-w-lg w-full p-6 sm:p-10 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-base sm:text-lg font-serif uppercase tracking-widest text-stone-900">{viewingPolicy.title}</h3>
              <button onClick={() => setViewingPolicy(null)} className="text-stone-400 hover:text-stone-900 text-xl ml-4">×</button>
            </div>
            <p className="text-xs text-stone-600 leading-loose uppercase tracking-wider">{viewingPolicy.text}</p>
            <button onClick={() => setViewingPolicy(null)}
              className="mt-6 w-full bg-stone-900 text-white py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all">
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;