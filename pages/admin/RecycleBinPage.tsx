import React, { useState } from 'react';
import Header from '../../components/Header';
import { useData } from '../../context/DataContext';

const RecycleBinPage: React.FC = () => {
    const { 
        recycledStaff, 
        restoreStaff, 
        permanentlyDeleteStaff,
        recycledMedicines,
        restoreMedicine,
        permanentlyDeleteMedicine
    } = useData();

    const [activeTab, setActiveTab] = useState<'staff' | 'inventory'>('staff');

    const handleRestoreStaff = (id: string) => {
        if (window.confirm('Are you sure you want to restore this staff member?')) {
            restoreStaff(id);
        }
    };
    
    const handlePermanentlyDeleteStaff = (id: string) => {
        if (window.confirm('This action is irreversible. Are you sure you want to permanently delete this staff member?')) {
            permanentlyDeleteStaff(id);
        }
    };

    const handleRestoreMedicine = (id: string) => {
        if (window.confirm('Are you sure you want to restore this medicine?')) {
            restoreMedicine(id);
        }
    };

    const handlePermanentlyDeleteMedicine = (id: string) => {
        if (window.confirm('This action is irreversible. Are you sure you want to permanently delete this medicine?')) {
            permanentlyDeleteMedicine(id);
        }
    };

    const tabBaseStyle = "px-4 py-2 text-sm font-medium rounded-t-lg";
    const tabActiveStyle = "text-primary bg-white dark:bg-gray-800 border-b-2 border-primary";
    const tabInactiveStyle = "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700/50";

    const renderStaffTable = () => (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800">
                <thead className="bg-gray-100 dark:bg-gray-700/50">
                    <tr>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Staff ID</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Role</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {recycledStaff.length > 0 ? recycledStaff.map((s) => (
                        <tr key={s.id} className="border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                            <td className="py-2 px-4">{s.id}</td>
                            <td className="py-2 px-4">{s.name}</td>
                            <td className="py-2 px-4">{s.role}</td>
                            <td className="py-2 px-4 space-x-2">
                                <button onClick={() => handleRestoreStaff(s.id)} className="bg-green-500 text-white text-sm py-1 px-3 rounded-md hover:bg-green-600">Restore</button>
                                <button onClick={() => handlePermanentlyDeleteStaff(s.id)} className="bg-danger text-white text-sm py-1 px-3 rounded-md hover:bg-danger-dark">Delete Permanently</button>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan={4} className="text-center py-4 text-gray-500 dark:text-gray-400">Recycle bin for staff is empty.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
    
    const renderInventoryTable = () => (
         <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800">
                <thead className="bg-gray-100 dark:bg-gray-700/50">
                    <tr>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Med ID</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Quantity</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                    </tr>
                </thead>
                <tbody>
                     {recycledMedicines.length > 0 ? recycledMedicines.map((m) => (
                        <tr key={m.id} className="border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                            <td className="py-2 px-4">{m.id}</td>
                            <td className="py-2 px-4">{m.name}</td>
                            <td className="py-2 px-4">{m.quantity}</td>
                            <td className="py-2 px-4 space-x-2">
                                <button onClick={() => handleRestoreMedicine(m.id)} className="bg-green-500 text-white text-sm py-1 px-3 rounded-md hover:bg-green-600">Restore</button>
                                <button onClick={() => handlePermanentlyDeleteMedicine(m.id)} className="bg-danger text-white text-sm py-1 px-3 rounded-md hover:bg-danger-dark">Delete Permanently</button>
                            </td>
                        </tr>
                    )) : (
                         <tr><td colSpan={4} className="text-center py-4 text-gray-500 dark:text-gray-400">Recycle bin for inventory is empty.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );


    return (
        <div className="flex flex-col h-full">
            <Header title="Recycle Bin" />
            <main className="flex-grow p-6 bg-white dark:bg-gray-800 rounded-b-lg flex flex-col">
                <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                    <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                        <button onClick={() => setActiveTab('staff')} className={`${tabBaseStyle} ${activeTab === 'staff' ? tabActiveStyle : tabInactiveStyle}`}>
                            Staff
                        </button>
                        <button onClick={() => setActiveTab('inventory')} className={`${tabBaseStyle} ${activeTab === 'inventory' ? tabActiveStyle : tabInactiveStyle}`}>
                            Inventory
                        </button>
                    </nav>
                </div>
                <div className="flex-grow">
                    {activeTab === 'staff' ? renderStaffTable() : renderInventoryTable()}
                </div>
            </main>
        </div>
    );
};

export default RecycleBinPage;
