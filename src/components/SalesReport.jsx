import React, {useEffect, useState} from 'react';
import {fetchOrderDetails, fetchOrdersList} from '../services/managerApi';
import OrderDetailView from './OrderDetailView';

const getToday = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${today.getFullYear()}-${month}-${day}`;
};

export default function SalesReport ({onAddToRefundCart, refundVersion, onClearRefundCart}) {
    const [startDate, setStartDate] = useState(getToday);
    const [endDate, setEndDate] = useState('');
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);

    useEffect(() => {
        if (!refundVersion || !selectedOrder) return;
        setSelectedOrder(null);
        setOrderDetails(null);
        loadOrders();
    }, [refundVersion]);

    const loadOrders = async () => {
        if (!startDate) return;

        setIsLoading(true);
        try {
            const data = await fetchOrdersList(startDate, endDate || null);
            setOrders(data);
        } catch (error) {
            console.error('Failed to load orders:', error);
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewOrder = async (order) => {
        setSelectedOrder(order);
        setIsDetailsLoading(true);
        try {
            const details = await fetchOrderDetails(order.orderID);
            setOrderDetails(details[0]);
            // console.log('Fetched order details:', details);
        } catch (error) {
            console.error('Failed to load order details:', error);
            setOrderDetails(null);
        } finally {
            setIsDetailsLoading(false);
        }
    };

    if (selectedOrder) {
        return (
            <OrderDetailView
                order={selectedOrder}
                details={orderDetails}
                isLoading={isDetailsLoading}
                onClose={() => {
                    setSelectedOrder(null);
                    setOrderDetails(null);
                    onClearRefundCart?.();
                }}
                onRefresh={loadOrders}
                onAddToRefundCart={onAddToRefundCart}
            />
        );
    };

    return (
        <section className="flex h-[calc(100vh-16rem)] min-h-0 flex-col overflow-hidden rounded-xl border border-purple-200 bg-white shadow-sm">
            <div className="shrink-0 border-b border-purple-100 px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="font-semibold text-purple-900">Sales Report</h2>
                    <div className="flex flex-wrap gap-3 items-end">
                        <label className="text-xs font-semibold text-purple-700">
                            Start date
                            <input
                                type="date"
                                value={startDate}
                                onChange={(event) => setStartDate(event.target.value)}
                                className="mt-1 block rounded-lg border border-purple-200 px-3 py-2 text-sm font-normal text-purple-900 outline-none focus:border-purple-500"
                            />
                        </label>
                        <label className="text-xs font-semibold text-purple-700">
                            End date
                            <input
                                type="date"
                                value={endDate}
                                min={startDate}
                                onChange={(event) => setEndDate(event.target.value)}
                                className="mt-1 block rounded-lg border border-purple-200 px-3 py-2 text-sm font-normal text-purple-900 outline-none focus:border-purple-500"
                            />
                        </label>
                        <button
                            type="button"
                            onClick={loadOrders}
                            className="rounded-lg bg-purple-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-800"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>
            {isLoading ? (
                <div className="min-h-0 flex-1 overflow-y-auto p-5 text-center text-sm text-purple-600">Loading orders...</div>
            ) : orders.length === 0 ? (
                <div className="min-h-0 flex-1 overflow-y-auto p-5 text-center text-sm text-purple-600">No orders</div>
            ) : (
                <div className="min-h-0 flex-1 overflow-auto">
                    <table className="min-w-full text-left text-xs">
                        <thead className="bg-gray-50 text-purple-900">
                            <tr>
                                <th className="p-3 font-semibold">Order ID</th>
                                <th className="p-3 font-semibold">Name</th>
                                <th className="p-3 font-semibold">Phone</th>
                                <th className="p-3 font-semibold">Order Date</th>
                                <th className="p-3 text-right font-semibold">Total</th>
                                <th className="p-3 text-right font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.orderID} className="border-t border-purple-100">
                                    <td className="p-3 text-purple-900">{order.orderID}</td>
                                    <td className="p-3 text-purple-700">{[order.firstName, order.lastName].filter(Boolean).join(' ') || '-'}</td>
                                    <td className="p-3 text-purple-700">{order.phonenumber || '-'}</td>
                                    <td className="p-3 text-purple-700">{order.orderDate ? new Intl.DateTimeFormat('en-GB', {dateStyle: 'short'}).format(new Date(order.orderDate)) : '-'}</td>
                                    <td className="p-3 text-right font-medium text-purple-900">${Number(order.totalAmount || 0).toFixed(2)}</td>
                                    <td className="p-3 text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleViewOrder(order)}
                                            className="rounded-lg bg-purple-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-purple-800"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
