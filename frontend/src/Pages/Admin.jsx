import React, { useState, useEffect } from 'react';
import CloudinaryUpload from '../Component/CloudinaryUpload.jsx';

const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : 'http://localhost:5000';
const API = `${API_BASE}/api`;

const AUDIENCES = ['Men', 'Women', 'Unisex'];
const TYPES = ['Fragrances', 'Accessories', 'Apparel', 'Tech', 'Lifestyle'];

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: 'grid' },
      { key: 'insights', label: 'Insights', icon: 'chart' },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { key: 'inventory', label: 'Inventory', icon: 'box' },
      { key: 'blog', label: 'Journal', icon: 'doc' },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { key: 'orders', label: 'Orders', icon: 'bag' },
    ],
  },
  {
    label: 'Store',
    items: [
      { key: 'design', label: 'Design', icon: 'image' },
      { key: 'settings', label: 'Settings', icon: 'gear' },
    ],
  },
];

const NavIcon = ({ name }) => {
  const common = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'grid': return <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
    case 'chart': return <svg {...common}><path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/></svg>;
    case 'box': return <svg {...common}><path d="M21 8l-9-5-9 5 9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>;
    case 'doc': return <svg {...common}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h6"/></svg>;
    case 'bag': return <svg {...common}><path d="M6 8L7.5 3h9L18 8"/><rect x="4" y="8" width="16" height="13" rx="2.5"/></svg>;
    case 'image': return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/></svg>;
    case 'gear': return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>;
    default: return null;
  }
};

