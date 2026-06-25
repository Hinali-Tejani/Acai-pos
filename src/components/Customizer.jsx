import React from 'react';

export default function Customizer({ 
  selectedItem, 
  chosenSize, 
  setChosenSize, 
  chosenBase, 
  setChosenBase, 
  selectedToppings, 
  onToppingToggle, 
  sizeOptions, 
  baseOptions, 
  premiumToppings, 
  currentItemPrice, 
  onBack, 
  onAddToCart 
}) {
  return (
    <div className="pos-customization-wrapper">
      <div className="pos-custom-panel-header">
        <button className="pos-back-btn" onClick={onBack}>← Back to Grid</button>
        <h2>Customize: {selectedItem.itemName || selectedItem.name}</h2>
      </div>

      {/* Portions & Sizes Matrix */}
      <div className="pos-option-section">
        <h4 className="pos-option-title">1. Choose Size Options</h4>
        <div className="pos-flex-button-group">
          {sizeOptions.map((sz) => (
            <button
              key={sz.label}
              onClick={() => setChosenSize(sz.label)}
              className={`pos-selector-btn ${chosenSize === sz.label ? 'selected-item' : ''}`}
            >
              {sz.label} {sz.priceModifier !== 0 && `(${sz.priceModifier > 0 ? '+' : ''}$${sz.priceModifier.toFixed(2)})`}
            </button>
          ))}
        </div>
      </div>

      {/* Bases Options Layout */}
      <div className="pos-option-section">
        <h4 className="pos-option-title">2. Choose Core Sorbet Base</h4>
        <div className="pos-flex-button-group">
          {baseOptions.map((bs) => (
            <button
              key={bs}
              onClick={() => setChosenBase(bs)}
              className={`pos-selector-btn ${chosenBase === bs ? 'selected-purple' : ''}`}
            >
              {bs}
            </button>
          ))}
        </div>
      </div>

      {/* Premium Add-ons Checklist */}
      <div className="pos-option-section">
        <h4 className="pos-option-title">3. Extra Toppings Additions</h4>
        <div className="pos-toppings-grid">
          {premiumToppings.map((top) => {
            const isChecked = selectedToppings.some(t => t.name === top.name);
            return (
              <div 
                key={top.name}
                onClick={() => onToppingToggle(top)}
                className={`pos-topping-card ${isChecked ? 'topping-active' : ''}`}
              >
                <input type="checkbox" checked={isChecked} readOnly className="pos-checkbox-spacer" />
                <span className="pos-topping-label">{top.name}</span>
                <b className="pos-topping-price">+${top.price.toFixed(2)}</b>
              </div>
            );
          })}
        </div>
      </div>

      {/* Execution Sub-Footer Block */}
      <div className="pos-action-footer">
        <div className="pos-live-price-text">Line Subtotal: <span>${currentItemPrice.toFixed(2)}</span></div>
        <button className="pos-commit-order-btn" onClick={onAddToCart}>Add to Active Ticket →</button>
      </div>
    </div>
  );
}
