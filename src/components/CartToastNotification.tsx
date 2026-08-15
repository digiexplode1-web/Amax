import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, X, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartToastNotification: React.FC = () => {
  const { lastAddedItem, dismissCartToast, cartCount } = useShop();

  useEffect(() => {
    if (lastAddedItem) {
      const timer = setTimeout(() => {
        dismissCartToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [lastAddedItem, dismissCartToast]);

  if (!lastAddedItem) return null;

  const { product, quantity } = lastAddedItem;
  const image = product.images && product.images.length > 0 ? product.images[0] : (product.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80');

  return (
    <div className="fixed top-16 right-4 sm:right-6 z-50 max-w-sm w-full animate-slide-down transition-all duration-300">
      <div className="bg-[#25201E]/95 backdrop-blur-md text-white p-4 rounded-2xl border-2 border-[#C7953E] shadow-2xl space-y-3 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-[#C7953E]/30 rounded-full blur-xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/40">
              <CheckCircle2 className="w-4 h-4 animate-pulse" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C7953E]">
              Added to Shopping Cart!
            </span>
          </div>
          <button
            onClick={dismissCartToast}
            className="text-white/60 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Dismiss toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Details Row */}
        <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/10">
          <img
            src={image}
            alt={product.name}
            className="w-12 h-12 object-cover rounded-lg border border-[#C7953E]/40 shrink-0 bg-white"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate" title={product.name}>
              {product.name}
            </h4>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs font-semibold text-[#D4AF37]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-white/70 bg-white/10 px-2 py-0.5 rounded">
                Qty: {quantity}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 pt-1">
          <Link
            to="/cart"
            onClick={dismissCartToast}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-[#751C2F] to-[#591423] hover:from-[#591423] hover:to-[#751C2F] text-white font-bold text-xs rounded-xl border border-[#C7953E]/50 transition-all shadow-md group"
          >
            <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
            <span>View Cart ({cartCount})</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#D4AF37]" />
          </Link>
        </div>
      </div>
    </div>
  );
};
