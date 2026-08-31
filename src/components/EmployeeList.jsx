import React, {useEffect} from 'react';
import {useEmployeeData} from '../context/EmployeeContext';

const formatDate = (value) => {
    if (!value) return '—';
    return new Date(value).toLocaleDateString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const formatTime = (value) => {
    if (!value) return '—';
    if (/^\d{2}:\d{2}/.test(value)) {
        const [hours, minutes] = value.split(':');
        return new Date(2000, 0, 1, Number(hours), Number(minutes)).toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
        });
    }
    return new Date(value).toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
};

export default function EmployeeList ({records = [], onPunchIn, onPunchOut}) {
    const {employees, refetchEmployees} = useEmployeeData();

    useEffect(() => {
        refetchEmployees();
    }, []);
    return (
        <div className="overflow-hidden rounded-xl border border-purple-200 bg-white">
            <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-purple-900">
                    <tr>
                        <th className="px-3 py-2 font-semibold">Name</th>
                        <th className="px-3 py-2 font-semibold">Work Date</th>
                        <th className="px-3 py-2 font-semibold">Punch In</th>
                        <th className="px-3 py-2 font-semibold">Punch Out</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((record) => {
                        const clockIn = record.clockIn ?? record.punchInTime;
                        const clockOut = record.clockOut ?? record.punchOutTime;
                        const isCurrentlyPunchedIn = Boolean(clockIn && !clockOut);

                        return (
                            <tr key={record.empID} className="border-t border-purple-100">
                                <td
                                    className={`px-3 py-2 font-medium ${isCurrentlyPunchedIn ? 'cursor-not-allowed text-purple-400' : 'cursor-pointer text-purple-900 hover:text-purple-700'}`}
                                    onClick={() => {
                                        if (!isCurrentlyPunchedIn) {
                                            onPunchIn?.(record);
                                        }
                                    }}
                                >
                                    {record.firstName} {record.lastName}
                                </td>
                                <td className="px-3 py-2 text-purple-700">
                                    {formatDate(record.workdate)}
                                </td>
                                <td className="px-3 py-2 text-purple-700">
                                    {formatTime(clockIn)}
                                </td>
                                <td
                                    className={`px-3 py-2 ${isCurrentlyPunchedIn ? 'cursor-pointer text-purple-700 hover:text-purple-900' : 'cursor-not-allowed text-purple-400'}`}
                                    onClick={() => {
                                        if (isCurrentlyPunchedIn) {
                                            onPunchOut?.(record);
                                        }
                                    }}
                                >
                                    {isCurrentlyPunchedIn ? 'Active' : formatTime(clockOut)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}