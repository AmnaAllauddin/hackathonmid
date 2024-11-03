 // src/components/AppointmentDetails.js
import React, { useState } from 'react';
import { db } from '../config/firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';

function AppointmentDetails({ appointment, onCancel, onAppointmentUpdated, onAppointmentDeleted }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedAppointment, setUpdatedAppointment] = useState(appointment);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const appointmentRef = doc(db, 'appointments', appointment.id);
      await updateDoc(appointmentRef, updatedAppointment);
      onAppointmentUpdated(updatedAppointment);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("Failed to update appointment. Please try again.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
    if (!confirmDelete) return;

    try {
      const appointmentRef = doc(db, 'appointments', appointment.id);
      await deleteDoc(appointmentRef);
      onAppointmentDeleted(appointment.id);
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Failed to delete appointment. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Appointment Details</h2>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block font-semibold">Doctor:</label>
            <input
              type="text"
              name="doctorName"
              value={updatedAppointment.doctorName}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              readOnly
            />
          </div>
          <div>
            <label className="block font-semibold">Patient Name:</label>
            <input
              type="text"
              name="patientName"
              value={updatedAppointment.patientName}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block font-semibold">Medical History:</label>
            <textarea
              name="medicalHistory"
              value={updatedAppointment.medicalHistory}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block font-semibold">Appointment Date:</label>
            <input
              type="date"
              name="date"
              value={updatedAppointment.date}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block font-semibold">Appointment Time:</label>
            <input
              type="time"
              name="time"
              value={updatedAppointment.time}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
            />
          </div>
          <button
            onClick={handleSave}
            className="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <strong>Doctor:</strong> {appointment.doctorName}
          </div>
          <div className="mb-4">
            <strong>Patient Name:</strong> {appointment.patientName}
          </div>
          <div className="mb-4">
            <strong>Medical History:</strong> {appointment.medicalHistory}
          </div>
          <div className="mb-4">
            <strong>Appointment Date:</strong> {appointment.date}
          </div>
          <div className="mb-4">
            <strong>Appointment Time:</strong> {appointment.time}
          </div>
          <button onClick={handleEdit} className="w-full bg-yellow-500 text-white font-semibold py-2 px-4 rounded hover:bg-yellow-600 transition">
            Edit
          </button>
        </div>
      )}
      <button onClick={onCancel} className="mt-4 w-full bg-gray-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-600 transition">
        Cancel
      </button>
      <button onClick={handleDelete} className="mt-2 w-full bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition">
        Delete Appointment
      </button>
    </div>
  );
}

export default AppointmentDetails;

