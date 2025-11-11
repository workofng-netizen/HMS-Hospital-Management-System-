import React, { useState, useMemo } from 'react';
import Header from '../../components/Header';
import { useData } from '../../context/DataContext';
import { SearchIcon } from '../../components/icons';

const AuditLogsPage: React.FC = () => {
    const { auditLogs } = useData();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLogs = useMemo(() => {
        if (!searchQuery) return auditLogs;
        const lowercasedQuery = searchQuery.toLowerCase();
        return auditLogs.filter(log =>
            log.staffId.toLowerCase().includes(lowercasedQuery) ||
            log.staffName.toLowerCase().includes(lowercasedQuery) ||
            log.staffRole.toLowerCase().includes(lowercasedQuery)
        );
    }, [searchQuery, auditLogs]);

    const inputStyles = "p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500 dark:placeholder-gray-400";

    return (
        <div className="flex flex-col h-full">
            <Header title="Audit Logs" />
            <main className="flex-grow p-6 bg-white dark:bg-gray-800 rounded-b-lg flex flex-col">
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search by Staff ID, Name, or Role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`pl-10 ${inputStyles}`}
                    />
                    <SearchIcon className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                </div>
                <div className="overflow-x-auto flex-grow">
                    <table className="min-w-full bg-white dark:bg-gray-800">
                        <thead className="bg-gray-100 dark:bg-gray-700/50">
                            <tr>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Staff ID</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Role</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Username</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Action</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.map((log) => (
                                <tr key={log.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200">
                                    <td className="py-2 px-4">{log.staffId}</td>
                                    <td className="py-2 px-4">{log.staffName}</td>
                                    <td className="py-2 px-4">{log.staffRole}</td>
                                    <td className="py-2 px-4">{log.username}</td>
                                    <td className="py-2 px-4">{log.action}</td>
                                    <td className="py-2 px-4">{log.timestamp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AuditLogsPage;
