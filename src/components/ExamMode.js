import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const ExamMode = ({ settings }) => {
  const navigate = useNavigate();
  const { age, time, difficulty } = settings; // Now receiving difficulty too

  const [timeLeft, setTimeLeft] = useState(time * 60);
  const [score, setScore] = useState(0);
  const [questionDeck, setQuestionDeck] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(localStorage.getItem('mathHighScore') || 0);
  const [playerName, setPlayerName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // --- 1. DETERMINE ALLOWED TOPICS BASED ON AGE ---
  // --- 1. DETERMINE ALLOWED TOPICS BASED ON AGE ---
  const getAllowedTopics = useCallback((userAge) => {
    let topics = [];

    // Rule: Age 5-6 -> Addition Only
    if (userAge <= 6) {
      topics = ['addition'];
    }
    // Rule: Age 7-9 -> Add, Sub
    else if (userAge >= 7 && userAge <= 9) {
      topics = ['addition', 'subtraction'];
    }
    // Rule: Age 10-11 -> Add, Sub, Mul
    else if (userAge >= 10 && userAge <= 11) {
      topics = ['addition', 'subtraction', 'multiplication'];
    }
    // Rule: Age 12 -> Add, Sub, Mul, Div, Fraction
    else if (userAge === 12) {
      topics = ['addition', 'subtraction', 'multiplication', 'division', 'fraction'];
    }
    // Rule: Age 13+ -> All Topics (including Circles, Trig)
    else {
      topics = ['addition', 'subtraction', 'multiplication', 'division', 'fraction', 'circles', 'trigonometry'];
    }
    return topics;
  }, []);

  // --- 2. NUMBER GENERATOR BASED ON DIFFICULTY ---
  // --- 2. NUMBER GENERATOR BASED ON DIFFICULTY ---
  const getNumber = useCallback((type) => {
    // Basic numbers for Add/Sub
    if (type === 'basic') {
      if (difficulty === 'easy') return Math.floor(Math.random() * 10) + 1; // 1-10
      if (difficulty === 'medium') return Math.floor(Math.random() * 40) + 10; // 10-50
      if (difficulty === 'hard') return Math.floor(Math.random() * 100) + 50; // 50-150
    }
    // For Multiplication (Tables)
    if (type === 'mul') {
      if (difficulty === 'easy') return Math.floor(Math.random() * 5) + 1; // 1-5 table
      if (difficulty === 'medium') return Math.floor(Math.random() * 8) + 3; // 3-10 table
      if (difficulty === 'hard') return Math.floor(Math.random() * 12) + 6; // 6-18 table
    }
    return 5;
  }, [difficulty]);

  // --- 3. GENERATE DECK ---
  const generateUniqueDeck = useCallback(() => {
    const newDeck = [];
    const seenTexts = new Set();
    const allowedTopics = getAllowedTopics(age);
    let safetyCounter = 0;

    // Generate 50 questions
    while (newDeck.length < 50 && safetyCounter < 500) {
      safetyCounter++;
      const topic = allowedTopics[Math.floor(Math.random() * allowedTopics.length)];
      let q = {};

      // === ADDITION ===
      if (topic === 'addition') {
        const n1 = getNumber('basic');
        const n2 = getNumber('basic');
        q.text = `${n1} + ${n2} = ?`;
        q.ans = n1 + n2;
        q.options = generateNumericOptions(q.ans);
      }

      // === SUBTRACTION ===
      else if (topic === 'subtraction') {
        const n1 = getNumber('basic');
        const n2 = getNumber('basic');
        const big = Math.max(n1, n2);
        const small = Math.min(n1, n2);
        q.text = `${big} - ${small} = ?`;
        q.ans = big - small;
        q.options = generateNumericOptions(q.ans);
      }

      // === MULTIPLICATION ===
      else if (topic === 'multiplication') {
        const n1 = getNumber('mul');
        const n2 = getNumber('mul');
        q.text = `${n1} × ${n2} = ?`;
        q.ans = n1 * n2;
        q.options = generateNumericOptions(q.ans);
      }

      // === DIVISION ===
      else if (topic === 'division') {
        const divisor = getNumber('mul'); // Use multiplication logic for divisors
        const answer = getNumber('mul');
        const dividend = divisor * answer;
        q.text = `${dividend} ÷ ${divisor} = ?`;
        q.ans = answer;
        q.options = generateNumericOptions(q.ans);
      }

      // === FRACTIONS ===
      else if (topic === 'fraction') {
        const den = Math.floor(Math.random() * 5) + 2;
        const n1 = Math.floor(Math.random() * 5) + 1;
        const n2 = Math.floor(Math.random() * 5) + 1;
        q.text = `${n1}/${den} + ${n2}/${den} = ?`;
        q.ans = `${n1 + n2}/${den}`;
        q.options = [q.ans, `${n1 + n2 + 1}/${den}`, `${n1}/${den}`, `${n1 + n2}/${den + 1}`].sort(() => Math.random() - 0.5);
      }

      // === CIRCLES (Harder topic) ===
      else if (topic === 'circles') {
        const r = (Math.floor(Math.random() * 3) + 1) * 7;
        q.text = `Area of circle (r=${r})?`;
        q.ans = (22 / 7) * r * r;
        q.options = generateNumericOptions(q.ans);
      }

      // === TRIGONOMETRY (Harder topic) ===
      else if (topic === 'trigonometry') {
        const angle = [30, 45, 60][Math.floor(Math.random() * 3)];
        q.text = `sin(${angle}°) = ?`;
        q.ans = angle === 30 ? "0.5" : (angle === 45 ? "1/√2" : "√3/2");
        q.options = ["0.5", "1/√2", "√3/2", "1"].sort(() => Math.random() - 0.5);
      }

      // Add to deck if unique
      if (q.text && !seenTexts.has(q.text)) {
        seenTexts.add(q.text);
        newDeck.push(q);
      }
    }
    setQuestionDeck(newDeck);
  }, [age, getAllowedTopics, getNumber]); // Re-run if age or difficulty changes

  const generateNumericOptions = (correct) => {
    let opts = new Set([correct]);
    while (opts.size < 4) {
      let wrong = correct + Math.floor(Math.random() * 10) - 5;
      if (wrong !== correct && wrong >= 0) opts.add(wrong);
    }
    return Array.from(opts).sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    generateUniqueDeck();
  }, [generateUniqueDeck]);

  const endGame = () => {
    setGameOver(true);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('mathHighScore', score);
    }
  };

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
    // eslint-disable-next-line
  }, [timeLeft, gameOver]);

  const handleAnswer = (selected) => {
    const currentQ = questionDeck[currentQIndex];
    if (selected === currentQ.ans) {
      setScore(score + 4);
    } else {
      setScore(score - 1);
    }

    if (currentQIndex + 1 < questionDeck.length) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      endGame();
    }
  };

  const formatTime = (s) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  if (gameOver) {
    const handleScoreSubmit = () => {
      if (!playerName) return alert("Enter your name first!");
      try {
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
        const apiUrl = `${baseUrl}/api`;
        const scoreObj = { name: playerName, score };
        fetch(`${apiUrl}/score`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scoreObj),
        })
          .then(res => res.json())
          .then(() => {
            setSubmitted(true);
            navigate('/leaderboard');
          })
          .catch(err => alert("Failed to save score. Is backend running?"));
      } catch (error) {
        console.error("Error submitting score:", error);
        alert("An unexpected error occurred while saving the score.");
      }
    };

    return (
      <div className="exam-container">
        <div className="result-card">
          <h2>🏁 Exam Finished!</h2>
          <h1>Your Score: {score}</h1>
          <h3>High Score: {highScore}</h3>

          {!submitted ? (
            <div style={{ marginTop: '20px' }}>
              <input
                type="text"
                placeholder="Enter Your Name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                style={{ padding: '10px', fontSize: '1.2rem', borderRadius: '5px', border: '1px solid #ccc' }}
              />
              <button
                className="exam-btn-main"
                style={{ marginLeft: '10px', fontSize: '1rem', padding: '10px 20px' }}
                onClick={handleScoreSubmit}
              >
                Save Score 🏆
              </button>
            </div>
          ) : (
            <p>Score Saved!</p>
          )}

          <p style={{ margin: '15px 0', color: '#636e72' }}>Great Job! Now let us know how you did.</p>
          <button
            className="exam-btn-main"
            style={{ marginTop: '20px', fontSize: '1.2rem' }}
            onClick={() => navigate('/feedback')}
          >
            Next: Give Feedback ➡
          </button>
        </div>
      </div>
    );
  }

  if (questionDeck.length === 0) return <div className="exam-container">Loading Questions...</div>;

  const currentQuestion = questionDeck[currentQIndex];

  return (
    <div className="exam-container">
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-icon">⏳</span>
          <span>{formatTime(timeLeft)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🏆</span>
          <span>{score}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">📊</span>
          <span>{currentQIndex + 1} / 50</span>
        </div>
      </div>

      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${((currentQIndex + 1) / 50) * 100}%` }}
        ></div>
      </div>

      <div className="question-box">
        {/* Shows Difficulty Level on screen */}
        <div className={`difficulty-badge ${difficulty}`}>
          {difficulty.toUpperCase()}
        </div>

        <h2 className="question-text">{currentQuestion.text}</h2>

        <div className="options-grid">
          {currentQuestion.options && currentQuestion.options.map((opt, i) => (
            <button key={i} className="option-btn" onClick={() => handleAnswer(opt)}>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamMode;