import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API = `${import.meta.env.VITE_API_URL}/api`;

// Full-bleed product tile: photo fills the entire card edge-to-edge (no background, no padding —
// the finished branded photo IS the card). A grey/white outline traces around the tile border on
// hover, and the image does a subtle zoom. Falls back to a plain dark card if the image fails to load.
const CategoryTile = ({ cat, index }) => {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <Link
      to={`/products?type=${cat.name.toLowerCase()}`}
      className="collection-tile group relative aspect-square rounded-2xl overflow-hidden bg-[#0a0a0a] block animate-fade-up"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Full-bleed branded product photo — fills the entire card, no background gap */}
      {!imgFailed && (
        <img
          src={cat.img}
          alt={cat.name}
          onError={() => setImgFailed(true)}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      )}

      {/* Grey/white outline that traces around the card border on hover */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect x="1" y="1" width="98" height="98" rx="8" fill="none" stroke="white" strokeWidth="0.6"
          className="collection-tile-trace" pathLength="100" />
      </svg>

      {/* Subtle bottom scrim so the category label stays legible over any photo */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

      {/* Label overlaid at the bottom of the card, with an underline that extends on hover */}
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
        <h3 className="font-display text-sm sm:text-base font-semibold text-white">
          {cat.name}
        </h3>
        <span className="block mx-auto mt-1.5 h-px w-6 bg-white/40 transition-all duration-300 group-hover:w-12 group-hover:bg-white" />
      </div>
    </Link>
  );
};

