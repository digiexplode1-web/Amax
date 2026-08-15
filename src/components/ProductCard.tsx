import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, MessageCircle, Star, Sparkles, Check } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const [isAdded, setIsAdded] = useState(false);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const whatsappMessage = encodeURIComponent(
    `Hello Amax Craft,\n\nI want to inquire about this product:\n- Product Name: ${product.name}\n- Category: ${product.category}\n- Price: ₹${product.price.toLocaleString('en-IN')}\n\nPlease share custom sizing, CAD design quote, and ordering options.`
  );

  return (
    <div className="bg-white rounded-xl border border-[#F4E3DD] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group relative">
      {/* Product Image & Badges Container */}
      <div className="relative aspect-4/3 bg-[#FFF9F0] overflow-hidden">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.images && product.images.length > 0 ? product.images[0] : product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
          {product.isWeddingEssential && (
            <span className="bg-[#751C2F] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Sparkles className="w-2.5 h-2.5 text-[#C7953E]" />
              Wedding Essential
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-[#C7953E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              New
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-colors z-10 ${
            inWishlist
              ? 'bg-[#751C2F] text-white'
              : 'bg-white/90 text-[#756A64] hover:text-[#751C2F] hover:bg-white'
          }`}
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className="w-4 h-4 fill-current" />
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-medium text-[#C7953E] uppercase tracking-wider block mb-1">
            {product.category}
          </span>
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-serif font-bold text-[#25201E] text-sm sm:text-base group-hover:text-[#751C2F] transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Rating & Reviews Count */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating || 4.8)
                      ? 'fill-amber-500 text-amber-500'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-[#25201E]">
              {product.rating ? product.rating.toFixed(1) : '4.8'}
            </span>
            <span className="text-[10px] text-[#756A64]/80">
              ({product.reviewsCount || 15} reviews)
            </span>
          </div>

          {/* Key Specs */}
          <div className="mt-2 text-xs text-[#756A64] space-y-0.5">
            {product.material && <div><span className="font-medium text-[#25201E]">Material:</span> {product.material}</div>}
            {product.dimensions && <div><span className="font-medium text-[#25201E]">Size:</span> {product.dimensions}</div>}
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="mt-4 pt-3 border-t border-[#F4E3DD]/60">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-[#751C2F] font-serif">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-[#756A64] line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className={`w-full inline-flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg transition-all shadow-xs relative overflow-hidden ${
                isAdded
                  ? 'bg-emerald-700 text-white scale-105 shadow-md ring-2 ring-emerald-400'
                  : 'bg-[#751C2F] text-white hover:bg-[#591423]'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white animate-bounce" />
                  <span className="font-bold">Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <a
              href={`https://wa.me/918514000016?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition-colors shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Inquire</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
