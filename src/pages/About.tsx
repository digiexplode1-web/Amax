import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MessageCircle, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export const About: React.FC = () => {
  useSEO(
    'About Us - Heritage CNC Laser Cutting Hub',
    'Learn about Amax Craft\'s premium metal work heritage, ISO 9001 certified CNC laser cutting hub, and precision fabrication of interior room dividers and name plates.'
  );
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Header Banner */}
      <div className="bg-[#751C2F] text-white p-8 sm:p-12 rounded-2xl border border-[#C7953E]/30 text-center space-y-4">
        <span className="text-xs font-bold text-[#C7953E] uppercase tracking-wider block flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          Amax Craft Heritage & Precision
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#FFF9F0]">
          WELCOME TO <span className="text-[#C7953E]">AMAX CRAFT</span>
        </h1>
        <p className="text-sm sm:text-base text-[#F4E3DD] max-w-2xl mx-auto">
          Your Home Creating Beautiful Ambience
        </p>
      </div>

      {/* Main Copy & Visual Frame Matching Screenshot Design */}
      <div className="bg-white rounded-2xl border-2 border-[#C7953E] p-6 sm:p-12 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="border-l-4 border-[#C7953E] pl-4 space-y-1">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#25201E]">
                WELCOME TO <span className="text-[#C7953E]">AMAX CRAFT</span>
              </h2>
              <p className="text-[#C7953E] font-semibold text-sm">
                Your Home Creating Beautiful Ambience
              </p>
            </div>

            <div className="w-16 h-1 bg-[#25201E]/20" />

            <p className="text-[#25201E]/80 text-sm sm:text-base leading-relaxed">
              Our company is engaged in designing Room Dividers for offices and residential projects as per the individual needs and taste. At AMAX CRAFT we offer CNC Laser cutting jali's for Rooms, Balcony area, Pools and facade. We also offer Designer strips for railings and Privacy jali's which are all customised to suit your specific requirements and can be supplied with framing and fittings.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href={`https://wa.me/918514000016?text=${encodeURIComponent('Hello Amax Craft, I want to inquire about your custom CNC laser cutting & jali design services.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 text-white font-bold text-xs rounded-lg hover:bg-emerald-800"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact Amax Craft CAD Team</span>
              </a>

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#751C2F] text-white font-bold text-xs rounded-lg hover:bg-[#591423]"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative z-10 rounded-lg overflow-hidden border-4 border-white shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                alt="Amax Craft CNC Laser Cutting Facility"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full bg-[#383330] rounded-lg -z-0 hidden sm:block" />
          </div>
        </div>
      </div>

      {/* Why Choose Amax Craft */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#F4E3DD] space-y-3">
          <ShieldCheck className="w-8 h-8 text-[#751C2F]" />
          <h3 className="font-serif font-bold text-base text-[#25201E]">Tailored Customization</h3>
          <p className="text-xs text-[#756A64] leading-relaxed">
            Every jali, partition, and railing strip is manufactured according to your exact site dimensions, thickness preferences, and metal finish requirements.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#F4E3DD] space-y-3">
          <Sparkles className="w-8 h-8 text-[#C7953E]" />
          <h3 className="font-serif font-bold text-base text-[#25201E]">Precision CNC Laser Technology</h3>
          <p className="text-xs text-[#756A64] leading-relaxed">
            State-of-the-art fiber laser cutting machinery ensures ultra-sharp edges, smooth cuts, and intricate geometrical or floral lattice patterns.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#F4E3DD] space-y-3">
          <CheckCircle2 className="w-8 h-8 text-emerald-700" />
          <h3 className="font-serif font-bold text-base text-[#25201E]">Complete Framing & Fittings</h3>
          <p className="text-xs text-[#756A64] leading-relaxed">
            All panels can be supplied with heavy-duty structural framing, mounting brackets, and weatherproof UV powder coating ready for installation.
          </p>
        </div>
      </div>
    </div>
  );
};
