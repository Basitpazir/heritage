import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = ({ heroImages = [], heroZoom = 100, products = [] }) => {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [trackId, setTrackId] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const dropsScrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex(prev => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages]);

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackId.trim()) navigate(`/track-order?id=${trackId.trim()}`);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  const scrollDrops = (dir) => {
    if (!dropsScrollRef.current) return;
    dropsScrollRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
  };

  const saleProducts = products.filter(p => p.discount > 0).slice(0, 4);
  const newArrivals = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);

  // Category grid — mirrors "Explore Collections" tile treatment
  const categories = [
    { name: 'Fragrances', img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80' },
    { name: 'Accessories', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80' },
    { name: 'Apparel', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80' },
    { name: 'Tech', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80' },
    { name: 'Lifestyle', img: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&q=80' },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans">

      {/* ── HERO ── */}
      <div className="relative h-screen w-full overflow-hidden bg-black">
        {heroImages.length > 0 ? heroImages.map((img, i) => (
          <div key={i} className="absolute inset-0 transition-opacity duration-[2000ms]"
            style={{ opacity: i === currentHeroIndex ? 1 : 0, backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center', transform: `scale(${heroZoom / 100})`, transformOrigin: 'center' }} />
        )) : (
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/50" />

        <div className="relative h-full flex flex-col items-center justify-end pb-20 sm:pb-28 text-center px-6">
          <p className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-[1em] mb-6">
            All Black. Everything.
          </p>

          <h1 className="leading-[0.95] mb-10">
            <span className="block text-6xl sm:text-8xl md:text-[9rem] font-serif text-white tracking-tight">
              Worn in
            </span>
            <span className="block text-5xl sm:text-7xl md:text-8xl font-serif italic text-white/70 -mt-2 sm:-mt-4">
              the dark
            </span>
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-4 sm:px-0">
            <Link to="/products?category=apparel"
              className="border border-white/40 text-white px-12 sm:px-14 py-4 text-[10px] font-bold uppercase tracking-[0.35em] hover:bg-white hover:text-black transition-all duration-300 text-center">
              Shop Apparel
            </Link>
            <Link to="/products?category=fragrances"
              className="border border-white/40 text-white px-12 sm:px-14 py-4 text-[10px] font-bold uppercase tracking-[0.35em] hover:bg-white hover:text-black transition-all duration-300 text-center">
              Shop Fragrances
            </Link>
          </div>
        </div>

        {heroImages.length > 1 && (
          <div className="absolute bottom-8 right-8 flex gap-2">
            {heroImages.map((_, i) => (
              <button key={i} onClick={() => setCurrentHeroIndex(i)}
                className={`w-1 h-1 rounded-full transition-all ${i === currentHeroIndex ? 'bg-white w-6' : 'bg-white/30'}`} />
            ))}
          </div>
        )}
      </div>

      {/* ── MARQUEE ── */}
      <div className="bg-white text-black py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="text-[9px] font-black uppercase tracking-[0.5em] mx-8">
              Fragrances · Accessories · Apparel · Tech · Lifestyle · New Arrivals ·
            </span>
          ))}
        </div>
      </div>

      {/* ── EXPLORE COLLECTIONS (category tile grid) ── */}
      <section className="py-20 sm:py-32 px-4 sm:px-8 max-w-[1600px] mx-auto">
        <p className="text-[9px] text-white/30 uppercase tracking-[0.6em] mb-3">The Vault</p>
        <h2 className="text-3xl sm:text-5xl mb-12 sm:mb-16">
          <span className="font-serif text-white">Explore </span>
          <span className="font-serif italic text-white/50">Collections</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link key={cat.name} to={`/products?category=${cat.name.toLowerCase()}`}
              className="group relative aspect-[3/4] overflow-hidden bg-neutral-100">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <h3 className="text-sm sm:text-base font-bold uppercase tracking-widest text-white border-b border-white/40 inline-block pb-1">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── LIFESTYLE BANNER ── */}
      <section className="relative h-[70vh] sm:h-[85vh] w-full overflow-hidden">
        <img
          src={heroImages[1] || heroImages[0] || 'https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?w=1600&q=80'}
          alt="OBSIDIAN Lifestyle"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <p className="text-[9px] text-white/50 uppercase tracking-[0.6em] mb-4">The Essence</p>
          <h2 className="leading-[0.95] mb-8">
            <span className="block text-4xl sm:text-6xl md:text-7xl font-serif text-white">Shades</span>
            <span className="block text-4xl sm:text-6xl md:text-7xl font-serif italic text-white/60 -mt-1 sm:-mt-2">of OBSIDIAN</span>
          </h2>
          <Link to="/products"
            className="border border-white/50 text-white px-10 py-4 text-[10px] font-bold uppercase tracking-[0.35em] hover:bg-white hover:text-black transition-all duration-300">
            Discover the Collection
          </Link>
        </div>
      </section>

      {/* ── JUST DROPPED (horizontal scroll) ── */}
      {newArrivals.length > 0 && (
        <section className="py-20 sm:py-32 border-t border-white/5">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-8 flex justify-between items-end mb-10 sm:mb-14">
            <div>
              <p className="text-[9px] text-white/30 uppercase tracking-[0.6em] mb-3">New This Week</p>
              <h2 className="text-3xl sm:text-5xl">
                <span className="font-serif text-white">Just </span>
                <span className="font-serif italic text-white/50">Dropped</span>
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <Link to="/products" className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors mr-4">
                View All →
              </Link>
              <button onClick={() => scrollDrops(-1)} className="w-10 h-10 border border-white/10 hover:border-white/30 flex items-center justify-center text-white/50 hover:text-white transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button onClick={() => scrollDrops(1)} className="w-10 h-10 border border-white/10 hover:border-white/30 flex items-center justify-center text-white/50 hover:text-white transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>

          <div ref={dropsScrollRef} className="drops-scroll flex gap-4 sm:gap-6 overflow-x-auto px-4 sm:px-8 pb-4 snap-x snap-mandatory">
            {newArrivals.map(product => {
              const discountedPrice = product.price - (product.price * ((product.discount || 0) / 100));
              return (
                <Link key={product._id} to={`/product/${product._id}`}
                  className="group flex-shrink-0 w-[220px] sm:w-[300px] snap-start">
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 mb-4">
                    <img src={product.image} alt={product.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                    {product.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-white text-black text-[8px] font-black uppercase tracking-widest px-2 py-1">
                        -{product.discount}%
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[8px] text-white/30 uppercase tracking-widest mb-1">{product.brand || 'OBSIDIAN'}</p>
                    <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-white mb-2 leading-tight">{product.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-serif text-white">Rs. {discountedPrice.toLocaleString()}</span>
                      {product.discount > 0 && <span className="text-[10px] text-white/30 line-through">Rs. {product.price.toLocaleString()}</span>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="sm:hidden px-4 mt-6">
            <Link to="/products" className="block text-center border border-white/10 py-3 text-[9px] font-bold uppercase tracking-widest text-white/40 hover:text-white hover:border-white/30 transition-all">
              View All New Arrivals
            </Link>
          </div>
        </section>
      )}

      {/* ── SALE VAULT ── */}
      {saleProducts.length > 0 && (
        <section className="py-20 sm:py-32 px-4 sm:px-8 max-w-[1600px] mx-auto border-t border-white/5">
          <div className="flex justify-between items-end mb-12 sm:mb-16">
            <div>
              <p className="text-[9px] text-white/30 uppercase tracking-[0.5em] mb-3">Limited Time</p>
              <h2 className="text-2xl sm:text-4xl font-serif uppercase tracking-widest">Sale</h2>
            </div>
            <Link to="/products" className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {saleProducts.map(product => {
              const discountedPrice = product.price - (product.price * (product.discount / 100));
              return (
                <Link key={product._id} to={`/product/${product._id}`} className="group">
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 mb-4">
                    <img src={product.image} alt={product.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                    <div className="absolute top-3 left-3 bg-white text-black text-[8px] font-black uppercase tracking-widest px-2 py-1">
                      -{product.discount}%
                    </div>
                  </div>
                  <div>
                    <p className="text-[8px] text-white/30 uppercase tracking-widest mb-1">{product.brand || 'OBSIDIAN'}</p>
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-white mb-2">{product.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-serif text-white">Rs. {discountedPrice.toLocaleString()}</span>
                      <span className="text-[10px] text-white/30 line-through">Rs. {product.price.toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── BRAND STATEMENT ── */}
      <section className="py-24 sm:py-40 px-6 text-center border-t border-white/5">
        <p className="text-[9px] text-white/30 uppercase tracking-[0.8em] mb-8">The Philosophy</p>
        <h2 className="text-3xl sm:text-5xl md:text-7xl font-serif uppercase tracking-wider leading-tight max-w-5xl mx-auto text-white/90">
          All Black. <br />Everything.
        </h2>
        <p className="text-xs sm:text-sm text-white/30 uppercase tracking-[0.3em] max-w-xl mx-auto mt-8 leading-loose">
          OBSIDIAN is more than a brand. It is a way of life. Minimalist. Powerful. Uncompromising.
        </p>
        <Link to="/products" className="inline-block mt-12 border border-white/20 text-white px-12 py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all duration-300">
          Explore The Collection
        </Link>
      </section>

      {/* ── TRACK ORDER ── */}
      <section className="py-16 border-t border-white/5 px-6">
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
            <div className="flex-shrink-0">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white">Track Order</p>
              <p className="text-[8px] uppercase tracking-widest text-white/30 mt-1">Enter reference ID</p>
            </div>
            <div className="relative flex-grow w-full">
              <input type="text" placeholder="ORD-123456789"
                className="w-full bg-transparent border-b border-white/10 p-3 text-[11px] outline-none focus:border-white/40 uppercase tracking-[0.2em] transition-colors text-white placeholder:text-white/20"
                value={trackId} onChange={(e) => setTrackId(e.target.value)} />
              <button type="submit" className="absolute right-0 bottom-3 text-white/30 hover:text-white transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="py-24 sm:py-32 px-6 border-t border-white/5 text-center">
        <p className="text-[9px] text-white/30 uppercase tracking-[0.8em] mb-6">Inner Circle</p>
        <h3 className="text-2xl sm:text-4xl font-serif uppercase tracking-widest mb-4 text-white">Join OBSIDIAN</h3>
        <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] mb-10 leading-loose max-w-md mx-auto">
          Early access. Exclusive drops. The darkest lifestyle.
        </p>
        {!subscribed ? (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
            <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="flex-grow bg-white/5 border border-white/10 px-6 py-4 text-[10px] uppercase tracking-widest outline-none focus:border-white/30 text-white placeholder:text-white/20"
            />
            <button type="submit" className="bg-white text-black px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/90 transition-all">
              Join
            </button>
          </form>
        ) : (
          <p className="text-[10px] text-white/40 uppercase tracking-widest">Welcome to the inner circle.</p>
        )}
      </section>

    </div>
  );
};

export default Home;