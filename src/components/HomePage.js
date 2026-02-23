import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const topics = [
    { id: 'addition', name: 'Addition', icon: '➕', color: '#FFD700' },
    { id: 'subtraction', name: 'Subtraction', icon: '➖', color: '#FF6347' },
    { id: 'multiplication', name: 'Multiplication', icon: '✖️', color: '#32CD32' },
    { id: 'division', name: 'Division', icon: '➗', color: '#1E90FF' },
    { id: 'sequences', name: 'Number Sequences', icon: '🔢', color: '#FF4500' }, // NEW
    { id: 'fractions', name: 'Fractions', icon: '🍰', color: '#9370DB' }, // Changed to cake for fractions/visual
    { id: 'circles', name: 'Circles', icon: '⭕', color: '#FF69B4' },
    { id: 'trigonometry', name: 'Trigonometry', icon: '📐', color: '#FFA500' },
  ];

  return (
    <div className="home-container">

      {/* 🟢 THIS ADDS BEN 10 ON THE LEFT SIDE */}
      <img src="/ben10.jpg" alt="Ben 10" className="ben10-sidebar" />

      <h1>📚 Math Learning Hub</h1>
      <p>Select a topic to learn formulas or take the Exam!</p>

      <div className="topic-grid">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="topic-card"
            onClick={() => {
              if (topic.id === 'addition') {
                navigate('/addition-interactive');
              } else if (topic.id === 'subtraction') {
                navigate('/subtraction-interactive');
              } else if (topic.id === 'multiplication') {
                navigate('/multiplication-interactive');
              } else if (topic.id === 'division') {
                navigate('/division-interactive');
              } else if (topic.id === 'sequences') {
                navigate('/sequence-interactive');
              } else if (topic.id === 'fractions') {
                navigate('/fractions-interactive');
              } else {
                navigate(`/learn/${topic.id}`);
              }
            }}
          >
            {/* Top Color Bar */}
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '8px',
              background: topic.color
            }}></div>

            <div className="topic-icon">{topic.icon}</div>
            <h3>{topic.name}</h3>
            <p>Click to Learn</p>
          </div>
        ))}
      </div>

      <button className="exam-btn-main" onClick={() => navigate('/exam-setup')}>
        📝 TAKE EXAM
      </button>
    </div>
  );
};

export default HomePage;