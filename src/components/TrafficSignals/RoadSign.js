// src/components/RoadSign.js
import React from 'react';

// This component displays a single sign tile
const RoadSign = ({ icon, label, bgColor = 'yellow', textColor = 'black' }) => {
  // Define styles for the sign box based on props
  const signStyle = {
    backgroundColor: bgColor,
    color: textColor,
    border: `4px solid ${bgColor === 'yellow' ? '#e6b800' : '#cc0000'}`, // Darker border
  };

  return (
    <div className="road-sign-tile" style={signStyle}>
      <span role="img" aria-label={label} className="sign-icon">
        {icon}
      </span>
      <span className="sign-label">{label}</span>
    </div>
  );
};

export default RoadSign;