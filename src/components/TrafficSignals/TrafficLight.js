import React from 'react';

const TrafficLight = ({ activeColor }) => {
  return (
    <div className="traffic-light-container">
      <div className={`light red ${activeColor === 'red' ? 'active' : ''}`}></div>
      <div className={`light yellow ${activeColor === 'yellow' ? 'active' : ''}`}></div>
      <div className={`light green ${activeColor === 'green' ? 'active' : ''}`}></div>
    </div>
  );
};

export default TrafficLight;