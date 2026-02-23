import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import HomePage from './components/HomePage';
import LearningModule from './components/LearningModule';
import ExamSetup from './components/ExamSetup';
import ExamMode from './components/ExamMode';
import ProductInfo from './components/ProductInfo';
import Contact from './components/Contact';
import Navbar from './components/Navbar';
import Feedback from './components/Feedback';
import Leaderboard from './components/Leaderboard';
import AdditionFeatures from './components/AdditionFeatures';
import SubtractionFeatures from './components/SubtractionFeatures'; // RESTORED
import MultiplicationFeatures from './components/MultiplicationFeatures';
import DivisionFeatures from './components/DivisionFeatures';
import SequenceFeatures from './components/SequenceFeatures';
import FractionFeatures from './components/FractionFeatures';
import MainSelection from './components/MainSelection';
import TrafficSignalsWrapper from './components/TrafficSignals/TrafficSignalsWrapper';
import StartScreen from './components/StartScreen'; // NEW
import './App.css';

function Layout() {
  const location = useLocation();
  const hideNavbarPaths = ['/', '/select-mode'];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="App">
      {showNavbar && <Navbar />}
      <Routes>
        {/* 🟢 NEW ENTRY POINT: SHINCHAN START SCREEN */}
        <Route path="/" element={<StartScreen />} />

        {/* 🟢 SELECTION MODE: MATH VS TRAFFIC */}
        <Route path="/select-mode" element={<MainSelection />} />

        {/* 🟢 TRAFFIC SIGNALS APP */}
        <Route path="/traffic-signals" element={<TrafficSignalsWrapper />} />

        {/* 🟢 EXISTING MATH BUDDY ROUTES */}
        <Route path="/math-buddy-intro" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/learn/:topic" element={<LearningModule />} />
        <Route path="/exam-setup" element={<ExamSetup setSettings={val => console.log(val)} />} /> {/* Placeholder to fix scope issue if needed, but better to pass props from App if state needed */}
        <Route path="/exam-mode" element={<ExamMode settings={{ age: 0, time: 2 }} />} /> {/* Placeholder */}
        <Route path="/details" element={<ProductInfo />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/addition-interactive" element={<AdditionFeatures />} />
        <Route path="/subtraction-interactive" element={<SubtractionFeatures />} />
        <Route path="/multiplication-interactive" element={<MultiplicationFeatures />} />
        <Route path="/division-interactive" element={<DivisionFeatures />} />
        <Route path="/sequence-interactive" element={<SequenceFeatures />} />
        <Route path="/fractions-interactive" element={<FractionFeatures />} />
      </Routes>
    </div>
  );
}

function App() {
  const [examSettings, setExamSettings] = useState({ age: 0, time: 2 });

  return (
    <Router>
      <ContentWrapper examSettings={examSettings} setExamSettings={setExamSettings} />
    </Router>
  );
}

function ContentWrapper({ examSettings, setExamSettings }) {
  const location = useLocation();
  const hideNavbarPaths = ['/', '/select-mode'];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="App">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/select-mode" element={<MainSelection />} />
        <Route path="/traffic-signals" element={<TrafficSignalsWrapper />} />
        <Route path="/math-buddy-intro" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/learn/:topic" element={<LearningModule />} />
        <Route path="/exam-setup" element={<ExamSetup setSettings={setExamSettings} />} />
        <Route path="/exam-mode" element={<ExamMode settings={examSettings} />} />
        <Route path="/details" element={<ProductInfo />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/addition-interactive" element={<AdditionFeatures />} />
        <Route path="/subtraction-interactive" element={<SubtractionFeatures />} />
        <Route path="/multiplication-interactive" element={<MultiplicationFeatures />} />
        <Route path="/division-interactive" element={<DivisionFeatures />} />
        <Route path="/sequence-interactive" element={<SequenceFeatures />} />
        <Route path="/fractions-interactive" element={<FractionFeatures />} />
      </Routes>
    </div>
  );
}

export default App;