import React from 'react';

export default function CheckoutTicket({ cart, cartTotal, onRemoveItem, onClearCart }) {
  const estimatedTax = cartTotal * 0.13;
  const grandTotal = cartTotal + estimatedTax;

  return (
    <div className="pos-checkout-panel">
      <h3 className="pos-cart-title">Active Register Ticket</h3>
      <div className="pos-ticket-scroll-area">
        {cart.length === 0 ? (
          <div className="pos-empty-cart-msg">No active line-items on ticket. Select product to begin.</div>
        ) : (
          cart.map((cartItem) => (
            <div key={cartItem.uid} className="pos-ticket-line-item">
              <div className="pos-ticket-line-row">
                <span className="pos-ticket-item-name">{cartItem.name}</span>
                <span className="pos-ticket-item-price">${cartItem.finalPrice.toFixed(2)}</span>
              </div>
              <div className="pos-ticket-meta-details">
                <span className="pos-meta-pill">Size: {cartItem.size}</span>
                <span className="pos-meta-pill">Base: {cartItem.base}</span>
                {cartItem.toppings.length > 0 && (
                  <div className="pos-ticket-toppings-list">
                    <strong>Add:</strong> {cartItem.toppings.join(', ')}
                  </div>
                )}
              </div>
              <button 
                className="pos-remove-item-btn" 
                onClick={() => onRemoveItem(cartItem.uid)}
              >
                Void Line Item
              </button>
            </div>
          ))
        )}
      </div>

      {/* Totals Summary Stack Section */}
      <div className="pos-summary-block">
        <div className="pos-summary-row">
          <span>Subtotal</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        <div className="pos-summary-row">
          <span>Estimated Tax (13%)</span>
          <span>${estimatedTax.toFixed(2)}</span>
        </div>
        <div className="pos-summary-row pos-summary-total">
          <span>Total Due</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
        
        <button 
          className={`pos-pay-button ${cart.length === 0 ? 'disabled' : 'active'}`}
          disabled={cart.length === 0}
          onClick={() => {
            alert('Initializing Payment Terminal Interface Processing...');
            onClearCart();
          }}
        >
          💳 TENDER TRANSACTION
        </button>
      </div>
    </div>
  );
}
