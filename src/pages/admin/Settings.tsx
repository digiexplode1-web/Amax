import React, { useState } from 'react';
import { Save } from 'lucide-react';

export const Settings: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      alert('Settings saved successfully (Demo)');
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#25201E]">Settings</h1>
        <p className="text-[#756A64] text-sm mt-1">Manage your business information and application settings.</p>
      </div>

      <div className="bg-white rounded-xl border border-[#F4E3DD] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F4E3DD]">
          <h2 className="font-semibold text-[#25201E]">Business Details</h2>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#25201E] mb-1">Business Name</label>
              <input type="text" defaultValue="Amax Crafts" className="w-full border border-[#F4E3DD] rounded-lg p-2.5 outline-none focus:border-[#C7953E] focus:ring-1 focus:ring-[#C7953E]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#25201E] mb-1">Tagline</label>
              <input type="text" defaultValue="Premium Laser Cut Designs" className="w-full border border-[#F4E3DD] rounded-lg p-2.5 outline-none focus:border-[#C7953E] focus:ring-1 focus:ring-[#C7953E]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#25201E] mb-1">WhatsApp Number</label>
              <input type="text" defaultValue="+91 80000 00000" className="w-full border border-[#F4E3DD] rounded-lg p-2.5 outline-none focus:border-[#C7953E] focus:ring-1 focus:ring-[#C7953E]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#25201E] mb-1">Email Address</label>
              <input type="email" defaultValue="hello@amaxcrafts.com" className="w-full border border-[#F4E3DD] rounded-lg p-2.5 outline-none focus:border-[#C7953E] focus:ring-1 focus:ring-[#C7953E]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#25201E] mb-1">Address</label>
              <textarea rows={2} defaultValue="123 Industrial Area, Phase 1, New Delhi, India" className="w-full border border-[#F4E3DD] rounded-lg p-2.5 outline-none focus:border-[#C7953E] focus:ring-1 focus:ring-[#C7953E]" />
            </div>
          </div>
          <div className="pt-4 border-t border-[#F4E3DD] flex justify-end">
            <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 px-5 py-2 bg-[#751C2F] text-white rounded-lg text-sm font-medium hover:bg-[#591423] transition-colors disabled:opacity-50">
              <Save className="w-4 h-4" />
              {submitting ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
