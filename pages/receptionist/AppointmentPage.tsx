import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { PlusIcon, SearchIcon } from '../../components/icons';
import { useData } from '../../context/DataContext';
import SearchableSelect from '../../components/SearchableSelect';
import { User } from '../../types';

const AppointmentPage: React.FC = () => {
  const { appointments, patients, doctors, addAppointment, updateAppointmentStatus } = useData();
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [appointmentDate, setAppointmentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [appointmentTime, setAppointmentTime] = useState<string>('10:00');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<User | null>(null);

  useEffect(() => {
    if (selectedDoctorId) {
      const doctor = doctors.find(d => d.id === selectedDoctorId);
      setSelectedDoctor(doctor || null);
    } else {
      setSelectedDoctor(null);
    }
  }, [selectedDoctorId, doctors]);

  const patientOptions = patients.map(p => ({ value: p.id, label: `${p.name} (${p.id})` }));
  const doctorOptions = doctors.map(d => ({ value: d.id, label: `${d.name}${d.specialty ? ` (${d.specialty})` : ''}` }));

  const filteredAppointments = appointments.filter(app => 
    app.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.doctorId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const handleAddAppointment = () => {
    if (!selectedPatientId || !selectedDoctorId || !appointmentDate || !appointmentTime) {
      alert('Please fill all fields to add an appointment.');
      return;
    }

    if (selectedDoctor?.availability !== 'Available') {
      alert(`Dr. ${selectedDoctor?.name} is currently ${selectedDoctor?.availability?.toLowerCase()}. Cannot book appointment.`);
      return;
    }

    const newAppointmentTimeInMinutes = timeToMinutes(appointmentTime);

    const doctorAppointmentsOnDate = appointments.filter(
      app => app.doctorId === selectedDoctorId && app.date === appointmentDate && app.status === 'Scheduled'
    );

    const conflict = doctorAppointmentsOnDate.some(app => {
      const existingTimeInMinutes = timeToMinutes(app.time);
      return Math.abs(newAppointmentTimeInMinutes - existingTimeInMinutes) < 5;
    });

    if (conflict) {
      alert('This time slot is too close to another appointment for this doctor. Please choose a time at least 5 minutes apart.');
      return;
    }

    const patient = patients.find(p => p.id === selectedPatientId);

    if (patient && selectedDoctor) {
      addAppointment({
        patientId: patient.id,
        patientName: patient.name,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date: appointmentDate,
        time: appointmentTime,
        status: 'Scheduled',
      });
      // Reset form
      setSelectedPatientId('');
      setSelectedDoctorId('');
    }
  };
  
  const inputStyles = "p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500 dark:placeholder-gray-400";

  const availabilityColors: { [key: string]: string } = {
    'Available': 'text-green-500',
    'On Break': 'text-yellow-500',
    'On Leave': 'text-red-500',
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Appointments" />
      <main className="flex-grow p-6 bg-white dark:bg-gray-800 rounded-b-lg">
        {/* Add Appointment Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50 items-start">
          <div className="lg:col-span-1">
            <SearchableSelect
              value={selectedPatientId}
              onChange={setSelectedPatientId}
              options={patientOptions}
              placeholder="Select Patient"
            />
          </div>
          <div className="lg:col-span-1">
            <SearchableSelect
              value={selectedDoctorId}
              onChange={setSelectedDoctorId}
              options={doctorOptions}
              placeholder="Select Doctor"
            />
            {selectedDoctor && (
              <p className={`text-sm mt-1 ml-1 font-semibold ${availabilityColors[selectedDoctor.availability || 'Available']}`}>
                Status: {selectedDoctor.availability}
              </p>
            )}
          </div>
          <input type="date" className={inputStyles} value={appointmentDate} onChange={e => setAppointmentDate(e.target.value)}/>
          <input type="time" className={inputStyles} value={appointmentTime} onChange={e => setAppointmentTime(e.target.value)}/>
          <button onClick={handleAddAppointment} className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors flex items-center justify-center h-[42px]">
            <PlusIcon className="w-5 h-5 mr-2" /> Add
          </button>
        </div>
        
        {/* Appointment List */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search appointments by patient or doctor..."
            className={`w-full pl-10 mb-4 ${inputStyles}`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <SearchIcon className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead className="bg-gray-100 dark:bg-gray-700/50">
              <tr>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Patient Name</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Patient ID</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Doctor Name</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Doctor ID</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Time</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                    <td colSpan={8} className="text-center py-4 text-gray-500 dark:text-gray-400">No appointments found.</td>
                </tr>
              ) : (
                filteredAppointments.map((app) => (
                    <tr key={app.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200">
                      <td className="py-2 px-4">{app.patientName}</td>
                      <td className="py-2 px-4">{app.patientId}</td>
                      <td className="py-2 px-4">{app.doctorName}</td>
                      <td className="py-2 px-4">{app.doctorId}</td>
                      <td className="py-2 px-4">{app.date}</td>
                      <td className="py-2 px-4">{app.time}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                            app.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' : 
                            app.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                            'bg-green-100 text-green-800'
                        }`}>
                            {app.status}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        {app.status === 'Scheduled' && (
                            <button onClick={() => updateAppointmentStatus(app.id, 'Cancelled')} className="bg-danger text-white text-sm py-1 px-3 rounded-md hover:bg-danger-dark">Cancel</button>
                        )}
                      </td>
                    </tr>
                )))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AppointmentPage;