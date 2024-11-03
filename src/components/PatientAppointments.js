 // src/components/PatientAppointments.js
import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const PatientAppointments = ({ patientData }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsRef = collection(db, 'appointments');
        const q = query(appointmentsRef, where('patientEmail', '==', patientData.email)); // Ensure this matches your Firestore structure
        const querySnapshot = await getDocs(q);

        const fetchedAppointments = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error("Error fetching appointments: ", error);
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [patientData]);

  return (
    <div className="patient-appointments bg-white p-8 rounded-lg max-w-lg w-full shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Appointments</h2>
      
      {loading && <p>Loading your appointments...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {appointments.length > 0 ? (
        appointments.map(appointment => (
          <div key={appointment.id} className="appointment-info border-b pb-4 mb-4">
            <p><strong>Doctor:</strong> {appointment.doctorName}</p>
            <p><strong>Date:</strong> {appointment.date}</p>
            <p><strong>Time:</strong> {appointment.time}</p>
            <p><strong>Medical History:</strong> {appointment.medicalHistory}</p>
          </div>
        ))
      ) : (
        !loading && <p>No appointments booked.</p>
      )}
    </div>
  );
};

export default PatientAppointments;
