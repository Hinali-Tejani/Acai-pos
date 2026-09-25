import React from 'react';

export default function EmployeeReport ({employees}) {
  const transactionTotal = employees.reduce((sum, employee) => sum + Number(employee.totalTransactions || 0), 0);
  const salesTotal = employees.reduce((sum, employee) => sum + Number(employee.totalSalesVolume || 0), 0);

  return (
    <section className="overflow-hidden rounded-xl border border-purple-200 bg-white shadow-sm">
      <div className="border-b border-purple-100 px-5 py-4">
        <h2 className="font-semibold text-purple-900">Employee Report</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-gray-50 text-purple-900">
            <tr>
              <th className="p-3 font-semibold">Employee</th>
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 text-right font-semibold">Transactions</th>
              <th className="p-3 text-right font-semibold">Sales Volume</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.employeeId} className="border-t border-purple-100">
                <td className="p-3 text-purple-700">{employee.employeeId}</td>
                <td className="p-3 font-medium text-purple-900">{employee.name}</td>
                <td className="p-3 text-right text-purple-700">{employee.totalTransactions}</td>
                <td className="p-3 text-right font-medium text-purple-900">${Number(employee.totalSalesVolume).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-purple-200 bg-gray-50 font-bold text-purple-900">
              <td className="p-3" colSpan="2">Totals</td>
              <td className="p-3 text-right">{transactionTotal}</td>
              <td className="p-3 text-right">${salesTotal.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
