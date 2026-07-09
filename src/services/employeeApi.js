import api from './api';

export async function getEmployees () {
    // const response = await api.get('/Employee/GetAllEmployees');
    // return Array.isArray(response.data) ? response.data : response.data.items || [];
    return ([
        {
            "empID": 0,
            "firstName": "john",
            "lastName": "doe"
        },
        {
            "empID": 1,
            "firstName": "jane",
            "lastName": "smith"
        },
        {
            "empID": 2,
            "firstName": "bob",
            "lastName": "johnson"
        }
    ])
}

export async function updateEmployeeShift (shiftData) {
    const response = await api.post('/Employee/UpdateEmployeeShift', shiftData);
    return response.data;
}