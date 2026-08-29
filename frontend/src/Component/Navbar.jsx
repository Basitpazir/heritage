import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AUDIENCES = ['Men', 'Women', 'Digital', 'Collabs' , 'Outlet' , 'Unisex'];
const PRODUCT_TYPES = ['All', 'Fragrances', 'Accessories', 'Apparel', 'Tech', 'Lifestyle'];
const OUTLET_LINKS = ['Men\u2019s Sale', 'Women\u2019s Sale', 'Unisex Sale'];

const SocialIcon = ({ name }) => {
  const common = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'currentColor' };
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

const Navbar = ({ cartCount, storeInfo = {} }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [megaOpen, setMegaOpen] = useState(null);
  const searchRef = useRef(null);
  const closeTimer = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); setMobileExpanded(null); setMegaOpen(null); }, [location]);
  useEffect(() => { if (searchOpen && searchRef.current) searchRef.current.focus(); }, [searchOpen]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const hasDropdown = (aud) => aud === 'Men' || aud === 'Women' || aud === 'Unisex' || aud === 'Outlet';

  // Measure the hovered item's position relative to the nav container so the
  // Each dropdown now renders as a small tile grid anchored directly under its own
  // trigger item (via CSS position, not measured page coordinates), so no manual
  // indent tracking is needed anymore — just open/close state per audience.
  const openMega = (aud) => {
    if (!hasDropdown(aud)) { setMegaOpen(null); return; }
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(aud);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(null), 150);
  };

  const toggleMobileCategory = (aud) => setMobileExpanded(prev => prev === aud ? null : aud);

  const audienceLink = (aud) => {
    if (aud === 'Collabs') return '/products';
    if (aud === 'Digital') return '/products?type=tech';
    if (aud === 'Outlet') return '/products?onSale=true';
    return `/products?audience=${aud.toLowerCase()}`;
  };
  const subLink = (aud, type) => type === 'All' ? audienceLink(aud) : `/products?audience=${aud.toLowerCase()}&type=${type.toLowerCase()}`;
  const outletLink = (label) => {
    const aud = label.split('\u2019')[0];
    return `/products?audience=${aud.toLowerCase()}&onSale=true`;
  };

  const handleHamburgerClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchOpen(false);
    setMenuOpen(prev => !prev);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[1000]">

        <nav className="bg-black border-b border-white/5">

          {/* ROW 1 — Icon-only top bar */}
          <div className="max-w-[1600px] mx-auto px-5 md:px-12 py-5 md:py-6 flex items-center justify-between">
            <div className="flex items-center gap-5 md:gap-7 flex-1">
              <button type="button" className="text-white p-1 relative z-10 group/fries" onClick={handleHamburgerClick} aria-label="Menu">
                <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                  <line x1="0" y1="1" x2="20" y2="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    className="transition-all duration-300 ease-out origin-right group-hover/fries:-translate-x-[3px]" />
                  <line x1="0" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    className="transition-all duration-300 ease-out origin-right group-hover/fries:-translate-x-[6px] group-hover/fries:opacity-70" />
                  <line x1="0" y1="13" x2="20" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    className="transition-all duration-300 ease-out origin-right group-hover/fries:-translate-x-[3px]" />
                </svg>
              </button>
              <div
                className="relative flex items-center group/search"
                onMouseEnter={() => setSearchOpen(true)}
                onMouseLeave={() => { if (!searchQuery) setSearchOpen(false); }}
              >
                <button type="button" onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }} className="text-white p-1 relative z-10 flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </button>
                <form
                  onSubmit={handleSearch}
                  className={`flex items-center overflow-hidden transition-all duration-300 ease-out ${searchOpen ? 'w-40 sm:w-56 opacity-100 ml-2' : 'w-0 opacity-0 ml-0'}`}
                >
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-b border-white/25 py-1 text-[11px] uppercase tracking-widest outline-none text-white placeholder:text-white/25 focus:border-white/60 transition-colors"
                  />
                </form>
              </div>
            </div>

            <Link to="/" className="flex-shrink-0">
              <h1 className="text-white font-serif uppercase tracking-[0.5em] sm:tracking-[0.6em] text-lg sm:text-xl md:text-2xl leading-none">
                OBSIDIAN
              </h1>
            </Link>

            <div className="flex items-center justify-end gap-5 md:gap-7 flex-1">
              <Link to={isLoggedIn ? '/account' : '/login'} className="text-white p-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              </Link>
              <Link to="/cart" className="relative text-white p-1 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M6 8L7.5 3h9L18 8" />
                  <rect x="4" y="8" width="16" height="13" rx="2.5" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center pt-[3px] text-[9px] font-black leading-none pointer-events-none">
                  {cartCount > 0 ? cartCount : ''}
                </span>
              </Link>
            </div>
          </div>

          {/* ROW 2 — Audience nav */}
          <div className="hidden md:block border-t border-white/[0.07] w-[20%] mx-auto"onMouseLeave={scheduleClose}>
            <div className="max-w-[1600px] mx-auto px-12 flex items-center justify-center gap-10 lg:gap-14 py-4">
              {AUDIENCES.map(aud => (
                <div key={aud} onMouseEnter={() => openMega(aud)} className="relative">
                  <Link to={audienceLink(aud)}
                    className={`text-[11px] font-bold uppercase block transition-all duration-500 ease-out ${megaOpen === aud ? 'text-white tracking-[0.28em]' : 'text-white/55 tracking-[0.2em] hover:text-white/85'}`}>
                    {aud}
                  </Link>
                  {/* Minimal underline indicator — scales in from center, not a static border */}
                  <span
                    className="absolute -bottom-1 left-1/2 h-px bg-white pointer-events-none"
                    style={{
                      width: megaOpen === aud ? '100%' : '0%',
                      transform: 'translateX(-50%)',
                      transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)',
                    }}
                  />

                  {/* Small floating tile grid — anchored directly under THIS item only, no full-width panel */}
                  {hasDropdown(aud) && (
                    <div
                      className="absolute top-full left-1/2 pt-6 pointer-events-none"
                      style={{
                        transform: `translateX(-50%) translateY(${megaOpen === aud ? '0' : '-6px'})`,
                        opacity: megaOpen === aud ? 1 : 0,
                        transition: 'opacity 0.35s cubic-bezier(0.16,1,0.3,1), transform 0.35s cubic-bezier(0.16,1,0.3,1)',
                        pointerEvents: megaOpen === aud ? 'auto' : 'none',
                      }}
                      onMouseEnter={() => openMega(aud)}
                    >
                      <div className="grid grid-cols-1 gap-0.95 p-2 rounded-xl border border-white/10 bg-[#0a0a0b] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)]">
                        {(aud === 'Outlet' ? OUTLET_LINKS : PRODUCT_TYPES).map((item, idx) => {
                          const to = aud === 'Outlet' ? outletLink(item) : subLink(aud, item);
                          return (
                            <Link key={item} to={to}
                              className="group/tile flex items-center justify-center text-center px-4 py-3 rounded-lg text-[10px] font-semibold uppercase tracking-wide text-white/65 hover:text-white hover:bg-white/[0.06] transition-all duration-300 whitespace-nowrap"
                              style={{
                                opacity: megaOpen === aud ? 1 : 0,
                                transform: megaOpen === aud ? 'translateY(0)' : 'translateY(4px)',
                                transitionDelay: megaOpen === aud ? `${idx * 35}ms` : '0ms',
                              }}>
                              {item}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Search now expands inline next to its icon in Row 1 — see above; no separate full-width drop row */}

        {/* MOBILE MENU — quarter-width side drawer, full viewport height */}
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/60"
              style={{ zIndex: 999998 }}
              onClick={() => setMenuOpen(false)}
            />
            <div
              className="fixed left-0 top-0 bottom-0 w-[75vw] sm:w-[380px] max-w-[420px] bg-black overflow-y-auto"
              style={{ zIndex: 999999 }}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <button type="button" onClick={handleHamburgerClick} className="text-white p-1">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
                <h1 className="text-white font-serif uppercase tracking-[0.4em] text-sm leading-none">OBSIDIAN</h1>
                <div className="w-[19px]" />
              </div>

              <div className="px-6 py-4">
                {AUDIENCES.map(aud => (
                  <div key={aud} className="border-b border-white/10">
                    {(aud === 'Collabs' || aud === 'Digital') ? (
                      <Link to={audienceLink(aud)} className="w-full flex justify-between items-center py-3.5 text-left">
                        <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-white">{aud}</span>
                      </Link>
                    ) : (
                      <>
                        <button type="button" onClick={() => toggleMobileCategory(aud)}
                          className="w-full flex justify-between items-center py-3.5 text-left">
                          <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-white">{aud}</span>
                          <span className={`text-white/40 transition-transform duration-300 ${mobileExpanded === aud ? 'rotate-90' : ''}`}>›</span>
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${mobileExpanded === aud ? 'max-h-96 pb-3' : 'max-h-0'}`}>
                          <div className="flex flex-col gap-2.5 pl-1">
                            {aud === 'Outlet'
                              ? OUTLET_LINKS.map(label => (
                                  <Link key={label} to={outletLink(label)} className="text-[11px] text-white/60 hover:text-white transition-colors">
                                    {label}
                                  </Link>
                                ))
                              : PRODUCT_TYPES.map(type => (
                                  <Link key={type} to={subLink(aud, type)} className="text-[11px] text-white/60 hover:text-white transition-colors">
                                    {type}
                                  </Link>
                                ))
                            }
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                <div className="mt-6">
                  {isLoggedIn ? (
                    <div className="flex items-center gap-6">
                      <Link to="/account" className="text-[13px] font-bold text-white underline underline-offset-4">My Account</Link>
                      <button type="button" onClick={handleLogout} className="text-[13px] font-bold text-white/60">Logout</button>
                    </div>
                  ) : (
                    <Link to="/login" className="text-[13px] font-bold text-white underline underline-offset-4">Login</Link>
                  )}
                </div>

                <div className="mt-6 flex flex-col gap-4">
                  <div>
                    <p className="text-[8px] text-white/40 uppercase tracking-widest mb-1.5">Language</p>
                    <select className="w-full bg-transparent border border-white/20 text-white text-[11px] px-2.5 py-2 outline-none">
                      <option className="bg-black">English</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-[8px] text-white/40 uppercase tracking-widest mb-1.5">Country/Region</p>
                    <select className="w-full bg-transparent border border-white/20 text-white text-[11px] px-2.5 py-2 outline-none">
                      <option className="bg-black">Pakistan (PKR Rs)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  {['x', 'facebook', 'youtube', 'pinterest', 'instagram', 'tiktok'].map(s => (
                    <a key={s} href="#" className="text-white/60 hover:text-white transition-colors">
                      <SocialIcon name={s} />
                    </a>
                  ))}
                </div>

                <p className="text-[9px] text-white/30 mt-6 pb-6">Copyright © 2026 OBSIDIAN</p>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Fixed spacer — must match actual navbar height (no announcement bar now); explicit bg-black prevents any gap flashing white */}
      <div className="h-[116px] md:h-[144px] bg-black" />
    </>
  );
};

export default Navbar;