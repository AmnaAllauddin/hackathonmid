 // src/components/Navbar.js
import React, { useState } from 'react';
import DoctorSignupForm from './DoctorSignupForm';
import PatientSignupForm from './PatientSignupForm';

function Navbar({ loggedIn, onLogout, onDoctorSignup, onPatientSignup }) {
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [showPatientForm, setShowPatientForm] = useState(false);

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-gray-100 shadow-md">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Doctor's Appointment System</h1>
          <div className="space-x-4">
            {!loggedIn ? (
              <>
                <button 
                  onClick={() => setShowDoctorForm(true)}
                  className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                  Sign Up as Doctor
                </button>
                <button 
                  onClick={() => setShowPatientForm(true)}
                  className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition"
                >
                  Sign Up as Patient
                </button>
              </>
            ) : (
              <button 
                onClick={onLogout}
                className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Show Doctor Sign-Up Form */}
      {showDoctorForm && (
        <DoctorSignupForm 
          onClose={() => setShowDoctorForm(false)} 
          onDoctorSignup={onDoctorSignup} 
        />
      )}

      {/* Show Patient Sign-Up Form */}
      {showPatientForm && (
        <PatientSignupForm 
          onClose={() => setShowPatientForm(false)} 
          onPatientSignup={onPatientSignup} 
        />
      )}
    </div>
  );
}

export default Navbar;
