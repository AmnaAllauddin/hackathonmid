 // src/App.js
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import DoctorDetails from './components/DoctorDetails';
import DoctorsList from './components/DoctorsList';
import AppointmentBookingForm from './components/AppointmentBookingForm';
import AppointmentDetails from './components/AppointmentDetails';
import PatientAppointments from './components/PatientAppointments'; // Import the new component
import { db } from './config/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const App = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDoctorName, setSelectedDoctorName] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPatientAppointments, setShowPatientAppointments] = useState(false); // State to manage PatientAppointments view

  const handleLogout = () => {
    setLoggedIn(false);
    setDoctorData(null);
    setPatientData(null);
  };

  const handleDoctorSignup = async (data) => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'doctors'), data);
      console.log("Doctor added with ID: ", docRef.id);
      setDoctorData(data);
      setLoggedIn(true);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error saving doctor data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSignup = (data) => {
    setPatientData(data);
    setLoggedIn(true);
  };

  const handleDoctorSelection = (doctorName) => {
    setSelectedDoctorName(doctorName);
    setShowBookingForm(true);
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
    setSelectedDoctorName('');
  };

  const handleAppointmentBooked = (appointmentData) => {
    setAppointments(prev => [...prev, appointmentData]);
    handleCloseBookingForm();
    setShowPatientAppointments(true); // Navigate to PatientAppointments
  };

  const handleAppointmentSelect = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleEditAppointment = async (updatedAppointment) => {
    setLoading(true);
    try {
      const appointmentRef = doc(db, 'appointments', selectedAppointment.id);
      await updateDoc(appointmentRef, updatedAppointment);
      setAppointments(prev => 
        prev.map(app => (app.id === selectedAppointment.id ? updatedAppointment : app))
      );
      console.log('Appointment updated:', updatedAppointment);
      setSelectedAppointment(updatedAppointment);
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert("Failed to update appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'appointments', appointmentId));
      setAppointments(prev => prev.filter(app => app.id !== appointmentId));
      console.log('Appointment deleted:', appointmentId);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error deleting appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAppointmentDetails = () => {
    setSelectedAppointment(null);
  };

  return (
    <div className="App">
      <Navbar 
        loggedIn={loggedIn} 
        onLogout={handleLogout} 
        onDoctorSignup={handleDoctorSignup}
        onPatientSignup={handlePatientSignup} 
      />

      {/* Hero Section */}
      {!doctorData && !patientData && !loggedIn && (
        <div className="hero h-screen flex items-center justify-center bg-blue-200 p-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Welcome to HealthCare</h1>
            <p className="mt-4">Your health is our priority. Sign up now!</p>
          </div>
        </div>
      )}

      {/* Show Doctor Details if form is filled */}
      {doctorData && <DoctorDetails />}

      {/* Show Doctors List if patient data is filled */}
      {patientData && !showPatientAppointments && (
        <DoctorsList onDoctorSelect={handleDoctorSelection} />
      )}

      {/* Appointment Booking Form */}
      {showBookingForm && (
        <AppointmentBookingForm
          doctorName={selectedDoctorName}
          onClose={handleCloseBookingForm}
          onAppointmentBooked={handleAppointmentBooked}
        />
      )}

      {/* Show Patient Appointments if navigated */}
      {showPatientAppointments && (
        <PatientAppointments patientData={patientData} />
      )}

      {/* Show Appointment Details if selected */}
      {selectedAppointment && (
        <AppointmentDetails
          appointment={selectedAppointment}
          onCancel={handleCloseAppointmentDetails}
          onAppointmentUpdated={handleEditAppointment}
          onAppointmentDeleted={handleDeleteAppointment}
        />
      )}

      {loading && <div className="loader">Loading...</div>} {/* Loading indicator */}
    </div>
  );
};

export default App;
