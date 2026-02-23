import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScreenshot } from 'use-react-screenshot';

const SequenceFeatures = () => {
    const navigate = useNavigate();
    const captureRef = useRef(null);
    const [image, takeScreenshot] = useScreenshot();

    // ==============================
    // 1. SEQUENCE STATE & GENERATION
    // ==============================
    const [config, setConfig] = useState({
        start: 2,
        ruleType: 'add', // 'add' or 'multiply'
        step: 3
    });

    const [sequence, setSequence] = useState([]);

    // Keystroke UX State
    const [activeTerm, setActiveTerm] = useState(0);

    // Mouse UX State
    const [hoveredTermId, setHoveredTermId] = useState(null);

    // Generate sequence on load or config change (String Events UX)
    const generateSequence = useCallback(() => {
        let current = Number(config.start);
        const stepNum = Number(config.step);
        const newSeq = [current];

        for (let i = 1; i < 10; i++) {
            if (config.ruleType === 'add') {
                current += stepNum;
            } else if (config.ruleType === 'multiply') {
                current *= stepNum;
            }
            newSeq.push(current);
        }
        setSequence(newSeq);
    }, [config]);

    useEffect(() => {
        generateSequence();
    }, [config, generateSequence]);

    // Handle Config Changes
    const handleConfigChange = (field, value) => {
        // Allow negative numbers and empty strings for smooth typing
        if (value === '' || value === '-') {
            setConfig(prev => ({ ...prev, [field]: value }));
            return;
        }
        const numVal = parseInt(value, 10);
        if (!isNaN(numVal)) {
            setConfig(prev => ({ ...prev, [field]: numVal }));
        }
    };

    // ==============================
    // 2. KEYSTROKE UX (Timeline Stepping)
    // ==============================
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            setActiveTerm(prev => Math.min(prev + 1, sequence.length - 1));
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            setActiveTerm(prev => Math.max(prev - 1, 0));
        }
    };

    // Ensure the container is focusable to catch key events
    useEffect(() => {
        const container = document.getElementById('sequence-container');
        if (container) container.focus();
    }, []);

    // ==============================
    // 3. SCREEN CAPTURE UX
    // ==============================
    const exportSequence = () => {
        if (captureRef.current) {
            takeScreenshot(captureRef.current).then(downloadImage);
        }
    };

    const downloadImage = (base64Image) => {
        if (!base64Image) return;
        const link = document.createElement('a');
        link.download = `sequence-${config.ruleType}-${config.step}.png`;
        link.href = base64Image;
        link.click();
    };


    // Helper for visual math operation
    const getMathSymbol = () => config.ruleType === 'add' ? '+' : '×';
    const getOperatorColor = () => config.ruleType === 'add' ? '#00b894' : '#0984e3';

    return (
        <div
            id="sequence-container"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            style={{
                padding: '20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center',
                outline: 'none' // Hide default focus ring
            }}
        >
            <h1 style={{ color: '#2d3436' }}>🔢 Number Sequences 🔢</h1>
            <p style={{ color: '#636e72', fontSize: '1.2rem', marginBottom: '30px' }}>
                Use <strong>Left/Right Arrows</strong> to step through the sequence. Hover over a number to trace its origin!
            </p>

            {/* CONFIG/SCAFFOLDING */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px', background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label style={{ fontWeight: 'bold', color: '#636e72', marginBottom: '8px' }}>Start Number ($a_1$)</label>
                    <input
                        type="text"
                        value={config.start}
                        onChange={(e) => handleConfigChange('start', e.target.value)}
                        style={{ padding: '10px', fontSize: '1.5rem', width: '100px', textAlign: 'center', borderRadius: '8px', border: '2px solid #ccc' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label style={{ fontWeight: 'bold', color: '#636e72', marginBottom: '8px' }}>Rule Type</label>
                    <select
                        value={config.ruleType}
                        onChange={(e) => setConfig({ ...config, ruleType: e.target.value })}
                        style={{ padding: '10px', fontSize: '1.5rem', borderRadius: '8px', border: '2px solid #ccc', cursor: 'pointer', outline: 'none' }}
                    >
                        <option value="add">Arithmetic (+)</option>
                        <option value="multiply">Geometric (×)</option>
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label style={{ fontWeight: 'bold', color: '#636e72', marginBottom: '8px' }}>Step / Factor (r)</label>
                    <input
                        type="text"
                        value={config.step}
                        onChange={(e) => handleConfigChange('step', e.target.value)}
                        style={{ padding: '10px', fontSize: '1.5rem', width: '100px', textAlign: 'center', borderRadius: '8px', border: `2px solid ${getOperatorColor()}` }}
                    />
                </div>
            </div>

            {/* SEQUENCE DISPLAY VIEW */}
            <div ref={captureRef} style={{ background: '#f8f9fa', padding: '50px 20px', borderRadius: '20px', position: 'relative', overflowX: 'auto', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.02)' }}>
                {sequence.map((num, idx) => {

                    // Mouse UX Logic
                    const isHovered = hoveredTermId === idx;
                    const isDependency = hoveredTermId !== null && hoveredTermId === idx + 1; // The previous term

                    // Keystroke UX Logic
                    const isActive = activeTerm === idx;

                    return (
                        <div key={idx} style={{ display: 'inline-flex', alignItems: 'center' }}>

                            {/* The Number Bubble */}
                            <div
                                onMouseEnter={() => setHoveredTermId(idx)}
                                onMouseLeave={() => setHoveredTermId(null)}
                                style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    position: 'relative', cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
                                }}
                            >
                                {/* Term Label (n=1, etc) */}
                                <span style={{ fontSize: '0.9rem', color: '#b2bec3', marginBottom: '5px', fontWeight: 'bold' }}>
                                    $a_{idx + 1}$
                                </span>

                                <div style={{
                                    minWidth: '60px', padding: '15px 20px',
                                    background: isActive ? '#ffeaa7' : (isHovered || isDependency ? 'white' : 'white'),
                                    border: isActive ? '3px solid #fdcb6e' : (isHovered ? `3px solid ${getOperatorColor()}` : (isDependency ? '3px solid #b2bec3' : '2px solid transparent')),
                                    borderRadius: '15px', fontSize: '2rem', fontWeight: 'bold', color: '#2d3436',
                                    boxShadow: (isHovered || isDependency || isActive) ? '0 10px 20px rgba(0,0,0,0.1)' : '0 4px 6px rgba(0,0,0,0.05)',
                                    transform: isHovered ? 'scale(1.15)' : (isDependency ? 'scale(1.05)' : (isActive ? 'scale(1.1)' : 'scale(1)')),
                                    zIndex: (isHovered || isDependency || isActive) ? 10 : 1
                                }}>
                                    {num}
                                </div>
                            </div>

                            {/* The Connecting Line / Math Operator */}
                            {idx < sequence.length - 1 && (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px', opacity: (hoveredTermId === idx + 1) ? 1 : 0.3, transition: 'opacity 0.2s', zIndex: 1 }}>
                                    {/* Custom Dependency Trace Arrow */}
                                    {hoveredTermId === idx + 1 && (
                                        <div style={{ position: 'absolute', top: '30px', background: getOperatorColor(), color: 'white', padding: '5px 10px', borderRadius: '10px', fontSize: '1.2rem', fontWeight: 'bold', animation: 'fadeIn 0.3s', zIndex: 20, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                            {getMathSymbol()} {config.step}
                                        </div>
                                    )}
                                    <div style={{ height: '4px', width: '40px', background: (hoveredTermId === idx + 1) ? getOperatorColor() : '#dfe6e9', borderRadius: '2px', alignSelf: 'center', marginTop: '25px' }}></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* CONTROLS */}
            <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <button onClick={exportSequence} style={{ padding: '15px 30px', fontSize: '1.2rem', background: '#e84393', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    📸 Export Sequence Pattern
                </button>
                <button onClick={() => navigate('/home')} style={{ padding: '15px 30px', background: '#636e72', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    ⬅ Back to Home
                </button>
            </div>

        </div>
    );
};

export default SequenceFeatures;
