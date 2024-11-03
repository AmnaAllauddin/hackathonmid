 // src/components/DoctorsList.js
import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import AppointmentBookingForm from './AppointmentBookingForm'; // Corrected import

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsRef = collection(db, 'doctorInfo');
        const querySnapshot = await getDocs(doctorsRef);
        const doctorList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDoctors(doctorList);
      } catch (error) {
        console.error("Error fetching doctors: ", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingForm(true);
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
    setSelectedDoctor(null);
  };

  return (
    <div className="doctors-list p-4">
      <h2 className="text-2xl font-bold mb-4">Doctors List</h2>
      <div className="space-y-4">
        {doctors.map(doctor => (
          <div key={doctor.id} className="flex justify-between items-center border p-4 rounded shadow">
            <div>
              <h3 className="text-xl font-semibold">{doctor.fullName}</h3>
              <p><strong>Specialization:</strong> {doctor.specialization}</p>
              <p><strong>Experience:</strong> {doctor.experience} Years</p>
            </div>
            <button
              onClick={() => handleBookAppointment(doctor)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>

      {/* Render AppointmentBookingForm modal if showBookingForm is true */}
      {showBookingForm && selectedDoctor && (
        <AppointmentBookingForm 
          doctorName={selectedDoctor.fullName} 
          onClose={handleCloseBookingForm} 
          onAppointmentBooked={(appointment) => {
            console.log("Appointment booked: ", appointment);
            handleCloseBookingForm();
          }}
        />
      )}
    </div>
  );
}

export default DoctorsList;


