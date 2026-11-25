import React from 'react';

/**
 * WebOrdersPanel Component
 * Displays incoming web orders from SignalR connection
 * Provides UI for completing orders and managing the queue
 */
export default function WebOrdersPanel({
  orders = [],
  notification = null,
  onDismissNotification,
  isConnected = false,
  error = null,
}) {
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
      </div>

      {notification && (
        <div className={`mt-3 flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm font-semibold ${notification.type === 'paid'
          ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
          : 'border-amber-300 bg-amber-50 text-amber-800'}`}>
          <span>{notification.message}</span>
          <button
            type="button"
            onClick={onDismissNotification}
            className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-bold text-white ${notification.type === 'paid' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-amber-600 hover:bg-amber-500'}`}
          >
            {notification.type === 'paid' ? 'View / Acknowledge' : 'Dismiss'}
          </button>
        </div>
      )}

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
