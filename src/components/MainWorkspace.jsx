import React from 'react';
import ProductGrid from './ProductGrid';

export default function MainWorkspace({
  itemsLoading,
  activeItems,
  activeCategoryName,
  onSelectItem
}) {
  if (itemsLoading) {
    return <div className="pos-centered-msg"><h3>Querying Category Items...</h3></div>;
  }

  return (
    <ProductGrid
      items={activeItems}
      activeCategory={activeCategoryName}
      onSelectItem={onSelectItem}
    />
  );
}
