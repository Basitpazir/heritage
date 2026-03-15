import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Cart = ({ cart, removeFromCart, placeOrder }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '', email: '', phone: '', address: '', city: ''
  });

  const subtotal = cart.reduce((sum, item) => {
    const discountedPrice = item.price - (item.price * ((item.discount || 0) / 100));
    return sum + discountedPrice;
  }, 0);
  const total = subtotal;

  const handleCheckout = async (e) => {
    e.preventDefault();
    const orderId = await placeOrder(customerInfo, cart, total, 'Cash on Delivery');
    if (orderId) {
      setOrderSuccess(orderId);
      setIsCheckingOut(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="bg-white p-8 sm:p-12 border border-stone-200 shadow-sm max-w-md w-full">
          <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mb-4 uppercase tracking-widest">Thank You</h2>
          <p className="text-xs text-stone-500 mb-6 uppercase tracking-widest leading-relaxed">Your order has been placed successfully.</p>
          <div className="bg-stone-50 p-4 border border-stone-100 mb-8">
            <p className="text-[10px] font-bold text-stone-900 uppercase tracking-widest mb-1">Order Reference</p>
            <p className="text-lg font-serif text-stone-600">{orderSuccess}</p>
          </div>
          <Link to="/products" className="inline-block w-full bg-stone-900 text-white py-4 sm:py-5 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-black transition-all">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 p-4 sm:p-6 lg:p-16 font-sans">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8 sm:mb-12 border-b border-stone-200 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 uppercase tracking-widest">Shopping Bag</h1>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-2">{cart.length} Items</p>
          </div>
          {isCheckingOut && (
            <button onClick={() => setIsCheckingOut(false)} className="text-[10px] uppercase tracking-widest text-stone-500 hover:text-stone-900 font-bold transition-colors">
              ← Back
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 sm:py-32 bg-white border border-stone-200 shadow-sm">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-8">Your bag is currently empty.</p>
            <Link to="/products" className="inline-block border border-stone-900 text-stone-900 px-8 py-4 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-stone-50">
              Discover Fragrances
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-12">

            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {!isCheckingOut ? (
                cart.map((item, index) => {
                  const discountedPrice = item.price - (item.price * ((item.discount || 0) / 100));
                  return (
                    <div key={`${item._id}-${index}`} className="flex gap-4 sm:gap-6 bg-white p-4 sm:p-6 border border-stone-200 shadow-sm items-center">
                      <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-24 sm:h-24 object-cover border border-stone-100 flex-shrink-0" />
                      <div className="flex-grow min-w-0">
                        <p className="text-[9px] sm:text-[10px] text-stone-400 uppercase tracking-widest mb-1">{item.brand}</p>
                        <h3 className="text-sm sm:text-lg font-serif text-stone-900 uppercase tracking-widest truncate">{item.name}</h3>
                        <div className="mt-1 sm:mt-2 flex items-center gap-3">
                          <p className="text-sm font-serif text-stone-900">Rs.{discountedPrice.toLocaleString()}</p>
                          {item.discount > 0 && <p className="text-xs text-stone-300 line-through">Rs.{item.price.toLocaleString()}</p>}
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item._id)} className="text-stone-300 hover:text-red-500 transition-colors p-1 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="bg-white p-6 sm:p-10 border border-stone-200 shadow-sm">
                  <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-6 sm:mb-8 border-b pb-4">Shipping Details</h3>
                  <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6 sm:space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                      <input type="text" placeholder="Full Name"
                        className="border-b border-stone-200 p-2 text-sm outline-none focus:border-stone-900 bg-transparent uppercase text-[10px] tracking-widest"
                        value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} required />
                      <input type="email" placeholder="Email Address"
                        className="border-b border-stone-200 p-2 text-sm outline-none focus:border-stone-900 bg-transparent uppercase text-[10px] tracking-widest"
                        value={customerInfo.email} onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})} required />
                      <input type="text" placeholder="City"
                        className="border-b border-stone-200 p-2 text-sm outline-none focus:border-stone-900 bg-transparent uppercase text-[10px] tracking-widest"
                        value={customerInfo.city} onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})} required />
                      <input type="tel" placeholder="Phone Number"
                        className="border-b border-stone-200 p-2 text-sm outline-none focus:border-stone-900 bg-transparent uppercase text-[10px] tracking-widest"
                        value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} required />
                    </div>
                    <textarea placeholder="Delivery Address"
                      className="w-full border-b border-stone-200 p-2 text-sm outline-none h-20 resize-none focus:border-stone-900 bg-transparent uppercase text-[10px] tracking-widest"
                      value={customerInfo.address} onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})} required />

                    {/* COD Only */}
                    <div className="pt-2">
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-900 mb-3">Payment Method</p>
                      <div className="flex items-center gap-3 p-4 border border-stone-900 bg-stone-50">
                        <div className="w-3 h-3 rounded-full bg-stone-900 flex-shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Cash on Delivery</span>
                        <span className="ml-auto text-[9px] text-green-600 font-bold uppercase tracking-widest">Selected</span>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 sm:p-8 border border-stone-200 shadow-sm sticky top-24">
                <h3 className="text-[10px] font-bold text-stone-900 uppercase tracking-widest mb-6 border-b pb-4">Order Summary</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-xs text-stone-500 uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span>Rs.{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[10px] items-center">
                    <span className="text-stone-500 uppercase tracking-widest">Shipping</span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 font-black uppercase tracking-tighter rounded-full text-[8px]">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm font-serif text-stone-900 pt-4 border-t border-stone-100">
                    <span className="uppercase tracking-widest">Total</span>
                    <span>Rs.{total.toLocaleString()}</span>
                  </div>
                </div>

                {!isCheckingOut ? (
                  <button onClick={() => setIsCheckingOut(true)}
                    className="w-full bg-stone-900 text-white py-4 sm:py-5 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-black transition-all shadow-md">
                    Secure Checkout
                  </button>
                ) : (
                  <button form="checkout-form" type="submit"
                    className="w-full bg-stone-900 text-white py-4 sm:py-5 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-black transition-all shadow-md">
                    Confirm Order
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;