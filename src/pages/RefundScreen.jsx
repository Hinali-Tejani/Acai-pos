import React, {useState, useMemo} from 'react';
import {useNavigate} from 'react-router-dom';
import {useMenuState} from '../state/MenuState';
import ProductGrid from '../components/ProductGrid';

export default function RefundScreen ({addToRefundCart}) {
  const navigate = useNavigate();
  const {categories, activeItems, activeCategory, loading, itemsLoading} = useMenuState();

  const activeCategoryName = useMemo(() => categories.find(cat => cat.id === activeCategory)?.name || 'Category', [categories, activeCategory]);

  const handleSelectItem = (item) => {
    addToRefundCart?.(item);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-purple-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-purple-900">Process Refund</h1>
            <p className="mt-1 text-sm text-purple-600">Select items from the sidebar categories</p>
          </div>
          <button
            onClick={() => navigate('/manager-menu')}
            className="rounded-xl bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-300"
          >
            Back to Manager Menu
          </button>
        </div>
      </div>

      <ProductGrid
        items={activeItems || []}
        activeCategory={activeCategoryName}
        onSelectItem={handleSelectItem}
      />
    </div>
  );
}
