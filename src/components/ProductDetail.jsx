import React from 'react';

export default function Customizer ({
  chosenBase,
  setChosenBase,
  selectedToppings,
  onToppingToggle,
  selectedAllergies,
  onAllergyToggle,
  baseOptions,
  addOns,
  allergies,
  onBack,
  onAddToCart,
  editingItemIndex,
  isRefund
}) {
  const addOnsByCategory = addOns.reduce((groups, addOn) => {
    const category = addOn.toppingCategory || 'Other';
    if (!groups[category]) groups[category] = [];
    groups[category].push(addOn);
    return groups;
  }, {});

  return (
    <div className="space-y-4 rounded-xl border border-purple-200 bg-white px-4 py-2 shadow-sm overflow-y-auto">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-purple-500">Choose Base</div>
          <div className="flex gap-3">
            <button
              className="rounded-lg bg-purple-900 px-2.5 py-1.5 text-sm! font-semibold text-white transition hover:bg-purple-800"
              onClick={onAddToCart}
            >
              {editingItemIndex !== null ? 'Update Order' : isRefund ? 'Add to refund' : 'Add to order'}
            </button>
            <button
              className="rounded-xl border border-purple-300 bg-white px-2.5 py-1.5 text-sm! font-semibold text-purple-700 transition hover:border-purple-400 hover:bg-purple-100"
              onClick={onBack}
            >
              Clear
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          {baseOptions.map((bs) => (
            <button
              key={bs}
              onClick={() => setChosenBase(bs)}
              className={`rounded-xl border px-5 py-2 text-sm font-semibold transition ${chosenBase === bs ? 'border-purple-900 bg-purple-900 text-white' : 'border-purple-200 bg-gray-50 text-purple-800 hover:border-purple-300 hover:bg-purple-100'}`}
            >
              {bs}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-semibold uppercase tracking-[0.24em] text-purple-500">Extra Toppings Additions</div>

        {addOns.length === 0 ? (
          <div className="text-[11px] text-purple-600">No additional toppings are available.</div>
        ) : (
          <div className="flex gap-x-3">
            {Object.entries(addOnsByCategory).map(([category, categoryAddOns]) => (
              <div key={category} className="space-y-1 flex-1 border border-purple-300 p-2 py-1 rounded-md">
                <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">
                  {category}
                </h4>
                <div className="grid grid-cols-3 gap-1 text-center text-xs md:grid-cols-2 xl:grid-cols-2">
                  {categoryAddOns.map((top) => {
                    const isChecked = selectedToppings.some(t => t.name === top.name);
                    return (
                      <button
                        key={top.addonID}
                        type="button"
                        onClick={() => onToppingToggle(top)}
                        className={`flex flex-wrap flex-col items-center gap-1 rounded-xl border p-2 font-semibold transition ${isChecked ? 'border-purple-900 bg-purple-900 text-white' : 'border-purple-200 bg-gray-50 text-purple-800 hover:border-purple-300 hover:bg-purple-100'}`}
                      >
                        <span className="flex-1 wrap-anywhere">{top.name}</span>
                        <b className={`text-[10px] ${isChecked ? 'text-white' : 'text-gray-600'}`}>+${top.price.toFixed(2)}</b>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="text-sm font-semibold uppercase tracking-[0.24em] text-purple-500">Mark Allergens That Apply</div>
        {allergies.length === 0 ? (
          <div className="text-[11px] text-purple-600">No allergen information available.</div>
        ) : (
          <div className="grid gap-2 grid-cols-2 md:grid-cols-5 xl:grid-cols-6 text-xs">
            {allergies.map((allergy) => {
              const isChecked = selectedAllergies.some(a => a.id === allergy.id);
              return (
                <button
                  key={allergy.id || allergy.name}
                  type="button"
                  onClick={() => onAllergyToggle(allergy)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left font-semibold transition ${isChecked ? 'border-amber-500 bg-amber-300 text-amber-900' : 'border-amber-200 bg-amber-50 text-amber-800 hover:border-amber-300 hover:bg-amber-100'}`}
                >
                  {/* <input type="checkbox" checked={isChecked} readOnly className="h-4 w-4 rounded border-amber-300 bg-white text-amber-900" /> */}
                  <span className="flex-1"> {allergy.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
