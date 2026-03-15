import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = ({ heroImages = [], heroZoom = 100, products = [] }) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [trackId, setTrackId] = useState("");
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages]);

  const saleProducts = products.filter(p => p.discount > 0).slice(0, 4);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(""); }
  };

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackId.trim()) navigate(`/track-order?id=${trackId.trim()}`);
  };

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* HERO */}
      <div className="relative h-screen w-full overflow-hidden bg-black">
        {heroImages.map((img, index) => (
          <div key={index} className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{ backgroundImage: `url(${img})`, opacity: index === currentHeroIndex ? 1 : 0, backgroundSize: 'cover', backgroundPosition: 'center', transform: `scale(${heroZoom / 100})`, transformOrigin: 'center center' }}
          />
        ))}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <p className="text-[9px] sm:text-[10px] text-white/80 uppercase tracking-[0.6em] mb-4 sm:mb-6 animate-pulse">
            The Art of Olfactory
          </p>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif text-white uppercase tracking-widest mb-8 leading-tight">
            The Heritage <br /> Collection
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
            <Link to="/products" className="bg-white text-stone-900 px-8 sm:px-12 py-4 sm:py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-stone-100 transition-all shadow-2xl text-center">
              Shop The Vault
            </Link>
            <Link to="/products" className="border border-white/30 text-white px-8 sm:px-12 py-4 sm:py-5 text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-sm hover:bg-white hover:text-stone-900 transition-all text-center">
              Discover Scent Profile
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-white/40 text-[8px] uppercase tracking-[0.4em]">Scroll</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-white/60 to-transparent" />
        </div>
      </div>

      {/* TRACK ORDER */}
      <section className="py-12 sm:py-16 bg-stone-50 border-b border-stone-100">
        <div className="max-w-xl mx-auto px-6">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-900">Track Order</p>
              <p className="text-[8px] uppercase tracking-widest text-stone-400 mt-1">Enter your reference</p>
            </div>
            <div className="relative flex-grow w-full">
              <input type="text" placeholder="ORD-123456789"
                className="w-full bg-transparent border-b border-stone-300 p-3 text-[11px] outline-none focus:border-stone-900 uppercase tracking-[0.2em] transition-colors"
                value={trackId} onChange={(e) => setTrackId(e.target.value)} />
              <button type="submit" className="absolute right-0 bottom-3 text-stone-400 hover:text-stone-900">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* MID TEASER */}
      <div className="py-16 sm:py-32 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-lg sm:text-2xl font-serif text-stone-900 uppercase tracking-widest mb-8 leading-relaxed">
          Crafted in the shadows of the old world, <br className="hidden sm:block" /> designed for the modern spirit.
        </h2>
        <div className="w-12 h-[1px] bg-stone-200 mx-auto" />
      </div>

      {/* SALE SECTION */}
      {saleProducts.length > 0 && (
        <div className="pb-16 sm:pb-32 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8 border-b border-stone-100 pb-6">
              <div>
                <p className="text-[9px] text-amber-600 font-bold uppercase tracking-[0.4em] mb-2">Limited Opportunities</p>
                <h3 className="text-xl sm:text-3xl font-serif text-stone-900 uppercase tracking-widest">The Sale Vault</h3>
              </div>
              <Link to="/products" className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors whitespace-nowrap ml-4">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              {saleProducts.map((product) => {
                const discountedPrice = product.price - (product.price * (product.discount / 100));
                return (
                  <Link key={product._id} to={`/product/${product._id}`} className="group">
                    <div className="relative aspect-[3/4] overflow-hidden bg-stone-50 border border-stone-100 mb-3 sm:mb-6">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute top-2 left-2">
                        <span className="bg-stone-900 text-white text-[7px] font-black uppercase tracking-widest px-2 py-0.5 shadow-lg">
                          {product.discount}% OFF
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] text-stone-400 uppercase tracking-widest mb-1">{product.brand}</p>
                      <h4 className="text-[9px] sm:text-[11px] font-serif text-stone-900 uppercase tracking-widest mb-2 leading-tight">{product.name}</h4>
                      <div className="flex justify-center gap-2 items-center flex-wrap">
                        <span className="text-xs font-serif text-stone-900">Rs.{discountedPrice.toLocaleString()}</span>
                        <span className="text-[9px] text-stone-300 line-through">Rs.{product.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* NEWSLETTER */}
      <div className="bg-stone-50 py-16 sm:py-32 px-6 border-t border-stone-100">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] text-stone-400 uppercase tracking-[0.5em] mb-4">The Inner Circle</p>
          <h3 className="text-2xl sm:text-3xl font-serif text-stone-900 uppercase tracking-widest mb-6">Join the Heritage Registry</h3>
          <p className="text-xs text-stone-500 uppercase tracking-widest leading-relaxed mb-8">
            Receive early access to private reserves, new olfactory creations, and exclusive events.
          </p>
          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 items-stretch">
              <input type="email" placeholder="EMAIL ADDRESS" value={email}
                onChange={(e) => setEmail(e.target.value)} required
                className="w-full bg-white border border-stone-200 px-6 py-4 text-[10px] uppercase tracking-widest outline-none focus:border-stone-900"
              />
              <button type="submit" className="bg-stone-900 text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all whitespace-nowrap">
                Apply
              </button>
            </form>
          ) : (
            <div className="bg-white border border-stone-200 p-8">
              <p className="text-[10px] font-bold text-stone-900 uppercase tracking-[0.3em]">Welcome to the Registry</p>
              <p className="text-[9px] text-stone-400 uppercase tracking-widest mt-2">A confirmation has been sent to your correspondence.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;