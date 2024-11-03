 // src/components/AppointmentBookingForm.js
import React, { useState } from 'react';
import { db } from '../config/firebase'; 
import { collection, addDoc } from 'firebase/firestore'; 

function AppointmentBookingForm({ doctorName, onClose, onAppointmentBooked }) {
  const [formData, setFormData] = useState({
    patientName: '',
    medicalHistory: '',
    appointmentDate: '',
    appointmentTime: '',
    phoneNumber: '',
    email: '',
  });

  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { patientName, medicalHistory, appointmentDate, appointmentTime, phoneNumber, email } = formData;
    if (!patientName || !medicalHistory || !appointmentDate || !appointmentTime || !phoneNumber || !email) {
      alert("Please fill in all the fields.");
      return;
    }

    const newAppointment = {
      doctorName,
      patientName,
      medicalHistory,
      date: appointmentDate,
      time: appointmentTime,
      phoneNumber,
      email,
    };

    try {
      // Add appointment to Firestore
      await addDoc(collection(db, 'appointments'), newAppointment);
      setAppointment(newAppointment); // Set the appointment state
      onAppointmentBooked(newAppointment); // Pass the appointment data back to parent
      setFormData({ // Reset form data
        patientName: '',
        medicalHistory: '',
        appointmentDate: '',
        appointmentTime: '',
        phoneNumber: '',
        email: '',
      });
      setError(''); // Clear any previous error
    } catch (err) {
      setError('Failed to book appointment. Please try again.'); 
      console.error("Error adding document: ", err);
    }
  };

  const handleCancelAppointment = () => {
    setAppointment(null); // Clear appointment state
    onClose(); // Close the booking form
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-lg w-full shadow-lg">
        {appointment ? (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Appointment Booked</h2>
            <p><strong>Patient Name:</strong> {appointment.patientName}</p>
            <p><strong>Doctor:</strong> {appointment.doctorName}</p>
            <p><strong>Date:</strong> {appointment.date}</p>
            <p><strong>Time:</strong> {appointment.time}</p>
            <button onClick={handleCancelAppointment} className="mt-4 w-full bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition">
              Cancel Appointment
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Book Appointment with {doctorName}</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">Patient Name</label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Enter patient name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Medical History</label>
                <textarea
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Enter past medical records"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Appointment Date</label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Appointment Time</label>
                <input
                  type="time"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition">
                Submit
              </button>
            </form>
            <button onClick={onClose} className="mt-4 w-full bg-gray-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-600 transition">
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default AppointmentBookingForm;
