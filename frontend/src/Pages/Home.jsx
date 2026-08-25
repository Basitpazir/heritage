import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = ({ heroImages = [], heroZoom = 100, products = [] }) => {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [trackId, setTrackId] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
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

  const saleProducts = products.filter(p => p.discount > 0).slice(0, 4);
  const newArrivals = products.slice(0, 4);

  const categories = [
    { name: 'Fragrances', desc: 'The scent of obsidian', img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80' },
    { name: 'Accessories', desc: 'Forged in darkness', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80' },
    { name: 'Apparel', desc: 'Wear the void', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80' },
    { name: 'Tech', desc: 'Black everything', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80' },
    { name: 'Lifestyle', desc: 'Live in black', img: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&q=80' },
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
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <p className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-[1em] mb-8">
            All Black. Everything.
          </p>
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-serif text-white uppercase tracking-[0.1em] mb-4 leading-none">
            OBSIDIAN
          </h1>
          <p className="text-[10px] sm:text-xs text-white/40 uppercase tracking-[0.5em] mb-12">
            The Black Lifestyle
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
            <Link to="/products"
              className="bg-white text-black px-10 sm:px-16 py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white/90 transition-all text-center">
              Shop Now
            </Link>
            <Link to="/products?category=fragrances"
              className="border border-white/30 text-white px-10 sm:px-16 py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:border-white hover:bg-white/5 transition-all text-center">
              Fragrances
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-bounce">
          <div className="w-[1px] h-10 bg-gradient-to-b from-white/40 to-transparent" />
        </div>

        {/* Hero dots */}
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

      {/* ── CATEGORIES GRID ── */}
      <section className="py-20 sm:py-32 px-4 sm:px-8 max-w-[1600px] mx-auto">
        <div className="flex justify-between items-end mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-serif uppercase tracking-widest">Shop by Category</h2>
          <Link to="/products" className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link key={cat.name} to={`/products?category=${cat.name.toLowerCase()}`}
              className="group relative aspect-[3/4] overflow-hidden bg-neutral-900">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <p className="text-[8px] text-white/50 uppercase tracking-widest mb-1">{cat.desc}</p>
                <h3 className="text-sm sm:text-base font-serif uppercase tracking-widest text-white">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED / NEW ARRIVALS ── */}
      {newArrivals.length > 0 && (
        <section className="py-20 sm:py-32 px-4 sm:px-8 max-w-[1600px] mx-auto border-t border-white/5">
          <div className="flex justify-between items-end mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-serif uppercase tracking-widest">New Arrivals</h2>
            <Link to="/products" className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map(product => {
              const discountedPrice = product.price - (product.price * ((product.discount || 0) / 100));
              return (
                <Link key={product._id} to={`/product/${product._id}`} className="group">
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 mb-4">
                    <img src={product.image} alt={product.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                    {product.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-white text-black text-[8px] font-black uppercase tracking-widest px-2 py-1">
                        -{product.discount}%
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-black text-[9px] font-black uppercase tracking-widest px-6 py-3 translate-y-4 group-hover:translate-y-0">
                        View
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[8px] text-white/30 uppercase tracking-widest mb-1">{product.brand || 'OBSIDIAN'}</p>
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-white mb-2 leading-tight">{product.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-serif text-white">Rs. {discountedPrice.toLocaleString()}</span>
                      {product.discount > 0 && <span className="text-[10px] text-white/30 line-through">Rs. {product.price.toLocaleString()}</span>}
                    </div>
                  </div>
                </Link>
              );
            })}
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