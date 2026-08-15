import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Tag, Sparkles, ChevronRight, Layers } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface SuggestiveSearchProps {
  placeholder?: string;
  className?: string;
  onSearchSelect?: () => void;
}

export const SuggestiveSearch: React.FC<SuggestiveSearchProps> = ({
  placeholder = "Search Name Plates, Decorative Lights, Wall Interior, Room Dividers...",
  className = "",
  onSearchSelect
}) => {
  const { allProducts, categories } = useShop();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered matching products
  const matchingProducts = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return allProducts.filter((p) => (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.material && p.material.toLowerCase().includes(q))
    )).slice(0, 6);
  }, [allProducts, query]);

  // Filtered matching categories
  const matchingCategories = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return categories.filter((c) => (
      c.name.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q))
    ));
  }, [categories, query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      if (onSearchSelect) onSearchSelect();
    }
  };

  const handleSelectProduct = (productId: string) => {
    navigate(`/product/${productId}`);
    setIsOpen(false);
    setQuery('');
    if (onSearchSelect) onSearchSelect();
  };

  const handleSelectCategory = (slug: string) => {
    navigate(`/category/${slug}`);
    setIsOpen(false);
    setQuery('');
    if (onSearchSelect) onSearchSelect();
  };

  const popularTags = [
    { label: 'Name Plates', q: 'Name Plates' },
    { label: 'Decorative Lights', q: 'Decoratives Lights' },
    { label: 'Wall Interior', q: 'Wall Interior' },
    { label: 'Staircase Pillars', q: 'Staircase lighting Pillar' },
    { label: 'Main Gate', q: 'Main Gate' },
    { label: 'Room Dividers', q: 'Room Dividers' },
    { label: 'Balcony Grills', q: 'Balcony Grills' },
    { label: 'Outdoor Screens', q: 'Garden & Outdoor Furniture' },
  ];

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full bg-[#FFFDF9] text-[#25201E] placeholder:text-[#756A64]/60 text-xs sm:text-sm font-medium py-2 sm:py-2.5 pl-9 pr-10 sm:pr-12 rounded-full border-2 border-[#E5C384]/70 focus:border-[#751C2F] focus:bg-white focus:ring-4 focus:ring-[#751C2F]/10 outline-none transition-all shadow-sm"
          />
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#C7953E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="absolute right-10 sm:right-12 top-1/2 -translate-y-1/2 p-1 text-[#756A64] hover:text-[#751C2F] transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 bg-gradient-to-r from-[#751C2F] to-[#91233A] text-[#FFF9F0] rounded-full hover:from-[#591423] hover:to-[#751C2F] hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center"
            title="Search"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Suggestive Dropdown Overlay */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border-2 border-[#E5C384]/80 shadow-2xl z-50 overflow-hidden text-xs divide-y divide-[#F4E3DD]">
          {/* Recent / Suggested Quick Tags (when search is empty) */}
          {!query.trim() && (
            <div className="p-4 bg-[#FFF9F0]/80">
              <div className="flex items-center gap-1.5 font-serif font-bold text-[#751C2F] text-xs uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C7953E]" />
                <span>Popular Searches & Categories</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {popularTags.map((tag) => (
                  <button
                    key={tag.label}
                    onClick={() => {
                      setQuery(tag.q);
                      setIsOpen(true);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-[#F4E3DD] hover:border-[#C7953E] hover:bg-[#751C2F] hover:text-white rounded-full text-[11px] text-[#25201E] transition-all font-medium"
                  >
                    <Tag className="w-3 h-3 text-[#C7953E]" />
                    <span>{tag.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Categories Section */}
          {query.trim() !== '' && matchingCategories.length > 0 && (
            <div className="p-3 bg-[#FFFDF9]">
              <span className="text-[10px] font-bold text-[#C7953E] uppercase tracking-wider block mb-2 px-1 flex items-center gap-1">
                <Layers className="w-3 h-3" /> Matching Categories ({matchingCategories.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchingCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.slug)}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#FFF9F0] border border-transparent hover:border-[#F4E3DD] transition-all text-left group"
                  >
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-9 h-9 object-cover rounded-md border border-[#F4E3DD]"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-[#751C2F] group-hover:text-[#C7953E] block truncate text-xs">
                        {cat.name}
                      </span>
                      <span className="text-[10px] text-[#756A64] block truncate">
                        Browse Collection →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Products Section */}
          {query.trim() !== '' && (
            <div className="p-2 max-h-80 overflow-y-auto">
              <span className="text-[10px] font-bold text-[#751C2F] uppercase tracking-wider block px-2 py-1">
                Suggested Products ({matchingProducts.length})
              </span>
              {matchingProducts.length === 0 ? (
                <div className="p-4 text-center text-[#756A64]">
                  No products matched "<strong className="text-[#751C2F]">{query}</strong>".
                  <p className="text-[11px] mt-1">Try searching for <em>Name Plates</em>, <em>Gates</em>, or <em>Lights</em>.</p>
                </div>
              ) : (
                matchingProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[#FFF9F0] transition-colors text-left group border-b border-[#F4E3DD]/40 last:border-0"
                  >
                    <img
                      src={product.imageUrl || product.images?.[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg border border-[#F4E3DD] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-serif font-bold text-[#25201E] group-hover:text-[#751C2F] truncate block text-xs">
                        {product.name}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-[#756A64] mt-0.5">
                        <span className="bg-[#FFF9F0] text-[#751C2F] px-1.5 py-0.5 rounded font-semibold border border-[#F4E3DD]">
                          {product.category}
                        </span>
                        {product.material && <span>{product.material}</span>}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-[#751C2F] text-xs block">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-[#C7953E] font-medium group-hover:underline flex items-center gap-0.5">
                        <span>View</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Footer View All Search Results */}
          {query.trim() !== '' && (
            <button
              onClick={handleSubmit}
              className="w-full p-2.5 bg-[#FFF9F0] hover:bg-[#751C2F] hover:text-white font-bold text-center text-xs text-[#751C2F] transition-all flex items-center justify-center gap-1.5"
            >
              <span>View All Results for "{query}"</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
