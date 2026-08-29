import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const API = `${import.meta.env.VITE_API_URL}/api`;

const AUDIENCES = ['All', 'Men', 'Women', 'Unisex'];
const TYPES = ['All', 'Fragrances', 'Accessories', 'Apparel', 'Tech', 'Lifestyle'];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [audienceFilter, setAudienceFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [gridCols, setGridCols] = useState(4);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/products`)
      .then(r => r.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    const audience = params.get('audience');
    const type = params.get('type');
    const onSale = params.get('onSale');

    if (search) {
      setSearchQuery(search.toLowerCase());
      setAudienceFilter('All');
      setTypeFilter('All');
      setOnSaleOnly(false);
      return;
    }

    setSearchQuery('');
    setOnSaleOnly(onSale === 'true');

    if (audience) {
      const match = AUDIENCES.find(a => a.toLowerCase() === audience.toLowerCase());
      setAudienceFilter(match || 'All');
    } else {
      setAudienceFilter('All');
    }
    if (type) {
      const match = TYPES.find(t => t.toLowerCase() === type.toLowerCase());
      setTypeFilter(match || 'All');
    } else {
      setTypeFilter('All');
    }
  }, [location.search]);

  const filteredProducts = products.filter(product => {
    const matchesAudience = audienceFilter === 'All' || (product.audience || '').toLowerCase() === audienceFilter.toLowerCase();
    const matchesType = typeFilter === 'All' || (product.type || '').toLowerCase() === typeFilter.toLowerCase();
    const matchesSale = !onSaleOnly || (product.discount || 0) > 0;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery) ||
      (product.brand && product.brand.toLowerCase().includes(searchQuery)) ||
      (product.notes && product.notes.toLowerCase().includes(searchQuery));
    return matchesAudience && matchesType && matchesSale && matchesSearch;
  });

  const gridClass = { 1: 'grid-cols-1', 2: 'grid-cols-2', 4: 'grid-cols-2 lg:grid-cols-4' }[gridCols];

  const applyFilter = (aud, type, sale = onSaleOnly) => {
    const params = new URLSearchParams();
    if (aud !== 'All') params.set('audience', aud.toLowerCase());
    if (type !== 'All') params.set('type', type.toLowerCase());
    if (sale) params.set('onSale', 'true');
    navigate(params.toString() ? `/products?${params.toString()}` : '/products');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#050506' }}>
      <p className="text-[10px] uppercase tracking-[0.8em] text-white/20 animate-pulse font-display">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen text-white font-body" style={{ backgroundColor: '#050506' }}>

      {/* Filter nav */}
      <div className="border-b border-white/[0.07] sticky top-[100px] md:top-[128px] z-10 backdrop-blur-xl" style={{ backgroundColor: 'rgba(5,5,6,0.92)' }}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col gap-3 py-4 sm:py-5">

            {/* Audience row */}
            <div className="flex items-center justify-between">
              <p key={`${audienceFilter}-${onSaleOnly}`} className="text-[10px] text-white/70 uppercase tracking-[0.3em] font-display animate-fade-up">
                {audienceFilter !== 'All' ? `${audienceFilter} — Refine by type` : 'Refine by type'}
                {onSaleOnly ? ' · On Sale' : ''}
              </p>
              <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                {searchQuery ? (
                  <div className="hidden sm:flex items-center gap-2">
                    <span className="text-[9px] text-white/40 uppercase tracking-[0.2em]">"{searchQuery}"</span>
                    <button onClick={() => navigate('/products')} className="text-[8px] text-white/25 hover:text-white uppercase tracking-widest transition-colors">✕</button>
                  </div>
                ) : (
                  <span className="hidden sm:block text-[9px] text-white/25 uppercase tracking-[0.2em]">{filteredProducts.length} items</span>
                )}

                <div className="flex items-center gap-1 border border-white/10 rounded-full p-1">
                  {[1, 2, 4].map(cols => (
                    <button key={cols} onClick={() => setGridCols(cols)}
                      className={`p-1.5 rounded-full transition-all duration-300 ${gridCols === cols ? 'bg-white text-black' : 'text-white/30 hover:text-white'}`}>
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

            {/* Type row (sub-filter) */}
            {!searchQuery && (
              <div className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide">
                {TYPES.map(type => (
                  <button key={type}
                    onClick={() => applyFilter(audienceFilter, type)}
                    className={`relative pb-1 text-[9px] font-bold uppercase tracking-[0.25em] whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                      typeFilter === type ? 'text-white' : 'text-white/35 hover:text-white/70'
                    }`}>
                    {type}
                    <span
                      className="absolute -bottom-0 left-1/2 h-px bg-white pointer-events-none"
                      style={{
                        width: typeFilter === type ? '100%' : '0%',
                        transform: 'translateX(-50%)',
                        transition: 'width 0.35s cubic-bezier(0.16,1,0.3,1)',
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-10 sm:py-16">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-[10px] text-white/25 uppercase tracking-[0.3em] font-display">No products found.</p>
          </div>
        ) : (
          <div className={`grid ${gridClass} gap-3 sm:gap-5 md:gap-6`}>
            {filteredProducts.map((product, i) => {
              const remaining = (product.stock || 0) - (product.sold || 0);
              const isSoldOut = remaining <= 0;
              const isLowStock = remaining > 0 && remaining <= 3;
              const isBestSeller = (product.sold || 0) >= 10;
              const discountedPrice = product.price - (product.price * ((product.discount || 0) / 100));

              return (
                <div key={product._id} className="group animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}>
                  <Link to={`/product/${product._id}`}
                    className="collection-tile card-lift relative block aspect-[3/4] overflow-hidden rounded-2xl mb-3 sm:mb-4 border border-white/[0.06]"
                    style={{ backgroundColor: '#101012' }}>
                    <img src={product.image} alt={product.name}
                      className="w-full h-full object-cover grayscale contrast-110 opacity-85 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" />

                    {/* Grey/white outline trace on hover, matching the collection tiles on Home */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <rect x="1" y="1" width="98" height="98" rx="6" fill="none" stroke="white" strokeWidth="0.5"
                        className="collection-tile-trace" pathLength="100" />
                    </svg>

                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                      {product.discount > 0 && (
                        <span className="bg-white text-black text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">-{product.discount}%</span>
                      )}
                      {isBestSeller && !isSoldOut && (
                        <span className="bg-black/50 border border-white/25 text-white text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full backdrop-blur-sm">Top</span>
                      )}
                    </div>

                    {isSoldOut ? (
                      <div className="absolute inset-0 bg-black/65 flex items-center justify-center">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-white/60 border border-white/20 rounded-full px-4 py-2">Sold Out</span>
                      </div>
                    ) : isLowStock ? (
                      <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm text-center py-2">
                        <p className="text-[7px] font-bold uppercase tracking-widest text-white">Only {remaining} Left</p>
                      </div>
                    ) : null}

                    {!isSoldOut && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/0 group-hover:bg-black/20">
                        <span className="bg-white text-black text-[9px] font-black uppercase tracking-widest px-6 py-3 rounded-full translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                          Quick View
                        </span>
                      </div>
                    )}
                  </Link>

                  <div className={gridCols === 1 ? 'flex justify-between items-end' : ''}>
                    <div>
                      <p className="text-[8px] text-white/40 uppercase tracking-widest mb-1">{product.brand || 'OBSIDIAN'}</p>
                      <h3 className={`font-display font-bold uppercase tracking-wide text-white leading-tight mb-2 ${gridCols === 4 ? 'text-[9px] sm:text-[10px]' : 'text-[10px] sm:text-xs'}`}>
                        {product.name}
                      </h3>
                    </div>
                    <div className={`flex items-center gap-2 ${gridCols === 1 ? 'flex-shrink-0' : ''}`}>
                      <span className="font-display text-white text-sm font-bold">Rs. {discountedPrice.toLocaleString()}</span>
                      {product.discount > 0 && <span className="text-[9px] text-white/30 line-through">Rs. {product.price.toLocaleString()}</span>}
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