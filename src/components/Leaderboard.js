import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Leaderboard = () => {
    const navigate = useNavigate();
    const [scores, setScores] = useState([]);

    const fetchLeaderboard = async () => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
            const response = await fetch(`${apiUrl}/leaderboard`);
            const data = await response.json();
            setScores(data);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    return (
        <div className="learning-container" style={{ flexDirection: 'column' }}>
            <div className="learning-card" style={{ textAlign: 'center' }}>
                <h1 style={{ color: '#ff9f43', fontSize: '3rem', marginBottom: '10px' }}>🏆 Hall of Fame 🏆</h1>
                <p style={{ color: '#57606f', marginBottom: '30px' }}>Top Math Wizards</p>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ background: '#54a0ff', color: 'white' }}>
                            <th style={{ padding: '15px', borderRadius: '10px 0 0 10px' }}>Rank</th>
                            <th style={{ padding: '15px' }}>Name</th>
                            <th style={{ padding: '15px', borderRadius: '0 10px 10px 0' }}>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.length > 0 ? (
                            scores.map((s, index) => (
                                <tr key={s._id} style={{ borderBottom: '1px solid #eee', fontSize: '1.2rem' }}>
                                    <td style={{ padding: '15px' }}>
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                                    </td>
                                    <td style={{ padding: '15px', fontWeight: 'bold', color: '#2f3542' }}>{s.name}</td>
                                    <td style={{ padding: '15px', color: '#ff6b6b', fontWeight: 'bold' }}>{s.score}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" style={{ padding: '20px' }}>No scores yet. Be the first!</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <button className="back-btn" onClick={() => navigate('/home')} style={{ marginTop: '40px' }}>
                    ⬅ Back to Home
                </button>
            </div>
        </div>
    );
};

export default Leaderboard;
