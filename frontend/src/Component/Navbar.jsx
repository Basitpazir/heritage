import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ cartCount, storeInfo = {} }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); setActiveSection(null); }, [location]);
  useEffect(() => { if (searchOpen && searchRef.current) searchRef.current.focus(); }, [searchOpen]);

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
  const navBg = isScrolled || !isHomePage
    ? 'bg-black/98 backdrop-blur-xl border-b border-white/5'
    : 'bg-transparent';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleSection = (s) => setActiveSection(prev => prev === s ? null : s);

  const categories = ['Fragrances', 'Accessories', 'Apparel', 'Tech', 'Lifestyle'];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[1000]">

        {/* ANNOUNCEMENT */}
        <div className="bg-white text-black h-8 flex items-center justify-center text-[9px] font-bold uppercase tracking-[0.5em]">
          <span className="hidden sm:block">Free worldwide shipping on orders over Rs. 50,000</span>
          <span className="sm:hidden">Free shipping over Rs. 50,000</span>
        </div>

        {/* MAIN NAV */}
        <nav className={`${navBg} transition-all duration-500 py-4 md:py-5`}>
          <div className="max-w-[1600px] mx-auto px-5 md:px-12 flex items-center justify-between">

            {/* LEFT — Desktop categories */}
            <div className="flex items-center gap-4 flex-1">
              <div className="hidden md:flex items-center gap-6 lg:gap-8">
                {categories.map(cat => (
                  <Link key={cat} to={`/products?category=${cat.toLowerCase()}`}
                    className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/50 hover:text-white transition-colors duration-300">
                    {cat}
                  </Link>
                ))}
              </div>

              {/* Mobile hamburger */}
              <button className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 text-white"
                onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }}>
                <span className={`block w-5 h-[1px] bg-current transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[3px]' : ''}`} />
                <span className={`block w-5 h-[1px] bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-[1px] bg-current transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[3px]' : ''}`} />
              </button>
            </div>

            {/* CENTER — OBSIDIAN Logo */}
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-white font-serif uppercase tracking-[0.5em] sm:tracking-[0.6em] text-lg sm:text-xl md:text-2xl leading-none">
                OBSIDIAN
              </h1>
            </Link>

            {/* RIGHT */}
            <div className="flex items-center justify-end gap-3 md:gap-6 flex-1">
              <div className="hidden lg:flex items-center gap-6">
                {isLoggedIn ? (
                  <>
                    <Link to="/account" className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/50 hover:text-white transition-colors">Account</Link>
                    <button onClick={handleLogout} className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/50 hover:text-white transition-colors">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/50 hover:text-white transition-colors">Sign In</Link>
                    <Link to="/signup" className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/50 hover:text-white transition-colors">Join</Link>
                  </>
                )}
              </div>

              <button onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }} className="text-white/50 hover:text-white transition-colors p-1">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </button>

              <Link to={isLoggedIn ? '/account' : '/login'} className="md:hidden text-white/50 hover:text-white transition-colors p-1">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              </Link>

              <Link to="/cart" className="relative text-white/50 hover:text-white transition-colors p-1">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-white text-black text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>
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

        {/* MOBILE MENU */}
        <div className={`md:hidden transition-all duration-500 overflow-hidden ${menuOpen ? 'max-h-[700px]' : 'max-h-0'} bg-black border-b border-white/5`}>
          <div className="flex flex-col px-6 py-3">
            {categories.map(cat => (
              <Link key={cat} to={`/products?category=${cat.toLowerCase()}`}
                className="text-[11px] font-bold uppercase tracking-[0.3em] py-3.5 border-b border-white/5 text-white/60 hover:text-white transition-colors">
                {cat}
              </Link>
            ))}
            <Link to="/" className="text-[11px] font-bold uppercase tracking-[0.3em] py-3.5 border-b border-white/5 text-white/60 hover:text-white">Home</Link>
            <Link to="/track-order" className="text-[11px] font-bold uppercase tracking-[0.3em] py-3.5 border-b border-white/5 text-white/60 hover:text-white">Track Order</Link>
            {isLoggedIn ? (
              <>
                <Link to="/account" className="text-[11px] font-bold uppercase tracking-[0.3em] py-3.5 border-b border-white/5 text-white/60 hover:text-white">My Account</Link>
                <button onClick={handleLogout} className="text-left text-[11px] font-bold uppercase tracking-[0.3em] py-3.5 border-b border-white/5 text-red-400/80">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-[11px] font-bold uppercase tracking-[0.3em] py-3.5 border-b border-white/5 text-white/60 hover:text-white">Sign In</Link>
                <Link to="/signup" className="text-[11px] font-bold uppercase tracking-[0.3em] py-3.5 border-b border-white/5 text-white/60 hover:text-white">Join</Link>
              </>
            )}
            <button onClick={() => toggleSection('shipping')}
              className="text-left text-[11px] font-bold uppercase tracking-[0.3em] py-3.5 border-b border-white/5 flex justify-between items-center text-white/60 hover:text-white">
              Shipping <span className={`text-xs transition-transform ${activeSection === 'shipping' ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {activeSection === 'shipping' && (
              <p className="text-[10px] leading-relaxed py-3 border-b border-white/5 text-white/30">
                {storeInfo.shippingPolicy || 'Free worldwide shipping on orders over Rs. 50,000.'}
              </p>
            )}
            <div className="py-4 space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">{storeInfo.phone || '+92 300 0000000'}</p>
              <p className="text-[9px] tracking-widest text-white/25">{storeInfo.email || 'contact@obsidian.com'}</p>
            </div>
          </div>
        </div>
      </header>

      <div className={isHomePage ? 'h-0' : 'h-20 md:h-28'} />
    </>
  );
};

export default Navbar;