 // src/components/PatientSignupForm.js
import React, { useState } from 'react';

function PatientSignupForm({ onClose, onPatientSignup }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',  // Add password to state
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for empty fields
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      alert("Please fill in all the fields.");
      return;
    }

    // Pass the data to the parent component and close the form
    onPatientSignup(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-lg w-full shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Patient Sign-Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"  // Change type to password
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              placeholder="Enter password"
            />
          </div>
          <button type="submit" className="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition">
            Submit
          </button>
        </form>

        <button onClick={onClose} className="mt-4 w-full bg-gray-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-600 transition">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default PatientSignupForm;
