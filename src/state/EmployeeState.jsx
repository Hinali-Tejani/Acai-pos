import { useMemo, useState } from 'react';

const STATIC_EMPLOYEES = [
  { id: 1, name: 'Alex Carter', role: 'Cashier' },
  { id: 2, name: 'Mina Patel', role: 'Manager' },
  { id: 3, name: 'Jordan Lee', role: 'Cook' },
];

export function useEmployeeState() {
  const [employees, setEmployees] = useState(STATIC_EMPLOYEES);
  const [punchRecords, setPunchRecords] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const employeeRows = useMemo(() => {
    return employees.map((employee) => {
      const record = punchRecords.find((item) => item.employee.id === employee.id);
      return {
        ...employee,
        punchInTime: record?.punchInTime ?? null,
        punchOutTime: record?.punchOutTime ?? null,
      };
    });
  }, [employees, punchRecords]);

  const punchInEmployee = (employee) => {
    setSelectedEmployee(employee);
    setPunchRecords((current) => {
      const existing = current.find((record) => record.employee.id === employee.id);
      if (existing) {
        return current.map((record) =>
          record.employee.id === employee.id
            ? { ...record, punchInTime: new Date(), punchOutTime: null }
            : record,
        );
      }

      return [
        ...current,
        {
          id: `${employee.id}-${Date.now()}`,
          employee,
          punchInTime: new Date(),
          punchOutTime: null,
        },
      ];
    });
  };

  const punchOutEmployee = (employee) => {
    setSelectedEmployee(employee);
    setPunchRecords((current) =>
      current.map((record) =>
        record.employee.id === employee.id && !record.punchOutTime
          ? { ...record, punchOutTime: new Date() }
          : record,
      ),
    );
  };

  const getEmployeeStatus = (employeeId) => {
    const record = punchRecords.find((item) => item.employee.id === employeeId);
    if (!record) return 'not-started';
    if (record.punchInTime && !record.punchOutTime) return 'active';
    return 'completed';
  };

  return {
    employees,
    employeeRows,
    punchRecords,
    selectedEmployee,
    setSelectedEmployee,
    punchInEmployee,
    punchOutEmployee,
    getEmployeeStatus,
    setEmployees,
    setPunchRecords,
  };
}
