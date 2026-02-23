import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScreenshot } from 'use-react-screenshot';

const FractionFeatures = () => {
    const navigate = useNavigate();
    const captureRef = useRef(null);
    const [image, takeScreenshot] = useScreenshot();

    // ==============================
    // 1. FRACTION STATE
    // ==============================
    const [fractions, setFractions] = useState([
        { num: '3', den: '4' },
        { num: '1', den: '2' }
    ]);
    const [operation, setOperation] = useState('+');
    const [hoveredFractionIdx, setHoveredFractionIdx] = useState(null);

    // ==============================
    // 2. INPUT RESTRICTION (String Events)
    // ==============================
    const handleInputChange = (idx, field, val) => {
        // Strict Validation: Only accept numbers
        if (!/^\d*$/.test(val)) return;

        // Prevent zero in denominator natively (we allow '0' while typing but highlight error later or block)
        // Let's block '0' as the very first char in denominator to explicitly prevent it
        if (field === 'den' && val === '0') return;

        setFractions(prev => {
            const newF = [...prev];
            newF[idx] = { ...newF[idx], [field]: val };
            return newF;
        });
    };

    // ==============================
    // 3. KEYSTROKE UX (Vertical Stack Navigation)
    // ==============================
    const handleKeyDown = (e, idx, field) => {
        if (e.key === 'ArrowDown' && field === 'num') {
            e.preventDefault();
            const denEl = document.getElementById(`frac-${idx}-den`);
            if (denEl) denEl.focus();
        } else if (e.key === 'ArrowUp' && field === 'den') {
            e.preventDefault();
            const numEl = document.getElementById(`frac-${idx}-num`);
            if (numEl) numEl.focus();
        } else if (e.key === 'ArrowRight' && idx + 1 < fractions.length) {
            e.preventDefault();
            // Jump to the next fraction's numerator
            const nextEl = document.getElementById(`frac-${idx + 1}-num`);
            if (nextEl) nextEl.focus();
        } else if (e.key === 'ArrowLeft' && idx - 1 >= 0) {
            e.preventDefault();
            // Jump to the previous fraction's denominator (or numerator)
            const prevEl = document.getElementById(`frac-${idx - 1}-num`);
            if (prevEl) prevEl.focus();
        }
    };

    // ==============================
    // 4. SCREEN CAPTURE EXPORT
    // ==============================
    const exportFraction = () => {
        if (captureRef.current) {
            takeScreenshot(captureRef.current).then(downloadImage);
        }
    };

    const downloadImage = (base64Image) => {
        if (!base64Image) return;
        const link = document.createElement('a');
        link.download = `fraction-visual.png`;
        link.href = base64Image;
        link.click();
    };

    // Helper: Calculate Common Denominator (Visual Only)
    const getResult = () => {
        const n1 = parseInt(fractions[0].num) || 0;
        const d1 = parseInt(fractions[0].den) || 1;
        const n2 = parseInt(fractions[1].num) || 0;
        const d2 = parseInt(fractions[1].den) || 1;

        if (operation === '+') {
            return { num: (n1 * d2) + (n2 * d1), den: (d1 * d2) };
        } else if (operation === '-') {
            return { num: (n1 * d2) - (n2 * d1), den: (d1 * d2) };
        } else if (operation === '×') {
            return { num: n1 * n2, den: d1 * d2 };
        } else {
            return { num: n1 * d2, den: d1 * n2 };
        }
    };

    const res = getResult();

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center', background: '#1e272e', minHeight: '100vh', color: '#ecf0f1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ color: '#0fb9b1', fontWeight: 'bold', fontSize: '2.5rem', marginBottom: '10px' }}>🍰 Fraction Lab 🍰</h1>
            <p style={{ color: '#808e9b', fontSize: '1.2rem', marginBottom: '50px' }}>
                Use <strong>Arrow Keys (↑ ↓ →)</strong> to smoothly navigate. Hover over fractions to see the slices!
            </p>

            <div ref={captureRef} style={{ background: '#2d3436', padding: '60px 40px', borderRadius: '25px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', display: 'inline-flex', alignItems: 'center', gap: '30px' }}>

                {/* DYNAMIC FRACTION BUILDER */}
                {fractions.map((frac, i) => (
                    <React.Fragment key={i}>

                        <div
                            onMouseEnter={() => setHoveredFractionIdx(i)}
                            onMouseLeave={() => setHoveredFractionIdx(null)}
                            style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                                background: hoveredFractionIdx === i ? '#353b48' : 'transparent',
                                padding: '15px', borderRadius: '15px', transition: 'all 0.3s'
                            }}
                        >
                            {/* NUMERATOR */}
                            <input
                                id={`frac-${i}-num`}
                                type="text"
                                maxLength="2"
                                value={frac.num}
                                onChange={(e) => handleInputChange(i, 'num', e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, i, 'num')}
                                style={{
                                    width: '60px', height: '60px', fontSize: '2rem', textAlign: 'center', fontWeight: 'bold',
                                    background: '#2f3542', color: '#ff7f50',
                                    border: '2px solid transparent', borderRadius: '10px', outline: 'none',
                                    transition: 'all 0.2s'
                                }}
                                onFocus={(e) => { e.target.style.borderColor = '#ff7f50'; e.target.style.background = '#1e272e'; }}
                                onBlur={(e) => { e.target.style.borderColor = 'transparent'; e.target.style.background = '#2f3542'; }}
                            />

                            {/* DIVIDER BAR */}
                            <div style={{ width: '80px', height: '4px', background: '#747d8c', borderRadius: '2px' }}></div>

                            {/* DENOMINATOR */}
                            <input
                                id={`frac-${i}-den`}
                                type="text"
                                maxLength="2"
                                value={frac.den}
                                onChange={(e) => handleInputChange(i, 'den', e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, i, 'den')}
                                style={{
                                    width: '60px', height: '60px', fontSize: '2rem', textAlign: 'center', fontWeight: 'bold',
                                    background: '#2f3542', color: '#9b59b6', // Neon Purple Accent
                                    border: '2px solid transparent', borderRadius: '10px', outline: 'none',
                                    transition: 'all 0.2s'
                                }}
                                onFocus={(e) => { e.target.style.borderColor = '#9b59b6'; e.target.style.background = '#1e272e'; }}
                                onBlur={(e) => { e.target.style.borderColor = 'transparent'; e.target.style.background = '#2f3542'; }}
                            />

                            {/* 4. MOUSE UX (DYNAMIC FILL BAR) */}
                            {/* Only renders completely valid segments strictly under 20 visually for spacing */}
                            <div style={{ display: 'flex', gap: '2px', marginTop: '15px', height: '15px', width: '100%', maxWidth: '100px', opacity: hoveredFractionIdx === i ? 1 : 0.2, transition: 'opacity 0.3s' }}>
                                {Array.from({ length: Math.min(parseInt(frac.den) || 1, 25) }).map((_, segmentIdx) => (
                                    <div key={segmentIdx} style={{
                                        flex: 1, height: '100%',
                                        background: segmentIdx < (parseInt(frac.num) || 0) ? '#ff7f50' : '#4b4b4b',
                                        borderRadius: '2px', transition: 'background 0.3s'
                                    }}></div>
                                ))}
                            </div>
                        </div>

                        {/* OPERATOR */}
                        {i === 0 && (
                            <select
                                value={operation}
                                onChange={(e) => setOperation(e.target.value)}
                                style={{
                                    fontSize: '3rem', background: 'transparent', color: '#0fb9b1', fontWeight: 'bold',
                                    border: 'none', appearance: 'none', outline: 'none', cursor: 'pointer', textAlign: 'center'
                                }}
                            >
                                <option value="+" style={{ background: '#2d3436' }}>+</option>
                                <option value="-" style={{ background: '#2d3436' }}>-</option>
                                <option value="×" style={{ background: '#2d3436' }}>×</option>
                                <option value="÷" style={{ background: '#2d3436' }}>÷</option>
                            </select>
                        )}
                    </React.Fragment>
                ))}

                <span style={{ fontSize: '3rem', color: '#747d8c', margin: '0 10px' }}>=</span>

                {/* RESULT BLOCK */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '15px', background: '#353b48', borderRadius: '15px' }}>
                    <span style={{ fontSize: '2.5rem', color: '#0fb9b1', fontWeight: 'bold' }}>{res.num}</span>
                    <div style={{ width: '80px', height: '4px', background: '#0fb9b1', borderRadius: '2px' }}></div>
                    <span style={{ fontSize: '2.5rem', color: '#0fb9b1', fontWeight: 'bold' }}>{res.den}</span>

                    {/* Visual Result Bar */}
                    <div style={{ display: 'flex', gap: '2px', marginTop: '10px', height: '15px', width: '100%', maxWidth: '120px' }}>
                        {Array.from({ length: Math.min(res.den, 30) }).map((_, segmentIdx) => (
                            <div key={segmentIdx} style={{
                                flex: 1, height: '100%',
                                background: segmentIdx < res.num ? '#0fb9b1' : '#4b4b4b',
                                borderRadius: '2px'
                            }}></div>
                        ))}
                    </div>
                </div>

            </div>

            {/* CONTROLS */}
            <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <button onClick={() => navigate('/learn/fractions')} style={{ padding: '15px 30px', background: '#9b59b6', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 5px 15px rgba(155, 89, 182, 0.3)', transition: 'transform 0.2s' }} onMouseOver={e => e.target.style.transform = 'scale(1.05)'} onMouseOut={e => e.target.style.transform = 'scale(1)'} >
                    📖 Read the Formula
                </button>
                <button onClick={exportFraction} style={{ padding: '15px 30px', fontSize: '1.2rem', background: '#ff7f50', color: '#1e272e', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 5px 15px rgba(255, 127, 80, 0.3)', transition: 'transform 0.2s' }} onMouseOver={e => e.target.style.transform = 'scale(1.05)'} onMouseOut={e => e.target.style.transform = 'scale(1)'}>
                    📸 Save Fraction
                </button>
                <button onClick={() => navigate('/home')} style={{ padding: '15px 30px', background: '#576574', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    ⬅ Back to Home
                </button>
            </div>

        </div>
    );
};

export default FractionFeatures;