const Home = ({ heroImages = [], heroZoom = 100, products = [] }) => {
  const [trackId, setTrackId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const dropsScrollRef = useRef(null);
  const reviewsScrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/blog?limit=3`)
      .then(r => r.json())
      .then(data => setBlogPosts(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => setBlogPosts([]));
  }, []);

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackId.trim()) navigate(`/track-order?id=${trackId.trim()}`);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); setFirstName(''); }
  };

  const scrollDrops = () => {}; // legacy no-op, kept for prop compatibility if referenced elsewhere

  const newArrivals = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
  const featuredProduct = products[0];

  // Product-only cutout images (isolated item, no background scenery) — transparent PNGs on white/black product-shot backgrounds
  const categories = [
    { name: 'Fragrances', img: '/images/collections/fragrances.jpg' },
    { name: 'Accessories', img: '/images/collections/accessories.jpg' },
    { name: 'Apparel', img: '/images/collections/apparel.jpg' },
    { name: 'Tech', img: '/images/collections/tech.jpg' },
    { name: 'Lifestyle', img: '/images/collections/lifestyle.jpg' },
    { name: 'Men', img: '/images/collections/men.jpg' },
  ];

  const reviews = [
    { name: 'Ahmed K.', handle: '@ahmedk_style', text: 'The quality is unmatched. Every piece feels engineered, not just designed.' },
    { name: 'Sara M.', handle: '@sara.m', text: 'OBSIDIAN fragrances last all day. Compliments every single time I wear them.' },
    { name: 'Hassan R.', handle: '@hassan.r', text: 'Fast shipping, premium packaging. This is how a black-label brand should feel.' },
    { name: 'Fatima Z.', handle: '@fatimaz', text: 'The tech accessories line is genuinely next level. Minimal, dark, functional.' },
    { name: 'Bilal A.', handle: '@bilal.a', text: 'Ordered twice already. The apparel fits like it was tailored for me.' },
  ];

  return (
    <div className="min-h-screen text-white font-body" style={{ backgroundColor: '#050506' }}>

      {/* ── HERO — dark, floating central card, vertical bar grid like the reference ── */}
      <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-4 sm:px-8 pt-24 pb-16">
        {/* Ambient background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-white/[0.03] blur-[120px] glow-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] rounded-full bg-white/[0.02] blur-[100px] glow-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Vertical bar grid backdrop — faint product imagery behind glass bars, with animated glowing outlines */}
        <div className="absolute inset-0 flex items-end justify-center gap-2 sm:gap-3 px-4 sm:px-10 opacity-70">
          {[
            { h: 65, img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80&sat=-100' },
            { h: 45, img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&q=80&sat=-100' },
            { h: 80, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80&sat=-100' },
            { h: 30, img: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80&sat=-100' },
            { h: 55, img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80&sat=-100' },
            { h: 95, img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80&sat=-100' },
            { h: 40, img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80&sat=-100' },
            { h: 70, img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&q=80&sat=-100' },
            { h: 50, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80&sat=-100' },
            { h: 85, img: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80&sat=-100' },
            { h: 35, img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80&sat=-100' },
            { h: 60, img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80&sat=-100' },
          ].map((bar, i) => (
            <div key={i} className="hero-bar flex-1 relative rounded-t-2xl overflow-hidden"
              style={{ height: `${bar.h}%`, maxWidth: '90px', animationDelay: `${i * 0.3}s` }}>
              <img src={bar.img} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="w-full h-full object-cover grayscale opacity-25" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/80" />
              <div className="hero-bar-outline absolute inset-0 rounded-t-2xl" />
            </div>
          ))}
        </div>

        {/* Central floating content card */}
        <div className="relative z-10 max-w-2xl w-full text-center animate-fade-up">
          <p className="font-display text-[9px] sm:text-[10px] text-white/60 uppercase tracking-[0.5em] mb-6">
            Crafted in Darkness
          </p>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight leading-[1.1] mb-6">
            Built for<br />Real Life.<br /><span className="text-white/40">Not Just Style.</span>
          </h1>
          <p className="text-sm sm:text-base text-white/60 mb-10 max-w-md mx-auto">
            Track your style, elevate your presence — with precision and control.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/products"
              className="bg-white text-black px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-white/90 transition-all duration-300">
              Explore the Vault
            </Link>
            <Link to="/products?onSale=true"
              className="border border-white/25 text-white/80 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:border-white/50 hover:text-white transition-all duration-300">
              View Outlet
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCT CARD — glass panel style like the Logitech reference ── */}
      {featuredProduct && (
        <section className="px-4 sm:px-8 -mt-8 sm:-mt-16 relative z-20 pb-20">
          <div className="max-w-5xl mx-auto rounded-[2rem] p-1 bg-gradient-to-br from-white/10 via-white/5 to-transparent animate-scale-in">
            <div className="rounded-[1.85rem] overflow-hidden relative" style={{ backgroundColor: '#101012' }}>
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="md:col-span-2 relative aspect-[16/10] md:aspect-auto">
                  <img src={featuredProduct.image} alt={featuredProduct.name}
                    className="w-full h-full object-cover grayscale contrast-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
                    <p className="font-display text-lg sm:text-2xl font-bold uppercase tracking-wide text-white">{featuredProduct.name}</p>
                  </div>
                </div>
                <div className="p-6 sm:p-8 flex flex-col justify-center">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">{featuredProduct.brand || 'OBSIDIAN'}</p>
                  <p className="text-sm text-white/60 mb-6 line-clamp-3">{featuredProduct.details || 'Precision-crafted for those who demand more from every detail.'}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl font-bold text-white">Rs. {featuredProduct.price?.toLocaleString()}</span>
                    <Link to={`/product/${featuredProduct._id}`}
                      className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── JUST DROPPED — 6 items, 3-per-row grid, centered with breathing room (not edge-to-edge) ── */}
      {newArrivals.length > 0 && (
        <section className="py-16 sm:py-24 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 flex justify-between items-end mb-10">
            <div>
              <p className="text-[9px] text-white/40 uppercase tracking-[0.5em] mb-3">New This Week</p>
              <h2 className="font-display text-2xl sm:text-4xl font-bold uppercase tracking-tight">Just Dropped</h2>
            </div>
            <Link to="/products" className="hidden sm:block text-[9px] font-bold uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors">
              View All →
            </Link>
          </div>

          <div className="max-w-5xl mx-auto px-6 sm:px-8 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            {newArrivals.map((product, i) => {
              const discountedPrice = product.price - (product.price * ((product.discount || 0) / 100));
              return (
                <div key={product._id} className="relative animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                  <Link to={`/product/${product._id}`} className="group block card-lift rounded-3xl overflow-hidden" style={{ backgroundColor: '#101012' }}>
                    <div className="relative aspect-square overflow-hidden">
                      <img src={product.image} alt={product.name}
                        className="w-full h-full object-cover grayscale contrast-110 group-hover:scale-105 transition-all duration-700" />
                      {product.discount > 0 && (
                        <div className="absolute top-3 left-3 bg-white text-black text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                          -{product.discount}%
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-[8px] text-white/40 uppercase tracking-widest mb-1">{product.brand || 'OBSIDIAN'}</p>
                      <h3 className="text-xs font-bold uppercase tracking-wide text-white mb-2 leading-tight">{product.name}</h3>
                      <div className="flex items-center gap-3">
                        <span className="font-display text-sm font-bold text-white">Rs. {discountedPrice.toLocaleString()}</span>
                        {product.discount > 0 && <span className="text-[10px] text-white/40 line-through">Rs. {product.price.toLocaleString()}</span>}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── EXPLORE COLLECTIONS — 6 tiles in 2 fixed rows, isolated product shots with 3D tilt + float ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-[1600px] mx-auto border-t border-white/5">
        <p className="text-[9px] text-white/40 uppercase tracking-[0.5em] mb-3 animate-fade-in">The Vault</p>
        <h2 className="font-display text-2xl sm:text-4xl font-bold uppercase tracking-tight mb-12 animate-fade-in">Explore Collections</h2>
        <div className="grid grid-cols-3 grid-rows-2 gap-3 sm:gap-5">
          {categories.map((cat, i) => (
            <CategoryTile key={cat.name} cat={cat} index={i} />
          ))}
        </div>
      </section>

      {/* ── CAMPAIGN BANNER — full-bleed editorial hero, serif italic headline + CTA ── */}
      <section className="relative h-[110vh] min-h-[480px] sm:min-h-[600px] overflow-hidden border-t border-white/5 animate-fade-in">
        <img
          src="/images/collections/shadesofobsidian.png"
          alt="Shades of OBSIDIAN"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <p className="text-[9px] text-white/60 uppercase tracking-[0.5em] mb-4">The Essence</p>
          <h2 className="font-display text-4xl sm:text-6xl font-bold uppercase tracking-tight leading-none mb-1">Shades</h2>
          <p className="font-serif italic text-3xl sm:text-5xl text-white/80 mb-8">of OBSIDIAN</p>
          <Link to="/products" className="border border-white/60 px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.3em] text-white hover:bg-white hover:text-black transition-all">
            Discover The Collection
          </Link>
        </div>
      </section>

      {/* ── FEATURED EDITORIAL — journal-style 3-card promo grid ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-[1600px] mx-auto border-t border-white/5">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-[9px] text-white/40 uppercase tracking-[0.5em] mb-3 animate-fade-in">The Journal</p>
            <h2 className="font-display text-2xl sm:text-4xl font-bold uppercase tracking-tight animate-fade-in">Latest Stories</h2>
          </div>
          <Link to="/blog" className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors">
            All Articles →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'How to Build the Perfect All-Black Wardrobe',
              excerpt: 'Monochrome dressing looks effortless but rarely is. Here\'s how to layer textures, tones, and silhouettes so an all-black fit reads as intentional, not flat.',
              img: '/images/collections/blog1.jpg',
            },
            {
              title: 'Inside the OBSIDIAN Design Language',
              excerpt: 'Every stitch, silhouette, and finish follows the same rule: restraint over noise. A look at the principles behind how we design.',
              img: '/images/collections/blog2.jpg',
            },
            {
              title: 'The Art of Wearing Less, Better',
              excerpt: 'A smaller wardrobe of higher quality pieces beats a closet full of compromises. Why fewer, sharper choices are the real luxury.',
              img: '/images/collections/blog3.jpg',
            },
          ].map((story, i) => (
            <div key={story.title} className="group rounded-3xl overflow-hidden card-lift animate-fade-up" style={{ backgroundColor: '#101012', animationDelay: `${i * 0.1}s` }}>
              <div className="aspect-[4/3] overflow-hidden">
                <img src={story.img} alt={story.title} className="w-full h-full object-cover grayscale group-hover:scale-105 transition-all duration-700" />
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-white mb-2 leading-snug">{story.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed line-clamp-2">{story.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── REVIEWS — dual-column scrolling testimonial layout ── */}
      <section className="py-16 sm:py-24 border-t border-white/5 rounded-t-[3rem] sm:rounded-t-[4rem]" style={{ backgroundColor: '#101012' }}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="animate-slide-in-left">
            <h2 className="font-display text-2xl sm:text-4xl font-bold uppercase tracking-tight leading-tight mb-4">
              Don't take our word for it, look at their results
            </h2>
            <p className="text-sm text-white/50 mb-8">
              Scroll through to see how OBSIDIAN fits into their everyday.
            </p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/90 transition-all">
              Start Shopping
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <div className="flex items-center gap-6 mt-10">
              <div>
                <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Reviews</p>
                <p className="font-display text-2xl font-bold text-white">500+</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Rated Excellent</p>
                <p className="text-sm text-white">★★★★★ 5/5</p>
              </div>
            </div>
          </div>

          <div ref={reviewsScrollRef} className="flex flex-col gap-4 max-h-[280px] overflow-y-auto pr-2 scrollbar-hide animate-slide-in-right">
            {reviews.map((r, i) => (
              <div key={i} className="rounded-2xl p-5 border border-white/10" style={{ backgroundColor: '#050506' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-display text-xs font-bold">{r.name[0]}</div>
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">{r.name}</p>
                    <p className="text-[10px] text-white/40">{r.handle}</p>
                  </div>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG POSTS ── */}
      {blogPosts.length > 0 && (
        <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-[1600px] mx-auto border-t border-white/5">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-[9px] text-white/40 uppercase tracking-[0.5em] mb-3">The Journal</p>
              <h2 className="font-display text-2xl sm:text-4xl font-bold uppercase tracking-tight">Latest Posts</h2>
            </div>
            <Link to="/blog" className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors">
              All Articles →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post, i) => (
              <Link key={post._id} to={`/blog/${post.slug}`} className="group rounded-3xl overflow-hidden card-lift animate-fade-up" style={{ backgroundColor: '#101012', animationDelay: `${i * 0.1}s` }}>
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover grayscale group-hover:scale-105 transition-all duration-700" />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-white mb-2 leading-snug group-hover:underline">{post.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── SIGNUP — rounded card, glow accent ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-t border-white/5">
        <div className="max-w-4xl mx-auto rounded-[2rem] p-8 sm:p-14 text-center relative overflow-hidden animate-scale-in" style={{ backgroundColor: '#101012' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-white/[0.04] blur-[80px] glow-pulse" />
          <div className="relative z-10">
            <p className="text-[9px] text-white/40 uppercase tracking-[0.5em] mb-4">Join the Vault</p>
            <h2 className="font-display text-2xl sm:text-4xl font-bold uppercase tracking-tight mb-4">Get 10% Off Your First Order</h2>
            <p className="text-sm text-white/50 mb-8 max-w-md mx-auto">
              Exclusive early access to drops, restocks, and members-only offers. No spam. Just black.
            </p>
            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="flex-grow bg-white/5 border border-white/15 rounded-full px-6 py-3.5 text-sm outline-none focus:border-white/40 text-white placeholder:text-white/30" />
                <button type="submit" className="relative overflow-hidden bg-white text-black px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/90 transition-all whitespace-nowrap">
                  <span className="relative z-10">Subscribe</span>
                  <span className="absolute inset-0 animate-shimmer" />
                </button>
              </form>
            ) : (
              <p className="text-sm text-white/70">Welcome to the inner circle. Check your email for your code.</p>
            )}
          </div>
        </div>
      </section>

      {/* ── TRACK ORDER ── */}
      <section className="py-14 border-t border-white/5 px-4 sm:px-8">
        <div className="max-w-xl mx-auto rounded-2xl p-6 border border-white/10" style={{ backgroundColor: '#101012' }}>
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-shrink-0">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Track Order</p>
            </div>
            <div className="relative flex-grow w-full">
              <input type="text" placeholder="ORD-123456789"
                className="w-full bg-transparent border-b border-white/15 py-2 text-sm outline-none focus:border-white/40 text-white placeholder:text-white/25"
                value={trackId} onChange={(e) => setTrackId(e.target.value)} />
              <button type="submit" className="absolute right-0 bottom-2 text-white/40 hover:text-white transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </button>
            </div>
          </form>
        </div>
      </section>

    </div>
  );
};

export default Home;