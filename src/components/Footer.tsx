import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, Heart, ShieldCheck, Truck, Clock } from 'lucide-react';
import { openExternalLink } from '../utils/externalLinks';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#25201E] text-[#FFF9F0] border-t border-[#C7953E]/30 pt-12 pb-20 md:pb-12">
      {/* Service Highlights */}
      <div className="max-w-7xl mx-auto px-4 pb-10 border-b border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#751C2F] text-[#C7953E] flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-white">Custom Laser Precision</h4>
          <p className="text-xs text-[#756A64] mt-1">Tailored CNC Laser cutting to exact millimeter specs</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#751C2F] text-[#C7953E] flex items-center justify-center mb-3">
            <Truck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-white">Pan-India Delivery</h4>
          <p className="text-xs text-[#756A64] mt-1">Secure wooden crate framing & nationwide dispatch</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#751C2F] text-[#C7953E] flex items-center justify-center mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-white">Fast Turnaround</h4>
          <p className="text-xs text-[#756A64] mt-1">Direct manufacturing & quick order processing</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#751C2F] text-[#C7953E] flex items-center justify-center mb-3">
            <MessageCircle className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-white">WhatsApp Support</h4>
          <p className="text-xs text-[#756A64] mt-1">Direct CAD design consultation & instant quotes</p>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        {/* Brand Overview */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/amax_logo.png"
              alt="AMAX CRAFT Logo"
              className="h-10 w-auto object-contain"
            />
            <div>
              <span className="font-serif text-xl font-bold text-[#FFF9F0] tracking-wide block">
                AMAX CRAFT
              </span>
              <span className="text-xs text-[#C7953E]">Creating Beautiful Ambience</span>
            </div>
          </div>
          <p className="text-[#756A64] text-xs leading-relaxed">
            Specializing in CNC Laser cutting jalis, room dividers, balcony & pool facade screens, designer railing strips, and wedding decorative craftwork.
          </p>
          <a
            href="https://wa.me/918514000016"
            onClick={(e) => openExternalLink('https://wa.me/918514000016', e)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp (+91 8514000016)
          </a>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif font-bold text-[#C7953E] uppercase text-xs tracking-wider mb-4">
            Product Categories
          </h4>
          <ul className="space-y-2 text-xs text-[#756A64]">
            <li><Link to="/category/name-plates" className="hover:text-white transition-colors">Name Plates</Link></li>
            <li><Link to="/category/decorative-lights" className="hover:text-white transition-colors">Decoratives Lights</Link></li>
            <li><Link to="/category/wall-interior" className="hover:text-white transition-colors">Wall Interior</Link></li>
            <li><Link to="/category/staircase-pillars" className="hover:text-white transition-colors">Staircase lighting Pillar</Link></li>
            <li><Link to="/category/main-gate" className="hover:text-white transition-colors">Main Gate</Link></li>
            <li><Link to="/category/room-dividers" className="hover:text-white transition-colors">Room Dividers</Link></li>
            <li><Link to="/category/balcony-grills" className="hover:text-white transition-colors">Balcony Grills</Link></li>
            <li><Link to="/category/garden-outdoor" className="hover:text-white transition-colors">Garden & Outdoor Furniture</Link></li>
          </ul>
        </div>

        {/* Policies & Support */}
        <div>
          <h4 className="font-serif font-bold text-[#C7953E] uppercase text-xs tracking-wider mb-4">
            Customer Care
          </h4>
          <ul className="space-y-2 text-xs text-[#756A64]">
            <li><Link to="/about" className="hover:text-white transition-colors">About Amax Craft</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact & Custom Orders</Link></li>
            <li><Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping & Delivery Policy</Link></li>
            <li><Link to="/return-refund-policy" className="hover:text-white transition-colors">Return & Refund Policy</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            <li><Link to="/diagnostics" className="hover:text-white transition-colors text-[#C7953E]">Firestore Diagnostics</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-serif font-bold text-[#C7953E] uppercase text-xs tracking-wider mb-4">
            Contact Amax Craft
          </h4>
          <ul className="space-y-3 text-xs text-[#756A64]">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#C7953E] shrink-0 mt-0.5" />
              <span>Amax Craft Industrial Zone, CNC Laser Cutting Hub, India</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C7953E] shrink-0" />
              <a href="tel:+918514000016" onClick={(e) => openExternalLink('tel:+918514000016', e)} className="hover:text-white transition-colors">+91 8514000016</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C7953E] shrink-0" />
              <a href="mailto:info@amaxcraft.com" onClick={(e) => openExternalLink('mailto:info@amaxcraft.com', e)} className="hover:text-white transition-colors">info@amaxcraft.com</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-white/10 text-center text-xs text-[#756A64] flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} Amax Craft. All rights reserved.</p>
        <p className="flex items-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-[#751C2F] fill-current" />
          <span>for Homes & Architectural Elegance</span>
        </p>
      </div>
    </footer>
  );
};
