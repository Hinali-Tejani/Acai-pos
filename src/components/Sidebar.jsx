import React from 'react';

export default function Sidebar({ categories, activeCategory, onCategoryChange, onResetItem }) {
  return (
    <div className="pos-side-tab-column">
      {/* Brand Header Display Block */}
      <div className="pos-brand-header">
        <h2 className="pos-brand-text">PALLADIUM</h2>
        <span className="pos-brand-sub">Live Menu Dashboard</span>
      </div>

      {/* Persistent Global Main Menu Navigation Tab */}
      <button
        onClick={() => {
          onCategoryChange('All Products'); // Sets fallback category identity
          onResetItem(); // Clears configuration panels
        }}
        className={`pos-sidebar-button pos-main-menu-btn ${activeCategory === 'All Products' ? 'active-tab' : ''}`}
      >
        🏠 MAIN MENU
      </button>

      {/* Dynamic Sub-Category Stream Toggles */}
      <div className="pos-category-scroll-container">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              onCategoryChange(cat);
              onResetItem();
            }}
            className={`pos-sidebar-button ${activeCategory === cat ? 'active-tab' : ''}`}
          >
            {cat.toUpperCase()}
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
