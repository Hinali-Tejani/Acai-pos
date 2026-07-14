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
          <div className="max-h-90 space-y-2 overflow-y-auto pr-1">
            {pendingOrders.map((order) => (
              <div key={order.id} className="rounded-xl border border-purple-200 bg-purple-50 p-3 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-purple-900">
                      {order.customerName || 'Walk-in customer'}
                    </div>
                    <div className="text-xs text-purple-600">
                      {order.orderType === 'takeout' ? 'Takeout' : 'Walk-in'} • {formatPendingDate(order.createdAt)}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-purple-900">
                    ${Number(order.totalDue || 0).toFixed(2)}
                  </div>
                </div>
                <div className="mt-2 text-xs text-purple-700">
                  {order.phone ? `Phone: ${order.phone}` : 'No phone saved'}
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      onClose?.();
                      onPayNow?.(order);
                    }}
                    className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-400"
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PopUp>
  );
}