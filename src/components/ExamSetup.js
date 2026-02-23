import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ExamSetup = ({ setSettings }) => {
  const [age, setAge] = useState('');
  const [time, setTime] = useState(2);
  const [difficulty, setDifficulty] = useState('easy'); // Default to Easy
  const navigate = useNavigate();

  const startExam = () => {
    if (!age || age < 5) {
      alert("Please enter a valid age (Min 5).");
      return;
    }
    // Pass difficulty along with age and time
    setSettings({ age: parseInt(age), time: parseInt(time), difficulty });
    navigate('/exam-mode');
  };

  return (
    <div className="setup-container">
      
      {/* LEFT CHARACTER: DORAEMON */}
      <img src="/doraemon.jpg" alt="Doraemon" className="side-char left-char" />

      <div className="setup-box">
        <h2>🤓 Exam Setup</h2>
        
        {/* 1. AGE INPUT */}
        <div className="input-group">
          <label>Enter Your Age:</label>
          <input 
            type="number" 
            value={age} 
            onChange={(e) => setAge(e.target.value)} 
            placeholder="Age (e.g., 5, 10, 15)"
          />
        </div>

        {/* 2. DIFFICULTY LEVEL */}
        <div className="input-group">
          <label>Select Difficulty:</label>
          <div className="timer-options">
            <button 
              className={difficulty === 'easy' ? 'active' : ''} 
              onClick={() => setDifficulty('easy')}
              style={{ background: difficulty === 'easy' ? '#00b894' : '' }}
            >Easy 🟢</button>
            <button 
              className={difficulty === 'medium' ? 'active' : ''} 
              onClick={() => setDifficulty('medium')}
              style={{ background: difficulty === 'medium' ? '#fdcb6e' : '' }}
            >Med 🟡</button>
            <button 
              className={difficulty === 'hard' ? 'active' : ''} 
              onClick={() => setDifficulty('hard')}
              style={{ background: difficulty === 'hard' ? '#d63031' : '' }}
            >Hard 🔴</button>
          </div>
        </div>

        {/* 3. TIMER SELECT */}
        <div className="input-group">
          <label>Select Timer:</label>
          <div className="timer-options">
            <button className={time === 2 ? 'active' : ''} onClick={() => setTime(2)}>2 Min</button>
            <button className={time === 4 ? 'active' : ''} onClick={() => setTime(4)}>4 Min</button>
            <button className={time === 5 ? 'active' : ''} onClick={() => setTime(5)}>5 Min</button>
          </div>
        </div>

        <button className="start-exam-btn" onClick={startExam}>START EXAM</button>
      </div>

      {/* RIGHT CHARACTER: SHINCHAN */}
      <img src="/shinchan.jpg" alt="Shinchan" className="side-char right-char" />

    </div>
  );
};

export default ExamSetup;