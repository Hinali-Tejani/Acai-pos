import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {fetchEmployeeReportData} from '../services/managerApi';
import SalesReport from './SalesReport';
import EmployeeReport from './EmployeeReport';

export default function ManagerMenu ({connectPrinter, printerDevice, onAddToRefundCart, refundVersion, onClearRefundCart, refundCart = []}) {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('menu');
  const [activeReport, setActiveReport] = useState('sales');
  const [employeeData, setEmployeeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnectPrinter = async () => {
    if (connectPrinter) {
      await connectPrinter();
    }
  };

  const menuItems = [
    {
      id: 'refund',
      label: 'Process Refund',
      action: () => navigate('/manager/refund'),
    },
    {
      id: 'reports',
      label: 'Sales Reports',
      action: () => setActiveView('reports'),
    }
  ];

  useEffect(() => {
    if (activeView !== 'reports' || activeReport === 'sales') return;

    let isCurrent = true;
    const loadReport = async () => {
      setIsLoading(true);
      try {
        const data = await fetchEmployeeReportData();
        if (isCurrent) {
          setEmployeeData(data);
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    loadReport();
    return () => {isCurrent = false;};
  }, [activeView, activeReport]);

  if (activeView === 'reports') {
    return (
      <div className="min-h-screen bg-gray-50 pt-2">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-purple-900">Manager Reports</h1>
              <p className="mt-2 text-sm text-purple-600">Review sales and employee activity.</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveView('menu')}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-300"
            >
              Back
            </button>
          </div>

          <div className="mb-3 flex gap-2 border-b border-purple-200">
            <button type="button" onClick={() => setActiveReport('sales')} className={`border-b-2 px-4 py-3 text-sm font-semibold ${activeReport === 'sales' ? 'border-purple-900 text-purple-900' : 'border-transparent text-purple-500'}`}>Sales Activity</button>
          </div>

          {isLoading ? (
            <div className="rounded-lg border border-purple-200 bg-white p-10 text-center text-sm text-purple-600 shadow-sm">Loading reports...</div>
          ) : (
            activeReport === 'sales'
              ? <SalesReport onAddToRefundCart={onAddToRefundCart} refundVersion={refundVersion} onClearRefundCart={onClearRefundCart} refundCart={refundCart} />
              : <EmployeeReport employees={employeeData} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl">
        <h1 className="pt-2 text-3xl font-bold text-purple-900">Manager Menu</h1>
        <p className="mt-2 text-sm text-purple-600">Choose a manager action.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={item.action}
              className="rounded-lg border border-purple-200 bg-white p-6 text-left text-lg font-semibold text-purple-900 shadow-sm transition hover:border-purple-400 hover:bg-purple-50"
            >
              {item.label}
            </button>
          ))}
        </div>

        {connectPrinter && (
          <button
            type="button"
            onClick={handleConnectPrinter}
            className="mt-4 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            Connect Printer
          </button>
        )}
        {printerDevice && (
          <p className="mt-3 text-sm text-emerald-700">Printer connected: {printerDevice}</p>
        )}
      </div>
    </div>
  );
}