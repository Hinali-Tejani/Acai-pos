import api from './api';

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

export async function fetchOrdersList (startDate, endDate = null) {
  const params = {startDate};
  if (endDate) params.endDate = endDate;

  const response = await api.get('/Order/GetOrdersList', {params});
  return Array.isArray(response.data) ? response.data : response.data?.items || [];
}

export async function fetchOrderDetails (orderId) {
  const response = await api.get('/Order/GetOrderDetails', {params: {orderId}});
  return response.data;
}

export async function saveRefundDetails (orderId, totalRefund, amtBeforeTax, itemArray) {
  if (Array.isArray(orderId)) {
    const response = await api.post('/Order/SaveRefundDetails', orderId);
    return response.data;
  }

  const response = await api.post('/Order/SaveRefundDetails', itemArray, {
    params: {
      OrderID: orderId,
      TotalRefundAmount: totalRefund,
      RefundAmtbeforeTax: amtBeforeTax,
    },
  });
  return response.data;
}

export async function deleteOrder (orderId) {
  const response = await api.delete('/Order/DeleteOrder', {params: {orderId}});
  return response.data;
}

export async function fetchEmployeeReportData () {
  await wait(350);
  return mockEmployeeReportData;
}
