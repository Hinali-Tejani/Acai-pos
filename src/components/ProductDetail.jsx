import React from 'react';

export default function Customizer ({
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
    <div className="space-y-8 rounded-xl border border-purple-200 bg-white p-4 shadow-sm">

      {/* size options */}
      {/* <div className="space-y-4">
        <div className="text-sm font-semibold uppercase tracking-[0.24em] text-purple-500">Choose Size Options</div>
        <div className="flex flex-wrap gap-3">
          {sizeOptions.map((sz) => (
            <button
              key={sz.label}
              onClick={() => setChosenSize(sz.label)}
              className={`rounded-xl border px-5 py-3 text-sm font-semibold transition ${chosenSize === sz.label ? 'border-purple-900 bg-purple-900 text-white' : 'border-purple-200 bg-purple-50 text-purple-800 hover:border-purple-300 hover:bg-purple-100'}`}
            >
              {sz.label} {sz.priceModifier !== 0 && `(${sz.priceModifier > 0 ? '+' : ''}$${sz.priceModifier.toFixed(2)})`}
            </button>
          ))}
        </div>
      </div> */}

      <div className="space-y-4">
        <div className="text-sm font-semibold uppercase tracking-[0.24em] text-purple-500">Choose Core Sorbet Base</div>
        <div className="flex flex-wrap gap-3 text-xs">
          {baseOptions.map((bs) => (
            <button
              key={bs}
              onClick={() => setChosenBase(bs)}
              className={`rounded-xl border px-5 py-3 text-sm font-semibold transition ${chosenBase === bs ? 'border-purple-900 bg-purple-900 text-white' : 'border-purple-200 bg-purple-50 text-purple-800 hover:border-purple-300 hover:bg-purple-100'}`}
            >
              {bs}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-sm font-semibold uppercase tracking-[0.24em] text-purple-500">Extra Toppings Additions</div>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 text-xs">
          {premiumToppings.map((top) => {
            const isChecked = selectedToppings.some(t => t.name === top.name);
            return (
              <button
                key={top.name}
                type="button"
                onClick={() => onToppingToggle(top)}
                className={`flex items-center gap-2 flex-wrap rounded-xl border px-3 py-2 text-left font-semibold transition ${isChecked ? 'border-purple-900 bg-purple-900 text-white' : 'border-purple-200 bg-purple-50 text-purple-800 hover:border-purple-300 hover:bg-purple-100'}`}
              >
                <input type="checkbox" checked={isChecked} readOnly className="h-4 w-4 rounded border-purple-300 bg-white text-purple-900" />
                <span className="flex-1">{top.name}</span>
                <b className="rounded-full bg-purple-100 px-2 py-1 text-[10px] text-purple-700">+${top.price.toFixed(2)}</b>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-xl bg-purple-50 p-3 px-4">
        <div className="text-base font-semibold text-purple-900">
          Line Subtotal: <span className="text-purple-600">${currentItemPrice.toFixed(2)}</span>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            className="rounded-xl bg-purple-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-800"
            onClick={onAddToCart}
          >
            Add to order
          </button>
          <button
            className="rounded-xl border border-purple-300 bg-white px-6 py-3 text-sm font-semibold text-purple-700 transition hover:border-purple-400 hover:bg-purple-100"
            onClick={onBack}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
