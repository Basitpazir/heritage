import React, { useState } from 'react';
import CloudinaryUpload from '../Component/CloudinaryUpload.jsx';

// Updated to your live backend URL
const API = 'https://heritage-backend-mu.vercel.app/api';

const Admin = ({
  products = [], orders = [], setOrders,
  addProduct, updateProduct, deleteProduct, setIsAdminLoggedIn,
  heroImages = [], setHeroImages, heroZoom = 100, setHeroZoom,
  storeInfo = {}, setStoreInfo, adminToken
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventorySort, setInventorySort] = useState('newest');
  const [orderSort, setOrderSort] = useState('newest');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingInsights, setViewingInsights] = useState(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', brand: '', category: 'Men', price: '', image: '', details: '', notes: '', features: '', stock: 0, discount: 0 });

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalUnitsSold = products.reduce((sum, p) => sum + (p.sold || 0), 0);
  const avgOrderValue = orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : 0;
  const productsByRevenue = [...products].sort((a, b) => ((b.sold||0)*b.price) - ((a.sold||0)*a.price));

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

  const sortedOrders = [...orders].sort((a, b) => {
    if (orderSort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (orderSort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (orderSort === 'total_high') return b.total - a.total;
    if (orderSort === 'total_low') return a.total - b.total;
    if (orderSort === 'processing') return a.status === 'Processing' ? -1 : 1;
    if (orderSort === 'delivered') return a.status === 'Delivered' ? -1 : 1;
    return 0;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.image) { alert('Please upload a product image.'); return; }
    // Passing clean data to the addProduct function
    addProduct({ 
      ...newProduct, 
      price: Number(newProduct.price), 
      stock: Number(newProduct.stock) || 0,
      discount: Number(newProduct.discount) || 0 
    });
    setNewProduct({ name:'', brand:'', category:'Men', price:'', image:'', details:'', notes:'', features:'', stock:0, discount:0 });
    alert('Fragrance added to vault.');
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateProduct(editingProduct._id, { 
      ...editingProduct, 
      price: Number(editingProduct.price), 
      stock: Number(editingProduct.stock) 
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

  const SortSelect = ({ value, onChange, options }) => (
    <select value={value} onChange={e => onChange(e.target.value)} className="text-[9px] font-bold bg-neutral-900 border border-neutral-700 text-white px-3 py-2 rounded outline-none cursor-pointer">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );

  const inp = "bg-neutral-900 border border-neutral-800 p-3 rounded-lg outline-none text-xs text-white focus:border-neutral-500";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-300 pt-8 pb-12 px-4 lg:px-8 font-sans">
      {/* ... (Rest of the JSX remains the same as your original) ... */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 bg-[#121212] p-6 rounded-2xl border border-neutral-800 gap-6">
        <div>
          <h2 className="text-2xl font-serif text-white uppercase tracking-widest">Executive Suite</h2>
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>Heritage Admin Portal</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 bg-[#0a0a0a] p-1.5 rounded-xl border border-neutral-800">
          {['dashboard','inventory','orders','design','settings'].map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setSelectedOrder(null); }}
              className={`text-[10px] px-4 md:px-6 py-2.5 uppercase tracking-widest font-bold transition-all rounded-lg ${activeTab===tab ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}>{tab}</button>
          ))}
          <button onClick={() => setIsAdminLoggedIn(false)} className="text-[10px] bg-red-950/30 text-red-400 border border-red-900/50 px-4 py-2.5 uppercase tracking-widest font-bold rounded-lg hover:bg-red-900/50">Exit</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[['Total Revenue',`Rs. ${totalRevenue.toLocaleString()}`],['Units Sold',totalUnitsSold],['Total Orders',orders.length],['Avg. Order',`Rs. ${Number(avgOrderValue).toLocaleString()}`]].map(([l,v]) => (
                <div key={l} className="bg-[#121212] p-4 md:p-6 rounded-2xl border border-neutral-800">
                  <p className="text-[9px] text-neutral-500 uppercase tracking-widest mb-2">{l}</p>
                  <h4 className="text-xl md:text-3xl font-serif text-white">{v}</h4>
                </div>
              ))}
            </div>
            <div className="bg-[#121212] p-6 md:p-8 rounded-2xl border border-neutral-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-8 border-b border-neutral-800 pb-4">Top Revenue Drivers</h3>
              <div className="space-y-6">
                {productsByRevenue.slice(0,5).map((item,idx) => {
                  const rev = (item.sold||0)*item.price;
                  const maxRev = (productsByRevenue[0]?.sold||0)*(productsByRevenue[0]?.price||1)||1;
                  return (
                    <div key={idx} className="flex flex-col gap-2">
                      <div className="flex justify-between text-[10px] uppercase tracking-widest">
                        <span className="text-white truncate mr-4">{item.name} <span className="text-neutral-600">({item.sold||0} sold)</span></span>
                        <span className="font-serif flex-shrink-0">Rs. {rev.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-white h-full rounded-full" style={{width:`${Math.max((rev/maxRev)*100,2)}%`}} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-8">
            <div className="bg-[#121212] p-6 md:p-8 rounded-2xl border border-neutral-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6 border-b border-neutral-800 pb-4">Add to Vault</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <input className={inp} placeholder="Name" value={newProduct.name} onChange={e=>setNewProduct({...newProduct,name:e.target.value})} required />
                <input className={inp} placeholder="Brand" value={newProduct.brand} onChange={e=>setNewProduct({...newProduct,brand:e.target.value})} required />
                <input type="number" className={inp} placeholder="Price (Rs)" value={newProduct.price} onChange={e=>setNewProduct({...newProduct,price:e.target.value})} required />
                <input type="number" className={inp} placeholder="Total Stock" value={newProduct.stock} onChange={e=>setNewProduct({...newProduct,stock:e.target.value})} required />
                <input type="number" className={inp} placeholder="Discount %" value={newProduct.discount} onChange={e=>setNewProduct({...newProduct,discount:e.target.value})} />
                <select className={inp} value={newProduct.category} onChange={e=>setNewProduct({...newProduct,category:e.target.value})}>
                  <option value="Men">Men</option><option value="Women">Women</option><option value="Unisex">Unisex</option>
                </select>
                <input className={inp} placeholder="Scent Notes" value={newProduct.notes} onChange={e=>setNewProduct({...newProduct,notes:e.target.value})} />
                <input className={inp} placeholder="Features" value={newProduct.features} onChange={e=>setNewProduct({...newProduct,features:e.target.value})} />
                <textarea className={`md:col-span-3 ${inp} h-20 resize-none`} placeholder="Description..." value={newProduct.details} onChange={e=>setNewProduct({...newProduct,details:e.target.value})} />
                <div className="md:col-span-3"><CloudinaryUpload label="Product Image" currentImage={newProduct.image} onUpload={url=>setNewProduct({...newProduct,image:url})} /></div>
                <button type="submit" className="md:col-span-3 bg-white text-black py-4 rounded-lg uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-neutral-200">Publish Fragrance</button>
              </form>
            </div>
            {/* ... List and Other Tabs ... */}
             <div className="bg-[#121212] rounded-2xl border border-neutral-800 overflow-hidden">
               <div className="p-4 md:p-6 border-b border-neutral-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/50">
                 <h3 className="text-xs font-bold text-white uppercase tracking-widest">Active Database</h3>
                 <div className="flex flex-wrap gap-3">
                   <input placeholder="Search..." className="text-[10px] bg-neutral-900 border border-neutral-800 rounded-md outline-none px-3 py-2 text-white w-36" value={inventorySearch} onChange={e=>setInventorySearch(e.target.value)} />
                   <SortSelect value={inventorySort} onChange={setInventorySort} options={[
                     {value:'newest',label:'🕐 Newest'},{value:'oldest',label:'🕐 Oldest'},
                     {value:'price_high',label:'💰 Price ↑'},{value:'price_low',label:'💰 Price ↓'},
                     {value:'stock_low',label:'⚠️ Low Stock'},{value:'best_seller',label:'🏆 Best Seller'},
                   ]} />
                 </div>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm whitespace-nowrap">
                   <thead className="bg-[#121212] text-[9px] uppercase tracking-widest font-bold text-neutral-500 border-b border-neutral-800">
                     <tr><th className="p-4 md:p-6">Product</th><th className="p-4 md:p-6 text-center">Stock</th><th className="p-4 md:p-6 text-center hidden sm:table-cell">Added</th><th className="p-4 md:p-6 text-center">Status</th><th className="p-4 md:p-6 text-right">Actions</th></tr>
                   </thead>
                   <tbody className="divide-y divide-neutral-800">
                     {sortedInventory.map(item => {
                       const remaining = (item.stock||0)-(item.sold||0);
                       const addedDate = item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-PK',{day:'numeric',month:'short',year:'numeric'}) : '—';
                       return (
                         <tr key={item._id} className="hover:bg-neutral-900/30">
                           <td className="p-4 md:p-6 flex items-center gap-3">
                             <img src={item.image} className="w-10 h-10 object-cover rounded-md border border-neutral-800 flex-shrink-0" alt="" />
                             <div><p className="font-serif text-sm text-white">{item.name}</p><p className="text-[9px] text-neutral-500">{item.brand} | Rs. {item.price?.toLocaleString()}</p></div>
                           </td>
                           <td className="p-4 md:p-6 text-center"><span className="text-white font-mono">{remaining}</span><span className="text-neutral-600 text-xs"> / {item.stock}</span></td>
                           <td className="p-4 md:p-6 text-center text-[9px] text-neutral-500 hidden sm:table-cell">{addedDate}</td>
                           <td className="p-4 md:p-6 text-center">
                             <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase border ${remaining>0?'bg-green-950/30 text-green-400 border-green-900/50':'bg-red-950/30 text-red-400 border-red-900/50'}`}>
                               {remaining>0?'Active':'Depleted'}
                             </span>
                           </td>
                           <td className="p-4 md:p-6 text-right space-x-1">
                             <button onClick={()=>setViewingInsights(item)} className="text-[9px] bg-neutral-800 hover:bg-neutral-700 text-white px-2 py-1.5 rounded">Insights</button>
                             <button onClick={()=>setEditingProduct(item)} className="text-[9px] bg-neutral-800 hover:bg-neutral-700 text-white px-2 py-1.5 rounded">Edit</button>
                             <button onClick={()=>deleteProduct(item._id)} className="text-[9px] border border-red-900/50 text-red-400 hover:bg-red-950/30 px-2 py-1.5 rounded">Drop</button>
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
        {/* ... Rest of Tabs (Orders, Design, Settings) ... */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {!selectedOrder ? (
              <div className="bg-[#121212] rounded-2xl border border-neutral-800 overflow-hidden">
                <div className="p-4 md:p-6 border-b border-neutral-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/50">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest">Order Log <span className="text-neutral-600">({sortedOrders.length})</span></h3>
                  <SortSelect value={orderSort} onChange={setOrderSort} options={[
                    {value:'newest',label:'🕐 Newest'},{value:'oldest',label:'🕐 Oldest'},
                    {value:'total_high',label:'💰 Total ↑'},{value:'total_low',label:'💰 Total ↓'},
                    {value:'processing',label:'⏳ Processing'},{value:'delivered',label:'✅ Delivered'},
                  ]} />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-[#0a0a0a] border-b border-neutral-800 text-[9px] uppercase tracking-widest font-bold text-neutral-500">
                      <tr><th className="p-4 md:p-6">Order ID</th><th className="p-4 md:p-6">Customer</th><th className="p-4 md:p-6 hidden md:table-cell">Date & Time</th><th className="p-4 md:p-6 text-center">Status</th><th className="p-4 md:p-6 text-center">Total</th><th className="p-4 md:p-6 text-center">Action</th></tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {sortedOrders.length === 0 ? (
                        <tr><td colSpan="6" className="p-20 text-center text-neutral-600 text-[10px] uppercase tracking-widest">No orders in system.</td></tr>
                      ) : sortedOrders.map(order => (
                        <tr key={order._id} className="hover:bg-neutral-900/30">
                          <td className="p-4 md:p-6 text-[10px] font-mono text-neutral-400">{order.orderId}</td>
                          <td className="p-4 md:p-6"><p className="text-xs font-bold text-white">{order.customer?.name}</p><p className="text-[9px] text-neutral-500">{order.customer?.city}</p></td>
                          <td className="p-4 md:p-6 hidden md:table-cell">
                            <p className="text-[10px] text-white">{order.date || new Date(order.createdAt).toLocaleDateString('en-PK',{day:'numeric',month:'short',year:'numeric'})}</p>
                            <p className="text-[9px] text-neutral-500">{order.time || new Date(order.createdAt).toLocaleTimeString('en-PK',{hour:'2-digit',minute:'2-digit',hour12:true})}</p>
                          </td>
                          <td className="p-4 md:p-6 text-center">
                            <select value={order.status} onChange={e=>updateOrderStatus(order._id,e.target.value)} className="text-[9px] font-bold bg-neutral-900 border border-neutral-700 text-white px-2 py-1.5 rounded outline-none">
                              <option value="Processing">Processing</option><option value="Shipped">Shipped</option><option value="Delivered">Delivered</option>
                            </select>
                          </td>
                          <td className="p-4 md:p-6 text-center font-serif text-white text-sm">Rs. {order.total?.toLocaleString()}</td>
                          <td className="p-4 md:p-6 text-center"><button onClick={()=>setSelectedOrder(order)} className="text-[9px] font-bold bg-white text-black px-3 py-1.5 rounded hover:bg-neutral-300">View</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-[#121212] border border-neutral-800 p-6 md:p-12 rounded-2xl">
                <div className="flex justify-between items-start mb-10 border-b border-neutral-800 pb-6">
                  <div>
                    <button onClick={()=>setSelectedOrder(null)} className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-4 block hover:text-white">← Back</button>
                    <h3 className="text-2xl font-serif text-white">Order {selectedOrder.orderId}</h3>
                    <p className="text-[10px] text-neutral-500 mt-1">
                      {selectedOrder.date || new Date(selectedOrder.createdAt).toLocaleDateString()} &nbsp;·&nbsp; {selectedOrder.time || new Date(selectedOrder.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right"><p className="text-[9px] text-neutral-500 uppercase">Payment</p><p className="text-xs font-bold uppercase text-white">{selectedOrder.paymentMethod}</p></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800/50">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-6">Client Profile</h4>
                    {[['Name',selectedOrder.customer.name],['Phone',selectedOrder.customer.phone],['City',selectedOrder.customer.city],['Address',selectedOrder.customer.address]].map(([l,v])=>(
                      <p key={l} className="flex flex-col mb-4"><span className="text-[9px] text-neutral-600 uppercase mb-1">{l}</span><span className="text-white text-xs">{v}</span></p>
                    ))}
                  </div>
                  <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800/50">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-6">Manifest</h4>
                    {selectedOrder.items.map((item,i)=>(
                      <div key={i} className="flex justify-between border-b border-neutral-800/50 pb-3 mb-3">
                        <p className="text-xs text-white">{item.name}</p><p className="text-xs font-serif text-neutral-400">Rs. {item.price?.toLocaleString()}</p>
                      </div>
                    ))}
                    <div className="flex justify-between pt-4"><p className="text-[10px] font-black uppercase text-white">Net Total</p><p className="text-xl font-serif text-white">Rs. {selectedOrder.total?.toLocaleString()}</p></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'design' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#121212] p-6 md:p-8 rounded-2xl border border-neutral-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-8 border-b border-neutral-800 pb-4">Hero Image Management</h3>
              <CloudinaryUpload label="Upload Hero Image" onUpload={url=>{if(url) setHeroImages([...heroImages,url]);}} />
              <div className="grid grid-cols-3 gap-3 mt-6">
                {heroImages.map((img,i)=>(
                  <div key={i} className="aspect-square bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 relative group">
                    <img src={img} className="w-full h-full object-cover" alt="" />
                    <button onClick={()=>setHeroImages(heroImages.filter((_,j)=>j!==i))} className="absolute top-2 right-2 bg-red-500/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100">×</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#121212] p-6 md:p-8 rounded-2xl border border-neutral-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6 border-b border-neutral-800 pb-4">Hero Adjustments</h3>
              <label className="block text-[10px] text-neutral-500 uppercase tracking-widest mb-4">Image Zoom ({heroZoom}%)</label>
              <input type="range" min="100" max="150" value={heroZoom} onChange={e=>setHeroZoom(Number(e.target.value))} className="w-full accent-white" />
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-[#121212] p-6 md:p-8 rounded-2xl border border-neutral-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-8 border-b border-neutral-800 pb-4">Store Information & Policies</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {[['Support Email','email','email'],['Contact Number','phone','text']].map(([l,k,t])=>(
                  <div key={k}><label className="text-[10px] text-neutral-500 uppercase tracking-widest block mb-2">{l}</label>
                  <input type={t} value={storeInfo[k]||''} onChange={e=>setStoreInfo({...storeInfo,[k]:e.target.value})} className={inp+" w-full"} /></div>
                ))}
                <div><label className="text-[10px] text-neutral-500 uppercase tracking-widest block mb-2">Shipping Policy</label>
                <textarea rows="4" value={storeInfo.shippingPolicy||''} onChange={e=>setStoreInfo({...storeInfo,shippingPolicy:e.target.value})} className={inp+" w-full resize-none"} /></div>
              </div>
              <div className="space-y-6 flex flex-col">
                <div><label className="text-[10px] text-neutral-500 uppercase tracking-widest block mb-2">Return Policy</label>
                <textarea rows="4" value={storeInfo.returnPolicy||''} onChange={e=>setStoreInfo({...storeInfo,returnPolicy:e.target.value})} className={inp+" w-full resize-none"} /></div>
                <div><label className="text-[10px] text-neutral-500 uppercase tracking-widest block mb-2">Store Address</label>
                <textarea rows="3" value={storeInfo.address||''} onChange={e=>setStoreInfo({...storeInfo,address:e.target.value})} className={inp+" w-full resize-none"} /></div>
                <button onClick={handleSaveSettings} className="mt-auto w-full bg-white text-black py-4 rounded-lg uppercase tracking-widest text-[10px] font-bold hover:bg-neutral-300">
                  {savingSettings?'Saving...':'Save Configuration'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121212] border border-neutral-800 p-6 md:p-8 rounded-2xl w-full max-w-2xl my-8 relative">
            <button onClick={()=>setEditingProduct(null)} className="absolute top-4 right-4 text-neutral-500 hover:text-white text-xl">×</button>
            <h3 className="text-lg font-serif text-white mb-6">Modify Fragrance</h3>
            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="text-[9px] text-neutral-500 uppercase mb-1 block">Title</label><input type="text" className={inp+" w-full"} value={editingProduct.name} onChange={e=>setEditingProduct({...editingProduct,name:e.target.value})} required /></div>
              <div><label className="text-[9px] text-neutral-500 uppercase mb-1 block">Brand</label><input type="text" className={inp+" w-full"} value={editingProduct.brand} onChange={e=>setEditingProduct({...editingProduct,brand:e.target.value})} required /></div>
              <div><label className="text-[9px] text-neutral-500 uppercase mb-1 block">Price</label><input type="number" className={inp+" w-full"} value={editingProduct.price} onChange={e=>setEditingProduct({...editingProduct,price:e.target.value})} required /></div>
              <div><label className="text-[9px] text-neutral-500 uppercase mb-1 block">Stock</label><input type="number" className={inp+" w-full"} value={editingProduct.stock} onChange={e=>setEditingProduct({...editingProduct,stock:e.target.value})} required /></div>
              <div className="md:col-span-2"><CloudinaryUpload label="Product Image" currentImage={editingProduct.image} onUpload={url=>setEditingProduct({...editingProduct,image:url})} /></div>
              <div className="md:col-span-2"><label className="text-[9px] text-neutral-500 uppercase mb-1 block">Description</label><textarea className={inp+" w-full h-20 resize-none"} value={editingProduct.details} onChange={e=>setEditingProduct({...editingProduct,details:e.target.value})} /></div>
              <button type="submit" className="md:col-span-2 bg-white text-black py-4 rounded-lg uppercase tracking-widest text-[10px] font-bold hover:bg-neutral-300 mt-2">Commit Changes</button>
            </form>
          </div>
        </div>
      )}

      {viewingInsights && (() => {
        const rev = (viewingInsights.sold||0)*viewingInsights.price;
        const pct = ((rev/(totalRevenue||1))*100).toFixed(1);
        const left = (viewingInsights.stock||0)-(viewingInsights.sold||0);
        return (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#121212] border border-neutral-800 rounded-2xl w-full max-w-xl overflow-hidden flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 bg-neutral-900 relative min-h-40">
                <img src={viewingInsights.image} alt="" className="w-full h-full object-cover absolute inset-0 opacity-60 mix-blend-overlay" />
                <div className="relative z-10 p-6 min-h-40 flex flex-col justify-end">
                  <button onClick={()=>setViewingInsights(null)} className="absolute top-4 left-4 bg-black/50 w-8 h-8 rounded-full text-white flex items-center justify-center hover:bg-white hover:text-black">×</button>
                  <p className="text-[9px] text-neutral-300">{viewingInsights.brand}</p>
                  <h3 className="text-lg font-serif text-white">{viewingInsights.name}</h3>
                </div>
              </div>
              <div className="w-full md:w-2/3 p-6 md:p-8 space-y-6">
                <div><p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Financial Yield</p>
                <p className="text-2xl font-serif text-green-400">Rs. {rev.toLocaleString()}</p>
                <p className="text-xs text-neutral-500 mt-1">Accounts for <strong className="text-white">{pct}%</strong> of revenue.</p></div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
                  <div><p className="text-[9px] text-neutral-500 uppercase mb-1">Units Sold</p><p className="text-lg text-white font-mono">{viewingInsights.sold||0}</p></div>
                  <div><p className="text-[9px] text-neutral-500 uppercase mb-1">Stock Left</p><p className="text-lg text-white font-mono">{left}</p></div>
                </div>
                <div className="pt-4 border-t border-neutral-800">
                  <p className="text-[9px] text-neutral-500 uppercase mb-3">Inventory Health</p>
                  <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${left>10?'bg-green-500':left>0?'bg-yellow-500':'bg-red-500'}`} style={{width:`${Math.min((left/(viewingInsights.stock||1))*100,100)}%`}} />
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