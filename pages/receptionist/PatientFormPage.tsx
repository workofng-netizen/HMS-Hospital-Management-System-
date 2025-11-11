import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import DateTime from '../../components/DateTime';
import { useData } from '../../context/DataContext';
import { Patient } from '../../types';
import SearchableSelect from '../../components/SearchableSelect';

const PatientFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { patients, doctors, addPatient, updatePatient } = useData();
    const isEditMode = Boolean(id);
    
    const [formData, setFormData] = useState<Omit<Patient, 'id'>>({
        name: '',
        contact: '',
        email: '',
        status: 'Admitted',
        gender: 'Male',
        ward: '',
        assignedDoctorId: '',
    });

    useEffect(() => {
        if (isEditMode && id) {
            const patientToEdit = patients.find(p => p.id === id);
            if (patientToEdit) {
                setFormData(patientToEdit);
            }
        }
    }, [id, isEditMode, patients]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (isEditMode && id) {
            updatePatient({ ...formData, id });
        } else {
            addPatient(formData);
        }
        navigate('/patients');
    };
    
    const doctorOptions = doctors.map(d => ({ value: d.id, label: `${d.name}${d.specialty ? ` (${d.specialty})` : ''}` }));

    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-gray-900 dark:text-gray-100";
    const labelStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <div className="flex flex-col h-full">
            <Header title={isEditMode ? 'Edit Patient' : 'Add Patient'} showDateTime={false} />
            <main className="flex-grow p-8 bg-white dark:bg-gray-800 rounded-b-lg flex flex-col">
                <form className="max-w-4xl mx-auto flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelStyle}>ID</label>
                            <span className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 rounded-md">{isEditMode ? id : 'Auto-generated'}</span>
                        </div>
                        <div>
                            <label htmlFor="name" className={labelStyle}>Name</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="contact" className={labelStyle}>Contact</label>
                            <input type="tel" id="contact" name="contact" value={formData.contact} onChange={handleChange} className={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="email" className={labelStyle}>Email</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="gender" className={labelStyle}>Gender</label>
                            <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className={inputStyle}>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="status" className={labelStyle}>Status</label>
                            <select id="status" name="status" value={formData.status} onChange={handleChange} className={inputStyle}>
                                <option>Admitted</option>
                                <option>Discharged</option>
                                <option>Died</option>
                            </select>
                        </div>
                         <div>
                            <label htmlFor="ward" className={labelStyle}>Ward</label>
                            <input type="text" id="ward" name="ward" value={formData.ward} onChange={handleChange} className={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="assignedDoctorId" className={labelStyle}>Assign Doctor</label>
                             <SearchableSelect
                                value={formData.assignedDoctorId || ''}
                                onChange={(value) => setFormData(prev => ({ ...prev, assignedDoctorId: value }))}
                                options={doctorOptions}
                                placeholder="Select Doctor"
                            />
                        </div>
                    </div>
                </form>
                 <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div>
                        <button onClick={handleSave} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200 mr-4">
                            Save
                        </button>
                        <button onClick={() => navigate('/patients')} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
                            Cancel
                        </button>
                    </div>
                    <DateTime />
                </div>
            </main>
        </div>
    );
};

export default PatientFormPage;