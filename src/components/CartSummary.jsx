import React from 'react';

export default function CartSummary ({cart, cartTotal, onRemoveItem, onClearCart}) {
    const estimatedTax = cartTotal * 0.13;
    const grandTotal = cartTotal + estimatedTax;

    return (
        <div className="space-y-6 rounded-[32px] border border-purple-200 bg-purple-50 p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-purple-900">Active Register Ticket</h3>
                <button
                    className="rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-purple-600 shadow-sm transition hover:bg-purple-100"
                    onClick={onClearCart}
                >
                    Clear
                </button>
            </div>

            <div className="space-y-4">
                {cart.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-purple-200 bg-white px-4 py-6 text-sm text-purple-600">
                        No active line-items on ticket. Select product to begin.
                    </div>
                ) : (
                    cart.map((cartItem) => (
                        <div key={cartItem.uid} className="rounded-3xl border border-purple-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center justify-between gap-4">
                                <span className="font-semibold text-purple-900">{cartItem.name}</span>
                                <span className="text-sm font-semibold text-purple-900">${cartItem.finalPrice.toFixed(2)}</span>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2 text-xs text-purple-600">
                                <span className="rounded-full bg-purple-100 px-3 py-1">Size: {cartItem.size}</span>
                                <span className="rounded-full bg-purple-100 px-3 py-1">Base: {cartItem.base}</span>
                            </div>
                            {cartItem.toppings.length > 0 && (
                                <div className="mt-3 rounded-2xl bg-purple-50 px-3 py-2 text-sm text-purple-700">
                                    <strong>Add:</strong> {cartItem.toppings.join(', ')}
                                </div>
                            )}
                            <button
                                className="mt-4 rounded-2xl bg-purple-100 px-4 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-200"
                                onClick={() => onRemoveItem(cartItem.uid)}
                            >
                                Remove Item
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="space-y-3 rounded-3xl border border-purple-200 bg-white p-5">
                <div className="flex items-center justify-between text-sm text-purple-600">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-purple-600">
                    <span>Estimated Tax (13%)</span>
                    <span>${estimatedTax.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-purple-200 pt-4 text-base font-semibold text-purple-900">
                    <span>Total Due</span>
                    <span>${grandTotal.toFixed(2)}</span>
                </div>
                <button
                    className={`w-full rounded-3xl px-4 py-3 text-sm font-semibold text-white transition ${cart.length === 0 ? 'bg-purple-200 cursor-not-allowed' : 'bg-purple-900 hover:bg-purple-800'}`}
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
