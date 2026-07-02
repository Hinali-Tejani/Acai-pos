import React from 'react';

const formatTime = (value) => {
    if (!value) return '—';
    return new Date(value).toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
};

export default function EmployeeList ({records = [], onPunchIn, onPunchOut}) {
    return (
        <div className="overflow-hidden rounded-xl border border-purple-200 bg-white">
            <table className="min-w-full text-left text-sm">
                <thead className="bg-purple-50 text-purple-900">
                    <tr>
                        <th className="px-3 py-2 font-semibold">Name</th>
                        <th className="px-3 py-2 font-semibold">Punch In</th>
                        <th className="px-3 py-2 font-semibold">Punch Out</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((record) => {
                        const isCurrentlyPunchedIn = Boolean(record.punchInTime && !record.punchOutTime);

                        return (
                            <tr key={record.id} className="border-t border-purple-100">
                                <td
                                    className={`px-3 py-2 font-medium ${isCurrentlyPunchedIn ? 'cursor-not-allowed text-purple-400' : 'cursor-pointer text-purple-900 hover:text-purple-700'}`}
                                    onClick={() => {
                                        if (!isCurrentlyPunchedIn) {
                                            onPunchIn?.(record);
                                        }
                                    }}
                                >
                                    {record.name}
                                </td>
                                <td className="px-3 py-2 text-purple-700">
                                    {record.punchInTime ? formatTime(record.punchInTime) : '—'}
                                </td>
                                <td
                                    className={`px-3 py-2 ${isCurrentlyPunchedIn ? 'cursor-pointer text-purple-700 hover:text-purple-900' : 'cursor-not-allowed text-purple-400'}`}
                                    onClick={() => {
                                        if (isCurrentlyPunchedIn) {
                                            onPunchOut?.(record);
                                        }
                                    }}
                                >
                                    {isCurrentlyPunchedIn ? 'Active' : (record.punchOutTime ? formatTime(record.punchOutTime) : '—')}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}