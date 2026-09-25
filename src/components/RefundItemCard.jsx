import React from 'react';

export default function RefundItemCard ({item, isSelected, onToggle}) {
  const quantity = Number(item.itemQty || 1);
  const amount = Number(item.totalItemPrice);
  const name = item.itemName;
  const isRefundable = Number(item.remainingRefundQty || 0) > 0;

  return (
    <button
      type="button"
      disabled={!isRefundable}
      onClick={isRefundable ? onToggle : undefined}
      className={`relative rounded-xl border-2 p-4 text-left transition ${isSelected ? 'border-emerald-500 bg-emerald-50' : isRefundable ? 'border-purple-100 bg-gray-50 hover:border-purple-300' : 'cursor-not-allowed border-gray-200 bg-gray-100 opacity-60'}`}
    >
      {isSelected && <span className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2 py-1 text-xs font-bold text-white">Selected</span>}
      <div className="pr-16 font-semibold text-purple-900">{name}</div>
      <div className="mt-2 text-sm text-purple-700">Quantity: {quantity}</div>
      <div className="mt-1 text-xs text-purple-600">Remaining refund quantity: {item.remainingRefundQty || 0}</div>
      <div className="mt-1 font-semibold text-purple-900">${(amount * quantity).toFixed(2)}</div>
    </button>
  );
}
