import React, {useMemo, useState} from 'react';
import RefundItemCard from './RefundItemCard';
import {deleteOrder} from '../services/managerApi';

export default function OrderDetailView ({order, details, isLoading, onClose, onRefresh, onAddToRefundCart}) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const items = details?.items || [];

    const selectedRows = useMemo(
        () => items.filter((item, index) => selectedItems.includes(index) && Number(item.remainingRefundQty || 0) > 0),
        [items, selectedItems]
    );

    const toggleItem = (index) => {
        if (Number(items[index]?.remainingRefundQty || 0) <= 0) return;

        setSelectedItems((current) => current.includes(index)
            ? current.filter((itemIndex) => itemIndex !== index)
            : [...current, index]);
    };

    const handleRefundSelected = () => {
        selectedRows.forEach((item) => {
            onAddToRefundCart?.({
                ...item,
                uid: `order-${order.orderID}-${item.itemID}-${item.itemSizeID}`,
                refundOrderId: order.orderID,
                name: item.itemName,
                finalPrice: Number(item.totalItemPrice || 0),
                quantity: Number(item.itemQty || 1),
                totalBeforeTax: Number(item.totalItemPrice || 0),
            });
        });
        setSelectedItems([]);
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this order?')) return;

        setIsSaving(true);
        try {
            await deleteOrder(order.orderID);
            onClose();
            await onRefresh();
        } catch (error) {
            console.error('Failed to delete order:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <section className="flex h-[calc(100vh-16rem)] min-h-0 flex-col overflow-hidden rounded-xl border border-purple-200 bg-white shadow-sm">
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-purple-100 px-5 py-4">
                <div>
                    <h2 className="text-lg font-semibold text-purple-900">Order #{order.orderID}</h2>
                    <p className="mt-1 text-sm text-purple-700">
                        {order.firstName} {order.lastName}
                        {' | '}
                        {order.phonenumber}
                    </p>
                </div>
                <button type="button" onClick={onClose} className="rounded-lg bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300">
                    Back
                </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
                {isLoading ? (
                    <p className="text-center text-sm text-purple-600">Loading order details...</p>
                ) : items.length === 0 ? (
                    <p className="text-center text-sm text-purple-600">No items found</p>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {details?.items.map((item, index) => (
                            <RefundItemCard
                                key={item.itemID}
                                item={item}
                                isSelected={selectedItems.includes(index)}
                                onToggle={() => toggleItem(index)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-purple-100 bg-gray-50 p-4">
                <button
                    type="button"
                    disabled={selectedRows.length === 0 || isSaving || isLoading}
                    onClick={handleRefundSelected}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Refund Selected
                </button>
                <button
                    type="button"
                    disabled={isSaving || isLoading}
                    onClick={handleDelete}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Delete Order
                </button>
            </div>

        </section>
    );
}
