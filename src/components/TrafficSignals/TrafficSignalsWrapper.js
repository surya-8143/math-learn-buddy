import React, { useState, useEffect } from 'react';
import './TrafficSignals.css'; // Renamed CSS file
import TrafficLight from './TrafficLight';
import RoadSign from './RoadSign';
import AboutClassPage from './AboutClassPage';
import FeedbackFormClass from './FeedbackFormClass';

function TrafficSignalsWrapper() {

    /* ---------------- APP FLOW ---------------- */
    // Start from step 2 because step 1 is now the global StartScreen
    const [appStep, setAppStep] = useState(2);

    /* ---------------- LEARNING ---------------- */
    const [currentLight, setCurrentLight] = useState('red');
    const [learnMessage, setLearnMessage] = useState("Red means Stop.");

    /* ---------------- QUIZ ---------------- */
    const [score, setScore] = useState(0);
    const [quizQuestion, setQuizQuestion] = useState(null);
    const [quizFeedback, setQuizFeedback] = useState("");


    const welcomeBg =
        "/shinchanfamily.jpg";

    /* ---------------- ROAD SIGNS ---------------- */
    const roadSignsList = [
        { icon: '🛑', label: 'STOP', bgColor: '#ff3333', textColor: 'white' },
        { icon: '🅿️', label: 'PARKING' },
        { icon: '🚸', label: 'SCHOOL' },
        { icon: '🏥', label: 'HOSPITAL', bgColor: '#4fc3f7', textColor: 'white' },
        { icon: '🚶‍♀️', label: 'CROSSWALK' },
        { icon: '5️⃣5️⃣', label: 'SPEED 55' },
        { icon: '🚧', label: 'WORK ZONE' },
        { icon: '⛔', label: 'NO ENTER', bgColor: 'white', textColor: 'black' },
        { icon: '🔕', label: 'NO HORN' },
        { icon: '↪️', label: 'NO U-TURN', bgColor: 'white', textColor: 'black' },
    ];

    /* ---------------- SPEECH ---------------- */
    const speak = (text) => {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(u);
    };

    useEffect(() => {
        speak(learnMessage);
    }, [learnMessage]);

    /* ---------------- LEARNING LOGIC ---------------- */
    const handleLearnClick = (color) => {
        setCurrentLight(color);
        if (color === 'red') setLearnMessage("Red means Stop.");
        if (color === 'yellow') setLearnMessage("Yellow means Wait.");
        if (color === 'green') setLearnMessage("Green means Go.");
    };

    const getBoxColor = () => {
        if (currentLight === 'red') return "#d32f2f";
        if (currentLight === 'yellow') return "#fbc02d";
        if (currentLight === 'green') return "#388e3c";
        return "#333";
    };

    /* ---------------- QUIZ LOGIC (RESTORED) ---------------- */
    const generateQuestion = () => {
        const isLight = Math.random() > 0.5;

        if (isLight) {
            const colors = ['red', 'yellow', 'green'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const map = { red: 'STOP', yellow: 'WAIT', green: 'GO' };

            setQuizQuestion({
                type: 'light',
                visual: color,
                correctAnswer: map[color],
                options: ['STOP', 'WAIT', 'GO'],
            });
        } else {
            const correct = roadSignsList[Math.floor(Math.random() * roadSignsList.length)];
            const wrong = roadSignsList
                .filter(s => s.label !== correct.label)
                .map(s => s.label)
                .sort(() => 0.5 - Math.random())
                .slice(0, 2);

            setQuizQuestion({
                type: 'sign',
                visual: correct,
                correctAnswer: correct.label,
                options: [correct.label, ...wrong].sort(() => 0.5 - Math.random()),
            });
        }
    };

    useEffect(() => {
        if (appStep === 4) {
            setScore(0);
            setQuizFeedback("");
            generateQuestion();
            speak("Quiz mode started");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appStep]);

    const handleQuizAnswer = (opt) => {
        if (opt === quizQuestion.correctAnswer) {
            setScore(s => s + 10);
            setQuizFeedback("Correct!");
            speak("Correct");
            setTimeout(() => {
                setQuizFeedback("");
                generateQuestion();
            }, 1000);
        } else {
            setQuizFeedback("Try again!");
            speak("Try again");
        }
    };

    /* ===================== PAGE 1 ===================== */
    if (appStep === 1) {
        return (
            <div className="traffic-app welcome-container" style={{ backgroundImage: `url(${welcomeBg})` }}>
                <button className="hand-start-btn" onClick={() => setAppStep(2)}>
                    START ▶
                </button>
            </div>
        );
    }

    /* ===================== PAGE 2 ===================== */
    if (appStep === 2) {
        return (
            <div className="traffic-app welcome-container" style={{ backgroundImage: `url(${welcomeBg})` }}>
                <div className="welcome-box">
                    <h1 className="welcome-title">Hi Kids!</h1>
                    <p className="welcome-subtitle">Let's learn traffic signals together!</p>
                    <button className="lets-go-btn" onClick={() => setAppStep(3)}>
                        Let's Go 🚀
                    </button>
                </div>
            </div>
        );
    }

    /* ===================== PAGE 4: QUIZ (FULLY RESTORED) ===================== */
    if (appStep === 4) {
        return (
            <div className="traffic-app quiz-page-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1>Quiz Arena</h1>
                <div className="score-board big-score">Score: {score}</div>

                <div className="quiz-card">
                    <h2>What does this mean?</h2>

                    <div className="quiz-visual">
                        {quizQuestion?.type === 'light' &&
                            <TrafficLight activeColor={quizQuestion.visual} />}
                        {quizQuestion?.type === 'sign' &&
                            <RoadSign {...quizQuestion.visual} label="???" />}
                    </div>

                    <div className="quiz-feedback">{quizFeedback}</div>

                    <div className="quiz-options">
                        {quizQuestion?.options.map((opt, i) => (
                            <button
                                key={i}
                                className="quiz-option-btn"
                                onClick={() => handleQuizAnswer(opt)}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                <button className="mode-switch" onClick={() => setAppStep(5)}>
                    Feedback Form →
                </button>
            </div>
        );
    }


    /* ===================== PAGE 6: CLASS COMPONENT PAGE ===================== */
    if (appStep === 6) {
        return <AboutClassPage goBack={() => setAppStep(3)} />;
    }
    if (appStep === 5) {
        return <FeedbackFormClass goBack={() => setAppStep(3)} />;
    }

    /* ===================== PAGE 3: LEARNING DASHBOARD ===================== */
    return (
        <div className="traffic-app" style={{ minHeight: '100vh' }}>
            <h1>TRAFFIC SIGNAL & ROAD SAFETY</h1>

            <div className="main-layout">
                <div className="traffic-light-section">
                    <TrafficLight activeColor={currentLight} />

                    <div className="instruction-box" style={{ backgroundColor: getBoxColor() }}>
                        {learnMessage}
                    </div>

                    <div className="controls">
                        <button onClick={() => handleLearnClick('red')}>Red</button>
                        <button onClick={() => handleLearnClick('yellow')}>Yellow</button>
                        <button onClick={() => handleLearnClick('green')}>Green</button>
                    </div>

                    <button className="mode-switch start-quiz-btn" onClick={() => setAppStep(4)}>
                        Start Quiz Mode →
                    </button>
                    <button className="mode-switch" onClick={() => setAppStep(6)}>
                        About
                    </button>

                </div>

                <div className="road-signs-section">
                    <h2>Road Signs Puzzle</h2>
                    <div className="sign-grid">
                        {roadSignsList.map((s, i) => (
                            <RoadSign key={i} {...s} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TrafficSignalsWrapper;
