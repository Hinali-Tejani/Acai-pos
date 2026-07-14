import React from 'react';

export default function CheckoutTicket ({
  cart,
  cartTotal,
  onRemoveItem,
  onRepeatItem,
  onPayNow,
  onPayLater,
  isCartEmpty,
}) {
  const estimatedTax = cartTotal * 0.13;
  const grandTotal = cartTotal + estimatedTax;

  return (
    <div className="">
      <div className="mb-3 flex items-center justify-between border-b border-purple-200 pb-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-purple-900">Register Ticket</h3>
        <span className="text-[11px] font-medium text-purple-600">
          {cart.length} {cart.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
        {cart.length === 0 ? (
          <div className="rounded-md border border-dashed border-purple-200 bg-white p-4 text-center text-xs text-purple-600">
            No active line-items on ticket. Select a product to begin.
          </div>
        ) : (
          cart.map((cartItem) => (
            <div key={cartItem.uid} className="rounded-xl border border-purple-200 bg-white p-2 shadow-sm space-y-2 text-[10px]">
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="font-semibold text-purple-900">{cartItem.name} - ${cartItem.finalPrice.toFixed(2)}</div>
                <div className="space-x-1 text-[9px]! font-semibold text-purple-700 whitespace-nowrap">
                  {onRepeatItem && (
                    <button
                      className="rounded-full bg-purple-100 px-2 py-1 transition hover:bg-purple-200"
                      onClick={() => onRepeatItem(cartItem.uid)}
                    >
                      Repeat
                    </button>
                  )}
                  <button
                    className="rounded-full bg-purple-100 px-2 py-1 transition hover:bg-purple-200"
                    onClick={() => onRemoveItem(cartItem.uid)}
                  >
                    X
                  </button>
                </div>
              </div>

              <div className="text-purple-600">
                <span className="mr-1 rounded-sm bg-purple-100 px-1.5 py-0.5">Size: {cartItem.size}</span>
                <span className="rounded-sm bg-purple-100 px-1.5 py-0.5">Base: {cartItem.base}</span>
              </div>
              {cartItem.toppings && cartItem.toppings.length > 0 && (
                <div className="rounded-sm bg-purple-50 p-1 text-purple-700">
                  <strong>Add:</strong> {cartItem.toppings.join(', ')}
                </div>
              )}
              {cartItem.allergies && cartItem.allergies.length > 0 && (
                <div className="rounded-sm bg-orange-50 p-1 text-orange-700">
                  <strong>Allergens:</strong> {cartItem.allergies.join(', ')}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-4 space-y-2 border-t border-purple-200 pt-3">
        <div className="flex items-center justify-between text-sm text-purple-600">
          <span>Subtotal</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-purple-600">
          <span>Estimated Tax (13%)</span>
          <span>${estimatedTax.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-purple-200 pt-3 text-base font-semibold text-purple-900">
          <span>Total Due</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            className={`rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${isCartEmpty ? 'cursor-not-allowed bg-purple-200' : 'bg-amber-600 hover:bg-amber-500'}`}
            disabled={isCartEmpty}
            onClick={onPayLater}
          >
            Pay Later
          </button>
          <button
            className={`rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${isCartEmpty ? 'cursor-not-allowed bg-purple-200' : 'bg-purple-900 hover:bg-purple-800'}`}
            disabled={isCartEmpty}
            onClick={onPayNow}
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}
