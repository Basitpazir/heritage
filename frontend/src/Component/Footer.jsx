import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ storeInfo }) => {
  const [viewingPolicy, setViewingPolicy] = useState(null);

  const info = storeInfo || {
    email: 'contact@obsidian.com',
    phone: '+92 300 0000000',
    address: 'Pakistan',
    shippingPolicy: 'Free worldwide shipping on all orders over Rs. 50,000.',
    returnPolicy: 'Returns accepted within 14 days of delivery in original condition.'
  };

  return (
    <footer className="bg-black border-t border-white/5 text-white">

      {/* Main footer */}
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12">

          {/* Shop */}
          <div>
            <h4 className="text-[9px] font-bold uppercase tracking-[0.4em] mb-5 text-white/40">Shop</h4>
            <ul className="space-y-3">
              {['Fragrances', 'Accessories', 'Apparel', 'Tech', 'Lifestyle'].map(item => (
                <li key={item}>
                  <Link to={`/products?category=${item.toLowerCase()}`}
                    className="text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-[9px] font-bold uppercase tracking-[0.4em] mb-5 text-white/40">Help</h4>
            <ul className="space-y-3">
              <li>
                <button onClick={() => setViewingPolicy({ title: 'Shipping & Delivery', text: info.shippingPolicy })}
                  className="text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors text-left">
                  Shipping
                </button>
              </li>
              <li>
                <button onClick={() => setViewingPolicy({ title: 'Returns Policy', text: info.returnPolicy })}
                  className="text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors text-left">
                  Returns
                </button>
              </li>
              <li>
                <Link to="/track-order" className="text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/account" className="text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[9px] font-bold uppercase tracking-[0.4em] mb-5 text-white/40">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">Collection</Link></li>
              <li>
                <button onClick={() => setViewingPolicy({ title: 'About OBSIDIAN', text: 'OBSIDIAN is a black lifestyle brand for those who live in the dark. Minimalist. Powerful. Uncompromising.' })}
                  className="text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors text-left">
                  About
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-2">
            <h4 className="text-[9px] font-bold uppercase tracking-[0.4em] mb-5 text-white/40">Contact</h4>
            <div className="space-y-3 mb-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-bold">{info.phone}</p>
              <p className="text-[10px] tracking-widest text-white/40 break-all lowercase">{info.email}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">{info.address}</p>
            </div>
            <div className="flex gap-3">
              {['instagram', 'twitter', 'tiktok'].map(s => (
                <a key={s} href="#" className="text-white/20 hover:text-white transition-colors">
                  <div className="w-8 h-8 border border-white/10 hover:border-white/30 flex items-center justify-center transition-colors">
                    <span className="text-[8px] font-bold uppercase">{s[0]}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 px-6 sm:px-12 py-6">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link to="/">
            <h2 className="font-serif text-white uppercase tracking-[0.5em] text-sm">OBSIDIAN</h2>
          </Link>
          <p className="text-[8px] text-white/20 tracking-[0.4em] uppercase">
            © 2026 OBSIDIAN — All Rights Reserved
          </p>
          <p className="text-[8px] text-white/20 tracking-[0.4em] uppercase">
            All Black. Everything.
          </p>
        </div>
      </div>

      {/* Policy Modal */}
      {viewingPolicy && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] max-w-lg w-full p-8 sm:p-10 border border-white/10">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-sm font-serif uppercase tracking-widest text-white">{viewingPolicy.title}</h3>
              <button onClick={() => setViewingPolicy(null)} className="text-white/30 hover:text-white text-xl ml-4">×</button>
            </div>
            <p className="text-[11px] text-white/50 leading-loose uppercase tracking-wider">{viewingPolicy.text}</p>
            <button onClick={() => setViewingPolicy(null)}
              className="mt-8 w-full bg-white text-black py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white/90 transition-all">
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;