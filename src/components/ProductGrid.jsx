import React from 'react';

export default function ProductGrid ({items, activeCategory, onSelectItem}) {
  return (
    <div>
      <h2 className="pos-section-heading">{activeCategory}</h2>
      <div className="pos-product-grid">
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            className="pos-product-card"
            onClick={() => onSelectItem(item)}
          >
            {/* Checks for submenu specific data bindings from your sub-endpoints */}
            <div className="pos-card-header">
              {item.submenuName || item.itemName || item.name || 'Unnamed Selection'}
            </div>
            <div className="pos-card-price-tag">
              ${parseFloat(item.submenuPrice || item.price || 0).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
