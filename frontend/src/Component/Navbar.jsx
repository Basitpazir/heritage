import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AUDIENCES = ['Men', 'Women', 'Unisex', 'Outlet', 'Collabs'];
const PRODUCT_TYPES = ['All', 'Fragrances', 'Accessories', 'Apparel', 'Tech', 'Lifestyle'];
const OUTLET_LINKS = ['Men\u2019s Sale', 'Women\u2019s Sale', 'Unisex Sale'];

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

  const isHomePage = location.pathname === '/';
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const hasDropdown = (aud) => aud === 'Men' || aud === 'Women' || aud === 'Unisex' || aud === 'Outlet';

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
    if (aud === 'Outlet') return '/products?onSale=true';
    return `/products?audience=${aud.toLowerCase()}`;
  };
  const subLink = (aud, type) => type === 'All' ? audienceLink(aud) : `/products?audience=${aud.toLowerCase()}&type=${type.toLowerCase()}`;
  const outletLink = (label) => {
    const aud = label.split('\u2019')[0];
    return `/products?audience=${aud.toLowerCase()}&onSale=true`;
  };

  const handleHamburgerClick = () => {
    setSearchOpen(false);
    setMenuOpen(prev => !prev);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[1000]">

        {/* ANNOUNCEMENT */}
        <div className="bg-white text-black h-8 flex items-center justify-center text-[9px] font-bold uppercase tracking-[0.5em]">
          <span className="hidden sm:block">Free worldwide shipping on orders over Rs. 50,000</span>
          <span className="sm:hidden">Free shipping over Rs. 50,000</span>
        </div>

        {/* Navbar is always solid black \u2014 no transparent state on any page or scroll position */}
        <nav className="bg-black border-b border-white/5" onMouseLeave={scheduleClose}>

          {/* ROW 1 — Icon-only top bar */}
          <div className="max-w-[1600px] mx-auto px-5 md:px-12 py-5 md:py-6 flex items-center justify-between">
            <div className="flex items-center gap-5 md:gap-7 flex-1">
              <button type="button" className="text-white p-1 relative z-10" onClick={handleHamburgerClick}>
                {menuOpen ? (
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                ) : (
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                )}
              </button>
              <button type="button" onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }} className="text-white p-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </button>
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
              <Link to="/cart" className="relative text-white p-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-white text-black text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* ROW 2 — Audience nav; each item is its own relative anchor for the dropdown below it */}
          <div className="hidden md:block border-t border-white/[0.06]">
            <div className="max-w-[1600px] mx-auto px-12 flex items-center justify-center gap-10 lg:gap-14 py-4">
              {AUDIENCES.map(aud => (
                <div key={aud} className="relative" onMouseEnter={() => openMega(aud)}>
                  <Link to={audienceLink(aud)}
                    className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 pb-1 border-b block ${megaOpen === aud ? 'text-white border-white' : 'text-white/60 border-transparent hover:text-white'}`}>
                    {aud}
                  </Link>

                  {/* Dropdown anchored directly under THIS item */}
                  {hasDropdown(aud) && (
                    <div
                      className={`absolute left-0 top-full pt-3 transition-all duration-200 ${megaOpen === aud ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'}`}
                      onMouseEnter={() => openMega(aud)}
                    >
                      <div className="bg-black border border-white/10 px-6 py-5 min-w-[180px] flex flex-col gap-3">
                        {aud === 'Outlet'
                          ? OUTLET_LINKS.map(label => (
                              <Link key={label} to={outletLink(label)}
                                className="text-[12px] font-semibold text-white/70 hover:text-white transition-colors whitespace-nowrap">
                                {label}
                              </Link>
                            ))
                          : PRODUCT_TYPES.map(type => (
                              <Link key={type} to={subLink(aud, type)}
                                className="text-[12px] font-semibold text-white/70 hover:text-white transition-colors whitespace-nowrap">
                                {type}
                              </Link>
                            ))
                        }
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* SEARCH DROP */}
        <div className={`transition-all duration-300 overflow-hidden ${searchOpen ? 'max-h-16' : 'max-h-0'} bg-[#0a0a0a] border-b border-white/5`}>
          <form onSubmit={handleSearch} className="flex items-center gap-3 px-5 md:px-12 py-3.5 max-w-[1600px] mx-auto">
            <svg width="13" height="13" className="opacity-25 flex-shrink-0 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input ref={searchRef} type="text" placeholder="Search OBSIDIAN..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow bg-transparent text-[11px] uppercase tracking-widest outline-none text-white placeholder:text-white/25"
            />
            {searchQuery && <button type="button" onClick={() => setSearchQuery('')} className="text-white/25 hover:text-white text-lg leading-none">×</button>}
          </form>
        </div>

        {/* MOBILE FULL-SCREEN MENU */}
        {menuOpen && (
          <div className="md:hidden fixed inset-0 bg-black overflow-y-auto" style={{ zIndex: 1001 }}>
            <div className="flex justify-end px-6 pt-6 pb-2">
              <button type="button" onClick={() => setMenuOpen(false)} className="text-white p-1">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="px-6 pb-10">
              {AUDIENCES.map(aud => (
                <div key={aud} className="border-b border-white/10">
                  {aud === 'Collabs' ? (
                    <Link to={audienceLink(aud)} className="w-full flex justify-between items-center py-4 text-left">
                      <span className="text-[13px] font-bold uppercase tracking-[0.15em] text-white">{aud}</span>
                    </Link>
                  ) : (
                    <>
                      <button type="button" onClick={() => toggleMobileCategory(aud)}
                        className="w-full flex justify-between items-center py-4 text-left">
                        <span className="text-[13px] font-bold uppercase tracking-[0.15em] text-white">{aud}</span>
                        <span className={`text-white/40 transition-transform duration-300 ${mobileExpanded === aud ? 'rotate-90' : ''}`}>›</span>
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${mobileExpanded === aud ? 'max-h-96 pb-4' : 'max-h-0'}`}>
                        <div className="flex flex-col gap-3 pl-1">
                          {aud === 'Outlet'
                            ? OUTLET_LINKS.map(label => (
                                <Link key={label} to={outletLink(label)} className="text-[12px] text-white/60 hover:text-white transition-colors">
                                  {label}
                                </Link>
                              ))
                            : PRODUCT_TYPES.map(type => (
                                <Link key={type} to={subLink(aud, type)} className="text-[12px] text-white/60 hover:text-white transition-colors">
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

              <div className="mt-8">
                {isLoggedIn ? (
                  <div className="flex flex-col gap-4">
                    <Link to="/account" className="text-[14px] font-bold text-white underline underline-offset-4">My Account</Link>
                    <button type="button" onClick={handleLogout} className="text-left text-[14px] font-bold text-white/60">Logout</button>
                  </div>
                ) : (
                  <Link to="/login" className="text-[14px] font-bold text-white underline underline-offset-4">Login</Link>
                )}
              </div>

              <div className="mt-10 grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[9px] text-white/40 uppercase tracking-widest mb-2">Language</p>
                  <select className="w-full bg-transparent border border-white/20 text-white text-[12px] px-3 py-2.5 outline-none">
                    <option className="bg-black">English</option>
                  </select>
                </div>
                <div>
                  <p className="text-[9px] text-white/40 uppercase tracking-widest mb-2">Country/Region</p>
                  <select className="w-full bg-transparent border border-white/20 text-white text-[12px] px-3 py-2.5 outline-none">
                    <option className="bg-black">Pakistan (PKR Rs)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                {['x', 'facebook', 'youtube', 'pinterest', 'instagram', 'tiktok'].map(s => (
                  <a key={s} href="#" className="text-white/60 hover:text-white transition-colors">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <span className="text-[10px] font-bold uppercase">{s[0]}</span>
                    </div>
                  </a>
                ))}
              </div>

              <p className="text-[10px] text-white/30 mt-10">Copyright © 2026 OBSIDIAN</p>
            </div>
          </div>
        )}
      </header>

      {/* Fixed spacer \u2014 same height on every page since navbar no longer changes size on scroll/home */}
      <div className="h-24 md:h-32" />
    </>
  );
};

export default Navbar;