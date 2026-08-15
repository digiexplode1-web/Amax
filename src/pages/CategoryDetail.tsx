import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { ProductSkeleton } from '../components/ProductSkeleton';
import { ArrowLeft } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export const CategoryDetail: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { products, categories, loading } = useShop();

  const category = categories.find((c) => c.slug === categoryId || c.id === categoryId);
  const categoryName = category ? category.name : categoryId?.replace(/-/g, ' ').toUpperCase() || 'Category';

  useSEO(
    `${categoryName} Collection`,
    category?.description || `Explore our premium range of custom CNC laser-cut items in the ${categoryName} collection.`
  );

  const categoryProducts = products.filter(
    (p) => p.categoryId === categoryId || p.category.toLowerCase().includes((categoryId || '').toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <Link to="/categories" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#751C2F] hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Categories</span>
      </Link>

      <div className="border-b border-[#F4E3DD] pb-4">
        <span className="text-xs font-bold text-[#C7953E] uppercase tracking-wider block">
          Category Collection
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#751C2F]">
          {categoryName}
        </h1>
        {category?.description && (
          <p className="text-xs text-[#756A64] mt-1 max-w-2xl">
            {category.description}
          </p>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
        </div>
      ) : categoryProducts.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#F4E3DD] p-12 text-center space-y-3">
          <p className="font-serif text-[#751C2F] font-bold text-lg">
            No products are available right now in this category.
          </p>
          <Link to="/shop" className="inline-block text-xs font-bold text-[#C7953E] underline">
            Browse All Crafts
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
