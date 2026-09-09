import React, {useState, useMemo, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useMenuState} from '../state/MenuState';
import RefundTabNavigation from '../components/RefundTabNavigation';
import QuickItemRefundTab from '../components/QuickItemRefundTab';
import OrderSearchTab from '../components/OrderSearchTab';
import {processRefund, searchRefundableOrders} from '../services/refundApi';
import {createReceiptBytes} from '../utils/receiptGenerator';

export default function RefundScreen ({addToRefundCart, printRaw}) {
  const navigate = useNavigate();
  const {categories, activeItems, activeCategory, loadSubmenu} = useMenuState();
  const [activeTab, setActiveTab] = useState('items');
  const [searchMode, setSearchMode] = useState('orderId');
  const [orderId, setOrderId] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [matchingOrders, setMatchingOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refundMode, setRefundMode] = useState('full');
  const [selectedItems, setSelectedItems] = useState({});
  const [searchMessage, setSearchMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);

  const selectFullOrder = (order, mode = 'full') => {
    setRefundMode(mode);
    if (mode !== 'full') return;

    const selection = {};
    (order.items || []).forEach((item) => {
      selection[item.id] = {selected: true, quantity: item.quantity};
    });
    setSelectedItems(selection);
  };

  const handleItemToggle = (itemId, checked, quantity = 1) => {
    setSelectedItems((previous) => ({
      ...previous,
      [itemId]: {selected: checked, quantity: checked ? (quantity || 1) : 0},
    }));
  };

  const handleQuantityChange = (item, delta) => {
    setSelectedItems((previous) => {
      const current = previous[item.id] || {selected: true, quantity: 1};
      return {
        ...previous,
        [item.id]: {
          ...current,
          selected: true,
          quantity: Math.max(1, Math.min(item.quantity, current.quantity + delta)),
        },
      };
    });
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setMatchingOrders([]);
    setSearchMessage('');
    selectFullOrder(order);
  };

  const handleSearch = async () => {
    const value = searchMode === 'orderId' ? orderId.trim() : customerPhone.replace(/\D/g, '');
    if (!value) {
      setSearchMessage(`Please enter a ${searchMode === 'orderId' ? 'order ID' : 'customer phone number'} to continue.`);
      return;
    }

    setIsSearching(true);
    setSearchMessage('');
    try {
      const results = searchMode === 'orderId'
        ? await searchRefundableOrders({orderId: value})
        : await searchRefundableOrders({customerPhone: value});

      setMatchingOrders(results);
      setSelectedOrder(null);
      setSelectedItems({});
      setRefundMode('full');
      setSearchMessage(results.length ? '' : 'No refundable orders found.');
      if (results.length === 1) handleSelectOrder(results[0]);
    } catch {
      setMatchingOrders([]);
      setSearchMessage('Unable to search refundable orders. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const refundItems = useMemo(() => (selectedOrder?.items || []).map((item) => {
    const selection = selectedItems[item.id] || {selected: false, quantity: 0};
    const quantity = selection.selected ? Math.min(item.quantity, Number(selection.quantity) || 0) : 0;
    return {...item, quantityToRefund: quantity, lineTotal: quantity * item.price};
  }).filter((item) => item.quantityToRefund > 0), [selectedOrder, selectedItems]);

  const refundTotal = useMemo(() => refundItems.reduce((total, item) => total + item.lineTotal, 0), [refundItems]);

  const handleProcessSelectedRefund = async () => {
    if (!selectedOrder || !refundItems.length) return;
    setIsProcessingRefund(true);
    try {
      await processRefund({
        orderId: selectedOrder.orderId,
        customerName: selectedOrder.customerName,
        refundMode,
        items: refundItems.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantityToRefund,
          unitPrice: item.price,
          lineTotal: item.lineTotal,
        })),
        subtotal: refundTotal,
        tax: 0,
        total: refundTotal,
        processedBy: 'Manager',
        processedAt: new Date().toISOString(),
      });
      if (printRaw) {
        await printRaw(createReceiptBytes({
          id: `refund-${selectedOrder.orderId}`,
          items: refundItems.map((item) => ({...item, price: item.lineTotal})),
          total: refundTotal,
        }));
      }
      alert(`Refund completed for order ${selectedOrder.orderId}.`);
    } catch {
      alert('Refund failed. Please try again.');
    } finally {
      setIsProcessingRefund(false);
    }
  };

  const activeCategoryName = useMemo(() => categories.find(cat => cat.id === activeCategory)?.name || 'Category', [categories, activeCategory]);

  useEffect(() => {
    if (activeCategory) {
      loadSubmenu(activeCategory);
    }
  }, [activeCategory, loadSubmenu]);

  const handleSelectItem = (item) => {
    addToRefundCart?.(item);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-purple-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-purple-900">Process Refund</h1>
            <p className="mt-1 text-sm text-purple-600">Select items from the sidebar categories</p>
          </div>
          <button
            onClick={() => navigate('/manager-menu')}
            className="rounded-xl bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-300"
          >
            Back
          </button>
        </div>
      </div>

      <RefundTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'items' ? (
        <QuickItemRefundTab
          items={activeItems}
          activeCategory={activeCategoryName}
          onSelectItem={handleSelectItem}
        />
      ) : (
        <OrderSearchTab
          searchMode={searchMode}
          setSearchMode={setSearchMode}
          orderId={orderId}
          setOrderId={setOrderId}
          customerPhone={customerPhone}
          setCustomerPhone={setCustomerPhone}
          handleSearch={handleSearch}
          isSearching={isSearching}
          searchMessage={searchMessage}
          matchingOrders={matchingOrders}
          selectedOrder={selectedOrder}
          handleSelectOrder={handleSelectOrder}
          refundMode={refundMode}
          selectFullOrder={selectFullOrder}
          selectedItems={selectedItems}
          handleItemToggle={handleItemToggle}
          handleQuantityChange={handleQuantityChange}
          refundTotal={refundTotal}
          refundItems={refundItems}
          handleProcessSelectedRefund={handleProcessSelectedRefund}
          isProcessingRefund={isProcessingRefund}
        />
      )}
    </div>
  );
}
