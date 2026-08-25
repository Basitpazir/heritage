import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Cart = ({ cart, removeFromCart, placeOrder }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '', address: '', city: '' });

  const subtotal = cart.reduce((sum, item) => {
    return sum + (item.price - (item.price * ((item.discount || 0) / 100)));
  }, 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    const orderId = await placeOrder(customerInfo, cart, subtotal, 'Cash on Delivery');
    if (orderId) { setOrderSuccess(orderId); setIsCheckingOut(false); }
  };

  if (orderSuccess) return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-12 h-12 border border-white/20 flex items-center justify-center mx-auto mb-8">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif text-white uppercase tracking-widest mb-4">Order Placed</h2>
        <p className="text-[10px] text-white/30 mb-8 uppercase tracking-widest leading-loose">Your order has been confirmed. We will process it shortly.</p>
        <div className="border border-white/10 p-6 mb-8">
          <p className="text-[9px] text-white/30 uppercase tracking-widest mb-2">Reference</p>
          <p className="text-lg font-serif text-white">{orderSuccess}</p>
        </div>
        <Link to="/products" className="inline-block w-full bg-white text-black py-4 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white/90 transition-all">
          Continue Shopping
        </Link>
      </div>
    </div>
  );

  const inp = "w-full bg-transparent border-b border-white/10 py-3 focus:border-white/30 outline-none text-white text-[10px] uppercase tracking-widest placeholder:text-white/15 transition-all";

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-12 py-10 sm:py-16 font-sans">
      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-end mb-10 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif uppercase tracking-widest text-white">Shopping Bag</h1>
            <p className="text-[9px] text-white/25 uppercase tracking-widest mt-2">{cart.length} {cart.length === 1 ? 'Item' : 'Items'}</p>
          </div>
          {isCheckingOut && (
            <button onClick={() => setIsCheckingOut(false)} className="text-[9px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">
              ← Back
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-32 border border-white/5">
            <p className="text-[10px] text-white/20 uppercase tracking-widest mb-8">Your bag is empty.</p>
            <Link to="/products" className="inline-block border border-white/20 text-white px-10 py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all">
              Explore OBSIDIAN
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">

            <div className="lg:col-span-2 space-y-4">
              {!isCheckingOut ? (
                cart.map((item, index) => {
                  const discountedPrice = item.price - (item.price * ((item.discount || 0) / 100));
                  return (
                    <div key={`${item._id}-${index}`} className="flex gap-4 sm:gap-6 border border-white/5 p-4 sm:p-5 hover:border-white/10 transition-colors">
                      <div className="w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 overflow-hidden bg-neutral-900">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-[8px] text-white/25 uppercase tracking-widest mb-1">{item.brand || 'OBSIDIAN'}</p>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white truncate mb-2">{item.name}</h3>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-serif text-white">Rs. {discountedPrice.toLocaleString()}</span>
                          {item.discount > 0 && <span className="text-[9px] text-white/25 line-through">Rs. {item.price.toLocaleString()}</span>}
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item._id)} className="text-white/20 hover:text-white transition-colors p-1 flex-shrink-0 self-start">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="border border-white/5 p-6 sm:p-8">
                  <h3 className="text-[9px] font-bold text-white/30 uppercase tracking-[0.4em] mb-8 border-b border-white/5 pb-4">Shipping Details</h3>
                  <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[8px] text-white/25 uppercase tracking-widest mb-2">Full Name</label>
                        <input type="text" placeholder="Your Name" className={inp} value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-[8px] text-white/25 uppercase tracking-widest mb-2">Email</label>
                        <input type="email" placeholder="your@email.com" className={inp} value={customerInfo.email} onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-[8px] text-white/25 uppercase tracking-widest mb-2">City</label>
                        <input type="text" placeholder="City" className={inp} value={customerInfo.city} onChange={e => setCustomerInfo({...customerInfo, city: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-[8px] text-white/25 uppercase tracking-widest mb-2">Phone</label>
                        <input type="tel" placeholder="+92 300 0000000" className={inp} value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[8px] text-white/25 uppercase tracking-widest mb-2">Delivery Address</label>
                      <textarea placeholder="Full address" className={`${inp} h-20 resize-none`} value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} required />
                    </div>

                    <div className="border border-white/10 p-4 flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-white flex-shrink-0" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white">Cash on Delivery</span>
                      <span className="ml-auto text-[8px] text-white/30 uppercase tracking-widest">Selected</span>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="border border-white/5 p-6 sticky top-28">
                <h3 className="text-[9px] font-bold text-white/30 uppercase tracking-[0.4em] mb-6 border-b border-white/5 pb-4">Order Summary</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-[10px] text-white/40 uppercase tracking-widest">
                    <span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[10px] items-center">
                    <span className="text-white/40 uppercase tracking-widest">Shipping</span>
                    <span className="text-white/60 text-[9px] uppercase tracking-widest">Free</span>
                  </div>
                  <div className="flex justify-between font-serif text-white pt-4 border-t border-white/5">
                    <span className="text-[10px] uppercase tracking-widest">Total</span>
                    <span>Rs. {subtotal.toLocaleString()}</span>
                  </div>
                </div>

                {!isCheckingOut ? (
                  <button onClick={() => setIsCheckingOut(true)}
                    className="w-full bg-white text-black py-4 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white/90 transition-all">
                    Checkout
                  </button>
                ) : (
                  <button form="checkout-form" type="submit"
                    className="w-full bg-white text-black py-4 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white/90 transition-all">
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