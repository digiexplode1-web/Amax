import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ArrowRight, Layers } from 'lucide-react';

export const Categories: React.FC = () => {
  const { categories, products } = useShop();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b border-[#F4E3DD] pb-4">
        <span className="text-xs font-bold text-[#C7953E] uppercase tracking-wider block">
          Amax Craft Collections
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#751C2F]">
          Product Categories
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const count = products.filter((p) => p.categoryId === cat.slug || p.category === cat.name).length;
          return (
            <Link
              key={cat.id}
              to={`/category/${cat.slug || cat.id}`}
              className="bg-white rounded-xl border border-[#F4E3DD] overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col"
            >
              <div className="aspect-16/9 bg-[#FFF9F0] overflow-hidden">
                <img
                  src={cat.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#25201E] group-hover:text-[#751C2F] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#756A64] mt-2 leading-relaxed">
                    {cat.description || 'Custom CNC laser cut designs for residential & commercial projects.'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F4E3DD]/60 flex items-center justify-between text-xs font-semibold text-[#751C2F]">
                  <span>{count} Products</span>
                  <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
