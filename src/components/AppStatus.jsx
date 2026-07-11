import React from 'react';
import Spinner from './Spinner';

export default function AppStatus({ loading, error, onRetry }) {
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-purple-50 px-6">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-purple-50 px-6">
        <div className="space-y-4 rounded-xl border border-rose-200 bg-white px-10 py-8 shadow-sm">
          <h4 className="text-lg font-semibold text-rose-700">{error}</h4>
          <button
            className="rounded-xl bg-rose-600 px-6 py-3 text-sm! font-semibold text-white hover:bg-rose-700"
            onClick={onRetry}
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return null;
}
