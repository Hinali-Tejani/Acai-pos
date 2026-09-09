export default function OrderSearchTab ({
  searchMode,
  setSearchMode,
  orderId,
  setOrderId,
  customerPhone,
  setCustomerPhone,
  handleSearch,
  isSearching,
  searchMessage,
  matchingOrders,
  selectedOrder,
  handleSelectOrder,
  refundMode,
  selectFullOrder,
  selectedItems,
  handleItemToggle,
  handleQuantityChange,
  refundTotal,
  refundItems,
  handleProcessSelectedRefund,
  isProcessingRefund,
}) {
  return (
    <>
      <div className="rounded-xl border border-purple-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSearchMode('orderId')}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${searchMode === 'orderId' ? 'bg-purple-900 text-white' : 'border border-purple-200 text-purple-700'}`}
          >
            Search by Order ID
          </button>
          <button
            type="button"
            onClick={() => setSearchMode('customerPhone')}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${searchMode === 'customerPhone' ? 'bg-purple-900 text-white' : 'border border-purple-200 text-purple-700'}`}
          >
            Search by Phone
          </button>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <input
            type={searchMode === 'orderId' ? 'text' : 'tel'}
            value={searchMode === 'orderId' ? orderId : customerPhone}
            onChange={(event) => searchMode === 'orderId' ? setOrderId(event.target.value) : setCustomerPhone(event.target.value)}
            placeholder={searchMode === 'orderId' ? 'Enter order ID' : 'Enter customer phone number'}
            className="w-full rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-purple-900 outline-none placeholder:text-purple-400 focus:border-purple-400"
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={isSearching}
            className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-60"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {searchMessage && <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{searchMessage}</p>}
      </div>

      {matchingOrders.length > 0 && !selectedOrder && (
        <div className="rounded-xl border border-purple-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-purple-900">Select an order</h2>
          <div className="space-y-2">
            {matchingOrders.map((order) => (
              <button
                key={order.orderId}
                type="button"
                onClick={() => handleSelectOrder(order)}
                className="flex w-full flex-col gap-1 rounded-lg border border-purple-200 bg-purple-50 p-3 text-left hover:bg-purple-100 md:flex-row md:items-center md:justify-between"
              >
                <span className="font-semibold text-purple-900">Order #{order.orderId}</span>
                <span className="text-sm text-purple-700">{order.customerName} {order.phoneNumber}</span>
                <span className="text-sm text-purple-700">{order.items?.length || 0} items</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="space-y-4 rounded-xl border border-purple-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-500">Selected Order</p>
              <h2 className="text-xl font-bold text-purple-900">#{selectedOrder.orderId}</h2>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => selectFullOrder(selectedOrder)} className={`rounded-lg px-3 py-2 text-sm font-semibold ${refundMode === 'full' ? 'bg-emerald-500 text-white' : 'border border-purple-200 text-purple-700'}`}>
                Full Refund
              </button>
              <button type="button" onClick={() => selectFullOrder(selectedOrder, 'partial')} className={`rounded-lg px-3 py-2 text-sm font-semibold ${refundMode === 'partial' ? 'bg-amber-500 text-white' : 'border border-purple-200 text-purple-700'}`}>
                Partial Refund
              </button>
            </div>
          </div>

          <div className="space-y-2 rounded-xl border border-purple-200 bg-purple-50 p-4">
            {(selectedOrder.items || []).map((item) => {
              const selection = selectedItems[item.id] || {selected: false, quantity: 1};
              return (
                <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-purple-200 bg-white p-3">
                  <label className="flex items-center gap-3 text-sm font-medium text-purple-800">
                    <input
                      type="checkbox"
                      checked={Boolean(selection.selected)}
                      onChange={(event) => handleItemToggle(item.id, event.target.checked, selection.quantity)}
                      className="h-4 w-4 rounded border-purple-300 text-purple-900"
                    />
                    {item.name}
                  </label>
                  <div className="flex items-center gap-2 text-sm text-purple-700">
                    <button type="button" onClick={() => handleQuantityChange(item, -1)} className="h-7 w-7 rounded-md border border-purple-200">-</button>
                    <span className="min-w-6 text-center">{selection.selected ? selection.quantity : 0}</span>
                    <button type="button" onClick={() => handleQuantityChange(item, 1)} className="h-7 w-7 rounded-md border border-purple-200">+</button>
                    <span>${(item.price * (selection.selected ? selection.quantity : 0)).toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between border-t border-purple-200 pt-3 text-base font-bold text-purple-900">
            <span>Refund total</span>
            <span>${refundTotal.toFixed(2)}</span>
          </div>
          <button type="button" onClick={handleProcessSelectedRefund} disabled={!refundItems.length || isProcessingRefund} className="w-full rounded-xl bg-purple-900 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300">
            {isProcessingRefund ? 'Processing...' : 'Process Selected Refund'}
          </button>
        </div>
      )}
    </>
  );
}
