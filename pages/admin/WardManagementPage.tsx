import React, { useState, useMemo, useEffect } from 'react';
import Header from '../../components/Header';
import { useData } from '../../context/DataContext';
import { SearchIcon, PlusIcon } from '../../components/icons';
import { Ward } from '../../types';

const WardFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (ward: Partial<Ward>) => void;
    ward: Partial<Ward> | null;
}> = ({ isOpen, onClose, onSave, ward }) => {
    const [formData, setFormData] = useState<Partial<Ward>>({});

    useEffect(() => {
        setFormData(ward || {});
    }, [ward]);
    
    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value) || 0 : value }));
    };

    const handleSave = () => {
        if (!formData.name || (formData.capacity ?? 0) <= 0) {
            alert('Please fill all fields with valid data.');
            return;
        }
        onSave(formData);
    };

    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-gray-900 dark:text-gray-100";
    const labelStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{ward?.id ? 'Edit Ward' : 'Add Ward'}</h2>
                <div className="space-y-4">
                    <div>
                        <label className={labelStyle}>Ward Name</label>
                        <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className={inputStyle} />
                    </div>
                     <div>
                        <label className={labelStyle}>Capacity</label>
                        <input type="number" name="capacity" value={formData.capacity || 0} onChange={handleChange} className={inputStyle} min="1" />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                    <button onClick={handleSave} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-md">Save</button>
                </div>
            </div>
        </div>
    );
};


const WardManagementPage: React.FC = () => {
    const { wards, patients, sosPatients, addWard, updateWard } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedWardId, setSelectedWardId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWard, setEditingWard] = useState<Partial<Ward> | null>(null);

    const getOccupancy = (wardName: string) => {
        const regularPatients = patients.filter(p => p.ward === wardName && p.status === 'Admitted').length;
        const sosPatientsCount = sosPatients.filter(p => p.admittedWard === wardName && p.status === 'Admitted').length;
        return regularPatients + sosPatientsCount;
    };

    const filteredWards = useMemo(() => {
        if (!searchQuery) return wards;
        const query = searchQuery.toLowerCase();
        return wards.filter(ward => 
            ward.id.toLowerCase().includes(query) ||
            ward.name.toLowerCase().includes(query)
        );
    }, [searchQuery, wards]);

    const handleOpenAddModal = () => {
        setEditingWard({ name: '', capacity: 10 });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = () => {
        if (selectedWardId) {
            const wardToEdit = wards.find(m => m.id === selectedWardId);
            if (wardToEdit) {
                setEditingWard(wardToEdit);
                setIsModalOpen(true);
            }
        }
    };
    
    const handleSaveWard = (wardData: Partial<Ward>) => {
        if (wardData.id) { // Editing
            updateWard(wardData as Ward);
        } else { // Adding
            addWard(wardData as Omit<Ward, 'id'>);
        }
        setIsModalOpen(false);
        setEditingWard(null);
    };

    const inputStyles = "p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500 dark:placeholder-gray-400";
    const buttonDisabledStyles = "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed";

    return (
        <div className="flex flex-col h-full">
            <Header title="Ward Management" />
            <main className="flex-grow p-6 bg-white dark:bg-gray-800 rounded-b-lg flex flex-col">
                <WardFormModal 
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); setEditingWard(null); }}
                    onSave={handleSaveWard}
                    ward={editingWard}
                />
                <div className="flex items-center mb-4">
                    <div className="relative flex-grow">
                        <input 
                            type="text" 
                            placeholder="Search Ward by ID or Name..."
                            className={`${inputStyles} w-full pl-10`}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                         <SearchIcon className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                    </div>
                    <button onClick={handleOpenAddModal} className="ml-4 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors flex items-center justify-center">
                        <PlusIcon className="w-5 h-5 mr-2" /> Add Ward
                    </button>
                </div>

                <div className="overflow-x-auto flex-grow">
                  <table className="min-w-full bg-white dark:bg-gray-800">
                    <thead className="bg-gray-100 dark:bg-gray-700/50">
                      <tr>
                        <th className="py-2 px-4"></th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Ward ID</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Ward Name</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Occupancy</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Capacity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredWards.map((ward) => {
                        const occupancy = getOccupancy(ward.name);
                        const occupancyRate = ward.capacity > 0 ? (occupancy / ward.capacity) * 100 : 0;
                        const occupancyColor = occupancyRate > 90 ? 'text-red-500' : occupancyRate > 70 ? 'text-yellow-500' : 'text-green-500';
                        return (
                        <tr key={ward.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200">
                          <td className="py-2 px-4 text-center">
                             <input type="radio" name="selectedWard" value={ward.id} checked={selectedWardId === ward.id} onChange={(e) => setSelectedWardId(e.target.value)} className="form-radio h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-500" />
                          </td>
                          <td className="py-2 px-4">{ward.id}</td>
                          <td className="py-2 px-4">{ward.name}</td>
                          <td className={`py-2 px-4 font-bold ${occupancyColor}`}>{occupancy}</td>
                          <td className="py-2 px-4">{ward.capacity}</td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div className="space-x-2">
                        <button 
                            disabled={!selectedWardId} 
                            onClick={handleOpenEditModal}
                            className={`py-2 px-4 rounded-md ${selectedWardId ? 'bg-blue-500 hover:bg-blue-600 text-white' : buttonDisabledStyles}`}
                        >
                            Edit
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default WardManagementPage;