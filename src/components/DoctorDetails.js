 
 
// src/components/DoctorDetails.js
import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

function DoctorDetails({ doctorId }) {
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!doctorId) {
      setError("Doctor ID is undefined.");
      setLoading(false);
      return; // Exit if doctorId is not available
    }

    const fetchDoctorInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const doctorsRef = collection(db, 'doctorInfo');
        const q = query(doctorsRef, where('id', '==', doctorId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const doctorData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))[0];
          
          setDoctorInfo(doctorData);
        } else {
          setError("Doctor not found.");
        }
      } catch (error) {
        console.error("Error fetching doctor info: ", error);
        setError("Failed to load doctor information.");
      } finally {
        setLoading(false);
      }
    };

    const fetchAppointments = async () => {
      try {
        const appointmentsRef = collection(db, 'appointments');
        const q = query(appointmentsRef, where('doctorId', '==', doctorId));
        const querySnapshot = await getDocs(q);

        const fetchedAppointments = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error("Error fetching appointments: ", error);
        setError("Failed to load appointments.");
      }
    };

    fetchDoctorInfo();
    fetchAppointments();
  }, [doctorId]);

  return (
    <div className="doctor-details bg-white p-8 rounded-lg max-w-lg w-full shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Doctor & Appointment Details</h2>
      
      {loading && <p>Loading doctor and appointment details...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {doctorInfo && (
        <div className="doctor-info space-y-4">
          <p><strong>Doctor Name:</strong> {doctorInfo.fullName || 'N/A'}</p>
          <p><strong>Specialization:</strong> {doctorInfo.specialization || 'N/A'}</p>
          <p><strong>Experience:</strong> {doctorInfo.experience || 'N/A'} Years</p>
        </div>
      )}

      <h3 className="text-xl font-semibold mt-6 mb-2">Appointments</h3>
      {appointments.length > 0 ? (
        <div className="space-y-6">
          {appointments.map(appointment => (
            <div key={appointment.id} className="appointment-info space-y-2 border-b pb-4">
              <p><strong>Patient Name:</strong> {appointment.patientName || 'N/A'}</p>
              <p><strong>Date:</strong> {appointment.date || 'N/A'}</p>
              <p><strong>Time:</strong> {appointment.time || 'N/A'}</p>
              <p><strong>Medical History:</strong> {appointment.medicalHistory || 'N/A'}</p>
              <p><strong>Contact Number:</strong> {appointment.phoneNumber || 'N/A'}</p>
              <p><strong>Email:</strong> {appointment.email || 'N/A'}</p>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p>No appointments found for this doctor.</p>
      )}
    </div>
  );
}

export default DoctorDetails;
