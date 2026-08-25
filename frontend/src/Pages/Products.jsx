import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const API = `${import.meta.env.VITE_API_URL}/api`;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [gridCols, setGridCols] = useState(2);

  const location = useLocation();
  const navigate = useNavigate();

  const categories = ['All', 'Fragrances', 'Accessories', 'Apparel', 'Tech', 'Lifestyle'];

  useEffect(() => {
    fetch(`${API}/products`)
      .then(r => r.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    const category = params.get('category');
    if (search) { setSearchQuery(search.toLowerCase()); setFilter('All'); }
    else if (category) {
      const match = categories.find(c => c.toLowerCase() === category.toLowerCase());
      if (match) setFilter(match);
      setSearchQuery('');
    } else {
      setSearchQuery('');
    }
  }, [location.search]);

  const filteredProducts = products.filter(product => {
    const cat = product.category?.toLowerCase() || '';
    const matchesCategory = filter === 'All' || cat === filter.toLowerCase() ||
      (filter === 'Fragrances' && cat === 'men') ||
      (filter === 'Fragrances' && cat === 'women') ||
      (filter === 'Fragrances' && cat === 'unisex');
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery) ||
      (product.brand && product.brand.toLowerCase().includes(searchQuery)) ||
      (product.notes && product.notes.toLowerCase().includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  const gridClass = { 1: 'grid-cols-1', 2: 'grid-cols-2', 4: 'grid-cols-2 lg:grid-cols-4' }[gridCols];

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-[10px] uppercase tracking-[0.8em] text-white/20 animate-pulse">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans">

      {/* Category nav */}
      <div className="border-b border-white/5 sticky top-[72px] z-10 bg-black/98 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between py-4 sm:py-5">
            {/* Categories */}
            <div className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto scrollbar-hide">
              {categories.map(cat => (
                <button key={cat}
                  onClick={() => { setFilter(cat); navigate('/products'); setSearchQuery(''); }}
                  className={`text-[9px] font-bold uppercase tracking-[0.3em] whitespace-nowrap transition-all pb-0.5 flex-shrink-0 ${
                    filter === cat && !searchQuery
                      ? 'text-white border-b border-white'
                      : 'text-white/30 hover:text-white'
                  }`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid toggle + count */}
            <div className="flex items-center gap-4 flex-shrink-0 ml-4">
              {searchQuery ? (
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-[9px] text-white/30 uppercase tracking-widest">"{searchQuery}"</span>
                  <button onClick={() => navigate('/products')} className="text-[8px] text-white/20 hover:text-white uppercase tracking-widest">✕</button>
                </div>
              ) : (
                <span className="hidden sm:block text-[9px] text-white/20 uppercase tracking-widest">{filteredProducts.length} items</span>
              )}

              <div className="flex items-center gap-1 border border-white/10 rounded p-1">
                {[1, 2, 4].map(cols => (
                  <button key={cols} onClick={() => setGridCols(cols)}
                    className={`p-1.5 rounded transition-all ${gridCols === cols ? 'bg-white text-black' : 'text-white/30 hover:text-white'}`}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      {cols === 1 && <>
                        <rect x="1" y="1" width="10" height="2.5" rx="0.5" fill="currentColor"/>
                        <rect x="1" y="4.75" width="10" height="2.5" rx="0.5" fill="currentColor"/>
                        <rect x="1" y="8.5" width="10" height="2.5" rx="0.5" fill="currentColor" opacity="0.4"/>
                      </>}
                      {cols === 2 && <>
                        <rect x="1" y="1" width="4" height="4" rx="0.5" fill="currentColor"/>
                        <rect x="7" y="1" width="4" height="4" rx="0.5" fill="currentColor"/>
                        <rect x="1" y="7" width="4" height="4" rx="0.5" fill="currentColor"/>
                        <rect x="7" y="7" width="4" height="4" rx="0.5" fill="currentColor"/>
                      </>}
                      {cols === 4 && <>
                        {[0,3,6,9].map(x => [0,3,6,9].map(y => (
                          <rect key={`${x}-${y}`} x={x > 0 ? x/9*10+1 : 1} y={y > 0 ? y/9*10+1 : 1} width="2" height="2" rx="0.3" fill="currentColor"/>
                        )))}
                      </>}
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-10 sm:py-16">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-[10px] text-white/20 uppercase tracking-widest">No products found.</p>
          </div>
        ) : (
          <div className={`grid ${gridClass} gap-3 sm:gap-5 md:gap-6`}>
            {filteredProducts.map(product => {
              const remaining = (product.stock || 0) - (product.sold || 0);
              const isSoldOut = remaining <= 0;
              const isLowStock = remaining > 0 && remaining <= 3;
              const isBestSeller = (product.sold || 0) >= 10;
              const discountedPrice = product.price - (product.price * ((product.discount || 0) / 100));

              return (
                <div key={product._id} className="group">
                  <Link to={`/product/${product._id}`} className="relative block aspect-[3/4] overflow-hidden bg-neutral-900 mb-3 sm:mb-4">
                    <img src={product.image} alt={product.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {product.discount > 0 && (
                        <span className="bg-white text-black text-[7px] font-black uppercase tracking-widest px-2 py-0.5">-{product.discount}%</span>
                      )}
                      {isBestSeller && !isSoldOut && (
                        <span className="bg-white/10 border border-white/20 text-white text-[7px] font-black uppercase tracking-widest px-2 py-0.5 backdrop-blur-sm">Top</span>
                      )}
                    </div>

                    {isSoldOut ? (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-white/50 border border-white/20 px-4 py-2">Sold Out</span>
                      </div>
                    ) : isLowStock ? (
                      <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm text-center py-2">
                        <p className="text-[7px] font-bold uppercase tracking-widest text-white">Only {remaining} Left</p>
                      </div>
                    ) : null}

                    {!isSoldOut && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="bg-white text-black text-[9px] font-black uppercase tracking-widest px-6 py-3 translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                          Quick View
                        </span>
                      </div>
                    )}
                  </Link>

                  <div className={gridCols === 1 ? 'flex justify-between items-end' : ''}>
                    <div>
                      <p className="text-[8px] text-white/25 uppercase tracking-widest mb-1">{product.brand || 'OBSIDIAN'}</p>
                      <h3 className={`font-bold uppercase tracking-widest text-white leading-tight mb-2 ${gridCols === 4 ? 'text-[9px] sm:text-[10px]' : 'text-[10px] sm:text-xs'}`}>
                        {product.name}
                      </h3>
                    </div>
                    <div className={`flex items-center gap-2 ${gridCols === 1 ? 'flex-shrink-0' : ''}`}>
                      <span className="font-serif text-white text-sm">Rs. {discountedPrice.toLocaleString()}</span>
                      {product.discount > 0 && <span className="text-[9px] text-white/25 line-through">Rs. {product.price.toLocaleString()}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;