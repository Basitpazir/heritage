import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Navbar from "./Component/Navbar.jsx";
import Footer from "./Component/Footer.jsx";
import ProtectedRoute from "./Component/ProtectedRoute.jsx";
import Home from "./Pages/Home.jsx";
import Products from "./Pages/Products.jsx";
import Login from "./Pages/Login.jsx";
import Signup from "./Pages/Signup.jsx";
import Cart from "./Pages/Cart.jsx";
import Admin from "./Pages/Admin.jsx";
import AdminAuth from "./Pages/AdminAuth.jsx";
import ProductDetails from "./Pages/ProductDetails.jsx";
import CustomerAccount from "./Pages/CustomerAccount.jsx";
import TrackOrder from "./Pages/TrackOrder.jsx";
import GoogleAuthSuccess from "./Pages/GoogleAuthSuccess.jsx";

// Use environment variable for Vercel compatibility
const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : 'http://localhost:5000';
const API = `${API_BASE}/api`;

const storedAdminToken = localStorage.getItem('adminToken');

const Layout = ({ children, cartCount, storeInfo }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPage && <Navbar cartCount={cartCount} storeInfo={storeInfo} />}
      <main className="flex-grow">{children}</main>
      {!isAdminPage && <Footer storeInfo={storeInfo} />}
    </div>
  );
};

function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [adminToken, setAdminToken] = useState(storedAdminToken);
  const [heroImages, setHeroImages] = useState([]);
  const [heroZoom, setHeroZoom] = useState(100);
  const [storeInfo, setStoreInfo] = useState({
    email: 'contact@heritage.com',
    phone: '+92 300 1234567',
    address: 'Heritage Flagship Store, Pakistan',
    shippingPolicy: 'Free shipping on all orders.',
    returnPolicy: 'Returns accepted within 14 days.'
  });

  useEffect(() => {
    fetch(`${API}/settings`)
      .then(r => r.json())
      .then(data => {
        setHeroImages(data.heroImages || []);
        setHeroZoom(data.heroZoom || 100);
        setStoreInfo({ email: data.email, phone: data.phone, address: data.address, shippingPolicy: data.shippingPolicy, returnPolicy: data.returnPolicy });
      }).catch(() => {});
  }, []);

  const fetchProducts = () => {
    fetch(`${API}/products`).then(r => r.json()).then(data => setProducts(Array.isArray(data) ? data : [])).catch(() => {});
  };
  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    if (!adminToken) return;
    fetch(`${API}/orders`, { headers: { Authorization: `Bearer ${adminToken}` } })
      .then(r => r.json()).then(data => setOrders(Array.isArray(data) ? data : [])).catch(() => {});
  }, [adminToken]);

  const addProduct = async (newProduct) => {
    const res = await fetch(`${API}/products`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` }, body: JSON.stringify(newProduct) });
    const data = await res.json();
    if (res.ok) setProducts(prev => [data, ...prev]); else alert(data.error);
  };

  const updateProduct = async (id, updatedFields) => {
    const res = await fetch(`${API}/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` }, body: JSON.stringify(updatedFields) });
    const data = await res.json();
    if (res.ok) setProducts(prev => prev.map(p => p._id === id ? data : p)); else alert(data.error);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    const res = await fetch(`${API}/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${adminToken}` } });
    if (res.ok) setProducts(prev => prev.filter(p => p._id !== id));
  };

  const placeOrder = async (customerDetails, cartItems, total, paymentMethod) => {
    const items = cartItems.map(item => ({ productId: item._id, name: item.name, brand: item.brand, image: item.image, price: item.price, discount: item.discount }));
    const res = await fetch(`${API}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customer: customerDetails, items, total, paymentMethod }) });
    const data = await res.json();
    if (res.ok) { setCart([]); fetchProducts(); return data.orderId; }
    else { alert(data.error); return null; }
  };

  const addToCart = (product) => setCart(prev => [...prev, product]);
  const removeFromCart = (id) => setCart(prev => prev.filter(item => item._id !== id));

  const saveHeroSettings = async (images, zoom) => {
    await fetch(`${API}/settings/hero`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` }, body: JSON.stringify({ heroImages: images, heroZoom: zoom }) });
  };

  const handleSetHeroImages = (images) => { setHeroImages(images); saveHeroSettings(images, heroZoom); };
  const handleSetHeroZoom = (zoom) => { setHeroZoom(zoom); saveHeroSettings(heroImages, zoom); };
  const handleSetStoreInfo = (info) => {
    setStoreInfo(info);
    fetch(`${API}/settings/store`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` }, body: JSON.stringify(info) });
  };

  const handleAdminLogin = (token) => { localStorage.setItem('adminToken', token); setAdminToken(token); };
  const handleAdminLogout = () => { localStorage.removeItem('adminToken'); setAdminToken(null); };

  return (
    <Router>
      <Layout cartCount={cart.length} storeInfo={storeInfo}>
        <Routes>
          <Route path="/" element={<Home heroImages={heroImages} heroZoom={heroZoom} products={products} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* FIXED: Changed from /google-auth-success to /auth/google/success so it perfectly matches the backend redirect */}
          <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />

          <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute><ProductDetails addToCart={addToCart} /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart cart={cart} removeFromCart={removeFromCart} placeOrder={placeOrder} /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><CustomerAccount /></ProtectedRoute>} />
          <Route path="/track-order" element={<ProtectedRoute><TrackOrder /></ProtectedRoute>} />

          <Route path="/admin" element={
            adminToken
              ? <Admin
                  products={products} orders={orders} setOrders={setOrders}
                  addProduct={addProduct} updateProduct={updateProduct} deleteProduct={deleteProduct}
                  setIsAdminLoggedIn={handleAdminLogout}
                  heroImages={heroImages} setHeroImages={handleSetHeroImages}
                  heroZoom={heroZoom} setHeroZoom={handleSetHeroZoom}
                  storeInfo={storeInfo} setStoreInfo={handleSetStoreInfo}
                  adminToken={adminToken}
                />
              : <Navigate to="/admin-auth" replace />
          } />
          <Route path="/admin-auth" element={<AdminAuth onAdminLogin={handleAdminLogin} />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;