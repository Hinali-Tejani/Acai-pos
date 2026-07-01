import React from 'react';

export default function ProductGrid ({items, activeCategory, onSelectItem}) {
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold text-purple-900">{activeCategory}</h2>
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 ">
        {items.map((item, idx) => (
          <button
            key={item.id || idx}
            onClick={() => onSelectItem(item)}
            className="flex min-h-25 flex-col justify-between rounded-xl border border-purple-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="text-sm uppercase tracking-[0.08em] wrap-anywhere">
              {item.submenuName || item.itemName || item.name || 'Unnamed Selection'}
            </div>
            <div className="mt-2 font-semibold text-sm">
              <span className="py-1 text-amber-700">
                ${parseFloat(item.submenuPrice || item.price || 0).toFixed(2)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
