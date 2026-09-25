import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';

import PendingPaymentOrdersPopup from './PendingPaymentOrdersPopup';
import CustomerSelectModal from './CustomerSelectModal';

export default function Sidebar ({
  categories,
  activeCategory,
  onCategoryChange,
  onResetItem,
  firstName,
  lastName,
  phoneNumber,
  setFirstName,
  setLastName,
  setPhoneNumber,
  isProcessing,
  onOpenPendingPaymentOrder,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCustomerModalOpen, setIsCustomerModalOpen] = React.useState(false);
  const [isPendingOrdersOpen, setIsPendingOrdersOpen] = React.useState(false);

  const handleHomeClick = () => {
    onCategoryChange('home');
    onResetItem();
    navigate('/home');
  };

  const selectedCustomerLabel = [firstName, lastName, phoneNumber].filter(Boolean).join(' | ');

  const handleCustomerSelect = (customer) => {
    setFirstName?.(customer.firstName || '');
    setLastName?.(customer.lastName || '');
    setPhoneNumber?.(customer.phoneNumber || '');
  };

  return (
    <div className="flex w-full shrink-0 justify-between border-b border-purple-200 bg-white">
      <div className="flex items-center gap-3 overflow-x-auto bg-gray-50 px-4 py-3">
        <button
          type="button"
          onClick={handleHomeClick}
          className={`shrink-0 rounded-xl border px-3 py-2 text-left text-sm! font-semibold transition ${activeCategory === 'home'
            ? 'border-purple-900 bg-purple-900 text-white'
            : 'border-purple-200 bg-white text-purple-800 hover:border-purple-900 hover:bg-gray-50'
            }`}
        >
          Home
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              onCategoryChange(cat.id);
              onResetItem();
              // If we're on a manager screen (refund), don't navigate away — let the page stay
              if (!location.pathname.startsWith('/manager')) {
                navigate(`/products/${cat.id}`);
              }
            }}
            className={`rounded-lg border px-3 py-2 text-left text-sm! font-semibold transition ${activeCategory === cat.id
              ? 'border-purple-900 border-2'
              : 'border-transparent bg-gray-200 text-purple-800 hover:border-purple-300 hover:bg-gray-50'
              }`}
          >
            {cat.name.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex shrink-0 items-center gap-3 bg-white px-4 py-3 sm:justify-end">
        <button
          className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-500"
          onClick={() => setIsPendingOrdersOpen(true)}
        >
          Pending Payments
        </button>
        <button
          className="rounded-xl bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-200"
          onClick={() => setIsCustomerModalOpen(true)}
        >
          Customer Portal
        </button>

      </div>

      <CustomerSelectModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSelectCustomer={handleCustomerSelect}
        selectedCustomerLabel={selectedCustomerLabel}
      />

      <PendingPaymentOrdersPopup
        isOpen={isPendingOrdersOpen}
        onClose={() => setIsPendingOrdersOpen(false)}
        onOpenPendingPaymentOrder={onOpenPendingPaymentOrder}
        isProcessing={isProcessing}
      />

    </div>
  );
}
