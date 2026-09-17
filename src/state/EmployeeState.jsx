import { useMemo, useState } from 'react';

export function useEmployeeState() {
  const [employees, setEmployees] = useState([]);
  const [punchRecords, setPunchRecords] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const employeeRows = useMemo(() => {
    return employees.map((employee) => {
      const record = punchRecords.find((item) => item.employee.id === employee.id);
      return {
        ...employee,
        clockIn: record?.clockIn ?? null,
        clockOut: record?.clockOut ?? null,
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
            ? { ...record, clockIn: new Date(), clockOut: null }
            : record,
        );
      }

      return [
        ...current,
        {
          id: `${employee.id}-${Date.now()}`,
          employee,
          clockIn: new Date(),
          clockOut: null,
        },
      ];
    });
  };

  const punchOutEmployee = (employee) => {
    setSelectedEmployee(employee);
    setPunchRecords((current) =>
      current.map((record) =>
        record.employee.id === employee.id && !record.clockOut
          ? { ...record, clockOut: new Date() }
          : record,
      ),
    );
  };

  const getEmployeeStatus = (employeeId) => {
    const record = punchRecords.find((item) => item.employee.id === employeeId);
    if (!record) return 'not-started';
    if (record.clockIn && !record.clockOut) return 'active';
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
