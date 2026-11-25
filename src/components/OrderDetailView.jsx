import React, {useEffect, useMemo, useState} from 'react';
import RefundItemCard from './RefundItemCard';
import {deleteOrder} from '../services/managerApi';

export default function OrderDetailView ({order, details, isLoading, onClose, onRefresh, onAddToRefundCart, refundCart = []}) {
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    const addedRefundKeys = useMemo(
        () => refundCart.map((item) => item.uniqueKey).filter(Boolean),
        [refundCart]
    );

    useEffect(() => {
        setSelectedKeys([]);
    }, [order?.orderID]);

    useEffect(() => {
        if (refundCart.length === 0) setSelectedKeys([]);
    }, [refundCart.length]);

    const expandedItems = useMemo(() => {
        let sourceItems = [];

        if (Array.isArray(details)) {
            sourceItems = details;
        } else if (Array.isArray(details?.items)) {
            sourceItems = details.items;
        } else if (Array.isArray(details?.orderDetails)) {
            sourceItems = details.orderDetails;
        } else if (Array.isArray(details?.data?.items)) {
            sourceItems = details.data.items;
        } else if (Array.isArray(details?.data)) {
            sourceItems = details.data;
        } else if (details?.itemID != null) {
            sourceItems = [details];
        }

        return sourceItems.flatMap((item, itemIndex) => {
            const rawItemQty = item.itemQty ?? item.quantity ?? item.qty ?? 1;
            const itemQty = Math.max(1, Math.floor(Number(rawItemQty) || 1));
            const remainingRefundQty = Math.max(
                0,
                Math.min(itemQty, Math.floor(Number(item.remainingRefundQty ?? itemQty)))
            );
            const rawQuantity = Number(item.itemQty ?? item.quantity ?? item.qty ?? itemQty);
            const rawTotalPrice = Number(item.totalItemPrice ?? item.totalAmount ?? item.itemBasePrice ?? 0);
            const unitPrice = rawQuantity > 0
                ? rawTotalPrice / rawQuantity
                : Number(item.itemBasePrice || 0);
            const safeUnitPrice = Number.isFinite(unitPrice) && unitPrice >= 0
                ? unitPrice
                : Number(item.itemBasePrice || 0);

            return Array.from({length: itemQty}, (_, unitIndex) => {
                const uniqueKey = `${item.itemID ?? 'item'}-${item.itemSizeID ?? 'size'}-${itemIndex}-${unitIndex}`;

                return {
                    ...item,
                    qty: 1,
                    itemQty: 1,
                    remainingRefundQty: unitIndex < remainingRefundQty ? 1 : 0,
                    isAlreadyRefunded: unitIndex >= remainingRefundQty,
                    totalItemPrice: safeUnitPrice,
                    itemBasePrice: safeUnitPrice,
                    unitPrice: safeUnitPrice,
                    uniqueKey,
                };
            });
        });
    }, [details]);

    const selectedRows = useMemo(
        () => expandedItems.filter((item) => selectedKeys.includes(item.uniqueKey)),
        [expandedItems, selectedKeys]
    );

    const toggleItem = (item) => {
        if (item.isAlreadyRefunded || addedRefundKeys.includes(item.uniqueKey)) return;

        setSelectedKeys((current) => current.includes(item.uniqueKey)
            ? current.filter((key) => key !== item.uniqueKey)
            : [...current, item.uniqueKey]);
    };

    const handleRefundSelected = () => {
        selectedRows.forEach((item) => {
            onAddToRefundCart?.({
                ...item,
                uid: `order-${order.orderID}-${item.uniqueKey}`,
                uniqueKey: item.uniqueKey,
                qty: 1,
                refundOrderId: order.orderID,
                name: item.itemName,
                finalPrice: item.unitPrice,
                quantity: 1,
                totalBeforeTax: item.unitPrice,
                totalItemRefund: item.unitPrice,
                itemQty: 1,
                itemID: item.itemID,
                itemSizeID: item.itemSizeID,
            });
        });
        setSelectedKeys([]);
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
                ) : expandedItems.length === 0 ? (
                    <p className="text-center text-sm text-purple-600">No items found</p>
                ) : (
                    <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
                        {expandedItems.map((item) => {
                            const isAddedToRefund = addedRefundKeys.includes(item.uniqueKey);
                            const isDisabled = item.isAlreadyRefunded || isAddedToRefund;

                            return (
                                <RefundItemCard
                                    key={item.uniqueKey}
                                    item={item}
                                    isSelected={selectedKeys.includes(item.uniqueKey)}
                                    isDisabled={isDisabled}
                                    isAddedToRefund={isAddedToRefund}
                                    onToggle={() => toggleItem(item)}
                                />
                            );
                        })}
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
                    Add Refund
                </button>
                <button
                    type="button"
                    disabled={isSaving || isLoading}
                    onClick={handleDelete}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Delete
                </button>
            </div>
        </section>
    );
}
