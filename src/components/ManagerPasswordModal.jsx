import React, {useState} from 'react';
import PopUp from './PopUp';
import {API_CONFIG} from '../config/apiConfig';

export default function ManagerPasswordModal ({isOpen, onClose, onSuccess}) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === API_CONFIG.MANAGER_PASSWORD) {
      setError('');
      setPassword('');
      onSuccess?.();
    } else {
      setError('Incorrect manager password');
    }
  };

  const handleClose = () => {
    setError('');
    setPassword('');
    onClose?.();
  };

  return (
    <PopUp isOpen={isOpen} title="Manager Verification" onClose={handleClose} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-purple-700">Enter manager password to continue.</p>
        <div>
          <label className="block text-sm font-semibold text-purple-900 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm text-purple-900 outline-none transition placeholder:text-purple-300 focus:border-purple-400"
            placeholder="Enter password"
            autoFocus
          />
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 rounded-xl bg-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            Verify
          </button>
        </div>
      </form>
    </PopUp>
  );
}
