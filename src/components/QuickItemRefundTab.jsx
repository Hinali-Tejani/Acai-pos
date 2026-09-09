import ProductGrid from './ProductGrid';

export default function QuickItemRefundTab ({items, activeCategory, onSelectItem}) {
  return (
    <ProductGrid
      items={items || []}
      activeCategory={activeCategory}
      onSelectItem={onSelectItem}
    />
  );
}
