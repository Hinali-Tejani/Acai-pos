import React from 'react';
import ProductGrid from '../components/ProductGrid';

export default function CategoryProductsPage({
  itemsLoading,
  activeItems,
  activeCategoryName,
  onSelectItem,
}) {
  if (itemsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-xl border border-purple-200 bg-white px-8 py-10 text-center shadow-sm">
          <h3 className="text-xl font-semibold text-purple-900">Loading category products...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <ProductGrid
        items={activeItems}
        activeCategory={activeCategoryName}
        onSelectItem={onSelectItem}
      />
    </div>
  );
}
