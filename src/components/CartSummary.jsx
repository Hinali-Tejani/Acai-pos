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
  takeoutFormRef,
}) {

  const estimatedTax = cartTotal * 0.13;
  const grandTotal = cartTotal + estimatedTax;

  const isTakeout = orderType === 'takeout';
  const isCartEmpty = cart.length === 0;

  const [showPayment, setShowPayment] = React.useState(false);

  const handleCheckout = () => {
    if (isCartEmpty) return;
    if (isTakeout && !takeoutFormRef.current?.validate()) return;
    setShowPayment(true);
  };

  const handlePaymentComplete = () => {
    onClearCart();
    setOrderType('walk-in');
    setFirstName('');
    setLastName('');
    setPhone('');
    setShowPayment(false);
  };

  const handleClosePayment = () => {
    setShowPayment(false);
  };

  const onRepeatItem = (uid) => {
    const itemToRepeat = cart.find(item => item.uid === uid);
    if (itemToRepeat) {
      const newItem = {
        ...itemToRepeat,
        uid: `${itemToRepeat.uid}}`, // Generate a new unique ID
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
          onCheckout={handleCheckout}
          isCartEmpty={isCartEmpty}
        />
      </div>

      {showPayment && (
        <Payment
          totalDue={grandTotal.toFixed(2)}
          onPaymentComplete={handlePaymentComplete}
          onClose={handleClosePayment}
        />
      )}
      <EmployeePunchIn />
    </div>
  );
}
