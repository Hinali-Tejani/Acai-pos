import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {fetchEmployeeReportData} from '../services/managerApi';
import SalesReport from '../components/SalesReport';
import EmployeeReport from '../components/EmployeeReport';

export default function ManagerMenu ({connectPrinter, printerDevice, onAddToRefundCart, refundVersion, onClearRefundCart}) {
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
      <div className="min-h-screen bg-gray-50 pt-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-purple-900">Manager Reports</h1>
              <p className="mt-2 text-sm text-purple-600">Review sales and employee activity.</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveView('menu')}
              className="rounded-xl bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-300"
            >
              Back
            </button>
          </div>

          <div className="mb-3 flex gap-2 border-b border-purple-200">
            <button type="button" onClick={() => setActiveReport('sales')} className={`border-b-2 px-4 py-3 text-sm font-semibold ${activeReport === 'sales' ? 'border-purple-900 text-purple-900' : 'border-transparent text-purple-500'}`}>Sales Activity</button>
            {/* <button type="button" onClick={() => setActiveReport('employees')} className={`border-b-2 px-4 py-3 text-sm font-semibold ${activeReport === 'employees' ? 'border-purple-900 text-purple-900' : 'border-transparent text-purple-500'}`}>Employee Activity</button> */}
          </div>

          {isLoading ? (
            <div className="rounded-xl border border-purple-200 bg-white p-10 text-center text-sm text-purple-600 shadow-sm">Loading reports...</div>
          ) : (
            activeReport === 'sales'
              ? <SalesReport onAddToRefundCart={onAddToRefundCart} refundVersion={refundVersion} onClearRefundCart={onClearRefundCart} />
              : <EmployeeReport employees={employeeData} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl">
        <div className="mb-3">
          <h1 className="text-3xl font-bold text-purple-900">Manager Menu</h1>
          <p className="mt-2 text-sm text-purple-600">Select an action to perform</p>
        </div>

        <div className="mb-3 rounded-xl border border-purple-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-purple-900">Thermal Printer</div>
              <div className="text-xs text-purple-600">{printerDevice ? 'Connected' : 'Not connected'}</div>
            </div>
            <button
              type="button"
              onClick={handleConnectPrinter}
              className="rounded-xl bg-purple-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-800"
            >
              Connect Printer
            </button>
          </div>
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
