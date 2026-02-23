const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/math-buddy')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- Schemas & Models ---

const FeedbackSchema = new mongoose.Schema({
    name: String,
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
});
const Feedback = mongoose.model('Feedback', FeedbackSchema);

const ScoreSchema = new mongoose.Schema({
    name: String,
    score: Number,
    date: { type: Date, default: Date.now }
});
const Score = mongoose.model('Score', ScoreSchema);

// --- Routes ---

app.get('/', (req, res) => {
    res.send('Math Buddy Backend (MERN) is Running!');
});

// 1. Submit Feedback
app.post('/api/feedback', async (req, res) => {
    try {
        const { name, rating, comment } = req.body;
        if (!rating) return res.status(400).json({ error: 'Rating is required' });

        const newFeedback = new Feedback({ name, rating, comment });
        await newFeedback.save();

        console.log('📝 Feedback Saved:', newFeedback);
        res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save feedback' });
    }
});

// 2. Submit Score
app.post('/api/score', async (req, res) => {
    try {
        const { name, score } = req.body;
        if (score === undefined) return res.status(400).json({ error: 'Score is required' });

        const newScore = new Score({ name: name || 'Anonymous', score });
        await newScore.save();

        console.log('🏆 Score Saved:', newScore);
        res.status(201).json({ message: 'Score saved', score: newScore });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save score' });
    }
});

// 3. Get Leaderboard (Top 10)
app.get('/api/leaderboard', async (req, res) => {
    try {
        const topScores = await Score.find().sort({ score: -1 }).limit(10);
        res.json(topScores);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
