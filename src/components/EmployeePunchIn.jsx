import React, {useMemo, useState} from 'react';
import EmployeeList from './EmployeeList';
import PopUp from './PopUp';
import ManagerPasswordModal from './ManagerPasswordModal';
import { useEmployeeState } from '../state/EmployeeState';
import { useEmployeeData } from '../context/EmployeeContext';

export default function EmployeePunchIn () {
    const [statusMessage, setStatusMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const { employeeRows, selectedEmployee, setSelectedEmployee } = useEmployeeState();
    const { punchEmployee } = useEmployeeData();

    const activeEmployeeName = useMemo(() => selectedEmployee?.name ?? 'No employee selected', [selectedEmployee]);

    const handlePunchAction = (action) => {
        setPendingAction(action);
        setShowPasswordModal(true);
    };

    const handlePasswordVerified = () => {
        setShowPasswordModal(false);
        setIsModalOpen(true);
        setStatusMessage(pendingAction === 'in' ? 'Select an employee to punch in' : 'Select an employee to punch out');
        setPendingAction(null);
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

            <ManagerPasswordModal
                isOpen={showPasswordModal}
                onClose={() => {setShowPasswordModal(false); setPendingAction(null);}}
                onSuccess={handlePasswordVerified}
            />
        </div>
    );
}