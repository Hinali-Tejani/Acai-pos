import React from 'react';
import {useLocation} from 'react-router-dom';
import EmployeePunchIn from './EmployeePunchIn';
import Payment from './Payment';
import CheckoutTicket from './CheckoutTicket';
import RefundTicket from './RefundTicket';
import ManagerPasswordModal from './ManagerPasswordModal';
import {processRefund} from '../services/refundApi';
import {saveRefundDetails} from '../services/managerApi';
import {createReceiptBytes} from '../utils/receiptGenerator';

export default function CartSummary ({
  cart,
  cartTotal,
  onRemoveItem,
  onClearCart,
  onUpdateItem,
  onEditItem,
  editingItemIndex,
  onProcessOrder,
  isProcessing,
  pendingPaymentOrder,
  onProcessPendingPayment,
  orderType,
  setOrderType,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  phoneNumber,
  setPhoneNumber,
  onRequestTakeoutFormOpen,
  refundCart = [],
  addToRefundCart,
  refundTotal = 0,
  removeRefundItem,
  updateRefundQuantity,
  clearRefundCart,
  printRaw,
  onRefundComplete,
}) {
  const location = useLocation();
  const isRefundRoute = location.pathname.startsWith('/manager/refund');
  const safeRefundCart = Array.isArray(refundCart) ? refundCart : [];
  const hasOrderRefundItems = safeRefundCart.some((item) => item.refundOrderId);
  const isRefundMode = isRefundRoute || location.state?.refund === true || hasOrderRefundItems;

  const estimatedTax = cartTotal * 0.13;
  const grandTotal = cartTotal + estimatedTax;
  const refundSubtotal = Math.abs(Number(refundTotal) || 0);
  const refundTax = refundSubtotal * 0.13;
  const refundGrandTotal = refundSubtotal + refundTax;

  const isTakeout = orderType === 'takeout';
  const isCartEmpty = cart.length === 0;

  const [showPayment, setShowPayment] = React.useState(false);
  const [isPaid, setIsPaid] = React.useState(false);
  const [paymentTotalDue, setPaymentTotalDue] = React.useState(grandTotal.toFixed(2));
  const [activePendingOrder, setActivePendingOrder] = React.useState(null);
  const [statusMessage, setStatusMessage] = React.useState('');
  const [showRefundPayment, setShowRefundPayment] = React.useState(false);
  const [showRefundPasswordModal, setShowRefundPasswordModal] = React.useState(false);
  const [refundPaymentDetails, setRefundPaymentDetails] = React.useState(null);

  React.useEffect(() => {
    setPaymentTotalDue(grandTotal.toFixed(2));
  }, [grandTotal]);

  React.useEffect(() => {
    if (!pendingPaymentOrder) return;

    openPaymentForOrder({
      ...pendingPaymentOrder,
      source: 'pending',
    });
  }, [pendingPaymentOrder]);

  React.useEffect(() => {
    if (!isRefundMode) {
      setShowRefundPayment(false);
      setShowRefundPasswordModal(false);
      setRefundPaymentDetails(null);
      return;
    }
  }, [isRefundMode]);

  React.useEffect(() => {
    if (location.pathname === '/home') clearRefundCart?.();
  }, [location.pathname]);

  const printReceipt = async (receiptData) => {
    try {
      const bytes = createReceiptBytes(receiptData);
      await printRaw(bytes);
    } catch (error) {
      console.error('Receipt printing failed:', error);
    }
  };

  const buildPendingOrder = () => ({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    orderType,
    customerName: [firstName, lastName].filter(Boolean).join(' ').trim(),
    phoneNumber,
    subtotal: cartTotal,
    tax: estimatedTax,
    totalDue: grandTotal,
    items: cart.map((item) => ({
      uid: item.uid,
      name: item.name,
      finalPrice: item.finalPrice,
      quantity: item.quantity || 1,
    })),
  });

  const openPaymentForOrder = (order = null) => {
    const nextOrder = order || {
      id: 'current-order',
      createdAt: new Date().toISOString(),
      orderType,
      customerName: [firstName, lastName].filter(Boolean).join(' ').trim(),
      phoneNumber,
      subtotal: cartTotal,
      tax: estimatedTax,
      totalDue: grandTotal,
      items: cart,
      source: 'current',
    };

    setActivePendingOrder(nextOrder);
    setPaymentTotalDue(Number(nextOrder.totalDue).toFixed(2));
    setShowPayment(true);
  };

  const checkTakeoutFormRequired = () => {
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedPhoneNumber = phoneNumber.trim();

    if (isTakeout) {
      if (!trimmedFirstName || !trimmedLastName || !trimmedPhoneNumber) {
        onRequestTakeoutFormOpen?.();
        return;
      }
      if (!/^[0-9]+$/.test(trimmedPhoneNumber)) {
        onRequestTakeoutFormOpen?.();
        return;
      }
      if (trimmedPhoneNumber.length !== 10) {
        onRequestTakeoutFormOpen?.();
        return;
      }
    } else {
      if (!trimmedFirstName) {
        onRequestTakeoutFormOpen?.();
        return;
      }
    }

    if (!firstName.trim() || (isTakeout && !lastName.trim()) || (isTakeout && !phoneNumber.trim())) {
      return;
    }
  }

  const handlePayNow = () => {
    if (isCartEmpty) return;
    checkTakeoutFormRequired();
    // If the form is valid, proceed to open the payment modal
    if (!firstName.trim() || (isTakeout && !lastName.trim()) || (isTakeout && !phoneNumber.trim())) {
      return;
    }
    openPaymentForOrder();
  };

  const handlePayLater = async () => {
    if (isCartEmpty) return;
    checkTakeoutFormRequired();
    if (!firstName.trim() || (isTakeout && !lastName.trim()) || (isTakeout && !phoneNumber.trim())) return;

    try {
      await onProcessOrder?.('CASH', true);
      onClearCart();
      setOrderType('walk-in');
      setFirstName('');
      setLastName('');
      setPhoneNumber('');
      setStatusMessage(`Saved pending payment order for ${grandTotal.toFixed(2)}`);
    } catch (error) {
      console.error('Failed to create pending order:', error);
    }
  };

  const handlePaymentComplete = async (method) => {
    const paymentMethod = method === 'CASH' ? 'CASH' : 'CARD';

    try {
      if (activePendingOrder?.source === 'pending') {
        await onProcessPendingPayment?.(paymentMethod, activePendingOrder);
      } else {
        await onProcessOrder?.(paymentMethod, false);
      }

      await printReceipt({
        id: activePendingOrder?.orderID ?? activePendingOrder?.id ?? 'current-order',
        items: activePendingOrder?.items || cart,
        total: activePendingOrder?.totalDue ?? grandTotal,
        paymentMethod: paymentMethod.toLowerCase(),
        kind: 'sale',
      });

      onClearCart();
      setOrderType('walk-in');
      setFirstName('');
      setLastName('');
      setPhoneNumber('');
      setShowPayment(false);
      setActivePendingOrder(null);
      setStatusMessage('Payment completed');
    } catch (error) {
      console.error('Payment completion failed:', error);
    }
  };

  const handleClosePayment = () => {
    setShowPayment(false);
    setActivePendingOrder(null);
  };

  const handlePayPendingOrder = (order) => {
    openPaymentForOrder({
      ...order,
      source: 'pending',
    });
  };

  const handleProceedToRefundPayment = () => {
    if (!safeRefundCart.length) return;
    setShowRefundPasswordModal(true);
  };

  const handleRefundPasswordVerified = async () => {
    setShowRefundPasswordModal(false);

    try {
      const orderId = safeRefundCart.find((item) => item.refundOrderId)?.refundOrderId;
      if (orderId) {
        const groupedRefundItems = safeRefundCart.reduce((groups, item) => {
          const itemID = item.itemID;
          const itemSizeID = item.itemSizeID;
          const key = `${itemID ?? 'item'}-${itemSizeID ?? 'size'}`;
          const unitRefund = Math.abs(Number(item.totalItemRefund ?? item.finalPrice ?? 0));

          if (!groups[key]) {
            groups[key] = {
              itemID,
              itemSizeID,
              totalItemRefund: unitRefund,
              itemQty: 1,
            };
          } else {
            groups[key].itemQty += 1;
            groups[key].totalItemRefund += unitRefund;
          }

          return groups;
        }, {});

        const itemArray = Object.values(groupedRefundItems).map((item) => ({
          itemID: item.itemID,
          itemSizeID: item.itemSizeID,
          totalItemRefund: Number(item.totalItemRefund.toFixed(2)),
          itemQty: item.itemQty,
        }));
        const refundSubtotalFromItems = itemArray.reduce((sum, item) => sum + item.totalItemRefund, 0);
        const totalRefund = refundSubtotalFromItems * 1.13;
        const amtBeforeTax = safeRefundCart.reduce(
          (sum, item) => sum + Math.abs(Number(item.totalBeforeTax ?? item.finalPrice ?? 0)) * (item.quantity || 1),
          0
        );

        await saveRefundDetails(orderId, totalRefund, amtBeforeTax, itemArray);
      } else {
        await saveRefundDetails(safeRefundCart);
      }

      setShowRefundPayment(true);
    } catch (error) {
      console.error('Failed to save refund details:', error);
      alert('Failed to save refund details. Please try again.');
    }
  };

  const handleRefundPaymentComplete = async (details) => {
    try {
      const refundData = {
        items: safeRefundCart,
        refundAmount: refundGrandTotal,
        paymentMethod: details.method,
        cashReceived: details.cashPaid,
        changeGiven: details.change,
        processedBy: 'Manager',
        processedAt: new Date().toISOString(),
      };

      await processRefund(refundData);
      await printReceipt({
        id: `refund-${Date.now()}`,
        items: safeRefundCart,
        total: refundGrandTotal,
        paymentMethod: details?.method,
        kind: 'refund',
        isRefund: true,
      });
      setRefundPaymentDetails(details);
      clearRefundCart?.();
      setShowRefundPayment(false);
      setStatusMessage('Refund completed');
      onRefundComplete?.();
    } catch (error) {
      console.error('Failed to process refund:', error);
      alert('Failed to process refund. Please try again.');
    }
  };

  const handleCloseRefundPayment = () => {
    setShowRefundPayment(false);
  };

  const handleRemovePendingOrder = (orderId) => {
    setStatusMessage(`Pending payment ${orderId} should be removed from the popup list.`);
  };

  const onRepeatItem = (uid) => {
    const itemToRepeat = cart.find(item => item.uid === uid);
    if (itemToRepeat) {
      const newItem = {
        ...itemToRepeat,
        uid: `${itemToRepeat.uid}-${Date.now()}`,
      };
      cart.push(newItem);
      onUpdateItem(newItem);
    }
  }

  const onRepeatRefundItem = (uid) => {
    const itemToRepeat = safeRefundCart.find((item) => item.uid === uid);
    if (!itemToRepeat) return;

    addToRefundCart?.({
      ...itemToRepeat,
      uid: itemToRepeat.uid,
      quantity: 1,
    });
  };

  return (
    <div className="flex h-full flex-col justify-between gap-3">
      <div className="space-y-3 border-r border-purple-200 bg-gray-50 p-4 shadow-sm flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-semibold text-purple-900">Active Order</h3>
          <button
            className="rounded-md bg-white px-3 py-1 text-xs font-semibold text-purple-600 shadow-sm transition hover:bg-purple-100"
            onClick={onClearCart}
          >
            Clear
          </button>
        </div>

        <div className="rounded-md border border-purple-200 bg-white p-1 px-3 text-sm text-purple-700 text-center">
          <>
            <span className="font-semibold text-purple-900">Order type: </span>
            <span className="ml-1 text-xs uppercase text-purple-700">
              {orderType === 'takeout' ? 'Takeout' : 'Walk-in'}
            </span>
          </>
          {(firstName || lastName || phoneNumber) && (
            <div>
              {(firstName || lastName) && (
                <div>
                  <span className="font-semibold text-purple-900">Name: </span>
                  <span className="ml-1 text-xs text-purple-700">
                    {firstName} {lastName}
                  </span>
                </div>
              )}
              {phoneNumber && (
                <div>
                  <span className="font-semibold text-purple-900">phoneNumber: </span>
                  <span className="ml-1 text-xs text-purple-700">
                    {phoneNumber}
                  </span>
                </div>
              )}
              <div>
                <span className="font-semibold text-purple-900">Status: </span>
                <span className="text-xs font-bold uppercase">
                  {isPaid ? 'Paid' : 'Not paid'}
                </span>
              </div>
            </div>
          )}
        </div>

        {isRefundMode ? (
          <RefundTicket
            refundCart={safeRefundCart}
            refundTotal={refundTotal}
            onRemoveItem={removeRefundItem}
            onRepeatItem={onRepeatRefundItem}
            onClearCart={clearRefundCart}
            onProceedToRefund={handleProceedToRefundPayment}
            isCartEmpty={safeRefundCart.length === 0}
          />
        ) : (
          <CheckoutTicket
            cart={cart}
            cartTotal={cartTotal}
            onRemoveItem={onRemoveItem}
            onRepeatItem={onRepeatItem}
            onEditItem={onEditItem}
            editingItemIndex={editingItemIndex}
            onPayNow={handlePayNow}
            onPayLater={handlePayLater}
            isProcessing={isProcessing}
            isCartEmpty={isCartEmpty}
          />
        )}
      </div>

      {showPayment && (
        <Payment
          totalDue={paymentTotalDue}
          onProcessPayment={handlePaymentComplete}
          onClose={handleClosePayment}
        />
      )}

      {showRefundPasswordModal && (
        <ManagerPasswordModal
          isOpen={showRefundPasswordModal}
          onClose={() => setShowRefundPasswordModal(false)}
          onSubmit={handleRefundPasswordVerified}
        />
      )}

      {showRefundPayment && (
        <Payment
          totalDue={refundGrandTotal.toFixed(2)}
          onPaymentComplete={handleRefundPaymentComplete}
          onClose={handleCloseRefundPayment}
          isRefund
        />
      )}

      {refundPaymentDetails && isRefundMode && (
        <div className="mt-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
          Refund completed
        </div>
      )}
      <EmployeePunchIn />
    </div>
  );
}
