import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const API = `${import.meta.env.VITE_API_URL}/api`;

const ProductDetails = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [newReview, setNewReview] = useState({ user: '', email: '', comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    setLoading(true);
    setProduct(null);
    fetch(`${API}/products/${id}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`Request failed (${r.status})`);
        const data = await r.json();
        // Guard against a malformed/incomplete response (e.g. an error object
        // that still parses as JSON) — only accept it if it actually looks
        // like a product, so we never render Rs. NaN / a blank image.
        if (!data || typeof data !== 'object' || !data._id || typeof data.price !== 'number') {
          throw new Error('Malformed product response');
        }
        return data;
      })
      .then(data => { setProduct(data); setLoading(false); })
      .catch(() => { setProduct(null); setLoading(false); });
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-[10px] uppercase tracking-[0.8em] text-white/20 animate-pulse">Loading...</p>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-[10px] uppercase tracking-widest text-white/30">Product not found.</p>
      <p className="text-[9px] uppercase tracking-widest text-white/15 max-w-sm">
        This item may be unavailable right now, or the store isn't fully connected yet.
      </p>
      <Link to="/products" className="mt-2 border border-white/15 text-white/50 hover:text-white hover:border-white/40 px-5 py-2.5 text-[9px] font-bold uppercase tracking-widest transition-all">
        Back to Collection
      </Link>
    </div>
  );

  const avgRating = product.reviews?.length > 0
    ? (product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length).toFixed(1)
    : null;

  const discountedPrice = product.price - (product.price * ((product.discount || 0) / 100));
  const remaining = (product.stock || 0) - (product.sold || 0);

  const handlePostReview = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/products/${id}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newReview, rating })
    });
    const data = await res.json();
    if (res.ok) {
      setProduct(prev => ({ ...prev, reviews: data.reviews }));
      setNewReview({ user: '', email: '', comment: '' });
      setRating(5);
      setShowReviewForm(false);
      alert('Review posted!');
    }
  };

  const inp = "w-full bg-transparent border-b border-white/10 py-3 focus:border-white/30 outline-none text-white text-sm placeholder:text-white/15 transition-all";

  return (
    <div className="min-h-screen bg-black text-white font-sans">

      {/* Breadcrumb */}
      <div className="border-b border-white/5 px-4 sm:px-8 lg:px-12 py-4 overflow-x-auto">
        <div className="max-w-[1600px] mx-auto flex gap-3 text-[8px] uppercase tracking-widest text-white/20 whitespace-nowrap">
          <Link to="/" className="hover:text-white/40 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-white/40 transition-colors">Collection</Link>
          <span>/</span>
          <span className="text-white/40">{product.name}</span>
        </div>
      </div>

      {/* Product */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 py-10 sm:py-16">

        {/* Image */}
        <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden max-w-sm mx-auto w-full lg:max-w-none">
          <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
          {product.discount > 0 && (
            <div className="absolute top-4 left-4 bg-white text-black text-[9px] font-black uppercase tracking-widest px-3 py-1.5">
              -{product.discount}%
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[9px] uppercase tracking-[0.4em] text-white/30">{product.brand || 'OBSIDIAN'}</p>
            {avgRating ? (
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-[10px]">{'★'.repeat(Math.round(avgRating))}</span>
                <span className="text-[9px] text-white/25">({avgRating})</span>
              </div>
            ) : (
              <span className="text-[8px] text-white/20 uppercase tracking-widest border border-white/10 px-2 py-0.5">New</span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif uppercase tracking-widest mb-6 leading-tight">{product.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-xl sm:text-2xl font-serif">Rs. {discountedPrice.toLocaleString()}</span>
            {product.discount > 0 && <span className="text-white/20 line-through text-sm">Rs. {product.price.toLocaleString()}</span>}
          </div>

          <div className="mb-8">
            {remaining > 0 ? (
              <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                In Stock {remaining < 10 && `— ${remaining} Left`}
              </p>
            ) : (
              <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-white/30 rounded-full"></span>
                Sold Out
              </p>
            )}
          </div>

          {product.details && (
            <p className="text-white/40 text-sm mb-8 leading-relaxed border-l border-white/10 pl-4">{product.details}</p>
          )}

          <button disabled={remaining <= 0}
            onClick={() => { addToCart(product); setAdded(true); setTimeout(() => setAdded(false), 2000); }}
            className={`w-full py-4 sm:py-5 text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-300 ${
              remaining <= 0 ? 'bg-white/5 text-white/20 cursor-not-allowed' :
              added ? 'bg-white/80 text-black' : 'bg-white text-black hover:bg-white/90'
            }`}>
            {remaining <= 0 ? 'Sold Out' : added ? '✓ Added' : 'Add to Bag'}
          </button>

          <div className="grid grid-cols-2 gap-8 mt-10 pt-10 border-t border-white/5">
            {product.notes && (
              <div>
                <h4 className="text-[8px] font-bold uppercase tracking-[0.4em] mb-3 text-white/25">Notes</h4>
                <p className="text-[10px] text-white/50 uppercase tracking-widest leading-loose">{product.notes}</p>
              </div>
            )}
            {product.features && (
              <div>
                <h4 className="text-[8px] font-bold uppercase tracking-[0.4em] mb-3 text-white/25">Features</h4>
                <p className="text-[10px] text-white/50 uppercase tracking-widest leading-loose">{product.features}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="border-t border-white/5 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-lg sm:text-xl font-serif uppercase tracking-widest">Reviews</h2>
              <p className="text-[8px] text-white/20 uppercase tracking-widest mt-1">{product.reviews?.length || 0} reviews</p>
            </div>
            <button onClick={() => setShowReviewForm(!showReviewForm)}
              className="border border-white/10 text-white/40 hover:text-white hover:border-white/30 px-5 py-2.5 text-[9px] font-bold uppercase tracking-widest transition-all">
              {showReviewForm ? 'Cancel' : 'Write Review'}
            </button>
          </div>

          {/* Review form */}
          {showReviewForm && (
            <div className="border border-white/5 p-6 sm:p-8 mb-8">
              <form onSubmit={handlePostReview} className="space-y-6">
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button"
                      className={`text-2xl transition-colors ${(hover || rating) >= s ? 'text-white' : 'text-white/10'}`}
                      onClick={() => setRating(s)} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}>★</button>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Name" className={inp} value={newReview.user} onChange={e => setNewReview({...newReview, user: e.target.value})} required />
                  <input type="email" placeholder="Email" className={inp} value={newReview.email} onChange={e => setNewReview({...newReview, email: e.target.value})} required />
                </div>
                <textarea placeholder="Share your experience..." className={`${inp} h-20 resize-none`} value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})} required />
                <button type="submit" className="w-full bg-white text-black py-4 text-[9px] font-black uppercase tracking-[0.4em] hover:bg-white/90 transition-all">
                  Post Review
                </button>
              </form>
            </div>
          )}

          {/* Reviews list */}
          <div className="space-y-6">
            {product.reviews?.length > 0 ? product.reviews.map((rev, i) => (
              <div key={i} className="border border-white/5 p-5 sm:p-6 hover:border-white/10 transition-colors">
                <div className="flex justify-between mb-3">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">{rev.user}</span>
                  <span className="text-[10px] text-white/30">{'★'.repeat(rev.rating)}</span>
                </div>
                <p className="text-sm text-white/30 leading-relaxed">{rev.comment}</p>
              </div>
            )) : (
              <p className="text-center text-[9px] text-white/15 uppercase tracking-widest py-12">No reviews yet. Be the first.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;