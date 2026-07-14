import React from 'react';
import EmployeePunchIn from './EmployeePunchIn';
import Payment from './Payment';
import CheckoutTicket from './CheckoutTicket';

export default function CartSummary ({
  cart,
  cartTotal,
  onRemoveItem,
  onClearCart,
  onUpdateItem,
  orderType,
  setOrderType,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  phone,
  setPhone,
  onRequestTakeoutFormOpen,
}) {

  const estimatedTax = cartTotal * 0.13;
  const grandTotal = cartTotal + estimatedTax;

  const isTakeout = orderType === 'takeout';
  const isCartEmpty = cart.length === 0;

  const [showPayment, setShowPayment] = React.useState(false);
  const [paymentTotalDue, setPaymentTotalDue] = React.useState(grandTotal.toFixed(2));
  const [activePendingOrder, setActivePendingOrder] = React.useState(null);
  const [statusMessage, setStatusMessage] = React.useState('');

  React.useEffect(() => {
    setPaymentTotalDue(grandTotal.toFixed(2));
  }, [grandTotal]);

  const buildPendingOrder = () => ({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    orderType,
    customerName: [firstName, lastName].filter(Boolean).join(' ').trim(),
    phone,
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
      phone,
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

  const handlePayNow = () => {
    if (isCartEmpty) return;
    if (isTakeout) {
      const trimmedFirstName = firstName.trim();
      const trimmedLastName = lastName.trim();
      const trimmedPhone = phone.trim();

      if (!trimmedFirstName || !trimmedLastName || !trimmedPhone) {
        onRequestTakeoutFormOpen?.();
        return;
      }
      if (!/^[0-9]+$/.test(trimmedPhone)) {
        onRequestTakeoutFormOpen?.();
        return;
      }
      if (trimmedPhone.length !== 10) {
        onRequestTakeoutFormOpen?.();
        return;
      }
    }
    openPaymentForOrder();
  };

  const handlePayLater = () => {
    if (isCartEmpty) return;
    if (isTakeout) {
      const trimmedFirstName = firstName.trim();
      const trimmedLastName = lastName.trim();
      const trimmedPhone = phone.trim();

      if (!trimmedFirstName || !trimmedLastName || !trimmedPhone) {
        onRequestTakeoutFormOpen?.();
        return;
      }
      if (!/^[0-9]+$/.test(trimmedPhone)) {
        onRequestTakeoutFormOpen?.();
        return;
      }
      if (trimmedPhone.length !== 10) {
        onRequestTakeoutFormOpen?.();
        return;
      }
    }

    const nextOrder = buildPendingOrder();
    const raw = window.localStorage.getItem('acai-pos-pending-payments');
    const currentOrders = raw ? JSON.parse(raw) : [];
    const nextOrders = [nextOrder, ...currentOrders];
    window.localStorage.setItem('acai-pos-pending-payments', JSON.stringify(nextOrders));
    onClearCart();
    setOrderType('walk-in');
    setFirstName('');
    setLastName('');
    setPhone('');
    setStatusMessage(`Saved pending payment order for ${nextOrder.totalDue.toFixed(2)}`);
  };

  const handlePaymentComplete = () => {
    if (activePendingOrder?.source !== 'pending') {
      onClearCart();
      setOrderType('walk-in');
      setFirstName('');
      setLastName('');
      setPhone('');
      setShowPayment(false);
      setActivePendingOrder(null);
      setStatusMessage('Payment completed');
      return;
    }
    onClearCart();
    setOrderType('walk-in');
    setFirstName('');
    setLastName('');
    setPhone('');
    setShowPayment(false);
    setActivePendingOrder(null);
    setStatusMessage('Pending payment completed');
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

  const handleRemovePendingOrder = (orderId) => {
    setStatusMessage(`Pending payment ${orderId} should be removed from the popup list.`);
  };

  const onRepeatItem = (uid) => {
    const itemToRepeat = cart.find(item => item.uid === uid);
    if (itemToRepeat) {
      const newItem = {
        ...itemToRepeat,
        uid: `${itemToRepeat.uid}-${Date.now()}`, // Generate a new unique ID
      };
      cart.push(newItem);
      onUpdateItem(newItem);
    }
  }

  return (
    <div className="flex h-full flex-col justify-between gap-3">
      <div className="space-y-3 rounded-sm border border-purple-200 bg-purple-50 p-4 shadow-sm flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-semibold text-purple-900">Active Order</h3>
          <button
            className="rounded-md bg-white px-3 py-1 text-xs font-semibold text-purple-600 shadow-sm transition hover:bg-purple-100"
            onClick={onClearCart}
          >
            Clear
          </button>
        </div>

        <div className="rounded-md border border-purple-200 bg-white p-1 px-3 text-sm text-purple-700">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-purple-900">Order type</span>
            <span className="text-xs uppercase text-purple-700">
              {orderType === 'takeout' ? 'Takeout' : 'Walk-in'}
            </span>
          </div>
        </div>


        <CheckoutTicket
          cart={cart}
          cartTotal={cartTotal}
          onRemoveItem={onRemoveItem}
          onRepeatItem={onRepeatItem}
          onPayNow={handlePayNow}
          onPayLater={handlePayLater}
          isCartEmpty={isCartEmpty}
        />
      </div>

      {showPayment && (
        <Payment
          totalDue={paymentTotalDue}
          onPaymentComplete={handlePaymentComplete}
          onClose={handleClosePayment}
        />
      )}
      <EmployeePunchIn />
    </div>
  );
}
