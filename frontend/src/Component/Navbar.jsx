import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ cartCount, brandColor = "#1c1917", storeInfo = {} }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); setActiveSection(null); }, [location]);
  useEffect(() => { if (searchOpen && searchRef.current) searchRef.current.focus(); }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const isHomePage = location.pathname === '/';
  const isDark = !isScrolled && isHomePage;
  const isLoggedIn = !!localStorage.getItem('token');

  const tc = isDark ? 'text-white' : 'text-stone-900';
  const bc = isDark ? 'border-white/10' : 'border-stone-100';
  const bg = isDark ? 'rgba(10,10,10,0.97)' : 'white';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleSection = (section) => setActiveSection(prev => prev === section ? null : section);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[1000] transition-all duration-700">

        {/* ANNOUNCEMENT BAR */}
        <div
          style={{ backgroundColor: isDark ? 'transparent' : brandColor }}
          className={`h-9 flex items-center justify-center transition-all duration-700 border-b uppercase tracking-[0.4em] text-[8px] font-bold ${
            isDark ? 'bg-white/5 border-white/10 text-white/70' : 'border-white/10 text-stone-300'
          }`}
        >
          <span className="hidden sm:block">Free express delivery on all orders over Rs. 50,000</span>
          <span className="sm:hidden">Free delivery over Rs. 50,000</span>
        </div>

        {/* MAIN NAVBAR */}
        <nav className={`transition-all duration-700 ${
          isScrolled || !isHomePage
            ? 'bg-white/95 backdrop-blur-2xl py-3 border-b border-stone-100 shadow-sm'
            : 'bg-transparent py-4 md:py-8'
        }`}>
          <div className="max-w-[1800px] mx-auto px-4 md:px-12 flex items-center justify-between gap-2">

            {/* LEFT — hamburger (mobile) | nav links (desktop) */}
            <div className="flex items-center gap-3 md:gap-10 flex-1">
              {/* Desktop nav */}
              <div className="hidden md:flex items-center gap-6">
                <Link to="/" className={`group relative text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${isDark ? 'text-white' : 'text-stone-900'}`}>
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-current transition-all duration-500 group-hover:w-full" />
                </Link>
                <Link to="/products" className={`group relative text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${isDark ? 'text-white' : 'text-stone-900'}`}>
                  Shop
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-current transition-all duration-500 group-hover:w-full" />
                </Link>
              </div>

              {/* Desktop search */}
              <form onSubmit={handleSearch} className="hidden xl:flex items-center relative group/search">
                <input type="text" placeholder="EXPLORE SCENTS" value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`bg-transparent border-b text-[8px] uppercase tracking-[0.2em] px-2 py-1 outline-none transition-all duration-700 ${
                    isDark ? 'border-white/20 text-white placeholder:text-white/30' : 'border-stone-200 text-stone-900'
                  } w-0 group-hover/search:w-32 focus:w-48 opacity-0 group-hover/search:opacity-100`}
                />
                <button type="submit" className={isDark ? 'text-white' : 'text-stone-900'}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </button>
              </form>

              {/* Mobile hamburger */}
              <button className={`md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 ${isDark ? 'text-white' : 'text-stone-900'}`}
                onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }}>
                <span className={`block w-5 h-[1.5px] bg-current transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
                <span className={`block w-5 h-[1.5px] bg-current transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
                <span className={`block w-5 h-[1.5px] bg-current transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
              </button>
            </div>

            {/* CENTER — Logo (fixed width so it never overlaps) */}
            <Link to="/" className="flex flex-col items-center group flex-shrink-0">
              <h1 className={`font-serif uppercase transition-all duration-700 leading-none text-center ${
                isDark
                  ? 'text-xl sm:text-3xl md:text-4xl text-white tracking-[0.3em] sm:tracking-[0.6em] md:tracking-[0.8em]'
                  : 'text-base sm:text-xl md:text-2xl text-stone-900 tracking-[0.3em] sm:tracking-[0.5em] md:tracking-[0.6em]'
              }`}>
                Heritage
              </h1>
              <p className={`text-[5px] sm:text-[6px] uppercase tracking-[0.6em] mt-1 ${isDark ? 'opacity-40 text-white' : 'opacity-100 text-stone-400'}`}>
                Signature
              </p>
            </Link>

            {/* RIGHT — icons */}
            <div className="flex items-center justify-end gap-2 md:gap-8 flex-1">
              {/* Desktop auth */}
              <div className={`hidden lg:flex items-center gap-5 border-r pr-8 ${isDark ? 'border-white/10' : 'border-stone-100'}`}>
                {isLoggedIn ? (
                  <>
                    <Link to="/account" className={`text-[9px] font-black uppercase tracking-[0.2em] hover:opacity-50 transition-all ${isDark ? 'text-white' : 'text-stone-500'}`}>Account</Link>
                    <button onClick={handleLogout} className={`text-[9px] font-black uppercase tracking-[0.2em] hover:opacity-50 transition-all ${isDark ? 'text-white' : 'text-stone-500'}`}>Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className={`text-[9px] font-black uppercase tracking-[0.2em] hover:opacity-50 transition-all ${isDark ? 'text-white' : 'text-stone-500'}`}>Sign In</Link>
                    <Link to="/signup" className={`text-[9px] font-black uppercase tracking-[0.2em] hover:opacity-50 transition-all ${isDark ? 'text-white' : 'text-stone-500'}`}>Register</Link>
                  </>
                )}
              </div>

              {/* Mobile: Search icon */}
              <button onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }}
                className={`md:hidden p-1 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </button>

              {/* Mobile: Account icon */}
              <Link to={isLoggedIn ? '/account' : '/login'}
                className={`md:hidden p-1 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              </Link>

              {/* Cart */}
              <Link to="/cart">
                <div style={{ backgroundColor: isDark ? 'transparent' : brandColor }}
                  className={`flex items-center gap-1.5 px-2.5 md:px-4 py-1.5 md:py-2 rounded-full border transition-all duration-500 hover:scale-105 ${
                    isDark ? 'border-white/20 text-white hover:bg-white hover:text-stone-900' : 'text-white shadow-lg border-transparent'
                  }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  <span className="text-[10px] font-bold tracking-widest">{cartCount}</span>
                </div>
              </Link>
            </div>
          </div>
        </nav>

        {/* MOBILE SEARCH BAR */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${searchOpen ? 'max-h-16' : 'max-h-0'}`}
          style={{ backgroundColor: isScrolled || !isHomePage ? 'white' : 'rgba(10,10,10,0.97)' }}>
          <form onSubmit={handleSearch} className={`flex items-center gap-3 px-5 py-3 border-t ${bc}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" className={`opacity-40 flex-shrink-0 ${tc}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input ref={searchRef} type="text" placeholder="Search scents..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className={`flex-grow bg-transparent text-[11px] uppercase tracking-widest outline-none ${tc} placeholder:opacity-40`}
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")} className={`opacity-40 text-lg leading-none ${tc}`}>×</button>
            )}
          </form>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        <div className={`md:hidden transition-all duration-400 overflow-hidden ${menuOpen ? 'max-h-[600px]' : 'max-h-0'}`}
          style={{ backgroundColor: bg }}>
          <div className={`flex flex-col px-6 py-2 border-t ${bc}`}>

            <Link to="/" className={`text-[11px] font-black uppercase tracking-[0.3em] py-3.5 border-b ${tc} ${bc}`}>Home</Link>
            <Link to="/products" className={`text-[11px] font-black uppercase tracking-[0.3em] py-3.5 border-b ${tc} ${bc}`}>Shop Collection</Link>
            <Link to="/track-order" className={`text-[11px] font-black uppercase tracking-[0.3em] py-3.5 border-b ${tc} ${bc}`}>Track Order</Link>

            {isLoggedIn ? (
              <>
                <Link to="/account" className={`text-[11px] font-black uppercase tracking-[0.3em] py-3.5 border-b ${tc} ${bc}`}>My Account</Link>
                <button onClick={handleLogout} className={`text-left text-[11px] font-black uppercase tracking-[0.3em] py-3.5 border-b text-red-500 ${bc}`}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className={`text-[11px] font-black uppercase tracking-[0.3em] py-3.5 border-b ${tc} ${bc}`}>Sign In</Link>
                <Link to="/signup" className={`text-[11px] font-black uppercase tracking-[0.3em] py-3.5 border-b ${tc} ${bc}`}>Register</Link>
              </>
            )}

            <button onClick={() => toggleSection('shipping')}
              className={`text-left text-[11px] font-black uppercase tracking-[0.3em] py-3.5 border-b flex justify-between items-center ${tc} ${bc}`}>
              Shipping & Delivery <span className={`text-xs transition-transform duration-300 ${activeSection === 'shipping' ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {activeSection === 'shipping' && (
              <p className={`text-[10px] leading-relaxed py-3 border-b opacity-60 ${tc} ${bc}`}>
                {storeInfo.shippingPolicy || 'Free shipping on all orders. Delivery in 3-5 business days.'}
              </p>
            )}

            <button onClick={() => toggleSection('returns')}
              className={`text-left text-[11px] font-black uppercase tracking-[0.3em] py-3.5 border-b flex justify-between items-center ${tc} ${bc}`}>
              Returns Policy <span className={`text-xs transition-transform duration-300 ${activeSection === 'returns' ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {activeSection === 'returns' && (
              <p className={`text-[10px] leading-relaxed py-3 border-b opacity-60 ${tc} ${bc}`}>
                {storeInfo.returnPolicy || 'Returns accepted within 14 days of delivery.'}
              </p>
            )}

            <div className="py-4 space-y-1.5">
              <p className={`text-[10px] font-bold uppercase tracking-widest ${tc}`}>{storeInfo.phone || '+92 300 1234567'}</p>
              <p className={`text-[9px] tracking-widest opacity-50 ${tc}`}>{storeInfo.email || 'contact@heritage.com'}</p>
              <p className={`text-[9px] uppercase tracking-widest opacity-50 ${tc}`}>{storeInfo.address || 'Pakistan'}</p>
            </div>
          </div>
        </div>

      </header>

      {/* SPACER */}
      <div className={isHomePage ? "h-0" : "h-20 md:h-36"} />
    </>
  );
};

export default Navbar;