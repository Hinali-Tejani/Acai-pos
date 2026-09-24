import React, {useState, useMemo, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useMenuState} from '../state/MenuState';
import ProductGrid from '../components/ProductGrid';

const BOWLS_CATEGORY_ID = 1;

export default function RefundScreen ({onSelectItem, setActiveCategory}) {
  const navigate = useNavigate();
  const {categories, activeItems, activeCategory, loading, itemsLoading, loadSubmenu} = useMenuState();

  const activeCategoryName = useMemo(() => categories.find(cat => cat.id === activeCategory)?.name || 'Bowls', [categories, activeCategory]);

  // Load menu on mount
  useEffect(() => {
    setActiveCategory(BOWLS_CATEGORY_ID);
    loadSubmenu(BOWLS_CATEGORY_ID);
  }, []);

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
            Back
          </button>
        </div>
      </div>

      <ProductGrid
        items={activeItems || []}
        activeCategory={activeCategoryName}
        onSelectItem={onSelectItem}
      />
    </div>
  );
}
