import React from 'react';

const PopUp = ({ isOpen, title, onClose, children, size = 'md' }) => {
  if (!isOpen) {
    return null;
  }

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
  }[size] || 'max-w-2xl';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className={`w-full ${sizeClasses} rounded-3xl bg-white shadow-2xl`}>
        <div className="flex items-center justify-between border-b border-purple-100 px-5 py-4">
          <h3 className="text-lg font-semibold text-purple-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700 transition hover:bg-purple-200"
          >
            ✕
          </button>
        </div>
        <div className="px-5 pt-4 pb-6">{children}</div>
      </div>
    </div>
  );
};

export default PopUp;