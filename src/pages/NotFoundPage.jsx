import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-purple-50 text-purple-900">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-purple-600">404</h1>
        <h2 className="mt-4 text-3xl font-semibold text-purple-800">Page Not Found</h2>
        <p className="mt-2 text-lg text-purple-600">
          Redirecting to home page...
        </p>
      </div>
    </div>
  );
}
