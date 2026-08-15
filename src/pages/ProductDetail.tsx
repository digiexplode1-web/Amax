import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { ShoppingBag, Heart, MessageCircle, ArrowLeft, ShieldCheck, Truck, Sparkles, Check, Star } from 'lucide-react';
import { getReviewsForProduct } from '../utils/reviewGenerator';
import { useSEO } from '../hooks/useSEO';

export const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { products, addToCart, toggleWishlist, isInWishlist } = useShop();

  const product = products.find((p) => p.id === productId);
  const reviews = product ? getReviewsForProduct(product.id, product.categoryId, product.rating) : [];

  useSEO(
    product ? `${product.name} | Custom CNC Laser Cutting` : 'Product Details',
    product ? `${product.description} Material: ${product.material || ''}. Thickness: ${product.thickness || ''}.` : ''
  );

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedFinish, setSelectedFinish] = useState<string>('Antique Brass');
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#751C2F]">
          Product Not Found
        </h2>
        <p className="text-xs text-[#756A64]">
          The craft item you are looking for does not exist or has been updated in the database.
        </p>
        <Link to="/shop" className="inline-block px-5 py-2 bg-[#751C2F] text-white text-xs font-bold rounded-lg">
          Back to Shop Catalog
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'];
  const activeImage = selectedImage || images[0];
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedFinish);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Amax Craft, I am interested in custom inquiry for product: ${product.name} (ID: ${product.id}). Selected Finish: ${selectedFinish}. Quantity: ${quantity}.`
  );

  const relatedProducts = products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <Link to="/shop" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#751C2F] hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Shop</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-6 sm:p-8 rounded-2xl border border-[#F4E3DD] shadow-sm">
        {/* Left Gallery Column */}
        <div className="space-y-4">
          <div className="aspect-4/3 bg-[#FFF9F0] rounded-xl overflow-hidden border border-[#F4E3DD] relative">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.isWeddingEssential && (
              <span className="absolute top-3 left-3 bg-[#751C2F] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                <Sparkles className="w-3 h-3 text-[#C7953E]" />
                Wedding Essential
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === img ? 'border-[#751C2F]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Product Details Column */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-[#C7953E] uppercase tracking-wider block">
              {product.category}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#25201E] mt-1">
              {product.name}
            </h1>

            {/* Star Rating Info */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating || 4.8)
                        ? 'fill-amber-500 text-amber-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-[#25201E]">
                {product.rating ? product.rating.toFixed(1) : '4.8'}
              </span>
              <span className="text-xs text-[#756A64]/80">
                ({product.reviewsCount || 15} verified reviews)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#751C2F]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-[#756A64] line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              Inclusive of GST & Framing
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#756A64] leading-relaxed">
            {product.description}
          </p>

          {/* Specifications Box */}
          <div className="bg-[#FFF9F0] p-4 rounded-xl border border-[#F4E3DD] grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[#756A64] block">Material</span>
              <span className="font-bold text-[#25201E]">{product.material || 'Mild Steel / MDF'}</span>
            </div>
            <div>
              <span className="text-[#756A64] block">Dimensions</span>
              <span className="font-bold text-[#25201E]">{product.dimensions || '4ft x 8ft Custom'}</span>
            </div>
            <div>
              <span className="text-[#756A64] block">Thickness</span>
              <span className="font-bold text-[#25201E]">{product.thickness || '3mm Laser Cut'}</span>
            </div>
            <div>
              <span className="text-[#756A64] block">Availability</span>
              <span className="font-bold text-emerald-700">In Stock ({product.stock || 50} units)</span>
            </div>
          </div>

          {/* Finish Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#25201E] uppercase tracking-wider block">
              Select Finish / Color Coat
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              {['Antique Brass', 'Royal Gold Powder Coat', 'Matte Black UV', 'Natural Teak Wood Polish', 'PVD Stainless Steel'].map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFinish(f)}
                  className={`px-3 py-1.5 rounded-lg border font-medium transition-all ${
                    selectedFinish === f
                      ? 'border-[#751C2F] bg-[#751C2F] text-white shadow-xs'
                      : 'border-[#F4E3DD] bg-white text-[#25201E] hover:border-[#C7953E]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-[#25201E] uppercase">Quantity:</span>
            <div className="flex items-center border border-[#F4E3DD] rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1.5 text-sm font-bold hover:bg-[#FFF9F0]"
              >
                -
              </button>
              <span className="px-4 py-1.5 text-xs font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1.5 text-sm font-bold hover:bg-[#FFF9F0]"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className={`flex-1 inline-flex items-center justify-center gap-2 py-3 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md ${
                  addedNotice
                    ? 'bg-emerald-700 text-white scale-105 ring-4 ring-emerald-400/50'
                    : 'bg-[#751C2F] text-white hover:bg-[#591423]'
                }`}
              >
                {addedNotice ? (
                  <>
                    <Check className="w-5 h-5 text-white animate-bounce" />
                    <span>Item Added to Shopping Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Shopping Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition-colors ${
                  inWishlist ? 'bg-[#751C2F] text-white border-[#751C2F]' : 'border-[#F4E3DD] text-[#756A64] hover:text-[#751C2F]'
                }`}
                title="Wishlist"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>

            {addedNotice && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Product added to your cart successfully!</span>
              </div>
            )}

            <a
              href={`https://wa.me/918514000016?text=${encodeURIComponent(
                `Hello Amax Craft,\n\nI want to inquire about custom dimensions for this product:\n- Product Name: ${product.name}\n- Category: ${product.category}\n- Price: ₹${product.price.toLocaleString('en-IN')}\n- Selected Finish: ${selectedFinish}\n- Quantity: ${quantity}\n\nPlease share material options, custom CAD drawing quote, and delivery timeframe.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-emerald-800 transition-colors shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire for Custom Sizes on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-6 pt-8 border-t border-[#F4E3DD]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#25201E]">
              Customer Reviews & Feedback
            </h2>
            <p className="text-xs text-[#756A64] mt-1">
              Honest ratings and design appreciations from our verified clients.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#FFF9F0] px-4 py-2 rounded-xl border border-[#F4E3DD]">
            <div className="flex text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating || 4.8)
                      ? 'fill-amber-500 text-amber-500'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-[#25201E]">{product.rating ? product.rating.toFixed(1) : '4.8'} / 5.0</span>
            <span className="text-xs text-[#756A64]">({reviews.length} reviews)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-white p-5 rounded-xl border border-[#F4E3DD]/80 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#25201E]">{rev.author}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="flex text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(rev.rating)
                              ? 'fill-amber-500 text-amber-500'
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-[#756A64]">{rev.date}</span>
                  </div>
                </div>
                {rev.verified && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Buyer
                  </span>
                )}
              </div>
              <p className="text-xs text-[#756A64] leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-[#F4E3DD]">
          <h2 className="font-serif text-xl font-bold text-[#751C2F]">
            More from {product.category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
