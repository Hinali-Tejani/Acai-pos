import React from 'react';

export default function ProductGrid ({items, activeCategory, onSelectItem}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-purple-900">{activeCategory}</h2>
      <div className="grid gap-5 grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 ">
        {items.map((item, idx) => (
          <button
            key={item.id || idx}
            onClick={() => onSelectItem(item)}
            className="flex min-h-[160px] flex-col justify-between rounded-[12px] border border-purple-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="text-sm uppercase tracking-[0.22em]">
              {item.submenuName || item.itemName || item.name || 'Unnamed Selection'}
            </div>
            <div className="mt-4 inline-flex items-center justify-between text-base font-bold text-purple-900">
              {/* <span className="text-lg">{item.submenuName ? item.submenuName : item.itemName || item.name}</span> */}
              <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                ${parseFloat(item.submenuPrice || item.price || 0).toFixed(2)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
