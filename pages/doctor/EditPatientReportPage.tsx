import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import DateTime from '../../components/DateTime';
import { useData } from '../../context/DataContext';
import { Patient, SosPatient } from '../../types';
import DynamicInputList from '../../components/DynamicInputList';

const EditPatientReportPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { patients, sosPatients, updatePatient, updateSosPatient } = useData();

    const isSosPatient = useMemo(() => location.pathname.includes('/sos-patients/'), [location.pathname]);
    
    const [patient, setPatient] = useState<Patient | SosPatient | null>(null);
    const [diagnoses, setDiagnoses] = useState<string[]>(['']);
    const [prescriptions, setPrescriptions] = useState<string[]>(['']);
    const [instructions, setInstructions] = useState<string[]>(['']);

    useEffect(() => {
        let currentPatient: Patient | SosPatient | undefined;
        if (isSosPatient) {
            currentPatient = sosPatients.find(p => p.id === id);
        } else {
            currentPatient = patients.find(p => p.id === id);
        }

        if (currentPatient) {
            setPatient(currentPatient);
            setDiagnoses(currentPatient.diagnosis?.length ? [...currentPatient.diagnosis] : ['']);
            setPrescriptions(currentPatient.prescriptions?.length ? [...currentPatient.prescriptions] : ['']);
            setInstructions(currentPatient.instructions?.length ? [...currentPatient.instructions] : ['']);
        }
    }, [id, isSosPatient, patients, sosPatients]);

    const handleSave = () => {
        if (!patient) return;
        
        const updatedData = {
            ...patient,
            diagnosis: diagnoses.filter(d => d.trim() !== ''),
            prescriptions: prescriptions.filter(p => p.trim() !== ''),
            instructions: instructions.filter(i => i.trim() !== ''),
        };

        if (isSosPatient) {
            updateSosPatient(updatedData as SosPatient);
            navigate('/doctor/sos-patients');
        } else {
            updatePatient(updatedData as Patient);
            navigate('/doctor/patients');
        }
    };

    const handleCancel = () => {
        navigate(isSosPatient ? '/doctor/sos-patients' : '/doctor/patients');
    };
    
    return (
        <div className="flex flex-col h-full">
            <Header title={isSosPatient ? "Edit SOS Patient Report" : "Edit Patient Report"} showDateTime={false} />
            <main className="flex-grow p-8 bg-white dark:bg-gray-800 rounded-b-lg flex flex-col">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Patient: {patient?.name}</h2>
                    <span className="text-md font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded">ID: {patient?.id}</span>
                </div>
                
                <div className="space-y-6 flex-grow">
                   <DynamicInputList 
                        label="Diagnosis"
                        values={diagnoses}
                        onChange={setDiagnoses}
                        placeholder="e.g., Hypertension"
                   />
                   <DynamicInputList 
                        label="Prescriptions"
                        values={prescriptions}
                        onChange={setPrescriptions}
                        placeholder="e.g., Lisinopril 10mg"
                   />
                   <DynamicInputList 
                        label="Instructions"
                        values={instructions}
                        onChange={setInstructions}
                        placeholder="e.g., Take one tablet daily."
                   />
                </div>
                
                 <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div>
                        <button onClick={handleSave} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200 mr-4">
                            Save
                        </button>
                        <button onClick={handleCancel} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
                            Cancel
                        </button>
                    </div>
                    <DateTime />
                </div>
            </main>
        </div>
    );
};

export default EditPatientReportPage;
