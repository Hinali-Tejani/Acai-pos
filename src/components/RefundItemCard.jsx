import React from 'react';

export default function RefundItemCard ({item, isSelected, isDisabled = false, isAddedToRefund = false, onToggle}) {
  const unitPrice = Number(item.unitPrice ?? item.itemBasePrice ?? item.totalItemPrice ?? 0);
  const name = item.itemName || item.name || 'Unnamed item';

  const handleClick = () => {
    if (isDisabled) return;
    onToggle?.();
  };

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={handleClick}
      className={`relative rounded-lg border-2 p-2 text-left transition text-[9px]! ${isAddedToRefund
        ? 'cursor-not-allowed border-emerald-500 bg-emerald-100 opacity-75'
        : isSelected
          ? 'border-emerald-500 bg-emerald-50'
          : isDisabled
            ? 'cursor-not-allowed border-gray-300 bg-gray-100 opacity-50'
            : 'border-purple-100 bg-gray-50 hover:border-purple-300'}`}
    >
      {isAddedToRefund && (
        <span className="absolute right-3 top-3 rounded-full bg-emerald-600 px-2 py-1 font-bold text-white">
          Added
        </span>
      )}
      {isDisabled && !isAddedToRefund && item.isAlreadyRefunded && (
        <span className="absolute right-3 top-3 rounded-full bg-gray-500 px-2 py-1 font-bold text-white">
          Refunded
        </span>
      )}
      <div className='text-xs'>
        <div className="pr-16 font-semibold text-purple-900">{name}</div>
        {item.addons && item.addons.length > 0 && (
          <div className="mt-1 text-[9px] text-purple-700">
             {item.addons.map((addon) => addon.toppingName).join(', ')}
          </div>
        )}
        {/* <div className="mt-2 text-sm text-purple-700">Quantity: 1</div> */}
        <div className="mt-1 font-semibold text-purple-900">${unitPrice.toFixed(2)}</div>
      </div>
    </button>
  );
}
