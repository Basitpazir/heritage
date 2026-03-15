import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const API = 'http://localhost:5000/api';

const ProductDetails = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [newReview, setNewReview] = useState({ user: '', email: '', comment: '' });

  useEffect(() => {
    fetch(`${API}/products/${id}`)
      .then(r => r.json())
      .then(data => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-[10px] uppercase tracking-widest text-stone-400 animate-pulse">Loading Fragrance...</p>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-[10px] uppercase tracking-widest text-stone-400">Product not found.</p>
    </div>
  );

  const averageRating = product.reviews?.length > 0
    ? (product.reviews.reduce((acc, rev) => acc + rev.rating, 0) / product.reviews.length).toFixed(1)
    : null;

  const discountedPrice = product.price - (product.price * (product.discount / 100));
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
      alert('Thank you for your feedback!');
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans">

      {/* Breadcrumb */}
      <div className="px-4 sm:px-8 lg:px-16 py-4 sm:py-8 flex gap-2 sm:gap-4 text-[9px] sm:text-[10px] uppercase tracking-widest text-stone-400 border-b border-stone-50 overflow-x-auto whitespace-nowrap">
        <Link to="/">Home</Link><span>/</span>
        <Link to="/products">Collection</Link><span>/</span>
        <span className="text-stone-900 truncate max-w-[120px] sm:max-w-none">{product.name}</span>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 py-8 sm:py-16">

        {/* Image */}
        <div className="aspect-[3/4] bg-stone-50 overflow-hidden relative border border-stone-100 shadow-sm max-w-sm mx-auto w-full lg:max-w-none">
          <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
          {product.discount > 0 && (
            <div className="absolute top-4 left-4 bg-stone-900 text-white text-[9px] px-3 py-1.5 uppercase tracking-widest">
              -{product.discount}% OFF
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-stone-400 font-medium">{product.brand}</p>
            <div className="flex items-center gap-2">
              {averageRating ? (
                <>
                  <span className="text-stone-900 text-xs">{"★".repeat(Math.round(averageRating))}</span>
                  <span className="text-[10px] text-stone-400">({averageRating}/5)</span>
                </>
              ) : (
                <span className="text-[9px] text-stone-300 uppercase tracking-widest border border-stone-100 px-2 py-0.5">New Arrival</span>
              )}
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif text-stone-900 uppercase tracking-widest mb-4 sm:mb-6 leading-tight">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4 sm:mb-6">
            <span className="text-xl sm:text-2xl font-serif text-stone-900">Rs.{discountedPrice.toLocaleString()}</span>
            {product.discount > 0 && <span className="text-stone-300 line-through text-base sm:text-lg">Rs.{product.price.toLocaleString()}</span>}
          </div>

          <div className="mb-6 sm:mb-10">
            {remaining > 0 ? (
              <p className="text-[10px] text-green-600 font-black uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                In Stock {remaining < 10 && `— Only ${remaining} Pieces Left`}
              </p>
            ) : (
              <p className="text-[10px] text-red-500 font-black uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                Out of Stock
              </p>
            )}
          </div>

          <p className="text-stone-600 italic text-sm mb-6 sm:mb-10 leading-relaxed border-l-2 border-stone-100 pl-4 sm:pl-6">"{product.details}"</p>

          <button
            disabled={remaining <= 0}
            onClick={() => { addToCart(product); setAdded(true); setTimeout(() => setAdded(false), 2000); }}
            className={`w-full py-4 sm:py-5 text-[11px] font-bold uppercase tracking-[0.3em] transition-all duration-500 ${
              remaining <= 0 ? 'bg-stone-100 text-stone-300 cursor-not-allowed' :
              added ? 'bg-green-600 text-white' : 'bg-stone-900 text-white hover:bg-black shadow-lg'
            }`}
          >
            {remaining <= 0 ? 'Currently Sold Out' : added ? 'Added to Bag' : 'Add to Shopping Bag'}
          </button>

          <div className="grid grid-cols-2 gap-6 sm:gap-12 mt-8 sm:mt-12 pt-8 sm:pt-12 border-t border-stone-100">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest mb-2 sm:mb-3 text-stone-400">Notes</h4>
              <p className="text-xs text-stone-600 uppercase tracking-widest">{product.notes || 'Sandalwood, Bergamot'}</p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest mb-2 sm:mb-3 text-stone-400">Features</h4>
              <p className="text-xs text-stone-600 uppercase tracking-widest">{product.features || 'Long Lasting Sillage'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-stone-50/50 py-16 sm:py-24 border-t border-stone-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-xl sm:text-2xl font-serif text-stone-900 uppercase tracking-widest mb-4">Customer Reviews</h2>
            <p className="text-[10px] uppercase tracking-widest text-stone-400">Total verified reviews: {product.reviews?.length || 0}</p>
          </div>

          <div className="space-y-6 mb-10 sm:mb-16">
            {product.reviews?.length > 0 ? (
              product.reviews.map((rev, i) => (
                <div key={i} className="bg-white p-4 sm:p-6 border border-stone-100 shadow-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest">{rev.user}</span>
                    <span className="text-stone-900 text-[10px]">{"★".repeat(rev.rating)}</span>
                  </div>
                  <p className="text-sm text-stone-500 italic leading-relaxed">"{rev.comment}"</p>
                </div>
              ))
            ) : (
              <p className="text-center text-[10px] text-stone-300 uppercase italic tracking-widest">No reviews yet for this fragrance.</p>
            )}
          </div>

          {/* Review Form */}
          <div className="bg-white p-6 sm:p-10 border border-stone-200 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6 sm:mb-8 border-b pb-4">Share Your Experience</h3>
            <form onSubmit={handlePostReview} className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="flex gap-2">
                  {[1,2,3,4,5].map((s) => (
                    <button key={s} type="button"
                      className={`text-2xl sm:text-3xl transition-colors ${(hover || rating) >= s ? 'text-stone-900' : 'text-stone-100'}`}
                      onClick={() => setRating(s)} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}>★</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <input type="text" placeholder="Name" className="border-b p-2 text-sm outline-none focus:border-stone-900 w-full"
                  value={newReview.user} onChange={(e) => setNewReview({...newReview, user: e.target.value})} required />
                <input type="email" placeholder="Email" className="border-b p-2 text-sm outline-none focus:border-stone-900 w-full"
                  value={newReview.email} onChange={(e) => setNewReview({...newReview, email: e.target.value})} required />
              </div>
              <textarea placeholder="Write your review here..." className="w-full border-b p-2 text-sm outline-none h-24 focus:border-stone-900 resize-none"
                value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} required />
              <button type="submit" className="w-full bg-stone-900 text-white py-4 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-black transition-all">
                Post Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;