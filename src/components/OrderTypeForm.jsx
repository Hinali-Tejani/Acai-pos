import React, {useState} from 'react';
import TakeoutForm from './TakeoutForm';

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
    id: 'manager-menu',
    label: 'Manager Menu',
    description: 'Manager controls and reports',
  },
  {
    id: 'more-options',
    label: 'More Options',
    description: 'Additional shortcuts coming soon',
  },
];

export default function OrderTypeForm({
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
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeAction, setActiveAction] = useState('');

  const handleSelectAction = (nextType) => {
    if (nextType === 'walk-in' || nextType === 'takeout') {
      setOrderType(nextType);
    }

    setActiveAction(nextType);
    setIsPanelOpen(true);
  };

  return (
    <div className="flex h-full flex-col space-y-3">
      <div className="text-sm font-semibold text-purple-900">Quick Actions</div>
      <div className="grid grid-cols-4 gap-2">
        {quickActions.map((action) => {
          const isSelected = activeAction === action.id;

          return (
            <button
              key={action.id}
              className={`flex py-6 w-full flex-col items-center justify-center rounded-2xl px-2 text-center text-xs font-semibold transition ${isSelected ? 'bg-purple-900 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
              type="button"
              onClick={() => handleSelectAction(action.id)}
            >
              <span className="leading-tight">{action.label}</span>
            </button>
          );
        })}
      </div>

      {isPanelOpen && (
        <div className="rounded-2xl border border-purple-200 bg-purple-50 p-3 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-purple-900">
              {activeAction === 'takeout'
                ? 'Takeout details'
                : activeAction === 'walk-in'
                  ? 'Walk-in order selected'
                  : activeAction === 'manager-menu'
                    ? 'Manager menu'
                    : 'More options'}
            </p>
            <button
              className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-purple-700"
              type="button"
              onClick={() => setIsPanelOpen(false)}
            >
              Close
            </button>
          </div>

          {activeAction === 'takeout' ? (
            <TakeoutForm
              ref={takeoutFormRef}
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              phone={phone}
              setPhone={setPhone}
              required={true}
            />
          ) : activeAction === 'walk-in' ? (
            <div className="space-y-2">
              <p className="text-sm text-purple-700">
                Walk-in order selected. Customer details are optional.
              </p>
              <TakeoutForm
                ref={takeoutFormRef}
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                phone={phone}
                setPhone={setPhone}
                required={false}
              />
            </div>
          ) : activeAction === 'manager-menu' ? (
            <p className="text-sm text-purple-700">
              Manager controls and reporting tools will appear here soon.
            </p>
          ) : (
            <p className="text-sm text-purple-700">
              Additional shortcuts and future actions can be added here.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
