import React, {useRef, useState} from 'react';
import EmployeeList from './EmployeeList';
import PopUp from './PopUp';
import ManagerPasswordModal from './ManagerPasswordModal';
import {useEmployeeData} from '../context/EmployeeContext';

export default function EmployeePunchIn () {
    const [statusMessage, setStatusMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const {employees, punchEmployee, refetchEmployees} = useEmployeeData();
    const statusTimeoutRef = useRef(null);

    const showStatusMessage = (message) => {
        setStatusMessage(message);
        if (statusTimeoutRef.current) {
            window.clearTimeout(statusTimeoutRef.current);
        }
        statusTimeoutRef.current = window.setTimeout(() => {
            setStatusMessage('');
            statusTimeoutRef.current = null;
        }, 3000);
    };

    React.useEffect(() => () => {
        if (statusTimeoutRef.current) {
            window.clearTimeout(statusTimeoutRef.current);
        }
    }, []);

    const handlePunchAction = () => {
        setShowPasswordModal(true);
    };

    const handlePasswordVerified = () => {
        setShowPasswordModal(false);
        setIsModalOpen(true);
        showStatusMessage('Select an employee to punch in or punch out');
    };

    const handleEmployeePunchIn = async (employee) => {
        const confirmed = window.confirm(`Punch in ${employee.firstName} ${employee.lastName}?`);
        if (!confirmed) return;

        setIsModalOpen(false);
        const result = await punchEmployee(employee.empID, 1);
        if (!result.success) {
            showStatusMessage(result.error);
            return;
        }

        await refetchEmployees();
        showStatusMessage(`Punched in ${employee.firstName} ${employee.lastName} successfully`);
    };

    const handleEmployeePunchOut = async (employee) => {
        const confirmed = window.confirm(`Punch out ${employee.firstName} ${employee.lastName}?`);
        if (!confirmed) return;
        setIsModalOpen(false);

        if (!employee.clockIn || employee.clockOut) {
            showStatusMessage('This employee is not currently punched in');
            return;
        }

        const result = await punchEmployee(employee.empID, 2);
        if (!result.success) {
            showStatusMessage(result.error);
            return;
        }

        await refetchEmployees();
        showStatusMessage(`Punched out ${employee.firstName} ${employee.lastName} successfully`);
    };

    return (
        <div className="space-y-3 border border-purple-200 bg-white p-3 text-purple-600">
            <h2 className="text-sm font-semibold text-purple-900">Employee Punch IN/OUT</h2>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={handlePunchAction}
                    className="flex-1 rounded-lg bg-purple-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-purple-800"
                >
                    Punch In/Out
                </button>
            </div>

            <p className="text-xs text-purple-700">{statusMessage}</p>
            {/* <p className="text-[11px] text-purple-600">Selected employee: {activeEmployeeName}</p> */}

            <PopUp isOpen={isModalOpen} title="Employee punch list" onClose={() => setIsModalOpen(false)} size="md">
                <EmployeeList
                    records={employees}
                    onPunchIn={handleEmployeePunchIn}
                    onPunchOut={handleEmployeePunchOut}
                />
            </PopUp>

            <ManagerPasswordModal
                isOpen={showPasswordModal}
                onClose={() => {
                    setShowPasswordModal(false);
                }}
                onSubmit={handlePasswordVerified}
            />
        </div>
    );
}