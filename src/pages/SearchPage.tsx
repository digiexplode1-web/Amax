import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Search } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const { products } = useShop();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query });
  };

  const results = products.filter((p) => {
    if (!initialQuery) return true;
    const q = initialQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.material && p.material.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="font-serif text-2xl font-bold text-[#751C2F] text-center">
          Search Amax Craft Catalog
        </h1>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search CNC Jalis, Room Dividers, Railing Strips..."
            className="w-full bg-white border border-[#F4E3DD] focus:border-[#C7953E] rounded-full py-3 pl-5 pr-12 text-sm text-[#25201E] shadow-sm outline-none"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#751C2F] text-white flex items-center justify-center hover:bg-[#591423]"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-sm font-bold text-[#756A64] mb-4">
          {initialQuery ? `Search results for "${initialQuery}" (${results.length})` : 'All Products'}
        </h2>

        {results.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#F4E3DD] p-12 text-center text-xs text-[#756A64]">
            No crafts matched your query. Try searching for "Jali", "Divider", "Railing", or "Metal".
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
