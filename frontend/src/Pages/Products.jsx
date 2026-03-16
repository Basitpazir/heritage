import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Dynamically use Localhost or Vercel URL
const API = `${import.meta.env.VITE_API_URL}/api`;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState("");
  const [gridCols, setGridCols] = useState(2); 

  const location = useLocation();
  const navigate = useNavigate();
  const categories = ['All', 'Men', 'Women', 'Unisex'];

  useEffect(() => {
    fetch(`${API}/products`)
      .then(r => r.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) { setSearchQuery(search.toLowerCase()); setFilter('All'); }
    else setSearchQuery("");
  }, [location.search]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = filter === 'All' || product.category === filter;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery) ||
      product.brand.toLowerCase().includes(searchQuery) ||
      (product.notes && product.notes.toLowerCase().includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    4: 'grid-cols-2 lg:grid-cols-4'
  }[gridCols];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-[10px] uppercase tracking-[0.5em] text-stone-400 animate-pulse">Entering the Vault...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="py-8 sm:py-12 border-b border-stone-100 mt-16 md:mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex justify-center gap-6 sm:gap-8 md:gap-16 mb-6">
            {categories.map((cat) => (
              <button key={cat} onClick={() => { setFilter(cat); if (searchQuery) navigate('/products'); setSearchQuery(""); }}
                className={`text-[10px] uppercase tracking-[0.4em] font-bold transition-all pb-2 border-b-2 ${
                  filter === cat && !searchQuery ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-300 hover:text-stone-900'
                }`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center">
            {searchQuery ? (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-stone-400">
                  Results for: <span className="text-stone-900 font-bold">"{searchQuery}"</span>
                </p>
                <button onClick={() => navigate('/products')} className="text-[8px] uppercase tracking-widest text-red-500 mt-1 hover:underline">
                  Clear
                </button>
              </div>
            ) : (
              <p className="text-[10px] uppercase tracking-widest text-stone-400">{filteredProducts.length} fragrances</p>
            )}

            <div className="flex items-center gap-1 border border-stone-200 rounded-lg p-1">
              <button onClick={() => setGridCols(1)} className={`p-1.5 rounded transition-all ${gridCols === 1 ? 'bg-stone-900 text-white' : 'text-stone-400 hover:text-stone-900'}`}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="12" height="3" rx="1" fill="currentColor"/>
                  <rect x="1" y="6" width="12" height="3" rx="1" fill="currentColor"/>
                  <rect x="1" y="11" width="12" height="3" rx="1" fill="currentColor" opacity="0.4"/>
                </svg>
              </button>
              <button onClick={() => setGridCols(2)} className={`p-1.5 rounded transition-all ${gridCols === 2 ? 'bg-stone-900 text-white' : 'text-stone-400 hover:text-stone-900'}`}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="5" height="5" rx="1" fill="currentColor"/><rect x="8" y="1" width="5" height="5" rx="1" fill="currentColor"/>
                  <rect x="1" y="8" width="5" height="5" rx="1" fill="currentColor"/><rect x="8" y="8" width="5" height="5" rx="1" fill="currentColor"/>
                </svg>
              </button>
              <button onClick={() => setGridCols(4)} className={`p-1.5 rounded transition-all ${gridCols === 4 ? 'bg-stone-900 text-white' : 'text-stone-400 hover:text-stone-900'}`}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="2.5" height="2.5" rx="0.5" fill="currentColor"/><rect x="4.5" y="1" width="2.5" height="2.5" rx="0.5" fill="currentColor"/>
                  <rect x="8" y="1" width="2.5" height="2.5" rx="0.5" fill="currentColor"/><rect x="11.5" y="1" width="2.5" height="2.5" rx="0.5" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-20">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20"><p className="text-xs text-stone-400 uppercase tracking-widest">No fragrances found.</p></div>
        ) : (
          <div className={`grid ${gridClass} gap-x-4 sm:gap-x-8 gap-y-10 sm:gap-y-16 transition-all duration-300`}>
            {filteredProducts.map((product) => {
              const remaining = (product.stock || 0) - (product.sold || 0);
              const isLowStock = remaining > 0 && remaining <= 3;
              const isSoldOut = remaining <= 0;
              const isBestSeller = (product.sold || 0) >= 10;
              const discountedPrice = product.price - (product.price * (product.discount / 100));

              return (
                <div key={product._id} className="group flex flex-col">
                  <Link to={`/product/${product._id}`} className="relative aspect-[3/4] overflow-hidden bg-stone-50 border border-stone-100">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-col gap-1 sm:gap-2">
                      {product.discount > 0 && <span className="bg-stone-900 text-white text-[7px] sm:text-[8px] font-black uppercase px-2 py-0.5 shadow-lg">{product.discount}% OFF</span>}
                      {isBestSeller && !isSoldOut && <span className="bg-amber-500 text-white text-[7px] sm:text-[8px] font-black uppercase px-2 py-0.5 shadow-lg">Best Seller</span>}
                    </div>
                    {isSoldOut ? (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400 border border-stone-200 px-4 py-2">Vault Empty</span>
                      </div>
                    ) : isLowStock ? (
                      <div className="absolute bottom-0 left-0 right-0 bg-red-600/90 text-white text-center py-1.5">
                        <p className="text-[7px] font-bold uppercase tracking-widest">Only {remaining} Remaining</p>
                      </div>
                    ) : null}
                  </Link>

                  <div className={`mt-3 sm:mt-6 text-center ${gridCols === 1 ? 'sm:text-left' : ''}`}>
                    <p className="text-[8px] sm:text-[9px] text-stone-400 uppercase tracking-[0.3em] mb-1">{product.brand}</p>
                    <h3 className="font-serif text-stone-900 uppercase tracking-widest mb-2 leading-tight text-xs sm:text-sm">{product.name}</h3>
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="font-serif text-stone-900 text-sm">Rs. {discountedPrice.toLocaleString()}</span>
                      {product.discount > 0 && <span className="text-[9px] text-stone-300 line-through">Rs. {product.price.toLocaleString()}</span>}
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