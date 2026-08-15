import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft, MessageCircle } from 'lucide-react';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, clearCart, cartTotal } = useShop();
  const navigate = useNavigate();

  const gstAmount = Math.round(cartTotal * 0.18);
  const finalTotal = cartTotal + gstAmount;

  const whatsappCartSummary = encodeURIComponent(
    `Hello Amax Craft, I want to submit a order inquiry for my cart:\n` +
      cart.map((i) => `- ${i.product.name} (Qty: ${i.quantity}, Finish: ${i.selectedFinish || 'Default'})`).join('\n') +
      `\nTotal: ₹${finalTotal.toLocaleString('en-IN')}`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b border-[#F4E3DD] pb-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[#C7953E] uppercase tracking-wider block">
            Amax Craft Order Summary
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#751C2F]">
            Shopping Cart ({cart.length} Items)
          </h1>
        </div>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Cart
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#F4E3DD] p-12 text-center space-y-4 max-w-md mx-auto">
          <ShoppingBag className="w-12 h-12 text-[#F4E3DD] mx-auto" />
          <h2 className="font-serif font-bold text-[#751C2F] text-lg">
            Your Cart is Currently Empty
          </h2>
          <p className="text-xs text-[#756A64]">
            Explore our custom CNC laser cutting jalis, room dividers, and railing strips to start building your order.
          </p>
          <Link to="/shop" className="inline-block px-6 py-2.5 bg-[#751C2F] text-white text-xs font-bold rounded-lg hover:bg-[#591423]">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-white p-4 rounded-xl border border-[#F4E3DD] flex flex-col sm:flex-row items-center gap-4 shadow-2xs"
              >
                <img
                  src={item.product.imageUrl || item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg bg-[#FFF9F0] shrink-0"
                />

                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <span className="text-[10px] font-bold text-[#C7953E] uppercase">
                    {item.product.category}
                  </span>
                  <h3 className="font-serif font-bold text-sm text-[#25201E]">
                    {item.product.name}
                  </h3>
                  <div className="text-xs text-[#756A64]">
                    Finish: <span className="font-medium text-[#25201E]">{item.selectedFinish || 'Standard'}</span>
                  </div>
                  <div className="text-xs font-bold text-[#751C2F] font-serif">
                    ₹{item.product.price.toLocaleString('en-IN')} / unit
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#F4E3DD] rounded-lg overflow-hidden bg-[#FFF9F0]">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="px-2 py-1 text-xs font-bold hover:bg-[#F4E3DD]"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-xs font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="px-2 py-1 text-xs font-bold hover:bg-[#F4E3DD]"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <Link to="/shop" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#751C2F] hover:underline pt-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </Link>
          </div>

          {/* Cart Order Total Card */}
          <div className="bg-white p-6 rounded-xl border border-[#F4E3DD] space-y-6 h-fit shadow-sm">
            <h3 className="font-serif font-bold text-[#751C2F] text-lg border-b border-[#F4E3DD] pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs text-[#756A64]">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} items)</span>
                <span className="font-bold text-[#25201E]">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (18%)</span>
                <span className="font-bold text-[#25201E]">₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping & Framing</span>
                <span className="font-bold text-emerald-700">Calculated at Checkout</span>
              </div>
              <div className="pt-3 border-t border-[#F4E3DD] flex justify-between text-base font-bold text-[#751C2F]">
                <span>Total Amount</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#751C2F] text-white font-bold text-xs rounded-xl hover:bg-[#591423] transition-colors shadow-md"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/918514000016?text=${whatsappCartSummary}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-emerald-700 text-white font-bold text-xs rounded-xl hover:bg-emerald-800 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send Cart Order via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
