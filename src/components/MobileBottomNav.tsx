import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, Heart, ShoppingBag, Settings, Search } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const MobileBottomNav: React.FC = () => {
  const { cartCount, wishlist, isCartBouncing } = useShop();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FFF9F0] border-t border-[#F4E3DD] shadow-lg px-2 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] flex items-center justify-around">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-3 text-xs font-medium transition-colors ${
            isActive ? 'text-[#751C2F]' : 'text-[#756A64]'
          }`
        }
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/shop"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-3 text-xs font-medium transition-colors ${
            isActive ? 'text-[#751C2F]' : 'text-[#756A64]'
          }`
        }
      >
        <Grid className="w-5 h-5 mb-0.5" />
        <span>Shop</span>
      </NavLink>

      <NavLink
        to="/search"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-3 text-xs font-medium transition-colors ${
            isActive ? 'text-[#751C2F]' : 'text-[#756A64]'
          }`
        }
      >
        <Search className="w-5 h-5 mb-0.5" />
        <span>Search</span>
      </NavLink>

      <NavLink
        to="/wishlist"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-3 text-xs font-medium transition-colors relative ${
            isActive ? 'text-[#751C2F]' : 'text-[#756A64]'
          }`
        }
      >
        <Heart className="w-5 h-5 mb-0.5" />
        <span>Wishlist</span>
        {wishlist.length > 0 && (
          <span className="absolute top-0 right-2 w-4 h-4 bg-[#C7953E] text-white rounded-full text-[9px] font-bold flex items-center justify-center">
            {wishlist.length}
          </span>
        )}
      </NavLink>

      <NavLink
        to="/cart"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-3 text-xs font-medium transition-all relative ${
            isCartBouncing ? 'animate-bounce text-[#751C2F] font-bold scale-110' : isActive ? 'text-[#751C2F]' : 'text-[#756A64]'
          }`
        }
      >
        <ShoppingBag className="w-5 h-5 mb-0.5" />
        <span>Cart</span>
        {cartCount > 0 && (
          <span className={`absolute top-0 right-2 w-4 h-4 bg-[#751C2F] text-white rounded-full text-[9px] font-bold flex items-center justify-center ${
            isCartBouncing ? 'bg-emerald-600 scale-110' : ''
          }`}>
            {cartCount}
          </span>
        )}
      </NavLink>

    </div>
  );
};
