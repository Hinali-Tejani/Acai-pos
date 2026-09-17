import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {fetchEmployeeReportData, fetchSalesReportData} from '../services/managerApi';

export default function ManagerMenu ({connectPrinter, printerDevice}) {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('menu');
  const [activeReport, setActiveReport] = useState('sales');
  const [salesData, setSalesData] = useState([]);
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
    if (activeView !== 'reports') return;

    let isCurrent = true;
    const loadReport = async () => {
      setIsLoading(true);
      try {
        const data = activeReport === 'sales'
          ? await fetchSalesReportData()
          : await fetchEmployeeReportData();
        if (isCurrent) {
          if (activeReport === 'sales') setSalesData(data);
          if (activeReport === 'employees') setEmployeeData(data);
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    loadReport();
    return () => {isCurrent = false;};
  }, [activeView, activeReport]);

  const salesTotal = salesData.reduce((total, sale) => total + Number(sale.totalAmt || 0), 0);
  const transactionTotal = employeeData.reduce((total, employee) => total + Number(employee.totalTransactions || 0), 0);
  const employeeSalesTotal = employeeData.reduce((total, employee) => total + Number(employee.totalSalesVolume || 0), 0);

  if (activeView === 'reports') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
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
            <button type="button" onClick={() => setActiveReport('employees')} className={`border-b-2 px-4 py-3 text-sm font-semibold ${activeReport === 'employees' ? 'border-purple-900 text-purple-900' : 'border-transparent text-purple-500'}`}>Employee Activity</button>
          </div>

          {isLoading ? (
            <div className="rounded-xl border border-purple-200 bg-white p-10 text-center text-sm text-purple-600 shadow-sm">Loading reports...</div>
          ) : (
            <div>
              {activeReport === 'sales' ? (
                <section className="overflow-hidden rounded-xl border border-purple-200 bg-white shadow-sm">
                  <div className="border-b border-purple-100 px-5 py-4">
                    <h2 className="font-semibold text-purple-900">Sales Report</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-xs">
                      <thead className="bg-gray-50 text-purple-900">
                        <tr><th className="p-3 font-semibold">Invoice</th><th className="p-3 font-semibold">Payment</th><th className="p-3 font-semibold">Timestamp</th><th className="p-3 text-right font-semibold">Total</th></tr>
                      </thead>
                      <tbody>{salesData.map((sale) => (
                        <tr key={sale.id} className="border-t border-purple-100"><td className="p-3 text-purple-900">{sale.invoiceNum}</td><td className="p-3 text-purple-700">{sale.paymentMethod}</td><td className="p-3 text-purple-700">{new Date(sale.timestamp).toLocaleString()}</td><td className="p-3 text-right font-medium text-purple-900">${Number(sale.totalAmt).toFixed(2)}</td></tr>
                      ))}</tbody>
                      <tfoot><tr className="border-t-2 border-purple-200 bg-gray-50 font-bold text-purple-900"><td className="p-3" colSpan="3">Total Sales</td><td className="p-3 text-right">${salesTotal.toFixed(2)}</td></tr></tfoot>
                    </table>
                  </div>
                </section>
              ) : (
                <section className="overflow-hidden rounded-xl border border-purple-200 bg-white shadow-sm">
                  <div className="border-b border-purple-100 px-5 py-4"><h2 className="font-semibold text-purple-900">Employee Report</h2></div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-xs">
                      <thead className="bg-gray-50 text-purple-900"><tr><th className="p-3 font-semibold">Employee</th><th className="p-3 font-semibold">Name</th><th className="p-3 text-right font-semibold">Transactions</th><th className="p-3 text-right font-semibold">Sales Volume</th></tr></thead>
                      <tbody>{employeeData.map((employee) => (
                        <tr key={employee.employeeId} className="border-t border-purple-100"><td className="p-3 text-purple-700">{employee.employeeId}</td><td className="p-3 font-medium text-purple-900">{employee.name}</td><td className="p-3 text-right text-purple-700">{employee.totalTransactions}</td><td className="p-3 text-right font-medium text-purple-900">${Number(employee.totalSalesVolume).toFixed(2)}</td></tr>
                      ))}</tbody>
                      <tfoot><tr className="border-t-2 border-purple-200 bg-gray-50 font-bold text-purple-900"><td className="p-3" colSpan="2">Totals</td><td className="p-3 text-right">{transactionTotal}</td><td className="p-3 text-right">${employeeSalesTotal.toFixed(2)}</td></tr></tfoot>
                    </table>
                  </div>
                </section>
              )}
            </div>
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
