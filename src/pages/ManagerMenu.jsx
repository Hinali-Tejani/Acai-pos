import React from 'react';
import {useNavigate} from 'react-router-dom';

export default function ManagerMenu () {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'refund',
      label: 'Process Refund',
      action: () => navigate('/manager/refund'),
    },
    {
      id: 'reports',
      label: 'Sales Reports',
      action: () => {},
    },
    {
      id: 'inventory',
      label: 'Inventory',
      action: () => {},
    },
    {
      id: 'employees',
      label: 'Employee Management',
      action: () => {},
    },
  ];

  return (
    <div className="min-h-screen bg-purple-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900">Manager Menu</h1>
          <p className="mt-2 text-sm text-purple-600">Select an action to perform</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              className="flex items-start gap-4 rounded-xl border border-purple-200 bg-white p-6 text-left shadow-sm transition hover:border-purple-400 hover:shadow-md"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-purple-900">{item.label}</h3>
              </div>
              <div className="flex items-center text-purple-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate('/home')}
          className="mt-8 rounded-xl bg-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-300"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
