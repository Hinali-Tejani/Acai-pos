import React from 'react';

export default function Sidebar({ categories, activeCategory, onCategoryChange, onResetItem }) {
  return (
    <div className="pos-side-tab-column">
      {/* Brand Header Display Block */}
      <div className="pos-brand-header">
        <h2 className="pos-brand-text">ACAI WORLD</h2>
        <span className="pos-brand-sub">Live Menu Dashboard</span>
      </div>

      {/* Dynamic Sub-Category Stream Toggles */}
      <div className="pos-category-scroll-container">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              onCategoryChange(cat.id);
              onResetItem();
            }}
            className={`pos-sidebar-button ${activeCategory === cat.id ? 'active-tab' : ''}`}
          >
            {cat.name.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="pos-sidebar-footer">
        <button className="pos-system-util-button" onClick={() => alert('Terminal Connected')}>
          🌐 API Online
        </button>
      </div>
    </div>
  );
}
