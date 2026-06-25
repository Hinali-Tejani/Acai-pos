import React from 'react';

export default function AppStatus({ loading, error, onRetry }) {
  if (loading) {
    return (
      <div className="pos-centered-msg">
        <h3>Loading System Profiles...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pos-error-banner">
        <h4>{error}</h4>
        <button onClick={onRetry}>Retry Connection</button>
      </div>
    );
  }

  return null;
}
