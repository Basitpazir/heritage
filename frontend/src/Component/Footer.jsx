import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SocialIcon = ({ name }) => {
  const common = { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'currentColor' };
  switch (name) {
    case 'x':
      return <svg {...common}><path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.4 22H1.3l8.1-9.3L1 2h7l4.9 6.1L18.9 2Zm-1.2 18h1.9L7.4 4H5.4l12.3 16Z"/></svg>;
    case 'facebook':
      return <svg {...common}><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z"/></svg>;
    case 'youtube':
      return <svg {...common}><path d="M23 12s0-3.6-.5-5.3a2.9 2.9 0 0 0-2-2C18.8 4.2 12 4.2 12 4.2s-6.8 0-8.5.5a2.9 2.9 0 0 0-2 2C1 8.4 1 12 1 12s0 3.6.5 5.3a2.9 2.9 0 0 0 2 2c1.7.5 8.5.5 8.5.5s6.8 0 8.5-.5a2.9 2.9 0 0 0 2-2C23 15.6 23 12 23 12ZM9.8 15.5v-7l6.2 3.5-6.2 3.5Z"/></svg>;
    case 'pinterest':
      return <svg {...common}><path d="M12 2a10 10 0 0 0-3.6 19.3c0-.8 0-1.7.2-2.5l1.4-6s-.3-.7-.3-1.7c0-1.6.9-2.8 2.1-2.8 1 0 1.5.7 1.5 1.6 0 1-.6 2.4-.9 3.8-.3 1.1.6 2 1.7 2 2 0 3.5-2.1 3.5-5.2 0-2.7-2-4.6-4.8-4.6-3.2 0-5.1 2.4-5.1 4.9 0 1 .3 1.9 1 2.6.1.1.1.2.1.3l-.3 1.2c0 .2-.1.3-.3.2-1.2-.5-1.9-2.1-1.9-3.4 0-2.8 2-5.4 5.9-5.4 3.1 0 5.5 2.2 5.5 5.2 0 3.1-2 5.6-4.7 5.6-.9 0-1.8-.5-2.1-1.1l-.6 2.2c-.2.8-.8 1.9-1.3 2.5A10 10 0 1 0 12 2Z"/></svg>;
    case 'instagram':
      return <svg {...common}><path d="M12 2c2.7 0 3 0 4.1.1 1.1 0 1.8.2 2.3.4a4.6 4.6 0 0 1 1.7 1.1 4.6 4.6 0 0 1 1.1 1.7c.2.5.4 1.2.4 2.3.1 1.1.1 1.4.1 4.1s0 3-.1 4.1c0 1.1-.2 1.8-.4 2.3a4.6 4.6 0 0 1-1.1 1.7 4.6 4.6 0 0 1-1.7 1.1c-.5.2-1.2.4-2.3.4-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-1.1 0-1.8-.2-2.3-.4a4.6 4.6 0 0 1-1.7-1.1 4.6 4.6 0 0 1-1.1-1.7c-.2-.5-.4-1.2-.4-2.3C2 15 2 14.7 2 12s0-3 .1-4.1c0-1.1.2-1.8.4-2.3a4.6 4.6 0 0 1 1.1-1.7 4.6 4.6 0 0 1 1.7-1.1c.5-.2 1.2-.4 2.3-.4C8.9 2.1 9.3 2 12 2Zm0 1.8c-2.6 0-3 0-4 .1-.9 0-1.4.2-1.8.3-.4.2-.7.4-1 .7-.3.3-.5.6-.7 1-.1.4-.3.9-.3 1.8-.1 1-.1 1.4-.1 4s0 3 .1 4c0 .9.2 1.4.3 1.8.2.4.4.7.7 1 .3.3.6.5 1 .7.4.1.9.3 1.8.3 1 .1 1.4.1 4 .1s3 0 4-.1c.9 0 1.4-.2 1.8-.3.4-.2.7-.4 1-.7.3-.3.5-.6.7-1 .1-.4.3-.9.3-1.8.1-1 .1-1.4.1-4s0-3-.1-4c0-.9-.2-1.4-.3-1.8a2.8 2.8 0 0 0-.7-1 2.8 2.8 0 0 0-1-.7c-.4-.1-.9-.3-1.8-.3-1-.1-1.4-.1-4-.1Zm0 3.5a4.7 4.7 0 1 1 0 9.4 4.7 4.7 0 0 1 0-9.4Zm0 1.8a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8Zm6-2a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z"/></svg>;
    case 'tiktok':
      return <svg {...common}><path d="M16.6 2h-3.2v13.4a2.8 2.8 0 1 1-2-2.7v-3.3a6.1 6.1 0 1 0 5.2 6V8.6a7.6 7.6 0 0 0 4.4 1.4V6.8a4.3 4.3 0 0 1-4.4-4.4V2Z"/></svg>;
    default:
      return null;
  }
};

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
    <footer className="bg-black border-t border-white/10 text-white">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12">

          {/* Collections */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5">Collections</h4>
            <ul className="space-y-3.5">
              {[
                { label: 'Men', to: '/products?audience=men' },
                { label: 'Women', to: '/products?audience=women' },
                { label: 'Unisex', to: '/products?audience=unisex' },
                { label: 'Outlet', to: '/products?onSale=true' },
                { label: 'Digital', to: '/products?type=tech' },
                { label: 'Collabs', to: '/products' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-white/60 hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5">Information</h4>
            <ul className="space-y-3.5">
              <li>
                <button onClick={() => setViewingPolicy({ title: 'Returns Policy', text: info.returnPolicy })}
                  className="text-sm text-white/60 hover:text-white transition-colors text-left">Returns</button>
              </li>
              <li>
                <button onClick={() => setViewingPolicy({ title: 'Shipping & Delivery', text: info.shippingPolicy })}
                  className="text-sm text-white/60 hover:text-white transition-colors text-left">Shipping</button>
              </li>
              <li><Link to="/track-order" className="text-sm text-white/60 hover:text-white transition-colors">Track Order</Link></li>
              <li><Link to="/account" className="text-sm text-white/60 hover:text-white transition-colors">Customer Account</Link></li>
            </ul>
          </div>

          {/* More */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5">More</h4>
            <ul className="space-y-3.5">
              <li><Link to="/blog" className="text-sm text-white/60 hover:text-white transition-colors">Blog</Link></li>
              <li>
                <button onClick={() => setViewingPolicy({ title: 'About OBSIDIAN', text: 'OBSIDIAN is a black lifestyle brand for those who live in the dark. Minimalist. Powerful. Uncompromising.' })}
                  className="text-sm text-white/60 hover:text-white transition-colors text-left">About</button>
              </li>
              <li><Link to="/" className="text-sm text-white/60 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-sm text-white/60 hover:text-white transition-colors">Shop All</Link></li>
            </ul>
          </div>

          {/* Follow us */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5">Follow us</h4>
            <ul className="space-y-3.5">
              {['x', 'facebook', 'youtube', 'pinterest', 'instagram', 'tiktok'].map(s => (
                <li key={s} className="flex items-center gap-3">
                  <span className="text-white/60"><SocialIcon name={s} /></span>
                  <a href="#" className="text-sm text-white/60 hover:text-white transition-colors capitalize">{s === 'x' ? 'X' : s}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/60">{info.phone} · {info.email}</p>
          <p className="text-sm text-white/40">© 2026 OBSIDIAN — All Rights Reserved</p>
        </div>
      </div>

      {viewingPolicy && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#050506] max-w-lg w-full p-8 sm:p-10 border border-white/10 animate-scale-in">
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