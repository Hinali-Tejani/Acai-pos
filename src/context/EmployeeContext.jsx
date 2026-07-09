// src/context/EmployeeContext.jsx
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { getEmployees, updateEmployeeShift } from '../services/employeeApi';

const EmployeeContext = createContext();

export function EmployeeProvider({ children }) {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasLoaded = useRef(false);

  // Fetch employees on mount
  useEffect(() => {

    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const fetchEmployees = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Manual refetch function
  const refetchEmployees = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Punch in/out function
  const punchEmployee = async (empID, punchType) => {
    const now = new Date();
    const workdate = now.toISOString();
    const punchTime = now.toTimeString();

    try {
      const response = await updateEmployeeShift({
        empID,
        workdate,
        punchTime,
        punchType
      });
      return { success: true, data: response };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to update employee shift' };
    }
  };

  return (
    <EmployeeContext.Provider value={{ employees, isLoading, error, refetchEmployees, punchEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
}

// Dedicated hook just for employee data
export function useEmployeeData() {
  return useContext(EmployeeContext);
}
