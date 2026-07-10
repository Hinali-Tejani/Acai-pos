import React, {useMemo, useState} from 'react';
import EmployeeList from './EmployeeList';
import PopUp from './PopUp';
import { useEmployeeState } from '../state/EmployeeState';
import { useEmployeeData } from '../context/EmployeeContext';

const MANAGER_PASSWORD = '1234';

export default function EmployeePunchIn () {
    const [statusMessage, setStatusMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { employeeRows, selectedEmployee, setSelectedEmployee } = useEmployeeState();
    const { punchEmployee } = useEmployeeData();

    const activeEmployeeName = useMemo(() => selectedEmployee?.name ?? 'No employee selected', [selectedEmployee]);

    const handlePunchAction = (action) => {
        const enteredPassword = window.prompt(action === 'in' ? 'Enter manager password to punch in' : 'Enter manager password to punch out');


        if (enteredPassword !== MANAGER_PASSWORD) {
            setStatusMessage('Incorrect manager password');
            return;
        }

        setIsModalOpen(true);
        setStatusMessage(action === 'in' ? 'Select an employee to punch in' : 'Select an employee to punch out');
    };

    const handleEmployeePunchIn = (employee) => {
        const confirmed = window.confirm(`Punch in ${employee.firstName} ${employee.lastName}?`);
        if (!confirmed) return;

        setSelectedEmployee(employee);
        setIsModalOpen(false);
        punchEmployee(employee.empID, 1);
        setStatusMessage(`Punched in ${employee.firstName} ${employee.lastName} successfully`);
    };

    const handleEmployeePunchOut = (employee) => {
        const confirmed = window.confirm(`Punch out ${employee.firstName} ${employee.lastName}?`);
        if (!confirmed) return;

        setSelectedEmployee(employee);
        setIsModalOpen(false);

        const existing = employeeRows.find((record) => record.id === employee.id);
        if (!existing || !existing.punchInTime || existing.punchOutTime) {
            setStatusMessage('This employee is not currently punched in');
            return;
        }

        punchEmployee(employee.empID, 2);
        setStatusMessage(`Punched out ${employee.firstName} ${employee.lastName} successfully`);
    };

    return (
        <div className="space-y-3 rounded-lg border border-purple-200 bg-white p-3 text-purple-600">
            <h2 className="text-sm font-semibold text-purple-900">Employee Punch IN/OUT</h2>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => handlePunchAction('in')}
                    className="flex-1 rounded-xl bg-purple-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-purple-800"
                >
                    Punch In
                </button>
                <button
                    type="button"
                    onClick={() => handlePunchAction('out')}
                    className="flex-1 rounded-xl bg-amber-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
                >
                    Punch Out
                </button>
            </div>

            <p className="text-xs text-purple-700">{statusMessage}</p>
            {/* <p className="text-[11px] text-purple-600">Selected employee: {activeEmployeeName}</p> */}

            <PopUp isOpen={isModalOpen} title="Employee punch list" onClose={() => setIsModalOpen(false)} size="md">
                <EmployeeList
                    records={employeeRows}
                    onPunchIn={handleEmployeePunchIn}
                    onPunchOut={handleEmployeePunchOut}
                />
            </PopUp>
        </div>
    );
}