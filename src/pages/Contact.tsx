import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b border-[#F4E3DD] pb-4">
        <span className="text-xs font-bold text-[#C7953E] uppercase tracking-wider block">
          Get in Touch with Amax Craft
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#751C2F]">
          Contact & Custom Orders
        </h1>
        <p className="text-xs text-[#756A64] mt-1">
          Inquire about custom CNC Laser cutting jalis, room dividers, railings, and wedding backdrops.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[#F4E3DD] space-y-4">
            <h3 className="font-serif font-bold text-[#751C2F] text-lg">
              Factory & Sales Office
            </h3>

            <div className="space-y-3 text-xs text-[#25201E]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C7953E] shrink-0 mt-0.5" />
                <div>
                  <strong className="block">Location</strong>
                  <span className="text-[#756A64]">Amax Craft Industrial Zone, CNC Laser Cutting Hub, India</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C7953E] shrink-0" />
                <div>
                  <strong className="block">Phone / WhatsApp</strong>
                  <span className="text-[#756A64]">+91 8514000016</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C7953E] shrink-0" />
                <div>
                  <strong className="block">Email</strong>
                  <span className="text-[#756A64]">info@amaxcraft.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#751C2F] text-white p-6 rounded-xl space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#FFF9F0]">
              Instant CAD Inquiry on WhatsApp
            </h3>
            <p className="text-xs text-[#F4E3DD] leading-relaxed">
              Connect directly with our laser cutting CAD technicians. Send floor plans, site measurements, or pattern sketches for instant estimates.
            </p>
            <a
              href={`https://wa.me/918514000016?text=${encodeURIComponent('Hello Amax Craft, I want to get a quote for a custom laser cutting project.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:bg-emerald-700 shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-6 rounded-xl border border-[#F4E3DD] space-y-4">
          <h3 className="font-serif font-bold text-[#751C2F] text-lg">
            Send Us a Message
          </h3>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-serif font-bold text-base">Message Sent Successfully!</h4>
              <p className="text-xs text-[#756A64]">
                Thank you for reaching out to Amax Craft. Our team will get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#25201E] block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-[#FFF9F0] border border-[#F4E3DD] rounded-lg p-2.5 outline-none focus:border-[#C7953E]"
                />
              </div>

              <div>
                <label className="font-bold text-[#25201E] block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 8514000016"
                  className="w-full bg-[#FFF9F0] border border-[#F4E3DD] rounded-lg p-2.5 outline-none focus:border-[#C7953E]"
                />
              </div>

              <div>
                <label className="font-bold text-[#25201E] block mb-1">Inquiry / Custom CAD Details *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your project dimensions, required material (MS/SS/MDF), thickness, or pattern..."
                  className="w-full bg-[#FFF9F0] border border-[#F4E3DD] rounded-lg p-2.5 outline-none focus:border-[#C7953E]"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#751C2F] text-white font-bold rounded-lg hover:bg-[#591423]"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