// Lightweight inline sparkline — no chart library, just an SVG polyline
// mapped from a series of numbers onto a small fixed viewBox.
const Sparkline = ({ data, color = '#ffffff' }) => {
  if (!data || data.length < 2) {
    return <div className="h-10" />;
  }
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 100, h = 32;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const areaPoints = `0,${h} ${points} ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-10" preserveAspectRatio="none">
      <polygon points={areaPoints} fill={color} opacity="0.08" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
    </svg>
  );
};

// Build a simple day-bucketed series from a list of items with createdAt/date
// and a value extractor — used to derive real (not fake) trend lines from
// the actual orders/products data already available to this component.
const buildDailySeries = (items, dateKey, valueFn, days = 14) => {
  const buckets = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    d.setHours(0, 0, 0, 0);
    return { date: d, total: 0 };
  });
  items.forEach(item => {
    const raw = item[dateKey];
    if (!raw) return;
    const d = new Date(raw);
    d.setHours(0, 0, 0, 0);
    const bucket = buckets.find(b => b.date.getTime() === d.getTime());
    if (bucket) bucket.total += valueFn(item);
  });
  return buckets.map(b => b.total);
};

const Admin = ({
  products = [], orders = [], setOrders,
  addProduct, updateProduct, deleteProduct, setIsAdminLoggedIn,
  heroImages = [], setHeroImages, heroZoom = 100, setHeroZoom,
  storeInfo = {}, setStoreInfo, adminToken
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventorySort, setInventorySort] = useState('newest');
  const [orderSort, setOrderSort] = useState('newest');
  const [orderFilter, setOrderFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingInsights, setViewingInsights] = useState(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', brand: '', audience: 'Men', type: 'Fragrances', price: '', image: '', details: '', notes: '', features: '', stock: 0, discount: 0 });

  // ── Blog state ──
  const [blogPosts, setBlogPosts] = useState([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', slug: '', excerpt: '', content: '', coverImage: '' });

  const fetchBlogPosts = () => {
    setBlogLoading(true);
    fetch(`${API}/blog`)
      .then(r => r.json())
      .then(data => setBlogPosts(Array.isArray(data) ? data : []))
      .catch(() => setBlogPosts([]))
      .finally(() => setBlogLoading(false));
  };
  useEffect(() => { fetchBlogPosts(); }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/blog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify(newPost),
      });
      const data = await res.json();
      if (res.ok) {
        setBlogPosts(prev => [data, ...prev]);
        setNewPost({ title: '', slug: '', excerpt: '', content: '', coverImage: '' });
        alert('Story published to the Journal.');
      } else {
        alert(data.error || 'Failed to publish.');
      }
    } catch {
      alert('Cannot reach the server.');
    }
  };

  const handlePostEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/blog/${editingPost._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify(editingPost),
      });
      const data = await res.json();
      if (res.ok) {
        setBlogPosts(prev => prev.map(p => p._id === data._id ? data : p));
        setEditingPost(null);
      } else {
        alert(data.error || 'Failed to update.');
      }
    } catch {
      alert('Cannot reach the server.');
    }
  };

  const handlePostDelete = async (id) => {
    if (!window.confirm('Delete this story?')) return;
    try {
      const res = await fetch(`${API}/blog/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) setBlogPosts(prev => prev.filter(p => p._id !== id));
    } catch {
      alert('Cannot reach the server.');
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalUnitsSold = products.reduce((sum, p) => sum + (p.sold || 0), 0);
  const avgOrderValue = orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : 0;
  const productsByRevenue = [...products].sort((a, b) => ((b.sold||0)*b.price) - ((a.sold||0)*a.price));

  // Real trend series derived from actual order/product data (not hardcoded).
  const revenueTrend = buildDailySeries(orders, 'createdAt', o => o.total || 0);
  const ordersTrend = buildDailySeries(orders, 'createdAt', () => 1);
  const unitsTrend = buildDailySeries(orders, 'createdAt', o => (o.items || []).length);

  const sortedInventory = [...products]
    .filter(p => p.name.toLowerCase().includes(inventorySearch.toLowerCase()) || p.brand.toLowerCase().includes(inventorySearch.toLowerCase()))
    .sort((a, b) => {
      if (inventorySort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (inventorySort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (inventorySort === 'price_high') return b.price - a.price;
      if (inventorySort === 'price_low') return a.price - b.price;
      if (inventorySort === 'stock_low') return (a.stock-a.sold) - (b.stock-b.sold);
      if (inventorySort === 'best_seller') return (b.sold||0) - (a.sold||0);
      return 0;
    });

  const filteredOrders = orders.filter(o => orderFilter === 'all' || o.status === orderFilter);
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (orderSort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (orderSort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (orderSort === 'total_high') return b.total - a.total;
    if (orderSort === 'total_low') return a.total - b.total;
    return 0;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.image) { alert('Please upload a product image.'); return; }
    addProduct({
      ...newProduct,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock) || 0,
      discount: Number(newProduct.discount) || 0
    });
    setNewProduct({ name:'', brand:'', audience:'Men', type:'Fragrances', price:'', image:'', details:'', notes:'', features:'', stock:0, discount:0 });
    alert('Item added to the OBSIDIAN vault.');
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateProduct(editingProduct._id, {
      ...editingProduct,
      price: Number(editingProduct.price),
      stock: Number(editingProduct.stock),
      discount: Number(editingProduct.discount) || 0
    });
    setEditingProduct(null);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const res = await fetch(`${API}/orders/${orderId}/status`, {
      method:'PUT',
      headers:{'Content-Type':'application/json', Authorization:`Bearer ${adminToken}`},
      body: JSON.stringify({status: newStatus})
    });
    if (res.ok) setOrders(orders.map(o => o._id === orderId ? {...o, status: newStatus} : o));
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    await fetch(`${API}/settings/store`, {
      method:'PUT',
      headers:{'Content-Type':'application/json', Authorization:`Bearer ${adminToken}`},
      body: JSON.stringify(storeInfo)
    });
    setSavingSettings(false);
    alert('Settings saved!');
  };

  const PillFilter = ({ value, onChange, options }) => (
    <div className="flex items-center gap-1 rounded-full border border-white/10 p-1 flex-wrap">
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)}
          className={`text-[9px] font-bold uppercase tracking-widest px-3.5 py-2 rounded-full transition-all duration-300 ${value === o.value ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>
          {o.label}
        </button>
      ))}
    </div>
  );

  const SortSelect = ({ value, onChange, options }) => (
    <select value={value} onChange={e => onChange(e.target.value)} className="text-[9px] font-bold bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-full outline-none cursor-pointer font-display">
      {options.map(o => <option key={o.value} value={o.value} className="bg-[#0a0a0b]">{o.label}</option>)}
    </select>
  );

  const inp = "bg-white/[0.03] border border-white/10 p-3 rounded-xl outline-none text-xs text-white focus:border-white/30 transition-colors placeholder:text-white/25";

  const activeItem = NAV_SECTIONS.flatMap(s => s.items).find(i => i.key === activeTab);

  return (
    <div className="min-h-screen flex font-body" style={{ backgroundColor: '#050506' }}>

      {/* ── SIDEBAR ── */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 flex-shrink-0 border-r border-white/10 flex flex-col z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`} style={{ backgroundColor: '#0a0a0b' }}>
        <div className="px-6 py-7 border-b border-white/10">
          <h2 className="font-serif text-white uppercase tracking-[0.4em] text-sm">OBSIDIAN</h2>
          <p className="text-[8px] text-white/35 uppercase tracking-[0.3em] mt-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Admin Portal
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-7">
          {NAV_SECTIONS.map(section => (
            <div key={section.label}>
              <p className="text-[8px] font-bold text-white/25 uppercase tracking-[0.3em] mb-2 px-2">{section.label}</p>
              <div className="space-y-0.5">
                {section.items.map(item => (
                  <button key={item.key}
                    onClick={() => { setActiveTab(item.key); setSelectedOrder(null); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all duration-300 font-display ${
                      activeTab === item.key ? 'bg-white text-black' : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}>
                    <NavIcon name={item.icon} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={() => setIsAdminLoggedIn(false)}
            className="w-full text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-3 uppercase tracking-widest font-bold rounded-xl hover:bg-red-500/20 transition-colors">
            Exit Portal
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── MAIN ── */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between gap-4 px-5 lg:px-8 py-5 border-b border-white/10 backdrop-blur-xl" style={{ backgroundColor: 'rgba(5,5,6,0.9)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/60 hover:text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <h1 className="font-display text-lg sm:text-xl font-bold uppercase tracking-tight text-white">{activeItem?.label}</h1>
          </div>
        </div>

        <div className="p-5 lg:p-8 max-w-7xl mx-auto">

          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-up">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { l: 'Total Revenue', v: `Rs. ${totalRevenue.toLocaleString()}`, trend: revenueTrend, color: '#ffffff' },
                  { l: 'Units Sold', v: totalUnitsSold, trend: unitsTrend, color: '#c9c9cf' },
                  { l: 'Total Orders', v: orders.length, trend: ordersTrend, color: '#c9c9cf' },
                  { l: 'Avg. Order', v: `Rs. ${Number(avgOrderValue).toLocaleString()}`, trend: revenueTrend, color: '#ffffff' },
                ].map(({ l, v, trend, color }) => (
                  <div key={l} className="rounded-2xl border border-white/10 p-5 overflow-hidden" style={{ backgroundColor: '#0a0a0b' }}>
                    <p className="text-[9px] text-white/40 uppercase tracking-widest mb-2 font-display">{l}</p>
                    <h4 className="text-xl md:text-2xl font-display font-bold text-white mb-3">{v}</h4>
                    <Sparkline data={trend} color={color} />
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-white/10 p-6 md:p-8" style={{ backgroundColor: '#0a0a0b' }}>
                <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-8 border-b border-white/10 pb-4 font-display">Top Revenue Drivers</h3>
                <div className="space-y-6">
                  {productsByRevenue.slice(0,5).map((item,idx) => {
                    const rev = (item.sold||0)*item.price;
                    const maxRev = (productsByRevenue[0]?.sold||0)*(productsByRevenue[0]?.price||1)||1;
                    return (
                      <div key={idx} className="flex flex-col gap-2">
                        <div className="flex justify-between text-[10px] uppercase tracking-widest">
                          <span className="text-white truncate mr-4">{item.name} <span className="text-white/30">({item.sold||0} sold)</span></span>
                          <span className="font-display flex-shrink-0">Rs. {rev.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-white h-full rounded-full transition-all duration-700" style={{width:`${Math.max((rev/maxRev)*100,2)}%`}} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-6 animate-fade-up">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-white/10 p-6" style={{ backgroundColor: '#0a0a0b' }}>
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-1 font-display">Revenue — Last 14 Days</h3>
                  <p className="text-[9px] text-white/35 uppercase tracking-widest mb-6">Rs. {revenueTrend.reduce((a,b)=>a+b,0).toLocaleString()} total</p>
                  <Sparkline data={revenueTrend} color="#ffffff" />
                  <div className="flex justify-between mt-3 text-[8px] text-white/25 uppercase tracking-widest">
                    <span>14 days ago</span><span>Today</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 p-6" style={{ backgroundColor: '#0a0a0b' }}>
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-1 font-display">Orders — Last 14 Days</h3>
                  <p className="text-[9px] text-white/35 uppercase tracking-widest mb-6">{ordersTrend.reduce((a,b)=>a+b,0)} total orders</p>
                  <Sparkline data={ordersTrend} color="#c9c9cf" />
                  <div className="flex justify-between mt-3 text-[8px] text-white/25 uppercase tracking-widest">
                    <span>14 days ago</span><span>Today</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 p-6 md:p-8" style={{ backgroundColor: '#0a0a0b' }}>
                <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-8 border-b border-white/10 pb-4 font-display">Inventory Health</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { l: 'Active SKUs', v: products.filter(p => (p.stock||0) - (p.sold||0) > 0).length },
                    { l: 'Low Stock (≤3)', v: products.filter(p => { const r=(p.stock||0)-(p.sold||0); return r>0 && r<=3; }).length },
                    { l: 'Sold Out', v: products.filter(p => (p.stock||0) - (p.sold||0) <= 0).length },
                  ].map(({l,v}) => (
                    <div key={l} className="text-center">
                      <p className="font-display text-3xl font-bold text-white mb-1">{v}</p>
                      <p className="text-[9px] text-white/35 uppercase tracking-widest">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-6 animate-fade-up">
              <div className="rounded-2xl border border-white/10 p-6 md:p-8" style={{ backgroundColor: '#0a0a0b' }}>
                <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-4 font-display">Add to Vault</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input className={inp} placeholder="Name" value={newProduct.name} onChange={e=>setNewProduct({...newProduct,name:e.target.value})} required />
                  <input className={inp} placeholder="Brand" value={newProduct.brand} onChange={e=>setNewProduct({...newProduct,brand:e.target.value})} required />
                  <input type="number" className={inp} placeholder="Price (Rs)" value={newProduct.price} onChange={e=>setNewProduct({...newProduct,price:e.target.value})} required />
                  <input type="number" className={inp} placeholder="Total Stock" value={newProduct.stock} onChange={e=>setNewProduct({...newProduct,stock:e.target.value})} required />
                  <input type="number" className={inp} placeholder="Discount %" value={newProduct.discount} onChange={e=>setNewProduct({...newProduct,discount:e.target.value})} />
                  <select className={inp} value={newProduct.audience} onChange={e=>setNewProduct({...newProduct,audience:e.target.value})}>
                    {AUDIENCES.map(a => <option key={a} value={a} className="bg-[#0a0a0b]">{a}</option>)}
                  </select>
                  <select className={inp} value={newProduct.type} onChange={e=>setNewProduct({...newProduct,type:e.target.value})}>
                    {TYPES.map(t => <option key={t} value={t} className="bg-[#0a0a0b]">{t}</option>)}
                  </select>
                  <input className={inp} placeholder="Notes (materials, scent, specs)" value={newProduct.notes} onChange={e=>setNewProduct({...newProduct,notes:e.target.value})} />
                  <input className={inp} placeholder="Features" value={newProduct.features} onChange={e=>setNewProduct({...newProduct,features:e.target.value})} />
                  <textarea className={`md:col-span-3 ${inp} h-20 resize-none`} placeholder="Description..." value={newProduct.details} onChange={e=>setNewProduct({...newProduct,details:e.target.value})} />
                  <div className="md:col-span-3"><CloudinaryUpload label="Product Image" currentImage={newProduct.image} onUpload={url=>setNewProduct({...newProduct,image:url})} /></div>
                  <button type="submit" className="md:col-span-3 bg-white text-black py-4 rounded-full uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-white/90 transition-colors font-display">Publish to OBSIDIAN</button>
                </form>
              </div>
              <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ backgroundColor: '#0a0a0b' }}>
                <div className="p-4 md:p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest font-display">Active Database</h3>
                  <div className="flex flex-wrap gap-3">
                    <input placeholder="Search..." className="text-[10px] bg-white/[0.03] border border-white/10 rounded-full outline-none px-4 py-2.5 text-white w-36 placeholder:text-white/25" value={inventorySearch} onChange={e=>setInventorySearch(e.target.value)} />
                    <SortSelect value={inventorySort} onChange={setInventorySort} options={[
                      {value:'newest',label:'Newest'},{value:'oldest',label:'Oldest'},
                      {value:'price_high',label:'Price ↑'},{value:'price_low',label:'Price ↓'},
                      {value:'stock_low',label:'Low Stock'},{value:'best_seller',label:'Best Seller'},
                    ]} />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="text-[9px] uppercase tracking-widest font-bold text-white/35 border-b border-white/10 font-display">
                      <tr><th className="p-4 md:p-6">Product</th><th className="p-4 md:p-6 text-center hidden sm:table-cell">Audience</th><th className="p-4 md:p-6 text-center hidden sm:table-cell">Type</th><th className="p-4 md:p-6 text-center">Stock</th><th className="p-4 md:p-6 text-center">Status</th><th className="p-4 md:p-6 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {sortedInventory.map(item => {
                        const remaining = (item.stock||0)-(item.sold||0);
                        return (
                          <tr key={item._id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 md:p-6 flex items-center gap-3">
                              <img src={item.image} className="w-10 h-10 object-cover rounded-lg border border-white/10 flex-shrink-0" alt="" />
                              <div><p className="font-display text-sm text-white">{item.name}</p><p className="text-[9px] text-white/35">{item.brand} | Rs. {item.price?.toLocaleString()}</p></div>
                            </td>
                            <td className="p-4 md:p-6 text-center hidden sm:table-cell">
                              <span className="text-[8px] font-bold uppercase tracking-widest text-white/50 border border-white/10 px-2 py-1 rounded-full">{item.audience}</span>
                            </td>
                            <td className="p-4 md:p-6 text-center hidden sm:table-cell">
                              <span className="text-[8px] font-bold uppercase tracking-widest text-white/50 border border-white/10 px-2 py-1 rounded-full">{item.type || '—'}</span>
                            </td>
                            <td className="p-4 md:p-6 text-center"><span className="text-white font-mono">{remaining}</span><span className="text-white/30 text-xs"> / {item.stock}</span></td>
                            <td className="p-4 md:p-6 text-center">
                              <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase border ${remaining>0?'bg-emerald-500/10 text-emerald-400 border-emerald-500/20':'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                {remaining>0?'Active':'Depleted'}
                              </span>
                            </td>
                            <td className="p-4 md:p-6 text-right space-x-1">
                              <button onClick={()=>setViewingInsights(item)} className="text-[9px] bg-white/5 hover:bg-white/10 text-white px-2.5 py-1.5 rounded-full transition-colors">Insights</button>
                              <button onClick={()=>setEditingProduct(item)} className="text-[9px] bg-white/5 hover:bg-white/10 text-white px-2.5 py-1.5 rounded-full transition-colors">Edit</button>
                              <button onClick={()=>deleteProduct(item._id)} className="text-[9px] border border-red-500/20 text-red-400 hover:bg-red-500/10 px-2.5 py-1.5 rounded-full transition-colors">Drop</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'blog' && (
            <div className="space-y-6 animate-fade-up">
              <div className="rounded-2xl border border-white/10 p-6 md:p-8" style={{ backgroundColor: '#0a0a0b' }}>
                <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-4 font-display">Write a Story</h3>
                <form onSubmit={handlePostSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className={inp} placeholder="Title" value={newPost.title} onChange={e=>setNewPost({...newPost,title:e.target.value})} required />
                  <input className={inp} placeholder="Slug (optional — auto-generated if blank)" value={newPost.slug} onChange={e=>setNewPost({...newPost,slug:e.target.value})} />
                  <input className={`md:col-span-2 ${inp}`} placeholder="Excerpt (short summary shown on cards)" value={newPost.excerpt} onChange={e=>setNewPost({...newPost,excerpt:e.target.value})} />
                  <textarea className={`md:col-span-2 ${inp} h-32 resize-none`} placeholder="Full story content..." value={newPost.content} onChange={e=>setNewPost({...newPost,content:e.target.value})} />
                  <div className="md:col-span-2"><CloudinaryUpload label="Cover Image" currentImage={newPost.coverImage} onUpload={url=>setNewPost({...newPost,coverImage:url})} /></div>
                  <button type="submit" className="md:col-span-2 bg-white text-black py-4 rounded-full uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-white/90 transition-colors font-display">Publish Story</button>
                </form>
              </div>

              <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ backgroundColor: '#0a0a0b' }}>
                <div className="p-4 md:p-6 border-b border-white/10">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest font-display">Published Stories <span className="text-white/30">({blogPosts.length})</span></h3>
                </div>
                {blogLoading ? (
                  <p className="text-[10px] text-white/25 uppercase tracking-widest p-8 text-center font-display animate-pulse">Loading...</p>
                ) : blogPosts.length === 0 ? (
                  <p className="text-[10px] text-white/25 uppercase tracking-widest p-8 text-center font-display">No stories yet. Publish your first above.</p>
                ) : (
                  <div className="divide-y divide-white/5">
                    {blogPosts.map(post => (
                      <div key={post._id} className="p-4 md:p-6 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                        {post.coverImage && <img src={post.coverImage} className="w-14 h-14 object-cover rounded-lg border border-white/10 flex-shrink-0" alt="" />}
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-sm text-white truncate">{post.title}</p>
                          <p className="text-[9px] text-white/35 truncate">/blog/{post.slug}</p>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button onClick={()=>setEditingPost(post)} className="text-[9px] bg-white/5 hover:bg-white/10 text-white px-2.5 py-1.5 rounded-full transition-colors">Edit</button>
                          <button onClick={()=>handlePostDelete(post._id)} className="text-[9px] border border-red-500/20 text-red-400 hover:bg-red-500/10 px-2.5 py-1.5 rounded-full transition-colors">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-up">
              {!selectedOrder ? (
                <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ backgroundColor: '#0a0a0b' }}>
                  <div className="p-4 md:p-6 border-b border-white/10 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <h3 className="text-xs font-bold text-white uppercase tracking-widest font-display">Order Log <span className="text-white/30">({sortedOrders.length})</span></h3>
                      <SortSelect value={orderSort} onChange={setOrderSort} options={[
                        {value:'newest',label:'Newest'},{value:'oldest',label:'Oldest'},
                        {value:'total_high',label:'Total ↑'},{value:'total_low',label:'Total ↓'},
                      ]} />
                    </div>
                    <PillFilter value={orderFilter} onChange={setOrderFilter} options={[
                      { value: 'all', label: 'All' },
                      { value: 'Processing', label: 'Processing' },
                      { value: 'Shipped', label: 'Shipped' },
                      { value: 'Delivered', label: 'Delivered' },
                    ]} />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="border-b border-white/10 text-[9px] uppercase tracking-widest font-bold text-white/35 font-display">
                        <tr><th className="p-4 md:p-6">Order ID</th><th className="p-4 md:p-6">Customer</th><th className="p-4 md:p-6 hidden md:table-cell">Date & Time</th><th className="p-4 md:p-6 text-center">Status</th><th className="p-4 md:p-6 text-center">Total</th><th className="p-4 md:p-6 text-center">Action</th></tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {sortedOrders.length === 0 ? (
                          <tr><td colSpan="6" className="p-20 text-center text-white/30 text-[10px] uppercase tracking-widest font-display">No orders found.</td></tr>
                        ) : sortedOrders.map(order => (
                          <tr key={order._id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 md:p-6 text-[10px] font-mono text-white/50">{order.orderId}</td>
                            <td className="p-4 md:p-6"><p className="text-xs font-bold text-white">{order.customer?.name}</p><p className="text-[9px] text-white/35">{order.customer?.city}</p></td>
                            <td className="p-4 md:p-6 hidden md:table-cell">
                              <p className="text-[10px] text-white">{order.date || new Date(order.createdAt).toLocaleDateString('en-PK',{day:'numeric',month:'short',year:'numeric'})}</p>
                              <p className="text-[9px] text-white/35">{order.time || new Date(order.createdAt).toLocaleTimeString('en-PK',{hour:'2-digit',minute:'2-digit',hour12:true})}</p>
                            </td>
                            <td className="p-4 md:p-6 text-center">
                              <select value={order.status} onChange={e=>updateOrderStatus(order._id,e.target.value)} className="text-[9px] font-bold bg-white/5 border border-white/10 text-white px-2.5 py-1.5 rounded-full outline-none">
                                <option value="Processing" className="bg-[#0a0a0b]">Processing</option><option value="Shipped" className="bg-[#0a0a0b]">Shipped</option><option value="Delivered" className="bg-[#0a0a0b]">Delivered</option>
                              </select>
                            </td>
                            <td className="p-4 md:p-6 text-center font-display text-white text-sm">Rs. {order.total?.toLocaleString()}</td>
                            <td className="p-4 md:p-6 text-center"><button onClick={()=>setSelectedOrder(order)} className="text-[9px] font-bold bg-white text-black px-3 py-1.5 rounded-full hover:bg-white/90 transition-colors">View</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 p-6 md:p-12" style={{ backgroundColor: '#0a0a0b' }}>
                  <div className="flex justify-between items-start mb-10 border-b border-white/10 pb-6">
                    <div>
                      <button onClick={()=>setSelectedOrder(null)} className="text-[9px] uppercase tracking-widest font-bold text-white/40 mb-4 block hover:text-white transition-colors">← Back</button>
                      <h3 className="text-2xl font-display font-bold text-white">Order {selectedOrder.orderId}</h3>
                      <p className="text-[10px] text-white/35 mt-1">
                        {selectedOrder.date || new Date(selectedOrder.createdAt).toLocaleDateString()} &nbsp;·&nbsp; {selectedOrder.time || new Date(selectedOrder.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right"><p className="text-[9px] text-white/35 uppercase">Payment</p><p className="text-xs font-bold uppercase text-white">{selectedOrder.paymentMethod}</p></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white/[0.02] p-6 rounded-xl border border-white/10">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/35 mb-6 font-display">Client Profile</h4>
                      {[['Name',selectedOrder.customer.name],['Phone',selectedOrder.customer.phone],['City',selectedOrder.customer.city],['Address',selectedOrder.customer.address]].map(([l,v])=>(
                        <p key={l} className="flex flex-col mb-4"><span className="text-[9px] text-white/30 uppercase mb-1">{l}</span><span className="text-white text-xs">{v}</span></p>
                      ))}
                    </div>
                    <div className="bg-white/[0.02] p-6 rounded-xl border border-white/10">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/35 mb-6 font-display">Manifest</h4>
                      {selectedOrder.items.map((item,i)=>(
                        <div key={i} className="flex justify-between border-b border-white/5 pb-3 mb-3">
                          <p className="text-xs text-white">{item.name}</p><p className="text-xs font-display text-white/50">Rs. {item.price?.toLocaleString()}</p>
                        </div>
                      ))}
                      <div className="flex justify-between pt-4"><p className="text-[10px] font-black uppercase text-white">Net Total</p><p className="text-xl font-display text-white">Rs. {selectedOrder.total?.toLocaleString()}</p></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'design' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-up">
              <div className="rounded-2xl border border-white/10 p-6 md:p-8" style={{ backgroundColor: '#0a0a0b' }}>
                <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-8 border-b border-white/10 pb-4 font-display">Hero Image Management</h3>
                <CloudinaryUpload label="Upload Hero Image" onUpload={url=>{if(url) setHeroImages([...heroImages,url]);}} />
                <div className="grid grid-cols-3 gap-3 mt-6">
                  {heroImages.map((img,i)=>(
                    <div key={i} className="aspect-square bg-white/[0.03] rounded-xl overflow-hidden border border-white/10 relative group">
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      <button onClick={()=>setHeroImages(heroImages.filter((_,j)=>j!==i))} className="absolute top-2 right-2 bg-red-500/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 p-6 md:p-8" style={{ backgroundColor: '#0a0a0b' }}>
                <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-4 font-display">Hero Adjustments</h3>
                <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-4">Image Zoom ({heroZoom}%)</label>
                <input type="range" min="100" max="150" value={heroZoom} onChange={e=>setHeroZoom(Number(e.target.value))} className="w-full accent-white" />
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="rounded-2xl border border-white/10 p-6 md:p-8 animate-fade-up" style={{ backgroundColor: '#0a0a0b' }}>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-8 border-b border-white/10 pb-4 font-display">Store Information & Policies</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {[['Support Email','email','email'],['Contact Number','phone','text']].map(([l,k,t])=>(
                    <div key={k}><label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">{l}</label>
                    <input type={t} value={storeInfo[k]||''} onChange={e=>setStoreInfo({...storeInfo,[k]:e.target.value})} className={inp+" w-full"} /></div>
                  ))}
                  <div><label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Shipping Policy</label>
                  <textarea rows="4" value={storeInfo.shippingPolicy||''} onChange={e=>setStoreInfo({...storeInfo,shippingPolicy:e.target.value})} className={inp+" w-full resize-none"} /></div>
                </div>
                <div className="space-y-6 flex flex-col">
                  <div><label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Return Policy</label>
                  <textarea rows="4" value={storeInfo.returnPolicy||''} onChange={e=>setStoreInfo({...storeInfo,returnPolicy:e.target.value})} className={inp+" w-full resize-none"} /></div>
                  <div><label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Store Address</label>
                  <textarea rows="3" value={storeInfo.address||''} onChange={e=>setStoreInfo({...storeInfo,address:e.target.value})} className={inp+" w-full resize-none"} /></div>
                  <button onClick={handleSaveSettings} className="mt-auto w-full bg-white text-black py-4 rounded-full uppercase tracking-widest text-[10px] font-bold hover:bg-white/90 transition-colors font-display">
                    {savingSettings?'Saving...':'Save Configuration'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Edit Product Modal ── */}
      {editingProduct && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="border border-white/10 p-6 md:p-8 rounded-2xl w-full max-w-2xl my-8 relative" style={{ backgroundColor: '#0a0a0b' }}>
            <button onClick={()=>setEditingProduct(null)} className="absolute top-4 right-4 text-white/40 hover:text-white text-xl transition-colors">×</button>
            <h3 className="text-lg font-display font-bold text-white mb-6">Modify Item</h3>
            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-[9px] text-white/40 uppercase mb-1 block">Title</label><input type="text" className={inp+" w-full"} value={editingProduct.name} onChange={e=>setEditingProduct({...editingProduct,name:e.target.value})} required /></div>
              <div><label className="text-[9px] text-white/40 uppercase mb-1 block">Brand</label><input type="text" className={inp+" w-full"} value={editingProduct.brand} onChange={e=>setEditingProduct({...editingProduct,brand:e.target.value})} required /></div>
              <div><label className="text-[9px] text-white/40 uppercase mb-1 block">Audience</label>
                <select className={inp+" w-full"} value={editingProduct.audience} onChange={e=>setEditingProduct({...editingProduct,audience:e.target.value})}>
                  {AUDIENCES.map(a => <option key={a} value={a} className="bg-[#0a0a0b]">{a}</option>)}
                </select>
              </div>
              <div><label className="text-[9px] text-white/40 uppercase mb-1 block">Type</label>
                <select className={inp+" w-full"} value={editingProduct.type} onChange={e=>setEditingProduct({...editingProduct,type:e.target.value})}>
                  {TYPES.map(t => <option key={t} value={t} className="bg-[#0a0a0b]">{t}</option>)}
                </select>
              </div>
              <div><label className="text-[9px] text-white/40 uppercase mb-1 block">Price</label><input type="number" className={inp+" w-full"} value={editingProduct.price} onChange={e=>setEditingProduct({...editingProduct,price:e.target.value})} required /></div>
              <div><label className="text-[9px] text-white/40 uppercase mb-1 block">Stock</label><input type="number" className={inp+" w-full"} value={editingProduct.stock} onChange={e=>setEditingProduct({...editingProduct,stock:e.target.value})} required /></div>
              <div><label className="text-[9px] text-white/40 uppercase mb-1 block">Discount %</label><input type="number" className={inp+" w-full"} value={editingProduct.discount||0} onChange={e=>setEditingProduct({...editingProduct,discount:e.target.value})} /></div>
              <div className="md:col-span-2"><CloudinaryUpload label="Product Image" currentImage={editingProduct.image} onUpload={url=>setEditingProduct({...editingProduct,image:url})} /></div>
              <div><label className="text-[9px] text-white/40 uppercase mb-1 block">Notes</label><input type="text" className={inp+" w-full"} value={editingProduct.notes||''} onChange={e=>setEditingProduct({...editingProduct,notes:e.target.value})} /></div>
              <div><label className="text-[9px] text-white/40 uppercase mb-1 block">Features</label><input type="text" className={inp+" w-full"} value={editingProduct.features||''} onChange={e=>setEditingProduct({...editingProduct,features:e.target.value})} /></div>
              <div className="md:col-span-2"><label className="text-[9px] text-white/40 uppercase mb-1 block">Description</label><textarea className={inp+" w-full h-20 resize-none"} value={editingProduct.details} onChange={e=>setEditingProduct({...editingProduct,details:e.target.value})} /></div>
              <button type="submit" className="md:col-span-2 bg-white text-black py-4 rounded-full uppercase tracking-widest text-[10px] font-bold hover:bg-white/90 transition-colors mt-2 font-display">Commit Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Blog Post Modal ── */}
      {editingPost && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="border border-white/10 p-6 md:p-8 rounded-2xl w-full max-w-2xl my-8 relative" style={{ backgroundColor: '#0a0a0b' }}>
            <button onClick={()=>setEditingPost(null)} className="absolute top-4 right-4 text-white/40 hover:text-white text-xl transition-colors">×</button>
            <h3 className="text-lg font-display font-bold text-white mb-6">Edit Story</h3>
            <form onSubmit={handlePostEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className={inp} placeholder="Title" value={editingPost.title} onChange={e=>setEditingPost({...editingPost,title:e.target.value})} required />
              <input className={inp} placeholder="Slug" value={editingPost.slug} onChange={e=>setEditingPost({...editingPost,slug:e.target.value})} required />
              <input className={`md:col-span-2 ${inp}`} placeholder="Excerpt" value={editingPost.excerpt||''} onChange={e=>setEditingPost({...editingPost,excerpt:e.target.value})} />
              <textarea className={`md:col-span-2 ${inp} h-32 resize-none`} placeholder="Content" value={editingPost.content||''} onChange={e=>setEditingPost({...editingPost,content:e.target.value})} />
              <div className="md:col-span-2"><CloudinaryUpload label="Cover Image" currentImage={editingPost.coverImage} onUpload={url=>setEditingPost({...editingPost,coverImage:url})} /></div>
              <button type="submit" className="md:col-span-2 bg-white text-black py-4 rounded-full uppercase tracking-widest text-[10px] font-bold hover:bg-white/90 transition-colors mt-2 font-display">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* ── Insights Modal (per-product) ── */}
      {viewingInsights && (() => {
        const rev = (viewingInsights.sold||0)*viewingInsights.price;
        const pct = ((rev/(totalRevenue||1))*100).toFixed(1);
        const left = (viewingInsights.stock||0)-(viewingInsights.sold||0);
        return (
          <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="border border-white/10 rounded-2xl w-full max-w-xl overflow-hidden flex flex-col md:flex-row" style={{ backgroundColor: '#0a0a0b' }}>
              <div className="w-full md:w-1/3 bg-white/5 relative min-h-40">
                <img src={viewingInsights.image} alt="" className="w-full h-full object-cover absolute inset-0 opacity-50 mix-blend-overlay" />
                <div className="relative z-10 p-6 min-h-40 flex flex-col justify-end">
                  <button onClick={()=>setViewingInsights(null)} className="absolute top-4 left-4 bg-black/50 w-8 h-8 rounded-full text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors">×</button>
                  <p className="text-[9px] text-white/60">{viewingInsights.brand}</p>
                  <h3 className="text-lg font-display font-bold text-white">{viewingInsights.name}</h3>
                </div>
              </div>
              <div className="w-full md:w-2/3 p-6 md:p-8 space-y-6">
                <div><p className="text-[10px] text-white/35 uppercase tracking-widest mb-1">Financial Yield</p>
                <p className="text-2xl font-display font-bold text-emerald-400">Rs. {rev.toLocaleString()}</p>
                <p className="text-xs text-white/40 mt-1">Accounts for <strong className="text-white">{pct}%</strong> of revenue.</p></div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div><p className="text-[9px] text-white/35 uppercase mb-1">Units Sold</p><p className="text-lg text-white font-mono">{viewingInsights.sold||0}</p></div>
                  <div><p className="text-[9px] text-white/35 uppercase mb-1">Stock Left</p><p className="text-lg text-white font-mono">{left}</p></div>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-[9px] text-white/35 uppercase mb-3">Inventory Health</p>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${left>10?'bg-emerald-400':left>0?'bg-yellow-400':'bg-red-400'}`} style={{width:`${Math.min((left/(viewingInsights.stock||1))*100,100)}%`}} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default Admin;