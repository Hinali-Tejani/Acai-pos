import React, {useState} from 'react';

export default function RefundItemSelector ({onItemsSelected, onCancel}) {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('1');
  const [itemPrice, setItemPrice] = useState('');

  const handleAddItem = () => {
    if (!itemName.trim() || !itemPrice) {
      alert('Please enter item name and price');
      return;
    }

    const quantity = parseInt(itemQuantity) || 1;
    const price = parseFloat(itemPrice) || 0;

    const newItem = {
      uid: Date.now().toString(),
      name: itemName.trim(),
      quantity: quantity,
      finalPrice: price,
    };

    setItems([...items, newItem]);
    setItemName('');
    setItemQuantity('1');
    setItemPrice('');
  };

  const handleRemoveItem = (uid) => {
    setItems(items.filter((item) => item.uid !== uid));
  };

  const handleSubmit = () => {
    if (items.length === 0) {
      alert('Please add at least one item to refund');
      return;
    }

    const total = items.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
    onItemsSelected(items, total, null);
  };

  const refundTotal = items.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);

  return (
    <div className="space-y-6">
      {/* Add Item Form */}
      <div className="rounded-xl border border-purple-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">Add Item to Refund</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-purple-900 mb-2">Item Name</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm text-purple-900 outline-none transition placeholder:text-purple-300 focus:border-purple-400"
              placeholder="Enter item name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-purple-900 mb-2">Quantity</label>
            <input
              type="number"
              min="1"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
              className="w-full rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm text-purple-900 outline-none transition placeholder:text-purple-300 focus:border-purple-400"
              placeholder="1"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-purple-900 mb-2">Price ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              className="w-full rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm text-purple-900 outline-none transition placeholder:text-purple-300 focus:border-purple-400"
              placeholder="0.00"
            />
          </div>
        </div>
        <button
          onClick={handleAddItem}
          className="mt-4 w-full rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
        >
          Add Item
        </button>
      </div>

      {/* Items List */}
      {items.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-purple-900 mb-3">Items to Refund</h3>
          <div className="rounded-xl border border-purple-200 bg-white overflow-hidden">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-purple-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-purple-900">Item</th>
                  <th className="px-4 py-3 font-semibold text-purple-900">Qty</th>
                  <th className="px-4 py-3 font-semibold text-purple-900 text-right">Price</th>
                  <th className="px-4 py-3 font-semibold text-purple-900 text-right">Total</th>
                  <th className="px-4 py-3 font-semibold text-purple-900 w-20">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.uid} className="border-t border-purple-100">
                    <td className="px-4 py-3 text-purple-900">{item.name}</td>
                    <td className="px-4 py-3 text-purple-700">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-purple-900">${item.finalPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-purple-900 font-semibold">${(item.finalPrice * item.quantity).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleRemoveItem(item.uid)}
                        className="text-red-600 hover:text-red-800 text-sm font-semibold"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Refund Summary */}
      {items.length > 0 && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-emerald-900">Total Refund Amount</span>
            <span className="text-lg font-bold text-emerald-900">${refundTotal.toFixed(2)}</span>
          </div>
          <div className="mt-2 text-xs text-emerald-700">
            {items.length} item{items.length !== 1 ? 's' : ''} added
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 rounded-xl bg-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={items.length === 0}
          className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
