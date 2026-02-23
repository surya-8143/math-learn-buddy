import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScreenshot } from 'use-react-screenshot';

const MultiplicationFeatures = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('standard');
    const captureRef = useRef(null);
    const [image, takeScreenshot] = useScreenshot();

    // ==============================
    // 1. GUIDED STANDARD ALGORITHM
    // ==============================
    const [standardProblem, setStandardProblem] = useState({ top: '123', bottom: '45' });
    const [userInputs, setUserInputs] = useState({});
    const [highlightedRow, setHighlightedRow] = useState(null);
    const [uiStage, setUiStage] = useState('solving');

    useEffect(() => {
        if (activeTab === 'standard') setupProblemFields(standardProblem.top, standardProblem.bottom);
    }, [activeTab]);

    const handleProblemChange = (factor, value) => {
        const numericVal = value.replace(/\D/g, '');
        const newProblem = { ...standardProblem, [factor]: numericVal };
        setStandardProblem(newProblem);
        setupProblemFields(newProblem.top, newProblem.bottom);
    };

    const setupProblemFields = (topStr, bottomStr) => {
        setUiStage('solving');

        const initialInputs = {};
        for (let i = 0; i < bottomStr.length; i++) {
            for (let z = 0; z < i; z++) {
                initialInputs[`row-${i}-pos-${z}`] = '0'; // placeholder zeros
            }
        }
        setUserInputs(initialInputs);
    };

    const handleInputChange = (e, type, row, pos) => {
        const val = e.target.value;
        if (!/^\d*$/.test(val)) return;

        let key = '';
        if (type === 'partial') {
            key = `row-${row}-pos-${pos}`;
        } else {
            key = `sum-pos-${pos}`;
        }
        setUserInputs(prev => ({ ...prev, [key]: val }));
    };

    const handleKeyUp = (e, type, row, pos) => {
        // Right-to-Left Auto-Advance
        if (/^\d$/.test(e.key)) {
            if (type === 'partial') {
                const nextPos = pos + 1;
                const nextKey = `row-${row}-pos-${nextPos}`;
                const nextEl = document.getElementById(nextKey);
                if (nextEl) nextEl.focus();
            } else if (type === 'sum') {
                const nextPos = pos + 1;
                const sumKey = `sum-pos-${nextPos}`;
                const sumEl = document.getElementById(sumKey);
                if (sumEl) sumEl.focus();
            }
        } else if (e.key === 'Enter') {
            if (type === 'partial') {
                const bottomStr = standardProblem.bottom;
                if (row < bottomStr.length - 1) {
                    const nextRow = row + 1;
                    const nextKey = `row-${nextRow}-pos-${nextRow}`; // starts after zeros
                    const nextEl = document.getElementById(nextKey);
                    if (nextEl) nextEl.focus();
                } else {
                    const sumKey = `sum-pos-0`;
                    const sumEl = document.getElementById(sumKey);
                    if (sumEl) sumEl.focus();
                }
            }
        } else if (e.key === 'Backspace') {
            const currentVal = type === 'partial' ? userInputs[`row-${row}-pos-${pos}`] : userInputs[`sum-pos-${pos}`];
            if (!currentVal) {
                const prevPos = pos - 1;
                if (prevPos >= (type === 'partial' ? row : 0)) {
                    const prevKey = type === 'partial' ? `row-${row}-pos-${prevPos}` : `sum-pos-${prevPos}`;
                    const prevEl = document.getElementById(prevKey);
                    if (prevEl) prevEl.focus();
                }
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
        link.download = 'multiplication-mastery.png';
        link.href = base64Image;
        link.click();
    };

    // ==============================
    // 2. CONCEPT: GROUPS (Visual Arrays)
    // ==============================
    const [groupsProblem, setGroupsProblem] = useState({ a: 3, b: 4 });

    const renderStandardGrid = () => {
        const topStr = standardProblem.top;
        const bottomStr = standardProblem.bottom;
        // The display digits of bottom string, reversed so index 0 = ones place
        const bottomDigits = bottomStr.split('').reverse();

        const cols = topStr.length + bottomStr.length;

        // Custom style for top number when highlighted
        const topNumberStyle = {
            color: highlightedRow !== null ? '#0984e3' : '#2d3436',
            transition: 'color 0.2s',
            fontWeight: highlightedRow !== null ? 'bold' : 'normal'
        };

        return (
            <div ref={captureRef} style={{ padding: '40px', background: 'white', borderRadius: '20px', display: 'inline-block', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                {/* PROBLEM SETUP */}
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <span style={{ fontSize: '1rem', color: '#636e72', fontWeight: 'bold' }}>Top Number</span>
                        <input
                            type="text"
                            maxLength="4"
                            value={standardProblem.top}
                            onChange={(e) => handleProblemChange('top', e.target.value)}
                            style={{ padding: '10px', fontSize: '1.5rem', width: '100px', textAlign: 'center', borderRadius: '8px', border: '2px solid #ccc' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <span style={{ fontSize: '1rem', color: '#636e72', fontWeight: 'bold' }}>Multiplier</span>
                        <input
                            type="text"
                            maxLength="3"
                            value={standardProblem.bottom}
                            onChange={(e) => handleProblemChange('bottom', e.target.value)}
                            style={{ padding: '10px', fontSize: '1.5rem', width: '100px', textAlign: 'center', borderRadius: '8px', border: '2px solid #ccc' }}
                        />
                    </div>
                </div>

                {/* PROBLEM AREA */}
                <div style={{ fontSize: '3rem', fontFamily: 'monospace', lineHeight: '1.2', textAlign: 'right', marginRight: '20px', position: 'relative' }}>
                    {/* TOP FACTOR */}
                    <div style={{ letterSpacing: '15px' }}>
                        {topStr.split('').map((d, i) => (
                            <span key={i} style={topNumberStyle}>{d}</span>
                        ))}
                    </div>

                    {/* BOTTOM FACTOR */}
                    <div style={{ letterSpacing: '15px' }}>
                        <span style={{ marginRight: '10px', color: '#2d3436' }}>×</span>
                        {bottomStr.split('').map((d, i) => {
                            const revIdx = bottomStr.length - 1 - i;
                            return (
                                <span key={i} style={{
                                    color: highlightedRow === revIdx ? '#e84393' : '#2d3436',
                                    fontWeight: highlightedRow === revIdx ? 'bold' : 'normal',
                                    transition: 'all 0.2s',
                                    textShadow: highlightedRow === revIdx ? '0px 0px 5px rgba(232,67,147,0.5)' : 'none'
                                }}>{d}</span>
                            );
                        })}
                    </div>
                    <div style={{ borderBottom: '4px solid #333', margin: '5px 0' }}></div>
                </div>

                {/* PARTIAL PRODUCTS INPUTS */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '10px', marginRight: '10px' }}>
                    {bottomDigits.map((digit, rowIdx) => (
                        <div
                            key={rowIdx}
                            style={{
                                display: 'flex', flexDirection: 'row-reverse', marginBottom: '5px',
                                background: highlightedRow === rowIdx ? 'rgba(232, 67, 147, 0.1)' : 'transparent',
                                borderRadius: '8px', padding: '5px',
                                border: highlightedRow === rowIdx ? '1px dashed #e84393' : '1px dashed transparent',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={() => setHighlightedRow(rowIdx)}
                            onMouseLeave={() => setHighlightedRow(null)}
                        >
                            {Array.from({ length: cols }).map((_, colIdx) => {
                                const pos = colIdx;
                                const val = userInputs[`row-${rowIdx}-pos-${pos}`] || '';
                                const isZeroPlaceholder = pos < rowIdx;

                                // Disable overly far inputs if we want, but let's just make them available up to 'cols'
                                const inputVisible = pos < (topStr.length + rowIdx + 1);

                                if (!inputVisible) return <div key={pos} style={{ width: '40px', margin: '0 2px' }}></div>;

                                return (
                                    <input
                                        key={pos}
                                        id={`row-${rowIdx}-pos-${pos}`}
                                        type="text"
                                        maxLength="1"
                                        value={val}
                                        readOnly={isZeroPlaceholder}
                                        onChange={(e) => handleInputChange(e, 'partial', rowIdx, pos)}
                                        onKeyUp={(e) => handleKeyUp(e, 'partial', rowIdx, pos)}
                                        placeholder={isZeroPlaceholder ? '0' : ''}
                                        style={{
                                            width: '40px', height: '50px', fontSize: '1.5rem', textAlign: 'center',
                                            margin: '0 2px', borderRadius: '5px', border: highlightedRow === rowIdx && !isZeroPlaceholder ? '2px solid #e84393' : '1px solid #ccc',
                                            background: isZeroPlaceholder ? '#f1f2f6' : 'white',
                                            color: isZeroPlaceholder ? '#b2bec3' : '#333',
                                            outline: 'none', transition: 'border 0.2s'
                                        }}
                                        onFocus={(e) => e.target.style.boxShadow = '0 0 5px #0984e3'}
                                        onBlur={(e) => e.target.style.boxShadow = 'none'}
                                    />
                                );
                            })}
                            <span style={{ fontSize: '1rem', color: '#b2bec3', alignSelf: 'center', marginRight: '10px', width: '100px', textAlign: 'right', fontWeight: highlightedRow === rowIdx ? 'bold' : 'normal', transition: 'all 0.2s' }}>
                                {`(${digit} × ${topStr})`}
                            </span>
                        </div>
                    ))}

                    <div style={{ borderBottom: '4px solid #333', width: '100%', margin: '10px 0' }}></div>

                    {/* FINAL SUM ROW */}
                    <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                        {Array.from({ length: cols + 1 }).map((_, colIdx) => (
                            <input
                                key={colIdx}
                                id={`sum-pos-${colIdx}`}
                                type="text"
                                maxLength="1"
                                value={userInputs[`sum-pos-${colIdx}`] || ''}
                                onChange={(e) => handleInputChange(e, 'sum', 0, colIdx)}
                                onKeyUp={(e) => handleKeyUp(e, 'sum', 0, colIdx)}
                                style={{
                                    width: '40px', height: '50px', fontSize: '1.5rem', textAlign: 'center',
                                    margin: '0 2px', borderRadius: '5px', border: '2px solid #0984e3',
                                    background: '#dfe6e9', fontWeight: 'bold'
                                }}
                            />
                        ))}
                        <span style={{ fontSize: '2rem', alignSelf: 'center', marginRight: '10px' }}>+</span>
                    </div>

                </div>

                {uiStage === 'complete' && (
                    <div style={{ marginTop: '20px', padding: '10px', background: '#e8f5e9', borderRadius: '10px', border: '2px solid #4caf50' }}>
                        <h2 style={{ color: '#4caf50', margin: '0' }}>🌟 Great Job! Correct Answer: {parseInt(standardProblem.top || 0) * parseInt(standardProblem.bottom || 0)} 🌟</h2>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ color: '#2d3436' }}>✖️ Multiplication Station ✖️</h1>

            <div style={{ marginBottom: '30px' }}>
                <button onClick={() => setActiveTab('standard')} style={{ padding: '10px 20px', margin: '0 10px', borderRadius: '20px', border: 'none', background: activeTab === 'standard' ? '#e84393' : '#eee', color: activeTab === 'standard' ? 'white' : '#333', cursor: 'pointer', fontWeight: 'bold' }}>📝 Standard Algorithm</button>
                <button onClick={() => setActiveTab('groups')} style={{ padding: '10px 20px', margin: '0 10px', borderRadius: '20px', border: 'none', background: activeTab === 'groups' ? '#0984e3' : '#eee', color: activeTab === 'groups' ? 'white' : '#333', cursor: 'pointer', fontWeight: 'bold' }}>🔵 Visual Groups</button>
            </div>

            {activeTab === 'standard' && (
                <div>
                    <p style={{ color: '#636e72', fontSize: '1.2rem', marginBottom: '20px' }}>Hover over the rows to see factors! Type answers right-to-left.</p>
                    {renderStandardGrid()}
                    <div style={{ marginTop: '20px' }}>
                        <button onClick={checkAnswer} style={{ padding: '15px 30px', fontSize: '1.2rem', background: '#00b894', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', marginRight: '20px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>Check Answer</button>
                        <button onClick={() => setupProblemFields(standardProblem.top, standardProblem.bottom)} style={{ padding: '15px 30px', fontSize: '1.2rem', background: '#fdcb6e', color: '#2d3436', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>Clear</button>
                    </div>
                </div>
            )}

            {activeTab === 'groups' && (
                <div>
                    <h2 style={{ color: '#2d3436' }}>Groups of Objects</h2>
                    <div style={{ fontSize: '2rem', marginBottom: '20px' }}>
                        <input
                            type="number" min="1" max="9" value={groupsProblem.a}
                            onChange={(e) => setGroupsProblem({ ...groupsProblem, a: parseInt(e.target.value) || 1 })}
                            style={{ width: '60px', padding: '5px', fontSize: '1.5rem', textAlign: 'center', borderRadius: '8px', border: '2px solid #ccc' }}
                        />
                        {' '} Groups of {' '}
                        <input
                            type="number" min="1" max="9" value={groupsProblem.b}
                            onChange={(e) => setGroupsProblem({ ...groupsProblem, b: parseInt(e.target.value) || 1 })}
                            style={{ width: '60px', padding: '5px', fontSize: '1.5rem', textAlign: 'center', borderRadius: '8px', border: '2px solid #ccc' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px' }}>
                        {Array.from({ length: groupsProblem.a }).map((_, i) => (
                            <div key={i} style={{ padding: '20px', border: '3px dashed #b2bec3', borderRadius: '15px', background: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                                    {Array.from({ length: groupsProblem.b }).map((_, j) => (
                                        <div key={j} style={{ fontSize: '1.5rem' }}>🍪</div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <h2 style={{ marginTop: '30px', color: '#2d3436' }}>Total: {groupsProblem.a} × {groupsProblem.b} = <span style={{ color: '#0984e3' }}>{groupsProblem.a * groupsProblem.b}</span></h2>
                </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <button onClick={() => navigate('/home')} style={{ padding: '10px 30px', background: '#636e72', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold' }}>⬅ Back to Home</button>
            </div>
        </div>
    );
};

export default MultiplicationFeatures;
