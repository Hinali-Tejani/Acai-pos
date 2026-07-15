import React, {useEffect, useState} from 'react';
import PopUp from './PopUp';

export const PENDING_PAYMENTS_STORAGE_KEY = 'acai-pos-pending-payments';

const readPendingPayments = () => {
  try {
    const raw = window.localStorage.getItem(PENDING_PAYMENTS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const formatPendingDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export default function PendingPaymentOrdersPopup ({isOpen, onClose, onPayNow}) {
  const [pendingOrders, setPendingOrders] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setPendingOrders(readPendingPayments());
  }, [isOpen]);

  return (
    <PopUp isOpen={isOpen} title="Pending Payment Orders" onClose={onClose} size="lg">
      <div className="space-y-4">
        {pendingOrders.length === 0 ? (
          <div className="rounded-md border border-dashed border-purple-200 bg-purple-50 p-4 text-center text-xs text-purple-600">
            No pending payment orders yet.
          </div>
        ) : (
          <div className="max-h-90 overflow-y-auto pr-1">
            <table className="min-w-full text-left text-sm">
              <thead className="sticky top-0 bg-purple-50 text-purple-900">
                <tr>
                  <th className="px-4 py-3 font-semibold">Customer Name</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Time</th>
                  <th className="px-4 py-3 font-semibold">Order Type</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingOrders.map((order) => (
                  <tr key={order.id} className="border-t border-purple-100">
                    <td className="px-4 py-3 text-purple-900">{order.customerName || 'Walk-in customer'}</td>
                    <td className="px-4 py-3 text-purple-700">{order.phoneNumber || '—'}</td>
                    <td className="px-4 py-3 text-purple-700">{formatPendingDate(order.createdAt)}</td>
                    <td className="px-4 py-3 text-purple-700">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${order.orderType === 'takeout' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                        {order.orderType === 'takeout' ? 'Takeout' : 'Walk-in'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-purple-900">${Number(order.totalDue || 0).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => {
                          onClose?.();
                          onPayNow?.(order);
                        }}
                        className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-400"
                      >
                        Pay Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PopUp>
  );
}