const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
// The dynamic port assignment is critical for Render/Heroku!
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- In-Memory Storage (No Database!) ---
// Note: These arrays will reset every time the server restarts
let feedbacks = [];
let scores = [];

// --- Routes ---

app.get('/', (req, res) => {
    res.send('Math Buddy Backend (Stateless API) is Running!');
});

// 1. Submit Feedback
app.post('/api/feedback', (req, res) => {
    try {
        // Updated to capture the current frontend structure (name, message)
        const { name, message } = req.body;
        if (!message && !req.body.rating) return res.status(400).json({ error: 'Feedback message is required' });

        const newFeedback = {
            id: Date.now().toString(),
            name: name || 'Anonymous',
            message: message || req.body.comment,
            rating: req.body.rating || null,
            date: new Date()
        };

        feedbacks.push(newFeedback);

        console.log('📝 Feedback Saved (In-Memory):', newFeedback);
        res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save feedback' });
    }
});

// 2. Submit Score
app.post('/api/score', (req, res) => {
    try {
        const { name, score } = req.body;
        if (score === undefined) return res.status(400).json({ error: 'Score is required' });

        const newScore = {
            id: Date.now().toString(),
            name: name || 'Anonymous',
            score: Number(score),
            date: new Date()
        };

        scores.push(newScore);

        console.log('🏆 Score Saved (In-Memory):', newScore);
        res.status(201).json({ message: 'Score saved', score: newScore });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save score' });
    }
});

// 3. Get Leaderboard (Top 10)
app.get('/api/leaderboard', (req, res) => {
    try {
        // Sort scores descending and take top 10
        const topScores = [...scores]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

        res.json(topScores);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Stateless Server is running on port ${PORT}`);
});
