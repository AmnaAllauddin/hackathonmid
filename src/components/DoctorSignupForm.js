import React, { useState } from 'react';
import { db } from '../config/firebase'; // Import Firestore database
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore'; // Import Firestore functions

function DoctorSignupForm({ onClose, onDoctorSignup }) {
  const [formData, setFormData] = useState({
    id: '',
    fullName: '',
    email: '',
    specialization: '',
    experience: '',
    freeSlotTime: '',
    password: '',
  });

  const [submittedDoctor, setSubmittedDoctor] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields
    if (!formData.id || !formData.fullName || !formData.email || !formData.specialization || !formData.experience || !formData.freeSlotTime || !formData.password) {
      alert("Please fill in all the fields.");
      return;
    }

    // Check for existing ID
    const doctorsCollection = collection(db, 'doctorInfo');
    const q = query(doctorsCollection, where('id', '==', formData.id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      alert("This ID already exists. Please choose a different ID.");
      return;
    }

    const doctorData = { ...formData };

    try {
      // Add the doctor data to the "doctorInfo" collection in Firestore
      const docRef = await addDoc(collection(db, 'doctorInfo'), doctorData);
      console.log("Doctor added with ID: ", docRef.id);

      // Store the submitted doctor details
      setSubmittedDoctor(doctorData);

      // Call the parent function if needed
      onDoctorSignup(doctorData);
    } catch (error) {
      console.error("Error adding doctor: ", error);
    }
  };

  const handleNewSignup = () => {
    setSubmittedDoctor(null);
    setFormData({ id: '', fullName: '', email: '', specialization: '', experience: '', freeSlotTime: '', password: '' });
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-lg w-full shadow-lg">
        {submittedDoctor ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Doctor Details</h2>
            <p><strong>ID:</strong> {submittedDoctor.id}</p> {/* Display the ID */}
            <p><strong>Full Name:</strong> {submittedDoctor.fullName}</p>
            <p><strong>Email:</strong> {submittedDoctor.email}</p>
            <p><strong>Specialization:</strong> {submittedDoctor.specialization}</p>
            <p><strong>Experience:</strong> {submittedDoctor.experience} years</p>
            <p><strong>Free Slot Time:</strong> {submittedDoctor.freeSlotTime}</p>
            <button onClick={handleNewSignup} className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition">
              New Signup
            </button>
            <button onClick={onClose} className="mt-4 w-full bg-gray-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-600 transition">
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Doctor Sign-Up</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">ID</label>
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Enter ID"
                />
              </div>
              <div>
                <label className="block text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-gray-700">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Specialization"
                />
              </div>
              <div>
                <label className="block text-gray-700">Experience (Years)</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Years of experience"
                />
              </div>
              <div>
                <label className="block text-gray-700">Free Slot Time</label>
                <input
                  type="text"
                  name="freeSlotTime"
                  value={formData.freeSlotTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="e.g., 09:00 AM - 11:00 AM"
                />
              </div>
              <div>
                <label className="block text-gray-700">Password</label>
                <input
                  type="password" // Change type to password
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Enter password"
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

export default DoctorSignupForm;
