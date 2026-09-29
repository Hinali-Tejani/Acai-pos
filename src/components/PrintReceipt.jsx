import React from 'react';

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

export default function PrintReceipt ({receipt}) {
  if (!receipt) return null;

  const subtotal = Number(receipt.subtotal || 0);
  const tax = Number(receipt.tax || 0);
  const total = Number(receipt.total || subtotal + tax);
  const orderDate = new Date(receipt.createdAt || Date.now());

  return (
    <div className="hidden print:block print:w-[72mm] print:p-0 print:m-0 font-mono text-xs text-black">
      <div className="w-full px-1 py-2">
        <header className="text-center">
          <h1 className="text-base font-bold tracking-wide">PALLADIUM ACAI</h1>
          <p>Fresh bowls and smoothies</p>
          <p>Order: #{receipt.orderId || 'N/A'}</p>
          <p>{orderDate.toLocaleDateString()} {orderDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</p>
        </header>

        <div className="my-2">--------------------------------</div>

        <main>
          {(receipt.items || []).map((item, index) => {
            const quantity = item.quantity || 1;
            const lineTotal = Number(item.finalPrice || item.lineTotal || item.price || 0) * quantity;
            const toppings = Array.isArray(item.toppings) ? item.toppings : [];

            return (
              <div key={item.uid || item.id || index} className="mb-2">
                <div className="flex justify-between gap-2">
                  <span className="min-w-0 flex-1 wrap-break-word">{item.name || 'Item'}</span>
                  <span className="shrink-0 whitespace-nowrap">{quantity} x {formatMoney(lineTotal)}</span>
                </div>
                {toppings.map((topping, toppingIndex) => {
                  const toppingName = typeof topping === 'string' ? topping : topping.name;
                  const toppingPrice = typeof topping === 'string' ? 0 : topping.price;
                  return (
                    <div key={`${toppingName}-${toppingIndex}`} className="pl-2 wrap-break-word">
                      - {toppingName || 'Topping'} ({formatMoney(toppingPrice)})
                    </div>
                  );
                })}
              </div>
            );
          })}
        </main>

        <div className="my-2">--------------------------------</div>
        <div className="space-y-1 text-right">
          <div>Subtotal: {formatMoney(subtotal)}</div>
          <div>Tax: {formatMoney(tax)}</div>
          <div className="font-bold">Grand Total: {formatMoney(total)}</div>
        </div>

        <footer className="mt-4 text-center">
          <p>Thank you for your order!</p>
        </footer>
      </div>
    </div>
  );
}
