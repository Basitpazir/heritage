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

const SOCIALS = [
  { key: 'x', label: 'X', href: 'https://obsidian.com/x' },
  { key: 'facebook', label: 'Facebook', href: 'https://obsidian.com/facebook' },
  { key: 'youtube', label: 'YouTube', href: 'https://obsidian.com/youtube' },
  { key: 'pinterest', label: 'Pinterest', href: 'https://obsidian.com/pinterest' },
  { key: 'instagram', label: 'Instagram', href: 'https://obsidian.com/instagram' },
  { key: 'tiktok', label: 'TikTok', href: 'https://obsidian.com/tiktok' },
];

// Simplified continent-dot world map. Coordinates are hand-placed in a 1000x500
// viewBox (equirectangular-ish) to trace recognizable continent silhouettes as a
// scatter of dots -- a common, license-free way to depict "world map" in premium
// dark UIs without importing a heavy precision GeoJSON/SVG dataset.
const WORLD_DOTS = [
  // North America
  [120,120],[135,115],[150,112],[165,118],[145,130],[130,140],[150,150],[165,145],[180,140],[170,160],
  [155,170],[140,175],[125,165],[110,150],[100,135],[190,155],[200,170],[185,180],[170,190],[195,195],
  // South America
  [220,240],[228,255],[235,270],[240,290],[235,310],[228,330],[220,350],[215,370],[210,390],[225,260],
  [215,280],[230,300],[218,320],[208,340],
  // Europe
  [470,100],[480,95],[495,98],[505,105],[490,110],[475,115],[510,95],[460,105],[500,120],[485,125],
  // Africa
  [480,180],[490,200],[500,220],[495,240],[485,260],[475,280],[465,300],[470,320],[480,340],[460,200],
  [455,220],[450,240],[500,190],[510,210],[505,230],[490,290],[475,250],[465,270],
  // Middle East
  [530,150],[540,160],[520,165],[535,175],
  // Asia
  [580,110],[600,105],[620,110],[640,120],[660,115],[680,125],[700,135],[720,130],[610,130],[630,140],
  [650,145],[670,140],[590,150],[605,160],[625,165],[645,160],[665,170],[685,155],[705,150],[720,160],
  [740,140],[760,135],[600,180],[620,190],[640,185],[660,195],[680,180],
  // Southeast Asia / Indonesia
  [680,240],[700,250],[720,245],[690,260],[710,270],[730,255],
  // Australia
  [790,320],[810,315],[830,325],[800,335],[820,340],[840,330],[850,345],[795,345],
  // UK/Iceland
  [455,80],[460,90],[440,60],
  // Japan
  [770,150],[775,160],[772,140],
];

const HEADQUARTERS = { x: 555, y: 175, label: 'Pakistan' };

