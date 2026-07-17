import React from 'react';

export default function RefundTicket({
  refundCart,
  refundTotal,
  onRemoveItem,
  onUpdateItem,
  onClearCart,
  onProceedToRefund,
  isCartEmpty,
}) {
  const itemCount = refundCart.length;
  const displayTotal = Math.abs(Number(refundTotal) || 0);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between border-b border-purple-200 pb-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-purple-900">Refund Ticket</h3>
        <span className="text-[11px] font-medium text-purple-600">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
        {refundCart.length === 0 ? (
          <div className="rounded-md border border-dashed border-purple-200 bg-white p-4 text-center text-xs text-purple-600">
            No items selected for refund. Choose products from the menu to start.
          </div>
        ) : (
          refundCart.map((cartItem) => {
            const lineTotal = Math.abs((cartItem.finalPrice || 0) * (cartItem.quantity || 1));

            return (
              <div key={cartItem.uid} className="space-y-2 rounded-xl border border-purple-200 bg-white p-2 text-[10px] shadow-sm">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="font-semibold text-purple-900">
                    {cartItem.name}
                  </div>
                  <div className="space-x-1 whitespace-nowrap text-[9px]! font-semibold text-purple-700">
                    <button
                      className="rounded-full bg-purple-100 px-2 py-1 transition hover:bg-purple-200"
                      onClick={() => onUpdateItem?.(cartItem.uid, -1)}
                    >
                      -
                    </button>
                    <button
                      className="rounded-full bg-purple-100 px-2 py-1 transition hover:bg-purple-200"
                      onClick={() => onUpdateItem?.(cartItem.uid, 1)}
                    >
                      +
                    </button>
                    <button
                      className="rounded-full bg-purple-100 px-2 py-1 transition hover:bg-purple-200"
                      onClick={() => onRemoveItem?.(cartItem.uid)}
                    >
                      X
                    </button>
                  </div>
                </div>

                <div className="text-purple-600">
                  <span className="mr-1 rounded-sm bg-purple-100 px-1.5 py-0.5">Qty: {cartItem.quantity || 1}</span>
                  <span className="rounded-sm bg-purple-100 px-1.5 py-0.5">Refund: ${lineTotal.toFixed(2)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 space-y-2 border-t border-purple-200 pt-3">
        <div className="flex items-center justify-between text-sm text-purple-600">
          <span>Subtotal</span>
          <span>${displayTotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-purple-600">
          <span>Estimated Tax</span>
          <span>$0.00</span>
        </div>
        <div className="flex items-center justify-between border-t border-purple-200 pt-3 text-base font-semibold text-purple-900">
          <span>Total Refund</span>
          <span>${displayTotal.toFixed(2)}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            className={`rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${isCartEmpty ? 'cursor-not-allowed bg-purple-200' : 'bg-gray-500 hover:bg-gray-400'}`}
            disabled={isCartEmpty}
            onClick={onClearCart}
          >
            Clear
          </button>
          <button
            className={`rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${isCartEmpty ? 'cursor-not-allowed bg-purple-200' : 'bg-emerald-600 hover:bg-emerald-500'}`}
            disabled={isCartEmpty}
            onClick={onProceedToRefund}
          >
            Proceed to Refund
          </button>
        </div>
      </div>
    </div>
  );
}
