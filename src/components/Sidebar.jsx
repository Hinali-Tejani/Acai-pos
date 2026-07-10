import React from 'react';
import {useNavigate} from 'react-router-dom';
import CustomerSelectModal from './CustomerSelectModal';

export default function Sidebar ({
  categories,
  activeCategory,
  onCategoryChange,
  onResetItem,
  firstName,
  lastName,
  phone,
  setFirstName,
  setLastName,
  setPhone,
}) {
  const navigate = useNavigate();
  const [isCustomerModalOpen, setIsCustomerModalOpen] = React.useState(false);

  const handleHomeClick = () => {
    onCategoryChange('home');
    onResetItem();
    navigate('/home');
  };

  const handleCustomerSelect = (customer) => {
    setFirstName?.(customer.firstName || '');
    setLastName?.(customer.lastName || '');
    setPhone?.(customer.phone || '');
  };

  const selectedCustomerLabel = [firstName, lastName].filter(Boolean).join(' ') || (phone ? `Phone: ${phone}` : '');

  return (
    <aside className="flex w-70 flex-col border-r border-purple-200 bg-white">
      <div className="space-y-2 bg-purple px-6 py-5 text-white">
        <h2 className="text-xl font-bold tracking-widest">ACAI AVENUE</h2>
        {/* <span className="text-xs text-purple-300">Live Menu Dashboard</span> */}
      </div>

      <div className="flex-1 overflow-y-auto bg-purple-50 p-4 space-y-3">
        <button
          type="button"
          onClick={handleHomeClick}
          className={`w-full rounded-xl border px-3 py-2 text-left text-sm! font-semibold transition ${activeCategory === 'home'
            ? 'border-purple-900 bg-purple-900 text-white'
            : 'border-purple-200 bg-white text-purple-800 hover:border-purple-900 hover:bg-purple-50'
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
              navigate(`/products/${cat.id}`);
            }}
            className={`w-full rounded-xl border px-3 py-2 text-left text-sm! font-semibold transition ${activeCategory === cat.id
              ? 'border-purple-900 border-2'
              : 'border-transparent bg-white text-purple-800 hover:border-purple-300 hover:bg-purple-50'
              }`}
          >
            {cat.name.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="border-t border-purple-200 bg-white p-4">
        <button
          className="w-full rounded-xl bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-200"
          onClick={() => setIsCustomerModalOpen(true)}
        >
          Customer Portal
        </button>
        {selectedCustomerLabel && (
          <p className="mt-2 truncate text-xs text-purple-600">Selected: {selectedCustomerLabel}</p>
        )}
      </div>

      <CustomerSelectModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSelectCustomer={handleCustomerSelect}
        selectedCustomerLabel={selectedCustomerLabel}
      />
    </aside>
  );
}
