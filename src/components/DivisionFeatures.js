import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScreenshot } from 'use-react-screenshot';

const DivisionFeatures = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('long');
    const captureRef = useRef(null);
    const [image, takeScreenshot] = useScreenshot();

    // ==============================
    // 1. GUIDED LONG DIVISION
    // ==============================
    const [divisionProblem, setDivisionProblem] = useState({ divisor: '4', dividend: '512' });
    const [userInputs, setUserInputs] = useState({});
    const [highlightedStep, setHighlightedStep] = useState(null);
    const [uiStage, setUiStage] = useState('solving');

    useEffect(() => {
        if (activeTab === 'long') setupProblemFields(divisionProblem.divisor, divisionProblem.dividend);
    }, [activeTab]);

    const handleProblemChange = (factor, value) => {
        const numericVal = value.replace(/\D/g, '');
        const newProblem = { ...divisionProblem, [factor]: numericVal };
        setDivisionProblem(newProblem);
        setupProblemFields(newProblem.divisor, newProblem.dividend);
    };

    const setupProblemFields = (divisorStr, dividendStr) => {
        setUiStage('solving');
        setUserInputs({});
    };

    const handleInputChange = (e, rowType, stepIdx, pos) => {
        const val = e.target.value;
        if (!/^\d*$/.test(val)) return;

        const key = `${rowType}-${stepIdx}-pos-${pos}`;
        setUserInputs(prev => ({ ...prev, [key]: val }));
    };

    const handleKeyUp = (e, rowType, stepIdx, pos) => {
        // Vertical Flow (Enter)
        if (e.key === 'Enter') {
            if (rowType === 'quotient') {
                // Focus corresponding subtraction step
                const subKey = `sub-${pos}-pos-${pos}`;
                const subEl = document.getElementById(subKey);
                if (subEl) subEl.focus();
            } else if (rowType === 'sub') {
                // Focus the bring down box for this step
                const bringDownKey = `rem-${stepIdx}-pos-${stepIdx}`;
                const bringDownEl = document.getElementById(bringDownKey);
                if (bringDownEl) bringDownEl.focus();
            } else if (rowType === 'rem') {
                // Focus *next* quotient digit
                const nextQuotientPos = stepIdx + 1;
                const nextQKey = `quotient-0-pos-${nextQuotientPos}`;
                const nextQEl = document.getElementById(nextQKey);
                if (nextQEl) nextQEl.focus();
            }
        } else if (/^\d$/.test(e.key)) {
            // Auto advance right in multi-digit subtraction boxes
            // Subtraction steps could be multiple digits.
            if (rowType === 'sub' || rowType === 'rem') {
                const nextPos = pos + 1;
                const nextKey = `${rowType}-${stepIdx}-pos-${nextPos}`;
                const nextEl = document.getElementById(nextKey);
                if (nextEl) nextEl.focus();
            }
        } else if (e.key === 'Backspace') {
            const currentVal = userInputs[`${rowType}-${stepIdx}-pos-${pos}`];
            if (!currentVal) {
                const prevPos = pos - 1;
                const prevKey = `${rowType}-${stepIdx}-pos-${prevPos}`;
                const prevEl = document.getElementById(prevKey);
                if (prevEl) prevEl.focus();
            }
        }
    };

    const checkAnswer = () => {
        setUiStage('complete');
        new Audio('https://codeskulptor-demos.commondatastorage.googleapis.com/pang/arrow.mp3').play().catch(e => console.log(e));

        setTimeout(() => {
            if (captureRef.current) {
                takeScreenshot(captureRef.current).then(downloadImage);
            }
        }, 800);
    };

    const downloadImage = (base64Image) => {
        if (!base64Image) return;
        const link = document.createElement('a');
        link.download = 'division-mastery.png';
        link.href = base64Image;
        link.click();
    };

    // ==============================
    // 2. CONCEPT: SHARING (Visual Groups)
    // ==============================
    const [sharingProblem, setSharingProblem] = useState({ total: 12, groups: 3 });

    const renderLongDivisionGrid = () => {
        const divisorStr = divisionProblem.divisor;
        const dividendStr = divisionProblem.dividend;
        const len = dividendStr.length;

        // Visual styles
        const divisorStyle = {
            color: highlightedStep !== null ? '#e84393' : '#2d3436',
            fontWeight: highlightedStep !== null ? 'bold' : 'normal',
            transition: 'all 0.2s',
            marginRight: '15px'
        };

        return (
            <div ref={captureRef} style={{ padding: '40px', background: 'white', borderRadius: '20px', display: 'inline-block', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                {/* PROBLEM SETUP */}
                <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <span style={{ fontSize: '1rem', color: '#636e72', fontWeight: 'bold' }}>Divisor (Outside)</span>
                        <input
                            type="text"
                            maxLength="2"
                            value={divisionProblem.divisor}
                            onChange={(e) => handleProblemChange('divisor', e.target.value)}
                            style={{ padding: '10px', fontSize: '1.5rem', width: '120px', textAlign: 'center', borderRadius: '8px', border: '2px solid #ccc' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <span style={{ fontSize: '1rem', color: '#636e72', fontWeight: 'bold' }}>Dividend (Inside)</span>
                        <input
                            type="text"
                            maxLength="4"
                            value={divisionProblem.dividend}
                            onChange={(e) => handleProblemChange('dividend', e.target.value)}
                            style={{ padding: '10px', fontSize: '1.5rem', width: '120px', textAlign: 'center', borderRadius: '8px', border: '2px solid #ccc' }}
                        />
                    </div>
                </div>

                {/* COMPUTATION AREA */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '2rem', fontFamily: 'monospace' }}>

                    {/* QUOTIENT ROW */}
                    <div style={{ display: 'flex', marginLeft: '60px' }}>
                        {Array.from({ length: len }).map((_, i) => (
                            <input
                                key={`quotient-${i}`}
                                id={`quotient-0-pos-${i}`}
                                type="text"
                                maxLength="1"
                                value={userInputs[`quotient-0-pos-${i}`] || ''}
                                onChange={(e) => handleInputChange(e, 'quotient', 0, i)}
                                onKeyUp={(e) => handleKeyUp(e, 'quotient', 0, i)}
                                style={{
                                    width: '40px', height: '50px', fontSize: '1.5rem', textAlign: 'center',
                                    margin: '0 5px', borderRadius: '5px',
                                    border: highlightedStep === i ? '2px solid #0984e3' : '1px solid #ccc',
                                    fontWeight: highlightedStep === i ? 'bold' : 'normal',
                                    color: highlightedStep === i ? '#0984e3' : '#333',
                                    outline: 'none', transition: 'all 0.2s', background: 'transparent'
                                }}
                                onFocus={(e) => e.target.style.boxShadow = '0 0 5px #0984e3'}
                                onBlur={(e) => e.target.style.boxShadow = 'none'}
                            />
                        ))}
                    </div>

                    {/* BRACKET LINE */}
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                        <span style={divisorStyle}>{divisorStr}</span>
                        <div style={{ display: 'flex', borderTop: '4px solid #333', borderLeft: '4px solid #333', padding: '10px', borderTopLeftRadius: '5px' }}>
                            {dividendStr.split('').map((d, i) => (
                                <span key={i} style={{ width: '50px', textAlign: 'center' }}>{d}</span>
                            ))}
                        </div>
                    </div>

                    {/* SUBTRACTION STEPS */}
                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '60px', marginTop: '10px' }}>
                        {Array.from({ length: len }).map((_, stepIdx) => (
                            <div
                                key={`step-${stepIdx}`}
                                style={{
                                    display: 'flex', flexDirection: 'column', marginBottom: '10px',
                                    background: highlightedStep === stepIdx ? 'rgba(9, 132, 227, 0.05)' : 'transparent',
                                    borderRadius: '8px', padding: '5px', border: highlightedStep === stepIdx ? '1px dashed #0984e3' : '1px dashed transparent',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={() => setHighlightedStep(stepIdx)}
                                onMouseLeave={() => setHighlightedStep(null)}
                            >
                                {/* Subtract Line (e.g. - 4 ) */}
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ fontSize: '1.5rem', marginRight: '10px', width: '20px' }}>-</span>
                                    {/* Offset subtraction inputs based on step index */}
                                    {Array.from({ length: stepIdx }).map((_, padIdx) => (
                                        <div key={`pad-${padIdx}`} style={{ width: '50px' }}></div>
                                    ))}
                                    {/* Usually subtraction is 1 or 2 digits max for a standard 1 digit divisor, let's allow 2 inputs */}
                                    {Array.from({ length: 2 }).map((_, i) => {
                                        const pos = stepIdx + i;
                                        return (
                                            <input
                                                key={`sub-${i}`}
                                                id={`sub-${stepIdx}-pos-${pos}`}
                                                type="text"
                                                maxLength="1"
                                                value={userInputs[`sub-${stepIdx}-pos-${pos}`] || ''}
                                                onChange={(e) => handleInputChange(e, 'sub', stepIdx, pos)}
                                                onKeyUp={(e) => handleKeyUp(e, 'sub', stepIdx, pos)}
                                                style={{
                                                    width: '40px', height: '40px', fontSize: '1.5rem', textAlign: 'center',
                                                    margin: '0 5px', borderRadius: '5px', border: '1px solid #ccc',
                                                    background: 'white', color: '#e84393' // Subtract is red/pink
                                                }}
                                            />
                                        )
                                    })}
                                    {/* Traceability Hint */}
                                    <span style={{ fontSize: '1rem', color: '#b2bec3', alignSelf: 'center', marginLeft: '15px', fontWeight: highlightedStep === stepIdx ? 'bold' : 'normal', transition: 'all 0.2s' }}>
                                        {(userInputs[`quotient-0-pos-${stepIdx}`] || '_')} × {divisorStr}
                                    </span>
                                </div>
                                <div style={{ borderBottom: '2px solid #333', width: `${100 + (stepIdx * 50)}px`, margin: '5px 0 5px 30px' }}></div>

                                {/* Remainder/Bring Down Line */}
                                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '30px' }}>
                                    {Array.from({ length: stepIdx }).map((_, padIdx) => (
                                        <div key={`pad-rem-${padIdx}`} style={{ width: '50px' }}></div>
                                    ))}
                                    {Array.from({ length: 2 }).map((_, i) => {
                                        const pos = stepIdx + i;
                                        return (
                                            <input
                                                key={`rem-${i}`}
                                                id={`rem-${stepIdx}-pos-${pos}`}
                                                type="text"
                                                maxLength="1"
                                                value={userInputs[`rem-${stepIdx}-pos-${pos}`] || ''}
                                                onChange={(e) => handleInputChange(e, 'rem', stepIdx, pos)}
                                                onKeyUp={(e) => handleKeyUp(e, 'rem', stepIdx, pos)}
                                                style={{
                                                    width: '40px', height: '40px', fontSize: '1.5rem', textAlign: 'center',
                                                    margin: '0 5px', borderRadius: '5px', border: '1px solid #0984e3',
                                                    background: '#f1f2f6', color: '#333'
                                                }}
                                            />
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {uiStage === 'complete' && (
                    <div style={{ marginTop: '20px', padding: '10px', background: '#e8f5e9', borderRadius: '10px', border: '2px solid #4caf50' }}>
                        <h2 style={{ color: '#4caf50', margin: '0' }}>🌟 Great Job! Correct Answer: {Math.floor(parseInt(divisionProblem.dividend || 0) / parseInt(divisionProblem.divisor || 1))} R{parseInt(divisionProblem.dividend || 0) % parseInt(divisionProblem.divisor || 1)} 🌟</h2>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ color: '#2d3436' }}>➗ Division Depot ➗</h1>

            <div style={{ marginBottom: '30px' }}>
                <button onClick={() => setActiveTab('long')} style={{ padding: '10px 20px', margin: '0 10px', borderRadius: '20px', border: 'none', background: activeTab === 'long' ? '#e84393' : '#eee', color: activeTab === 'long' ? 'white' : '#333', cursor: 'pointer', fontWeight: 'bold' }}>📝 Long Division</button>
                <button onClick={() => setActiveTab('sharing')} style={{ padding: '10px 20px', margin: '0 10px', borderRadius: '20px', border: 'none', background: activeTab === 'sharing' ? '#0984e3' : '#eee', color: activeTab === 'sharing' ? 'white' : '#333', cursor: 'pointer', fontWeight: 'bold' }}>🤝 Visual Sharing</button>
            </div>

            {activeTab === 'long' && (
                <div>
                    <p style={{ color: '#636e72', fontSize: '1.2rem', marginBottom: '20px' }}>Hover over steps to see relationships! Press Enter to move down.</p>
                    {renderLongDivisionGrid()}
                    <div style={{ marginTop: '20px' }}>
                        <button onClick={checkAnswer} style={{ padding: '15px 30px', fontSize: '1.2rem', background: '#00b894', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', marginRight: '20px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>Check Answer</button>
                        <button onClick={() => setupProblemFields(divisionProblem.divisor, divisionProblem.dividend)} style={{ padding: '15px 30px', fontSize: '1.2rem', background: '#fdcb6e', color: '#2d3436', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>Clear</button>
                    </div>
                </div>
            )}

            {activeTab === 'sharing' && (
                <div>
                    <h2 style={{ color: '#2d3436' }}>Sharing Cookies evenly!</h2>
                    <div style={{ fontSize: '2rem', marginBottom: '20px' }}>
                        <input
                            type="number" min="1" max="30" value={sharingProblem.total}
                            onChange={(e) => setSharingProblem({ ...sharingProblem, total: parseInt(e.target.value) || 1 })}
                            style={{ width: '80px', padding: '5px', fontSize: '1.5rem', textAlign: 'center', borderRadius: '8px', border: '2px solid #ccc' }}
                        />
                        {' '} cookies among {' '}
                        <input
                            type="number" min="1" max="10" value={sharingProblem.groups}
                            onChange={(e) => setSharingProblem({ ...sharingProblem, groups: parseInt(e.target.value) || 1 })}
                            style={{ width: '60px', padding: '5px', fontSize: '1.5rem', textAlign: 'center', borderRadius: '8px', border: '2px solid #ccc' }}
                        />
                        {' '} friends.
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px' }}>
                        {Array.from({ length: sharingProblem.groups }).map((_, i) => (
                            <div key={i} style={{ padding: '20px', border: '3px dashed #b2bec3', borderRadius: '15px', background: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', minWidth: '100px', minHeight: '100px' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center' }}>
                                    {Array.from({ length: Math.floor(sharingProblem.total / sharingProblem.groups) }).map((_, j) => (
                                        <div key={j} style={{ fontSize: '2rem' }}>🍪</div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <h2 style={{ marginTop: '30px', color: '#2d3436' }}>
                        Each friend gets: <span style={{ color: '#0984e3' }}>{Math.floor(sharingProblem.total / sharingProblem.groups)}</span> cookies!
                        {sharingProblem.total % sharingProblem.groups > 0 && (
                            <span style={{ color: '#e84393' }}> (Remainder: {sharingProblem.total % sharingProblem.groups})</span>
                        )}
                    </h2>
                </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <button onClick={() => navigate('/home')} style={{ padding: '10px 30px', background: '#636e72', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold' }}>⬅ Back to Home</button>
            </div>
        </div>
    );
};

export default DivisionFeatures;
