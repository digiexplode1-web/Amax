import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { ProductSkeleton } from '../components/ProductSkeleton';
import { Filter, SlidersHorizontal, Search } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export const Shop: React.FC = () => {
  useSEO(
    'Shop Catalog - Custom CNC Laser Cut Jalis & Panels',
    'Browse our wide range of custom CNC laser-cut name plates, decorative lights, room dividers, wall cladding panels, balcony privacy screens, and garden gates.'
  );
  const { products, categories, loading } = useShop();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.categoryId === selectedCategory || p.category === selectedCategory;
      const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchMat = selectedMaterial === 'all' || (p.material && p.material.toLowerCase().includes(selectedMaterial.toLowerCase()));
      return matchCat && matchSearch && matchMat;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });
  }, [products, selectedCategory, searchQuery, selectedMaterial, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#F4E3DD] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#C7953E] uppercase tracking-wider block">
            Amax Craft Complete Catalog
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#751C2F]">
            Shop CNC Jalis & Crafts
          </h1>
          <p className="text-xs text-[#756A64] mt-1">
            Showing {filteredProducts.length} active products from Firestore
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#F4E3DD] rounded-lg py-2 pl-3 pr-8 text-xs text-[#25201E]"
            />
            <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#756A64]" />
          </div>

          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-white border border-[#F4E3DD] rounded-lg py-2 px-3 text-xs text-[#25201E] font-medium"
          >
            <option value="featured">Sort by: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="space-y-6 bg-white p-5 rounded-xl border border-[#F4E3DD] h-fit">
          <div>
            <h3 className="font-serif font-bold text-[#751C2F] text-sm mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#C7953E]" />
              <span>Categories</span>
            </h3>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-1.5 rounded-md font-medium transition-colors ${
                  selectedCategory === 'all' ? 'bg-[#751C2F] text-white' : 'text-[#25201E] hover:bg-[#FFF9F0]'
                }`}
              >
                All Categories ({products.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug || cat.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-md font-medium transition-colors ${
                    selectedCategory === (cat.slug || cat.id) ? 'bg-[#751C2F] text-white' : 'text-[#25201E] hover:bg-[#FFF9F0]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#F4E3DD]">
            <h3 className="font-serif font-bold text-[#751C2F] text-sm mb-3">
              Filter by Material
            </h3>
            <div className="space-y-1 text-xs">
              {['all', 'steel', 'mdf', 'wpc', 'wood', 'brass'].map((mat) => (
                <button
                  key={mat}
                  onClick={() => setSelectedMaterial(mat)}
                  className={`w-full text-left px-3 py-1 rounded-md capitalize font-medium ${
                    selectedMaterial === mat ? 'bg-[#C7953E] text-white' : 'text-[#756A64] hover:bg-[#FFF9F0]'
                  }`}
                >
                  {mat === 'all' ? 'All Materials' : mat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#F4E3DD] p-12 text-center space-y-3">
              <p className="font-serif text-[#751C2F] font-bold text-lg">
                No products are available right now.
              </p>
              <p className="text-xs text-[#756A64]">
                Try adjusting your search query or selecting a different category filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
