import React from 'react';
import { useSignalROrders } from '../hooks/useSignalROrders';

/**
 * WebOrdersPanel Component
 * Displays incoming web orders from SignalR connection
 * Provides UI for completing orders and managing the queue
 */
export default function WebOrdersPanel() {
//   const { orders, isConnected, error, completeOrder, clearAllOrders } = useSignalROrders();
  const { orders, isConnected } = useSignalROrders();

  return (
    <div className="mb-2 p-2">
      {/* Header with connection status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-purple-900">Web Orders</h3>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex h-3 w-3 rounded-full transition-all ${
                isConnected
                  ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50'
                  : 'bg-red-500 shadow-lg shadow-red-500/50'
              }`}
            />
            <span className="text-sm font-medium text-purple-700">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* {orders.length > 0 && (
          <button
            type="button"
            onClick={clearAllOrders}
            className="rounded-lg bg-purple-100 px-3 py-1.5 text-xs font-semibold text-purple-700 transition hover:bg-purple-200 active:scale-95"
          >
            Clear All
          </button>
        )} */}
      </div>

      {/* Error message */}
      {/* {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <span className="font-semibold">⚠️ Connection Error:</span> {error}
        </div>
      )} */}

      {/* Orders list */}
      
    </div>
  );
}
