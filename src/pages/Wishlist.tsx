import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Heart } from 'lucide-react';

export const Wishlist: React.FC = () => {
  const { wishlist } = useShop();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b border-[#F4E3DD] pb-4">
        <span className="text-xs font-bold text-[#C7953E] uppercase tracking-wider block">
          Your Saved Crafts
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#751C2F]">
          Wishlist ({wishlist.length})
        </h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#F4E3DD] p-12 text-center space-y-4 max-w-md mx-auto">
          <Heart className="w-12 h-12 text-[#F4E3DD] mx-auto" />
          <h2 className="font-serif font-bold text-[#751C2F] text-lg">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs text-[#756A64]">
            Save your favorite CNC jalis and custom room divider designs while browsing our catalog.
          </p>
          <Link to="/shop" className="inline-block px-6 py-2.5 bg-[#751C2F] text-white text-xs font-bold rounded-lg hover:bg-[#591423]">
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
