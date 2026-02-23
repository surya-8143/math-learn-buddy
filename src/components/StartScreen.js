import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TrafficSignals/TrafficSignals.css'; // Reuse existing styles

function StartScreen() {
    const navigate = useNavigate();
    const welcomeBg = "https://img10.hotstar.com/image/upload/f_auto,q_auto/sources/r1/cms/prod/1675/1715415371675-i";

    return (
        <div
            className="traffic-app welcome-container"
            style={{
                backgroundImage: `url(${welcomeBg})`,
                height: '100vh',
                width: '100vw',
                overflow: 'hidden',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                margin: 0,
                padding: 0,
                position: 'relative' // Ensure relative positioning for absolute child
            }}
        >
            <button
                className="hand-start-btn"
                onClick={() => navigate('/select-mode')}
                style={{
                    backgroundColor: '#ff5252',
                    color: 'white',
                    border: '4px solid white',
                    position: 'absolute',
                    bottom: '18%',
                    left: '3%',
                    padding: '15px 30px',
                    borderRadius: '50px',
                    fontSize: '1.5rem',
                    fontFamily: '"Comic Sans MS", cursive',
                    cursor: 'pointer',
                    animation: 'pulseBtn 2s infinite'
                }}
            >
                START ▶
            </button>
        </div>
    );
}

export default StartScreen;
