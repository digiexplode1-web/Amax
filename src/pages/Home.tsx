import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Star, MessageCircle, Layers, CheckCircle2, RefreshCw } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { ProductSkeleton } from '../components/ProductSkeleton';
import { useSEO } from '../hooks/useSEO';

export const Home: React.FC = () => {
  useSEO(
    'Premium Custom CNC Laser Cutting Jalis & Room Dividers',
    'Specialized CNC Laser Cutting Jalis, Architectural Room Dividers, Designer Railing Strips, Balcony Screens, and Traditional Wedding Accessories.'
  );
  const { products, categories, banners, loading, activeProductsCount, seedInitialDataIfEmpty, isSeeding, homepageSettings } = useShop();

  const featuredProducts = products.filter((p) => p.isFeatured || p.isWeddingEssential).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);
  const weddingEssentials = products.filter((p) => p.isWeddingEssential || p.categoryId === 'wedding-essentials').slice(0, 4);

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* Hero Banner Section matching Image 5 Mobile Frame Mockup */}
      <section className="relative bg-gradient-to-br from-[#591423] via-[#751C2F] to-[#4F111E] text-white overflow-hidden rounded-3xl mx-3 sm:mx-8 mt-3 border-2 border-[#C7953E]/40 shadow-2xl">
        <div className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url('${homepageSettings?.hero?.backgroundImageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'}')` }} />
        
        <div className="relative max-w-7xl mx-auto px-5 py-10 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C7953E]/20 text-[#D4AF37] border border-[#C7953E]/50 text-[11px] sm:text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{homepageSettings?.hero?.badgeText || 'LASER CUT CRAFTSMANSHIP & ARCHITECTURAL JALIS'}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-[#FFF9F0]">
              WELCOME TO <br className="hidden sm:inline" /><span className="text-[#C7953E]">AMAX CRAFT</span>
            </h1>

            <p className="text-base sm:text-xl font-bold text-[#F4E3DD]">
              {homepageSettings?.hero?.subheading || 'Your Home Creating Beautiful Ambience'}
            </p>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-xl mx-auto sm:mx-0">
              {homepageSettings?.hero?.description || 'Specialized CNC Laser Cutting Jalis, Architectural Room Dividers, Designer Railing Strips, Balcony Screens, and Traditional Wedding Accessories crafted to custom precision.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C7953E] text-white rounded-full font-bold hover:bg-[#a67a2e] active:scale-95 transition-all shadow-lg text-sm"
              >
                <span>{homepageSettings?.hero?.primaryButtonText || 'Explore Full Catalog'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={homepageSettings?.hero?.secondaryButtonLink || `https://wa.me/918514000016?text=${encodeURIComponent('Hello Amax Craft, I want to discuss a custom CNC laser cutting & architectural jali project.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-full font-semibold transition-all text-xs sm:text-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Custom CAD Inquiry</span>
              </a>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-4/3 rounded-2xl overflow-hidden border-2 border-[#C7953E] shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                alt="Amax Craft CNC Laser Cutting Jali"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-md p-3 rounded-xl text-white border border-white/20 text-xs">
                <span className="font-bold text-[#C7953E] block">Precision Laser Cut Panels</span>
                <span className="text-[11px] text-white/90">Mild Steel, Stainless Steel, MDF & WPC Custom Framing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Custom Metal Craft Feature Highlights Showcase (From Image 5 Layout) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#E5C384]/70 p-6 sm:p-10 shadow-lg space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#751C2F]/10 text-[#751C2F] text-[11px] font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#C7953E]" />
              <span>PREMIUM CUSTOM METAL CRAFT</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#25201E]">
              Railings, Doors, Jalis & More
            </h2>
            <p className="text-xs sm:text-sm text-[#756A64]">
              Custom architectural metalwork engineered for durability, beauty, and personal elegance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#F4E3DD] shadow-2xs hover:border-[#C7953E] transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#751C2F] text-[#C7953E] flex items-center justify-center shrink-0 shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-sm text-[#25201E]">Custom Craftsmanship</h3>
                <p className="text-xs text-[#756A64]">Precision laser cutting for perfectly crafted custom designs.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#F4E3DD] shadow-2xs hover:border-[#C7953E] transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#751C2F] text-[#C7953E] flex items-center justify-center shrink-0 shadow-md">
                <Star className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-sm text-[#25201E]">Premium Design</h3>
                <p className="text-xs text-[#756A64]">Elegant, durable & made to elevate your home or office space.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#F4E3DD] shadow-2xs hover:border-[#C7953E] transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#751C2F] text-[#C7953E] flex items-center justify-center shrink-0 shadow-md">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-sm text-[#25201E]">Easy Catalog Browsing</h3>
                <p className="text-xs text-[#756A64]">Explore products, customize dimensions & request CAD quotes with ease.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center pt-2">
            <Link to="/category/room-dividers" className="p-4 bg-[#751C2F] text-white rounded-2xl hover:bg-[#591423] transition-colors space-y-1 border border-[#C7953E]/40 shadow-sm">
              <span className="font-serif font-bold text-xs sm:text-sm block text-[#FFF9F0]">JALIS & ROOM DIVIDERS</span>
              <span className="text-[10px] text-[#C7953E] uppercase block tracking-wider font-semibold">Custom Cut Panels</span>
            </Link>
            <Link to="/category/balcony-grills" className="p-4 bg-[#751C2F] text-white rounded-2xl hover:bg-[#591423] transition-colors space-y-1 border border-[#C7953E]/40 shadow-sm">
              <span className="font-serif font-bold text-xs sm:text-sm block text-[#FFF9F0]">RAILINGS & BALCONY</span>
              <span className="text-[10px] text-[#C7953E] uppercase block tracking-wider font-semibold">Privacy Screens</span>
            </Link>
            <Link to="/category/main-gate" className="p-4 bg-[#751C2F] text-white rounded-2xl hover:bg-[#591423] transition-colors space-y-1 border border-[#C7953E]/40 shadow-sm">
              <span className="font-serif font-bold text-xs sm:text-sm block text-[#FFF9F0]">DOORS & GATES</span>
              <span className="text-[10px] text-[#C7953E] uppercase block tracking-wider font-semibold">Steel & Metal Gates</span>
            </Link>
            <Link to="/category/wall-interior" className="p-4 bg-[#751C2F] text-white rounded-2xl hover:bg-[#591423] transition-colors space-y-1 border border-[#C7953E]/40 shadow-sm">
              <span className="font-serif font-bold text-xs sm:text-sm block text-[#FFF9F0]">DECORATIVE METAL CRAFTS</span>
              <span className="text-[10px] text-[#C7953E] uppercase block tracking-wider font-semibold">Lights & Name Plates</span>
            </Link>
          </div>

          <div className="pt-2 text-center text-xs font-bold text-[#751C2F] flex flex-wrap items-center justify-center gap-4 sm:gap-8 uppercase tracking-wider border-t border-[#F4E3DD]">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#C7953E]" /> CUSTOM MADE</span>
            <span className="hidden sm:inline text-[#E5C384]">|</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#C7953E]" /> PREMIUM QUALITY</span>
            <span className="hidden sm:inline text-[#E5C384]">|</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#C7953E]" /> MADE TO LAST</span>
          </div>
        </div>
      </section>

      {/* Shop By Category */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8 border-b border-[#F4E3DD] pb-4">
          <div>
            <span className="text-xs font-bold text-[#C7953E] uppercase tracking-wider block">
              Architectural Collections
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#751C2F]">
              Shop by Category
            </h2>
          </div>
          <Link to="/categories" className="text-xs font-semibold text-[#751C2F] hover:text-[#C7953E] flex items-center gap-1">
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.id || cat.slug}
              to={`/category/${cat.slug}`}
              className="group relative bg-white rounded-xl overflow-hidden border border-[#F4E3DD] shadow-2xs hover:shadow-md transition-all text-center p-3 flex flex-col items-center"
            >
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-[#FFF9F0] mb-3">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-serif font-bold text-xs sm:text-sm text-[#25201E] group-hover:text-[#751C2F] transition-colors line-clamp-2">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8 border-b border-[#F4E3DD] pb-4">
          <div>
            <span className="text-xs font-bold text-[#C7953E] uppercase tracking-wider block">
              Handcrafted Precision
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#751C2F]">
              Featured Crafts & Jalis
            </h2>
          </div>
          <Link to="/shop" className="text-xs font-semibold text-[#751C2F] hover:text-[#C7953E] flex items-center gap-1">
            <span>Explore All ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#F4E3DD] p-8 text-center space-y-4 max-w-lg mx-auto">
            <Layers className="w-12 h-12 text-[#C7953E] mx-auto opacity-80" />
            <h3 className="font-serif font-bold text-[#751C2F] text-lg">
              No products are available right now.
            </h3>
            <p className="text-xs text-[#756A64]">
              The Firestore collection 'products' in database '{import.meta.env.VITE_FIREBASE_PROJECT_ID || 'gen-lang-client-0746984388'}' is currently empty.
            </p>
            <button
              onClick={seedInitialDataIfEmpty}
              disabled={isSeeding}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#751C2F] text-white text-xs font-bold rounded-lg hover:bg-[#591423] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isSeeding ? 'Syncing Catalog...' : 'Sync Initial Catalog to Database'}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* PROMOTIONAL SECTION WITH EXACT SCREENSHOT LAYOUT & COPY */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl border-2 border-[#C7953E] p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Exact Headline, Subtitle, Copy, and Button */}
            <div className="lg:col-span-7 space-y-6">
              <div className="border-l-4 border-[#C7953E] pl-4 space-y-1">
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#25201E] tracking-tight">
                  WELCOME TO <span className="text-[#C7953E]">AMAX CRAFT</span>
                </h2>
                <p className="text-[#C7953E] font-semibold text-sm sm:text-base">
                  Your Home Creating Beautiful Ambience
                </p>
              </div>

              <div className="w-20 h-1 bg-[#25201E]/20 rounded-full" />

              <p className="text-[#25201E]/80 text-sm sm:text-base leading-relaxed font-sans">
                Our company is engaged in designing Room Dividers for offices and residential projects as per the individual needs and taste. At AMAX CRAFT we offer CNC Laser cutting jali's for Rooms, Balcony area, Pools and facade. We also offer Designer strips for railings and Privacy jali's which are all customised to suit your specific requirements and can be supplied with framing and fittings.
              </p>

              <div>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#383330] text-white font-semibold text-sm rounded hover:bg-black transition-colors shadow-md"
                >
                  <span>Know More »</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Screenshot Visual Layout Frame */}
            <div className="lg:col-span-5 relative">
              <div className="relative z-10 rounded-lg overflow-hidden border-4 border-white shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                  alt="Amax Craft Facade and Balcony Jali Installation"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-[#383330] rounded-lg -z-0 hidden sm:block" />
            </div>

          </div>
        </div>
      </section>

      {/* Wedding Essentials Highlight */}
      <section className="bg-[#F4E3DD]/40 py-12 border-y border-[#F4E3DD]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold text-[#751C2F] uppercase tracking-wider block flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C7953E]" />
              Grand Celebrations & Traditional Crafts
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#751C2F]">
              Wedding Essentials & Mandap Jalis
            </h2>
            <p className="text-xs sm:text-sm text-[#756A64]">
              Intricate metallic and wooden laser-cut backdrops, royal mandap lattice screens, and custom ceremonial accessories.
            </p>
          </div>

          {!loading && weddingEssentials.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {weddingEssentials.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WhatsApp CAD Custom Inquiry Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#751C2F] text-white rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl border border-[#C7953E]/40">
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FFF9F0]">
              Need Custom CNC Laser Design or Architecture Framing?
            </h2>
            <p className="text-sm text-[#F4E3DD] leading-relaxed">
              Send us your architectural CAD drawings, site dimensions, or inspiration photos. Our design team will provide instant quotes, material guidance, and 3D preview mockups.
            </p>
            <a
              href={`https://wa.me/918514000016?text=${encodeURIComponent('Hello Amax Craft, I want to discuss a custom CNC laser cutting & architecture framing project with CAD drawings.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 text-white rounded-full font-bold text-sm hover:bg-emerald-700 transition-colors shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Connect with Amax Craft Design Team</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
