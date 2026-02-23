import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  // State to control the Popup
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="landing-container">
      
      {/* 1. The Start Button (Only visible if popup is closed) */}
      {!showPopup && (
        <button className="omnitrix-btn" onClick={() => setShowPopup(true)}>
          START
        </button>
      )}

      {/* 2. The "HI KIDS" Popup Box (Visible when showPopup is true) */}
      {showPopup && (
        <div className="welcome-overlay">
          <div className="welcome-box">
            <h1 className="welcome-title">HI KIDS!</h1>
            <p className="welcome-text">Let's learn maths together!</p>
            <button className="lets-go-btn" onClick={() => navigate('/home')}>
              Let's Go 🚀
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;