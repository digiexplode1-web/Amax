import React from 'react';

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-[#F4E3DD] overflow-hidden shadow-xs animate-pulse">
      <div className="aspect-4/3 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="h-5 bg-gray-200 rounded w-1/4" />
          <div className="h-8 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
};
