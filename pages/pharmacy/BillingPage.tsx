import React, { useState, useMemo } from 'react';
import Header from '../../components/Header';
import { useData } from '../../context/DataContext';
import SearchableSelect from '../../components/SearchableSelect';
import { PlusIcon, MinusIcon } from '../../components/icons';
import { BilledMedicine } from '../../types';

const BillingPage: React.FC = () => {
    const { patients, medicines, bills, addBill } = useData();
    
    const [patientId, setPatientId] = useState<string>('');
    const [billedMedicines, setBilledMedicines] = useState<Partial<BilledMedicine>[]>([{ id: '', quantity: 1 }]);
    const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Online'>('Cash');

    const patientOptions = patients.map(p => ({ value: p.id, label: `${p.name} (${p.id})` }));
    const medicineOptions = medicines.map(m => ({ value: m.id, label: `${m.name} (Qty: ${m.quantity})` }));
    const selectedPatient = patients.find(p => p.id === patientId);

    const handleMedicineChange = (index: number, medId: string) => {
        const med = medicines.find(m => m.id === medId);
        const newMeds = [...billedMedicines];
        newMeds[index] = {
            id: medId,
            name: med?.name || '',
            quantity: 1,
            sellPrice: med?.sellPrice || 0,
        };
        setBilledMedicines(newMeds);
    };
    
    const handleQuantityChange = (index: number, quantity: number) => {
        const newMeds = [...billedMedicines];
        const medId = newMeds[index].id;
        const stockMed = medicines.find(m => m.id === medId);
        if (stockMed && quantity > stockMed.quantity) {
            alert(`Cannot sell more than available quantity (${stockMed.quantity})`);
            newMeds[index].quantity = stockMed.quantity;
        } else {
             newMeds[index].quantity = quantity > 0 ? quantity : 1;
        }
        setBilledMedicines(newMeds);
    };

    const addMedicineRow = () => setBilledMedicines([...billedMedicines, { id: '', quantity: 1 }]);
    const removeMedicineRow = (index: number) => {
        if (billedMedicines.length > 1) {
            setBilledMedicines(billedMedicines.filter((_, i) => i !== index));
        }
    };
    
    const totalAmount = useMemo(() => {
        return billedMedicines.reduce((total, med) => total + (med.sellPrice || 0) * (med.quantity || 0), 0);
    }, [billedMedicines]);
    
    const resetForm = () => {
        setPatientId('');
        setBilledMedicines([{ id: '', quantity: 1 }]);
        setPaymentMethod('Cash');
    };

    const handleFinalizeBill = () => {
        if (!patientId || billedMedicines.some(m => !m.id || !m.quantity)) {
            alert("Please select a patient and fill all medicine details.");
            return;
        }
        addBill({
            patientId: patientId,
            patientName: selectedPatient?.name || 'N/A',
            medicines: billedMedicines.filter(m => m.id).map(m => m as BilledMedicine),
            totalAmount: totalAmount,
            paymentMethod: paymentMethod,
            timestamp: new Date().toLocaleString()
        });
        alert('Bill finalized successfully!');
        resetForm();
    };


    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-gray-900 dark:text-gray-100";
    const labelStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <div className="flex flex-col h-full">
            <Header title="Billing" />
            <main className="flex-grow p-6 bg-white dark:bg-gray-800 rounded-b-lg flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Billing Form */}
                    <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                        <h3 className="text-lg font-semibold border-b pb-2">New Bill</h3>
                        <div>
                            <label className={labelStyle}>Patient</label>
                            <SearchableSelect options={patientOptions} value={patientId} onChange={setPatientId} placeholder="Select Patient"/>
                        </div>
                        <div className="space-y-2 pt-2">
                             <label className={labelStyle}>Medicines</label>
                            {billedMedicines.map((med, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-6"><SearchableSelect options={medicineOptions} value={med.id || ''} onChange={(val) => handleMedicineChange(index, val)} placeholder="Select Medicine"/></div>
                                    <div className="col-span-3"><input type="number" value={med.quantity} onChange={e => handleQuantityChange(index, parseInt(e.target.value))} className={inputStyle} /></div>
                                    <div className="col-span-3 flex items-center">
                                        <span className="text-sm mr-2">₹{(med.sellPrice || 0).toFixed(2)}</span>
                                        <button onClick={addMedicineRow} className="p-1.5 bg-green-500 text-white rounded-md hover:bg-green-600"><PlusIcon className="w-4 h-4"/></button>
                                        <button onClick={() => removeMedicineRow(index)} className="p-1.5 ml-1 bg-danger text-white rounded-md hover:bg-danger-dark"><MinusIcon className="w-4 h-4"/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                         <div className="border-t pt-4">
                            <label className={labelStyle}>Payment Method</label>
                            <div className="flex items-center space-x-4 mt-2">
                                <label><input type="radio" name="payment" value="Cash" checked={paymentMethod === 'Cash'} onChange={() => setPaymentMethod('Cash')} className="mr-1" /> Cash</label>
                                <label><input type="radio" name="payment" value="Online" checked={paymentMethod === 'Online'} onChange={() => setPaymentMethod('Online')} className="mr-1" /> Online</label>
                            </div>
                         </div>
                        <div className="border-t pt-4 flex justify-between items-center">
                            <span className="text-xl font-bold">Total: ₹{totalAmount.toFixed(2)}</span>
                            <div className="space-x-2">
                                <button onClick={handleFinalizeBill} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-md">Finalize Bill</button>
                                <button onClick={resetForm} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md">Cancel Bill</button>
                            </div>
                        </div>
                    </div>
                    {/* Bill History */}
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold mb-2">Bill History</h3>
                        <div className="overflow-y-auto flex-grow border rounded-lg">
                             <table className="min-w-full bg-white dark:bg-gray-800">
                                <thead className="bg-gray-100 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Bill ID</th>
                                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Patient</th>
                                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Amount</th>
                                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Payment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bills.map(bill => (
                                        <tr key={bill.id} className="border-b dark:border-gray-700">
                                            <td className="py-2 px-4 text-xs">{bill.id}</td>
                                            <td className="py-2 px-4">{bill.patientName}</td>
                                            <td className="py-2 px-4">₹{bill.totalAmount.toFixed(2)}</td>
                                            <td className="py-2 px-4">{bill.paymentMethod}</td>
                                        </tr>
                                    ))}
                                </tbody>
                             </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BillingPage;