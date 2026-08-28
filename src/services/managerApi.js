export const mockSalesReportData = [
  {
    id: 1,
    invoiceNum: 'INV-1001',
    totalAmt: 18.5,
    paymentMethod: 'CARD',
    timestamp: '2026-08-28T09:15:00.000Z',
  },
  {
    id: 2,
    invoiceNum: 'INV-1002',
    totalAmt: 24.75,
    paymentMethod: 'CASH',
    timestamp: '2026-08-28T10:42:00.000Z',
  },
  {
    id: 3,
    invoiceNum: 'INV-1003',
    totalAmt: 31.2,
    paymentMethod: 'CARD',
    timestamp: '2026-08-28T12:08:00.000Z',
  },
];

export const mockEmployeeReportData = [
  {
    employeeId: 101,
    name: 'Mina Patel',
    totalTransactions: 12,
    totalSalesVolume: 246.4,
  },
  {
    employeeId: 102,
    name: 'Jordan Lee',
    totalTransactions: 9,
    totalSalesVolume: 182.65,
  },
  {
    employeeId: 103,
    name: 'Sam Rivera',
    totalTransactions: 7,
    totalSalesVolume: 141.8,
  },
];

const wait = (milliseconds) => new Promise((resolve) => {
  setTimeout(resolve, milliseconds);
});

export async function fetchSalesReportData () {
  await wait(350);
  return mockSalesReportData;
}

export async function fetchEmployeeReportData () {
  await wait(350);
  return mockEmployeeReportData;
}
