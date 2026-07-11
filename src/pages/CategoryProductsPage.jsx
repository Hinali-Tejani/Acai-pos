import React from 'react';
import ProductGrid from '../components/ProductGrid';
import Spinner from '../components/Spinner';

export default function CategoryProductsPage({
  itemsLoading,
  activeItems,
  activeCategoryName,
  onSelectItem,
}) {
  if (itemsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
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
