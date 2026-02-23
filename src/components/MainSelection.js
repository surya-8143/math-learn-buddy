import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainSelection.css';

function MainSelection() {
    const navigate = useNavigate();

    return (
        <div className="main-selection-container">
            <h1 className="main-title">CHOOSE YOUR ADVENTURE</h1>

            <div className="selection-layout">
                {/* LEFT IMAGE */}
                <img src="/tom.jpg" alt="Tom" className="side-image left-image" />

                <div className="selection-cards">
                    {/* MATH BUDDY CARD */}
                    <div className="selection-card math-card" onClick={() => navigate('/home')}>
                        <div className="card-icon">🧮</div>
                        <h2>MATH BUDDY</h2>
                        <p>Learn Math the Fun Way!</p>
                    </div>

                    {/* TRAFFIC SIGNALS CARD */}
                    <div className="selection-card traffic-card" onClick={() => navigate('/traffic-signals')}>
                        <div className="card-icon">🚦</div>
                        <h2>TRAFFIC SIGNALS</h2>
                        <p>Learn Road Safety & Signs!</p>
                    </div>
                </div>

                {/* RIGHT IMAGE */}
                <img src="/pokemon.jpg" alt="Pokemon" className="side-image right-image" />
            </div>
        </div>
    );
}

export default MainSelection;
