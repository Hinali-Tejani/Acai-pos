import api from './api';

export async function getEmployees () {
    const response = await api.get('/Employee/GetAllEmployees');
    return Array.isArray(response.data) ? response.data : response.data.items || [];
}

export async function updateEmployeeShift (shiftData) {
    const response = await api.post('/Employee/UpdateEmployeeShift', shiftData);
    return response.data;
}