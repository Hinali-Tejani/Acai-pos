import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderTypeForm from './OrderTypeForm';
import PopUp from './PopUp';
import ManagerPasswordModal from './ManagerPasswordModal';
import { API_CONFIG } from '../config/apiConfig';

const quickActions = [
  {
    id: 'walk-in',
    label: 'Walk-in',
    description: 'Start a walk-in order',
  },
  {
    id: 'takeout',
    label: 'Takeout',
    description: 'Capture customer details for pickup',
  },
  {
    id: 'delivery',
    label: 'Delivery',
    description: 'Capture delivery details',
  },
  {
    id: 'manager-menu',
    label: 'Manager Menu',
    description: 'Manager controls and reports',
  },
];

export default function HomeActions({
  orderType,
  setOrderType,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  phoneNumber,
  setPhoneNumber,
  isTakeoutModalOpen,
  setIsTakeoutModalOpen,
}) {
  const navigate = useNavigate();
  const [activeAction, setActiveAction] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleSelectAction = (nextType) => {
    if (nextType === 'walk-in' || nextType === 'takeout') {
      setOrderType(nextType);
      setActiveAction(nextType);
      setIsTakeoutModalOpen(true);
      return;
    }

    if (nextType === 'manager-menu') {
      setShowPasswordModal(true);
      return;
    }

    setActiveAction(nextType);
    setIsTakeoutModalOpen(false);
  };

  const handlePasswordVerified = () => {
    setShowPasswordModal(false);
    navigate('/manager-menu');
  };

  const popupTitle = activeAction === 'takeout'
    ? 'Takeout order details'
    : activeAction === 'walk-in'
      ? 'Walk-in order details'
      : 'Order details';

  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-purple-900">Quick Actions</div>
      <div className="grid grid-cols-4 gap-2">
        {quickActions.map((action) => {
          const isSelected = activeAction === action.id;

          return (
            <button
              key={action.id}
              className={`flex w-full flex-col items-center justify-center rounded-xl px-2 py-6 text-center text-xs font-semibold transition ${isSelected ? 'bg-purple-900 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
              type="button"
              onClick={() => handleSelectAction(action.id)}
            >
              <span className="leading-tight">{action.label}</span>
            </button>
          );
        })}
      </div>

      <PopUp
        isOpen={isTakeoutModalOpen && (activeAction === 'walk-in' || activeAction === 'takeout')}
        title={popupTitle}
        onClose={() => setIsTakeoutModalOpen(false)}
        size="md"
      >
        <div className="space-y-3">
          <p className="text-sm text-purple-700">
            {activeAction === 'takeout'
              ? 'Capture the pickup customer details below.'
              : 'Customer details are optional for a walk-in order.'}
          </p>
          <OrderTypeForm
            orderType={orderType}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            onSubmit={() => {
              setIsTakeoutModalOpen(false);
              setActiveAction('');
            }}
            onCancel={() => {
              setIsTakeoutModalOpen(false);
              setActiveAction('');
            }}
          />
        </div>
      </PopUp>

      <ManagerPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordVerified}
      />
    </div>
  );
}