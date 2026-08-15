import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Menu, X, MessageCircle, ShieldCheck, Sparkles, User, PhoneCall, Award } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { SuggestiveSearch } from './SuggestiveSearch';
import { openExternalLink } from '../utils/externalLinks';

export const Header: React.FC = () => {
  const { cartCount, wishlist, activeProductsCount, isCartBouncing } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FFF9F0] border-b border-[#E5C384]/60 shadow-md pt-[env(safe-area-inset-top,0px)]">
      {/* Main Header Row - CENTERED LOGO */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left Column: Quick Contact Badge */}
          <div className="hidden lg:flex items-center gap-3 text-xs shrink-0">
            <a
              href="tel:+918514000016"
              onClick={(e) => openExternalLink('tel:+918514000016', e)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E5C384] text-[#751C2F] font-bold hover:bg-[#751C2F] hover:text-white transition-all shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#C7953E]" />
              <span>+91 8514000016</span>
            </a>
            <div className="flex items-center gap-1 text-[#756A64] font-medium text-[11px]">
              <Award className="w-3.5 h-3.5 text-[#C7953E]" />
              <span>ISO 9001 Certified Laser Hub</span>
            </div>
          </div>

          {/* CENTER LOGO SECTION WITH NEW LOGO IMAGE */}
          <div className="flex-1 flex justify-center text-center">
            <Link to="/" className="inline-flex items-center gap-2.5 sm:gap-3 group">
              <img
                src="/amax_logo.png"
                alt="AMAX CRAFT Logo"
                className="h-10 sm:h-12 max-h-12 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform drop-shadow-xs"
              />
              <div className="text-center sm:text-left">
                <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#751C2F] tracking-wider block leading-none group-hover:text-[#591423] transition-colors">
                  AMAX CRAFT
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-[#C7953E] tracking-widest uppercase block mt-1">
                  Creating Beautiful Ambience
                </span>
              </div>
            </Link>
          </div>

          {/* Right Column: Actions & User Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/wishlist"
              className="relative p-2.5 text-[#751C2F] hover:text-[#C7953E] transition-colors rounded-full hover:bg-[#F4E3DD]/50"
              title="Wishlist"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#C7953E] text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className={`relative p-2.5 text-[#751C2F] hover:text-[#C7953E] transition-all rounded-full hover:bg-[#F4E3DD]/50 ${
                isCartBouncing ? 'scale-125 bg-[#C7953E]/20 ring-4 ring-[#C7953E] text-[#751C2F] animate-bounce' : ''
              }`}
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartCount > 0 && (
                <span className={`absolute top-0 right-0 w-5 h-5 bg-[#751C2F] text-white rounded-full text-xs font-bold flex items-center justify-center border-2 border-white shadow-xs ${
                  isCartBouncing ? 'bg-emerald-600 scale-110' : ''
                }`}>
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              to="/admin/login"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#751C2F]/10 border border-[#751C2F]/20 text-[#751C2F] font-bold text-xs hover:bg-[#751C2F] hover:text-white transition-all"
              title="Admin Portal"
            >
              <User className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#751C2F] md:hidden rounded-lg hover:bg-[#F4E3DD]/50"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <nav className="hidden md:block bg-white border-t border-[#F4E3DD]">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-2.5 text-xs font-medium text-[#25201E]">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/" className="hover:text-[#751C2F] transition-colors py-1 font-bold text-[#751C2F]">
              Home
            </Link>
            <Link to="/shop" className="hover:text-[#751C2F] transition-colors py-1 font-semibold text-[#C7953E]">
              Shop All
            </Link>
            <Link to="/category/name-plates" className="hover:text-[#751C2F] transition-colors py-1">
              Name Plates
            </Link>
            <Link to="/category/decorative-lights" className="hover:text-[#751C2F] transition-colors py-1">
              Decoratives Lights
            </Link>
            <Link to="/category/wall-interior" className="hover:text-[#751C2F] transition-colors py-1">
              Wall Interior
            </Link>
            <Link to="/category/staircase-pillars" className="hover:text-[#751C2F] transition-colors py-1">
              Staircase lighting Pillar
            </Link>
            <Link to="/category/main-gate" className="hover:text-[#751C2F] transition-colors py-1">
              Main Gate
            </Link>
            <Link to="/category/room-dividers" className="hover:text-[#751C2F] transition-colors py-1">
              Room Dividers
            </Link>
            <Link to="/category/balcony-grills" className="hover:text-[#751C2F] transition-colors py-1">
              Balcony Grills
            </Link>
            <Link to="/category/garden-outdoor" className="hover:text-[#751C2F] transition-colors py-1">
              Garden & Outdoor Furniture
            </Link>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-[#756A64]">
            <Link to="/about" className="hover:text-[#751C2F]">
              About Us
            </Link>
            <Link to="/contact" className="hover:text-[#751C2F]">
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* SUGGESTIVE SEARCH BAR STRIP */}
      <div className="bg-[#FFFDF9] border-t border-b border-[#E5C384]/50 py-2 px-3 sm:py-2.5 sm:px-4 shadow-2xs">
        <div className="max-w-4xl mx-auto">
          <SuggestiveSearch placeholder="Search Name Plates, Decorative Lights & Jalis..." />
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#F4E3DD] px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-medium text-[#25201E]">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#F4E3DD]/40">
              Home
            </Link>
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#F4E3DD]/40">
              Shop All Products
            </Link>
            <Link to="/category/name-plates" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#F4E3DD]/40">
              Name Plates
            </Link>
            <Link to="/category/decorative-lights" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#F4E3DD]/40">
              Decoratives Lights
            </Link>
            <Link to="/category/wall-interior" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#F4E3DD]/40">
              Wall Interior
            </Link>
            <Link to="/category/staircase-pillars" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#F4E3DD]/40">
              Staircase lighting Pillar
            </Link>
            <Link to="/category/main-gate" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#F4E3DD]/40">
              Main Gate
            </Link>
            <Link to="/category/room-dividers" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#F4E3DD]/40">
              Room Dividers
            </Link>
            <Link to="/category/balcony-grills" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#F4E3DD]/40">
              Balcony Grills
            </Link>
            <Link to="/category/garden-outdoor" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#F4E3DD]/40">
              Garden & Outdoor Furniture
            </Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#F4E3DD]/40">
              About Amax Craft
            </Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#F4E3DD]/40">
              Contact Us
            </Link>
            <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)} className="py-2 text-[#751C2F] font-bold">
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

