import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { Save, Image as ImageIcon, CheckCircle, LayoutTemplate, RefreshCw } from 'lucide-react';
import { HomepageSettings } from '../../types';

export const HomepageEditor: React.FC = () => {
  const { homepageSettings, updateHomepageSettings } = useShop();
  const [settings, setSettings] = useState<HomepageSettings>({
    hero: {
      heading: 'WELCOME TO',
      highlightedWord: 'AMAX CRAFT',
      subheading: 'Your Home Creating Beautiful Ambience',
      description: 'Specialized CNC Laser Cutting Jalis, Architectural Room Dividers, Designer Railing Strips, Balcony Screens, and Traditional Wedding Accessories crafted to custom precision.',
      backgroundImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      badgeText: 'Laser Cut Craftsmanship & Architectural Jalis',
      primaryButtonText: 'Explore Full Catalog',
      secondaryButtonText: 'Chat on WhatsApp',
      secondaryButtonLink: 'https://wa.me/918514000016'
    },
    announcementText: '🎉 Free Shipping on all orders above ₹50,000! Use code AMAXFREE'
  });
  
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (homepageSettings) {
      setSettings(homepageSettings);
    }
  }, [homepageSettings]);

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [name]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage(null);
    try {
      await updateHomepageSettings(settings);
      setSuccessMessage('Homepage settings saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error(error);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-gray-900">Homepage Editor</h2>
          <p className="text-sm text-gray-500 mt-1">Manage hero banner content and announcements.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-[#751C2F] text-white rounded-lg hover:bg-[#5a1524] transition-colors disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Publishing...' : 'Publish Changes'}
        </button>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
          <CheckCircle className="w-5 h-5" />
          <p className="font-medium">{successMessage}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2 text-[#751C2F] mb-1">
            <LayoutTemplate className="w-5 h-5" />
            <h3 className="text-lg font-bold">Hero Section (Top Banner)</h3>
          </div>
          <p className="text-sm text-gray-500">This content appears at the very top of your homepage.</p>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Badge Text (Small text at top)</label>
              <input
                type="text"
                name="badgeText"
                value={settings.hero.badgeText}
                onChange={handleHeroChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7953E]/50"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Heading Prefix</label>
                <input
                  type="text"
                  name="heading"
                  value={settings.hero.heading}
                  onChange={handleHeroChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7953E]/50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Highlighted Name</label>
                <input
                  type="text"
                  name="highlightedWord"
                  value={settings.hero.highlightedWord}
                  onChange={handleHeroChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7953E]/50 text-[#C7953E] font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Subheading</label>
              <input
                type="text"
                name="subheading"
                value={settings.hero.subheading}
                onChange={handleHeroChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7953E]/50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description Paragraph</label>
              <textarea
                name="description"
                rows={3}
                value={settings.hero.description}
                onChange={handleHeroChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7953E]/50"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Background Image URL</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ImageIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="backgroundImageUrl"
                    value={settings.hero.backgroundImageUrl}
                    onChange={handleHeroChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7953E]/50"
                  />
                </div>
              </div>
              {settings.hero.backgroundImageUrl && (
                <div className="mt-3 relative h-32 rounded-lg overflow-hidden border border-gray-200">
                   <img src={settings.hero.backgroundImageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Primary Button Text</label>
                <input
                  type="text"
                  name="primaryButtonText"
                  value={settings.hero.primaryButtonText}
                  onChange={handleHeroChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7953E]/50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Secondary Button Text</label>
                <input
                  type="text"
                  name="secondaryButtonText"
                  value={settings.hero.secondaryButtonText}
                  onChange={handleHeroChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7953E]/50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Visual Preview */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Live Preview</h3>
        <div className="border-[4px] border-gray-800 rounded-xl overflow-hidden shadow-2xl relative bg-white pb-8">
           <div className="h-6 bg-gray-800 flex items-center px-4 gap-2">
             <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
           </div>
           
           <div className="relative bg-[#751C2F] text-white overflow-hidden m-4 rounded-xl border border-[#C7953E]/30">
              <div className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay" style={{ backgroundImage: `url('${settings.hero.backgroundImageUrl}')` }} />
              
              <div className="relative p-8 md:p-12 text-center md:text-left">
                <div className="inline-block px-3 py-1 rounded-full bg-[#C7953E]/20 text-[#C7953E] border border-[#C7953E]/40 text-xs font-semibold tracking-wider uppercase mb-4">
                  {settings.hero.badgeText}
                </div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-[#FFF9F0] mb-2">
                  {settings.hero.heading} <span className="text-[#C7953E]">{settings.hero.highlightedWord}</span>
                </h1>
                <p className="text-lg md:text-xl font-medium text-[#F4E3DD] mb-4">
                  {settings.hero.subheading}
                </p>
                <p className="text-sm md:text-base text-white/80 max-w-xl mx-auto md:mx-0 mb-6">
                  {settings.hero.description}
                </p>
                
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                   <div className="px-5 py-2.5 bg-[#C7953E] text-white rounded-lg font-bold text-sm">
                     {settings.hero.primaryButtonText}
                   </div>
                   <div className="px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg font-semibold text-sm">
                     {settings.hero.secondaryButtonText}
                   </div>
                </div>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
};