const WorldMapBackdrop = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none footer-map-lines">
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1000 450"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {WORLD_DOTS.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="2.2"
          fill="white"
          className="map-dot"
          style={{ animationDelay: `${(i % 24) * 0.18}s`, opacity: 0.09 }}
        />
      ))}
      {/* Highlight OBSIDIAN's home base with a stronger, more visible pulse */}
      <circle cx={HEADQUARTERS.x} cy={HEADQUARTERS.y} r="4" fill="white" className="map-hq-dot" />
      <circle cx={HEADQUARTERS.x} cy={HEADQUARTERS.y} r="9" stroke="white" strokeWidth="1" fill="none" className="map-hq-ring" />
      <circle cx={HEADQUARTERS.x} cy={HEADQUARTERS.y} r="9" stroke="white" strokeWidth="1" fill="none" className="map-hq-ring map-hq-ring-delay" />
    </svg>

    {/* Traveling scan sweep — a soft diagonal glow band that periodically passes over the whole map */}
    <div className="map-scan-sweep absolute inset-0" />
  </div>
);

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
    <footer className="footer-map relative overflow-hidden border-t border-white/10 text-white" style={{ backgroundColor: '#050506' }}>

      <WorldMapBackdrop />

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12">

          {/* Collections */}
          <div className="animate-fade-up" style={{ animationDelay: '0s' }}>
            <h4 className="font-display text-[11px] font-bold uppercase tracking-[0.25em] text-white mb-5">Collections</h4>
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
                  <Link to={item.to} className="footer-link group text-sm text-white/55 hover:text-white transition-colors duration-300 inline-flex items-center gap-0">
                    <span className="footer-link-bar inline-block h-px w-0 bg-white group-hover:w-3 transition-all duration-300 ease-out" />
                    <span className="group-hover:translate-x-1.5 transition-transform duration-300 ease-out">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div className="animate-fade-up" style={{ animationDelay: '0.08s' }}>
            <h4 className="font-display text-[11px] font-bold uppercase tracking-[0.25em] text-white mb-5">Information</h4>
            <ul className="space-y-3.5">
              <li>
                <button onClick={() => setViewingPolicy({ title: 'Returns Policy', text: info.returnPolicy })}
                  className="footer-link group text-sm text-white/55 hover:text-white transition-colors duration-300 text-left inline-flex items-center gap-0">
                  <span className="footer-link-bar inline-block h-px w-0 bg-white group-hover:w-3 transition-all duration-300 ease-out" />
                  <span className="group-hover:translate-x-1.5 transition-transform duration-300 ease-out">Returns</span>
                </button>
              </li>
              <li>
                <button onClick={() => setViewingPolicy({ title: 'Shipping & Delivery', text: info.shippingPolicy })}
                  className="footer-link group text-sm text-white/55 hover:text-white transition-colors duration-300 text-left inline-flex items-center gap-0">
                  <span className="footer-link-bar inline-block h-px w-0 bg-white group-hover:w-3 transition-all duration-300 ease-out" />
                  <span className="group-hover:translate-x-1.5 transition-transform duration-300 ease-out">Shipping</span>
                </button>
              </li>
              <li>
                <Link to="/track-order" className="footer-link group text-sm text-white/55 hover:text-white transition-colors duration-300 inline-flex items-center gap-0">
                  <span className="footer-link-bar inline-block h-px w-0 bg-white group-hover:w-3 transition-all duration-300 ease-out" />
                  <span className="group-hover:translate-x-1.5 transition-transform duration-300 ease-out">Track Order</span>
                </Link>
              </li>
              <li>
                <Link to="/account" className="footer-link group text-sm text-white/55 hover:text-white transition-colors duration-300 inline-flex items-center gap-0">
                  <span className="footer-link-bar inline-block h-px w-0 bg-white group-hover:w-3 transition-all duration-300 ease-out" />
                  <span className="group-hover:translate-x-1.5 transition-transform duration-300 ease-out">Customer Account</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* More */}
          <div className="animate-fade-up" style={{ animationDelay: '0.16s' }}>
            <h4 className="font-display text-[11px] font-bold uppercase tracking-[0.25em] text-white mb-5">More</h4>
            <ul className="space-y-3.5">
              <li>
                <Link to="/blog" className="footer-link group text-sm text-white/55 hover:text-white transition-colors duration-300 inline-flex items-center gap-0">
                  <span className="footer-link-bar inline-block h-px w-0 bg-white group-hover:w-3 transition-all duration-300 ease-out" />
                  <span className="group-hover:translate-x-1.5 transition-transform duration-300 ease-out">Blog</span>
                </Link>
              </li>
              <li>
                <button onClick={() => setViewingPolicy({ title: 'About OBSIDIAN', text: 'OBSIDIAN is a black lifestyle brand for those who live in the dark. Minimalist. Powerful. Uncompromising.' })}
                  className="footer-link group text-sm text-white/55 hover:text-white transition-colors duration-300 text-left inline-flex items-center gap-0">
                  <span className="footer-link-bar inline-block h-px w-0 bg-white group-hover:w-3 transition-all duration-300 ease-out" />
                  <span className="group-hover:translate-x-1.5 transition-transform duration-300 ease-out">About</span>
                </button>
              </li>
              <li>
                <Link to="/" className="footer-link group text-sm text-white/55 hover:text-white transition-colors duration-300 inline-flex items-center gap-0">
                  <span className="footer-link-bar inline-block h-px w-0 bg-white group-hover:w-3 transition-all duration-300 ease-out" />
                  <span className="group-hover:translate-x-1.5 transition-transform duration-300 ease-out">Home</span>
                </Link>
              </li>
              <li>
                <Link to="/products" className="footer-link group text-sm text-white/55 hover:text-white transition-colors duration-300 inline-flex items-center gap-0">
                  <span className="footer-link-bar inline-block h-px w-0 bg-white group-hover:w-3 transition-all duration-300 ease-out" />
                  <span className="group-hover:translate-x-1.5 transition-transform duration-300 ease-out">Shop All</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow us */}
          <div className="animate-fade-up" style={{ animationDelay: '0.24s' }}>
            <h4 className="font-display text-[11px] font-bold uppercase tracking-[0.25em] text-white mb-5">Follow Us</h4>
            <ul className="space-y-3.5">
              {SOCIALS.map(s => (
                <li key={s.key}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer"
                    className="footer-social-link group flex items-center gap-3 text-sm text-white/55 hover:text-white transition-colors duration-300">
                    <span className="footer-social-icon flex items-center justify-center w-7 h-7 rounded-full border border-white/15 text-white/55 group-hover:text-black group-hover:bg-white group-hover:border-white transition-all duration-300 ease-out">
                      <SocialIcon name={s.key} />
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300 ease-out">{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 animate-fade-up" style={{ animationDelay: '0.32s' }}>
          <p className="text-sm text-white/50">{info.phone} · {info.email}</p>
          <p className="font-display text-[10px] tracking-[0.15em] text-white/30">© 2026 OBSIDIAN — All Rights Reserved</p>
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