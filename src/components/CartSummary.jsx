import React from 'react';
import EmployeePunchIn from './EmployeePunchIn';
import Payment from './Payment';

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

    const orderDetails = isTakeout
      ? `Takeout order for ${firstName} ${lastName}, phone ${phone}`
      : 'Walk-in order';

    // alert(`Processing ${orderDetails}`);
    onClearCart();
    setOrderType('walk-in');
    setFirstName('');
    setLastName('');
    setPhone('');
  };

  const handleClosePayment = () => {
    setShowPayment(false);
    // onClearCart();

  }

  return (
    <div className=" flex flex-col justify-between gap-3 h-full">
      <div className='space-y-3 rounded-sm border border-purple-200 bg-purple-50 p-4 shadow-sm'>
        <div className="flex items-center justify-between">
          <h3 className="text-md font-semibold text-purple-900">Active Order</h3>
          <button
            className="rounded-md bg-white px-3 py-1 text-xs! font-semibold text-purple-600 shadow-sm transition hover:bg-purple-100"
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

        <div className="space-y-2">
          {cart.length === 0 ? (
            <div className="rounded-md border border-dashed border-purple-200 bg-white p-4 text-xs text-purple-600">
              No active order. Select product to begin.
            </div>
          ) : (
            cart.map((cartItem) => (
              <div key={cartItem.uid} className="rounded-xl border border-purple-200 bg-white p-2 shadow-sm text-[10px] space-y-2 relative">
                <div className="flex items-center justify-between gap-4 text-xs">
                  <div className="font-semibold text-purple-900">{cartItem.name} - ${cartItem.finalPrice.toFixed(2)}</div>

                  <div className='space-x-1 text-[9px]! font-semibold text-purple-700 whitespace-nowrap' >
                    <button
                      className=" rounded-full bg-purple-100 px-2 py-1 transition hover:bg-purple-200 cursor-pointer"
                      onClick={() => onRemoveItem(cartItem.uid)}
                    >
                      Repeat
                    </button>
                    <button
                      className="rounded-full bg-purple-100 px-2 py-1 transition hover:bg-purple-200 cursor-pointer"
                      onClick={() => onRemoveItem(cartItem.uid)}
                    >
                      X
                    </button>
                  </div>


                </div>
                <div>
                  <div className=" text-purple-600"> <span className='rounded-sm bg-purple-100 p-1 mr-1'> Size: {cartItem.size} </span>
                    <span className='rounded-sm bg-purple-100 p-1'> Base: {cartItem.base}</span>
                  </div>
                </div>

                {cartItem.toppings && cartItem.toppings.length > 0 && (
                  <div className="rounded-sm bg-purple-50 p-1 text-purple-700">
                    <strong>Add:</strong> {cartItem.toppings.join(', ')}
                  </div>
                )}
              </div>
            ))
          )}
        </div>


        <div className="flex items-center justify-between text-sm text-purple-600">
          <span>Subtotal</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-purple-600">
          <span>Estimated Tax (13%)</span>
          <span>${estimatedTax.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-purple-200 pt-4 text-base font-semibold text-purple-900">
          <span>Total Due</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
        <button
          className={`w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${isCartEmpty ? 'bg-purple-200 cursor-not-allowed' : 'bg-purple-900 hover:bg-purple-800'}`}
          disabled={isCartEmpty}
          onClick={handleCheckout}
        >
          💳 TENDER TRANSACTION
        </button>
      </div>
      {showPayment && <Payment totalDue={grandTotal.toFixed(2)} onClose={handleClosePayment} />}
      <EmployeePunchIn />

    </div>
  );
}
