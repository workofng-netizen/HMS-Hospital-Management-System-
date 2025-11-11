import React, { useState, useMemo, useEffect } from 'react';
import Header from '../../components/Header';
import DateTime from '../../components/DateTime';
import { useData } from '../../context/DataContext';
import { SearchIcon, PlusIcon } from '../../components/icons';
import { Medicine } from '../../types';

const MedicineFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (medicine: Partial<Medicine>) => void;
    medicine: Partial<Medicine> | null;
}> = ({ isOpen, onClose, onSave, medicine }) => {
    const [formData, setFormData] = useState<Partial<Medicine>>({});

    useEffect(() => {
        setFormData(medicine || {});
    }, [medicine]);
    
    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    };

    const handleSave = () => {
        if (!formData.name || (formData.quantity ?? 0) < 0 || (formData.buyPrice ?? 0) < 0 || (formData.sellPrice ?? 0) < 0) {
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
                <h2 className="text-xl font-bold mb-4">{medicine?.id ? 'Edit Medicine' : 'Add Medicine'}</h2>
                <div className="space-y-4">
                    <div>
                        <label className={labelStyle}>Name</label>
                        <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className={inputStyle} />
                    </div>
                     <div>
                        <label className={labelStyle}>Quantity</label>
                        <input type="number" name="quantity" value={formData.quantity || 0} onChange={handleChange} className={inputStyle} min="0" />
                    </div>
                     <div>
                        <label className={labelStyle}>Buy Price (₹)</label>
                        <input type="number" name="buyPrice" value={formData.buyPrice || 0} onChange={handleChange} className={inputStyle} min="0" step="0.01" />
                    </div>
                     <div>
                        <label className={labelStyle}>Sell Price (₹)</label>
                        <input type="number" name="sellPrice" value={formData.sellPrice || 0} onChange={handleChange} className={inputStyle} min="0" step="0.01" />
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

const InventoryPage: React.FC = () => {
    const { medicines, addMedicine, updateMedicine, removeMedicine } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMedicineId, setSelectedMedicineId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMedicine, setEditingMedicine] = useState<Partial<Medicine> | null>(null);

    const filteredMedicines = useMemo(() => {
        if (!searchQuery) return medicines;
        const query = searchQuery.toLowerCase();
        return medicines.filter(med => 
            med.id.toLowerCase().includes(query) ||
            med.name.toLowerCase().includes(query)
        );
    }, [searchQuery, medicines]);

    const handleOpenAddModal = () => {
        setEditingMedicine({ name: '', quantity: 0, buyPrice: 0, sellPrice: 0 });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = () => {
        if (selectedMedicineId) {
            const medicineToEdit = medicines.find(m => m.id === selectedMedicineId);
            if (medicineToEdit) {
                setEditingMedicine(medicineToEdit);
                setIsModalOpen(true);
            }
        }
    };

    const handleRemoveMedicine = () => {
        if (selectedMedicineId) {
            if (window.confirm('Are you sure you want to move this medicine to the recycle bin?')) {
                removeMedicine(selectedMedicineId);
                setSelectedMedicineId(null);
            }
        }
    };
    
    const handleSaveMedicine = (medicineData: Partial<Medicine>) => {
        if (medicineData.id) { // Editing existing medicine
            updateMedicine(medicineData as Medicine);
        } else { // Adding new medicine
            addMedicine(medicineData as Omit<Medicine, 'id'>);
        }
        setIsModalOpen(false);
        setEditingMedicine(null);
    };

    const inputStyles = "p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500 dark:placeholder-gray-400";
    const buttonDisabledStyles = "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed";

    return (
        <div className="flex flex-col h-full">
            <Header title="Inventory" showDateTime={false} />
            <main className="flex-grow p-6 bg-white dark:bg-gray-800 rounded-b-lg flex flex-col">
                <MedicineFormModal 
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); setEditingMedicine(null); }}
                    onSave={handleSaveMedicine}
                    medicine={editingMedicine}
                />
                <div className="flex items-center mb-4">
                    <div className="relative flex-grow">
                        <input 
                            type="text" 
                            placeholder="Search Medicine by ID or Name..."
                            className={`${inputStyles} w-full pl-10`}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                         <SearchIcon className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                    </div>
                    <button onClick={handleOpenAddModal} className="ml-4 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors flex items-center justify-center">
                        <PlusIcon className="w-5 h-5 mr-2" /> Add Medicine
                    </button>
                </div>

                <div className="overflow-x-auto flex-grow">
                  <table className="min-w-full bg-white dark:bg-gray-800">
                    <thead className="bg-gray-100 dark:bg-gray-700/50">
                      <tr>
                        <th className="py-2 px-4"></th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Med ID</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Med Name</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Quantity</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Buy Price</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Sell Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMedicines.map((med) => (
                        <tr key={med.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200">
                          <td className="py-2 px-4 text-center">
                             <input type="radio" name="selectedMedicine" value={med.id} checked={selectedMedicineId === med.id} onChange={(e) => setSelectedMedicineId(e.target.value)} className="form-radio h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-500" />
                          </td>
                          <td className="py-2 px-4">{med.id}</td>
                          <td className="py-2 px-4">{med.name}</td>
                          <td className="py-2 px-4">{med.quantity}</td>
                          <td className="py-2 px-4">₹{med.buyPrice.toFixed(2)}</td>
                          <td className="py-2 px-4">₹{med.sellPrice.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div className="space-x-2">
                        <button 
                            disabled={!selectedMedicineId} 
                            onClick={handleOpenEditModal}
                            className={`py-2 px-4 rounded-md ${selectedMedicineId ? 'bg-blue-500 hover:bg-blue-600 text-white' : buttonDisabledStyles}`}
                        >
                            Edit
                        </button>
                        <button
                            disabled={!selectedMedicineId}
                            onClick={handleRemoveMedicine}
                            className={`py-2 px-4 rounded-md ${selectedMedicineId ? 'bg-danger hover:bg-danger-dark text-white' : buttonDisabledStyles}`}
                        >
                            Remove
                        </button>
                    </div>
                    <DateTime />
                </div>
            </main>
        </div>
    );
};

export default InventoryPage;