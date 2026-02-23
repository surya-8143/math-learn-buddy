import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';

const SubtractionFeatures = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('fade'); // fade, backspace, transform, gap
    const [gallery, setGallery] = useState([]); // Stores captured states

    // ==============================
    // 1. FADE AWAY STATE (Click to Fade)
    // ==============================
    const [fadeItems, setFadeItems] = useState([]);
    const [fadeTarget, setFadeTarget] = useState({ start: 5, remove: 2 });
    const [fadeSuccess, setFadeSuccess] = useState(false);

    useEffect(() => {
        if (activeTab === 'fade') startFadeGame();
    }, [activeTab]);

    const startFadeGame = () => {
        const start = Math.floor(Math.random() * 5) + 3; // 3-8
        const remove = Math.floor(Math.random() * (start - 1)) + 1;
        setFadeTarget({ start, remove });
        const items = Array.from({ length: start }, (_, i) => ({ id: i, faded: false }));
        setFadeItems(items);
        setFadeSuccess(false);
    };

    const toggleFade = (id) => {
        if (fadeSuccess) return;
        const newItems = fadeItems.map(item =>
            item.id === id ? { ...item, faded: !item.faded } : item
        );
        setFadeItems(newItems);

        const fadedCount = newItems.filter(i => i.faded).length;
        if (fadedCount === fadeTarget.remove) {
            setFadeSuccess(true);
            new Audio('https://codeskulptor-demos.commondatastorage.googleapis.com/pang/arrow.mp3').play().catch(e => console.log(e));
            setTimeout(startFadeGame, 2000); // Auto-reset
        }
    };

    // ==============================
    // 2. BACKSPACE STATE (Keystroke UX)
    // ==============================
    const [backspaceString, setBackspaceString] = useState("");
    const [backspaceTarget, setBackspaceTarget] = useState({ start: 6, remove: 3 });
    const [backspaceSuccess, setBackspaceSuccess] = useState(false);

    useEffect(() => {
        if (activeTab === 'backspace') startBackspaceGame();
    }, [activeTab]);

    const startBackspaceGame = () => {
        const start = Math.floor(Math.random() * 5) + 4; // 4-9
        const remove = Math.floor(Math.random() * 3) + 1; // 1-3
        setBackspaceTarget({ start, remove });
        setBackspaceString("🍎".repeat(start));
        setBackspaceSuccess(false);
    };

    const handleKeyDown = (e) => {
        if (activeTab !== 'backspace' || backspaceSuccess) return;

        if (e.key === 'Backspace') {
            e.preventDefault();
            const currentLen = [...backspaceString].length / 2; // Emoji is 2 chars usually, but spread helps count
            // Actually relying on string length for emojis can be tricky.
            // Let's use an array approach for simpler state logic if needed, but string slice works for simple repetition.

            // Simple approach: reduce string by one emoji unit
            const newStr = backspaceString.slice(0, -2);
            setBackspaceString(newStr);

            const remaining = newStr.length / 2;
            const expectedRemaining = backspaceTarget.start - backspaceTarget.remove;

            if (remaining === expectedRemaining) {
                setBackspaceSuccess(true);
                new Audio('https://codeskulptor-demos.commondatastorage.googleapis.com/pang/arrow.mp3').play().catch(e => console.log(e));
                setTimeout(startBackspaceGame, 2000);
            }
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeTab, backspaceString, backspaceSuccess]);


    // ==============================
    // 3. TRANSFORMATION (Before & After)
    // ==============================
    const transformRef = useRef(null);
    const [transItems, setTransItems] = useState([]);
    const [transTarget, setTransTarget] = useState({ start: 8, remove: 4 });
    const [capturedBefore, setCapturedBefore] = useState(null);
    const [capturedAfter, setCapturedAfter] = useState(null);
    const [transStage, setTransStage] = useState('setup'); // setup, action, done

    useEffect(() => {
        if (activeTab === 'transform') resetTransform();
    }, [activeTab]);

    const resetTransform = () => {
        const start = 8;
        const remove = 4;
        setTransTarget({ start, remove });
        setTransItems(Array.from({ length: start }, (_, i) => ({ id: i, state: 'basket' }))); // all in basket
        setCapturedBefore(null);
        setCapturedAfter(null);
        setTransStage('setup');
    };

    const captureBefore = async () => {
        if (transformRef.current) {
            const canvas = await html2canvas(transformRef.current);
            setCapturedBefore(canvas.toDataURL());
            setTransStage('action');
        }
    };

    const captureAfter = async () => {
        if (transformRef.current) {
            const canvas = await html2canvas(transformRef.current);
            setCapturedAfter(canvas.toDataURL());
            setTransStage('done');
            new Audio('https://codeskulptor-demos.commondatastorage.googleapis.com/pang/arrow.mp3').play().catch(e => console.log(e));
        }
    };

    // Transformation Drag Logic
    const handleTransDrag = (e, id) => e.dataTransfer.setData("id", id);
    const handleTransDropTrash = (e) => {
        const id = parseInt(e.dataTransfer.getData("id"));
        setTransItems(prev => prev.map(i => i.id === id ? { ...i, state: 'trash' } : i));
    };


    // ==============================
    // 4. GAP FILLER (Find Difference)
    // ==============================
    const [gapTarget, setGapTarget] = useState({ top: 7, bottom: 4 });
    const [gapBlocks, setGapBlocks] = useState([]); // Blocks placed in the gap
    const [gapSuccess, setGapSuccess] = useState(false);

    useEffect(() => {
        if (activeTab === 'gap') resetGapGame();
    }, [activeTab]);

    const resetGapGame = () => {
        const top = Math.floor(Math.random() * 4) + 4; // 4-8
        const bottom = top - (Math.floor(Math.random() * 3) + 1); // Ensure diff
        setGapTarget({ top, bottom });
        setGapBlocks([]);
        setGapSuccess(false);
    };

    const handleBlockDrag = (e) => e.dataTransfer.setData("type", "block");
    const handleGapDrop = (e) => {
        if (gapSuccess) return;
        const type = e.dataTransfer.getData("type");
        if (type === "block") {
            const newBlocks = [...gapBlocks, { id: Date.now() }];
            setGapBlocks(newBlocks);

            const diff = gapTarget.top - gapTarget.bottom;
            if (newBlocks.length === diff) {
                setGapSuccess(true);
                new Audio('https://codeskulptor-demos.commondatastorage.googleapis.com/pang/arrow.mp3').play().catch(e => console.log(e));
                setTimeout(resetGapGame, 2000);
            }
        }
    };

    return (
        <div className="subtraction-container" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1>➖ Subtraction Master ➖</h1>
            <p style={{ textAlign: 'center', marginBottom: '20px' }}>Choose your subtraction style!</p>

            <div className="tabs" style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
                <button onClick={() => setActiveTab('fade')} className={activeTab === 'fade' ? 'active-tab' : ''} style={tabStyle(activeTab === 'fade')}>👻 Fade Away</button>
                <button onClick={() => setActiveTab('backspace')} className={activeTab === 'backspace' ? 'active-tab' : ''} style={tabStyle(activeTab === 'backspace')}>⌨️ Backspace</button>
                <button onClick={() => setActiveTab('transform')} className={activeTab === 'transform' ? 'active-tab' : ''} style={tabStyle(activeTab === 'transform')}>📸 Transformation</button>
                <button onClick={() => setActiveTab('gap')} className={activeTab === 'gap' ? 'active-tab' : ''} style={tabStyle(activeTab === 'gap')}>🧩 Gap Filler</button>
                <button onClick={() => navigate('/learn/subtraction')} style={{ ...tabStyle(false), background: '#636e72', color: 'white' }}>📖 Learn Concepts</button>
            </div>

            <div className="feature-content" style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', minHeight: '400px' }}>

                {/* --- 1. FADE AWAY --- */}
                {activeTab === 'fade' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2>Click items to Make them Fade!</h2>
                        <p style={{ fontSize: '1.5rem', margin: '20px' }}>
                            {fadeTarget.start} - <span style={{ color: '#b2bec3' }}>{fadeItems.filter(i => i.faded).length}</span> = ?
                        </p>
                        <p>Fade <strong>{fadeTarget.remove}</strong> items.</p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '30px' }}>
                            {fadeItems.map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => toggleFade(item.id)}
                                    style={{
                                        fontSize: '4rem', cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        opacity: item.faded ? 0.2 : 1,
                                        filter: item.faded ? 'grayscale(100%)' : 'none',
                                        transform: item.faded ? 'scale(0.9)' : 'scale(1.1)'
                                    }}
                                >
                                    🎁
                                </div>
                            ))}
                        </div>
                        {fadeSuccess && <h2 style={{ color: '#00b894', marginTop: '20px', animation: 'popIn 0.5s' }}>Success! {fadeTarget.start - fadeTarget.remove} Left!</h2>}
                    </div>
                )}

                {/* --- 2. BACKSPACE --- */}
                {activeTab === 'backspace' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2>Use your Keyboard! ⌨️</h2>
                        <p style={{ fontSize: '1.2rem' }}>Problem: <strong>{backspaceTarget.start} - {backspaceTarget.remove}</strong></p>
                        <p>Press <strong>BACKSPACE</strong> {backspaceTarget.remove} times to eat the apples!</p>

                        <div style={{
                            fontSize: '3rem', padding: '20px', border: '3px solid #333',
                            borderRadius: '10px', display: 'inline-block', minWidth: '300px',
                            marginTop: '20px', background: '#fafafa'
                        }}>
                            {backspaceString}
                        </div>

                        {backspaceSuccess && (
                            <div style={{ marginTop: '20px', animation: 'popIn 0.5s' }}>
                                <h3 style={{ color: '#00b894' }}>Tasty! 🍎</h3>
                                <p>Loading next problem...</p>
                            </div>
                        )}
                        <p style={{ marginTop: '30px', color: '#888', fontStyle: 'italic' }}>(Click here if keys aren't working)</p>
                    </div>
                )}

                {/* --- 3. TRANSFORMATION GALLERY --- */}
                {activeTab === 'transform' && (
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 2 }}>
                            <h2>Transformation Lab</h2>
                            <p>State: <strong>{transStage === 'setup' ? 'Drag nothing yet. Capture Initial State!' : transStage === 'action' ? `Now Move ${transTarget.remove} items to Trash!` : 'Complete!'}</strong></p>

                            <div ref={transformRef} style={{ border: '3px dashed #ccc', padding: '20px', borderRadius: '15px', background: '#f8f9fa' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <div style={{ background: '#ffeaa7', padding: '10px', borderRadius: '10px', flex: 1, marginRight: '10px' }}>
                                        <h4>Start ({transTarget.start})</h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {transItems.filter(i => i.state === 'basket').map(i => (
                                                <div key={i.id} draggable onDragStart={(e) => handleTransDrag(e, i.id)} style={{ fontSize: '2.5rem', cursor: 'grab' }}>💎</div>
                                            ))}
                                        </div>
                                    </div>
                                    <div
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={handleTransDropTrash}
                                        style={{ background: '#b2bec3', padding: '10px', borderRadius: '10px', flex: 1 }}
                                    >
                                        <h4>Discard Bin</h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', opacity: 0.5 }}>
                                            {transItems.filter(i => i.state === 'trash').map(i => (
                                                <div key={i.id} style={{ fontSize: '2.5rem' }}>💎</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                                <button onClick={captureBefore} disabled={transStage !== 'setup'} style={btnStyle(transStage === 'setup')}>1. Capture Before</button>
                                <button onClick={captureAfter} disabled={transStage !== 'action'} style={btnStyle(transStage === 'action')}>2. Capture After</button>
                                <button onClick={resetTransform} style={{ ...btnStyle(true), background: '#636e72' }}>Reset</button>
                            </div>
                        </div>

                        <div style={{ flex: 1, borderLeft: '2px solid #eee', paddingLeft: '20px' }}>
                            <h3>Transformation Gallery</h3>
                            {capturedBefore && (
                                <div style={{ marginBottom: '20px' }}>
                                    <p><strong>Before:</strong></p>
                                    <img src={capturedBefore} style={{ width: '100%', borderRadius: '10px', border: '2px solid #ddd' }} alt="Before" />
                                </div>
                            )}
                            {capturedAfter && (
                                <div>
                                    <p><strong>After ({transTarget.start} - {transItems.filter(i => i.state === 'trash').length}):</strong></p>
                                    <img src={capturedAfter} style={{ width: '100%', borderRadius: '10px', border: '2px solid #00b894' }} alt="After" />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- 4. GAP FILLER (LEGO BRIDGE THEME) --- */}
                {activeTab === 'gap' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#2d3436', marginBottom: '10px' }}>🚧 Bridge Builder 🚧</h2>
                        <p style={{ fontSize: '1.2rem', color: '#636e72', marginBottom: '30px' }}>
                            The bridge is broken! Drag blocks to fill the gap so the car can cross.
                            <br />
                            <strong>{gapTarget.top} (Goal) - {gapTarget.bottom} (Built) = <span style={{ color: '#e17055' }}>? (Needed)</span></strong>
                        </p>

                        <div style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0',
                            background: '#f1f2f6', padding: '40px', borderRadius: '30px', border: '4px solid #dfe6e9'
                        }}>

                            {/* GOAL HEIGHT (Transparent Outline) */}
                            <div style={{ display: 'flex', marginBottom: '5px', opacity: 0.3 }}>
                                <span style={{ marginRight: '10px', alignSelf: 'center', fontWeight: 'bold' }}>Goal:</span>
                                {Array(gapTarget.top).fill(0).map((_, i) => (
                                    <div key={i} style={legoBlockStyle('#b2bec3')}></div>
                                ))}
                            </div>

                            {/* THE BRIDGE */}
                            <div style={{ display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
                                {/* Car Waiting */}
                                <div style={{
                                    fontSize: '3rem', position: 'absolute', top: '-60px', left: '0',
                                    transition: 'left 2s ease-in-out',
                                    left: gapSuccess ? `calc(100% - 60px)` : '0'
                                }}>
                                    🏎️
                                </div>

                                {/* Existing Road */}
                                <div style={{ display: 'flex' }}>
                                    {Array(gapTarget.bottom).fill(0).map((_, i) => (
                                        <div key={i} style={legoBlockStyle('#0984e3')}></div>
                                    ))}
                                </div>

                                {/* The GAP Drop Zone */}
                                <div
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleGapDrop}
                                    style={{
                                        display: 'flex',
                                        background: 'rgba(0,0,0,0.05)',
                                        border: '3px dashed #b2bec3',
                                        borderRadius: '10px',
                                        minWidth: `${(gapTarget.top - gapTarget.bottom) * 54}px`, // 50px + 4px margin
                                        height: '60px',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        paddingLeft: '2px'
                                    }}
                                >
                                    {gapBlocks.map(b => (
                                        <div key={b.id} style={legoBlockStyle('#e17055')}></div>
                                    ))}
                                    {gapBlocks.length === 0 && <span style={{ fontSize: '0.8rem', color: '#b2bec3', width: '100%', textAlign: 'center' }}>Drop Here</span>}
                                </div>
                            </div>
                        </div>

                        {/* Draggable Source */}
                        <div style={{ marginTop: '30px', padding: '20px', background: '#ffeaa7', borderRadius: '20px', display: 'inline-block' }}>
                            <p style={{ fontWeight: 'bold', color: '#d63031', marginBottom: '10px' }}>🧱 Construction Zone</p>
                            <div
                                draggable
                                onDragStart={handleBlockDrag}
                                style={{ ...legoBlockStyle('#e17055'), cursor: 'grab', margin: '0 auto' }}
                            ></div>
                            <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>Drag Me!</p>
                        </div>

                        {gapSuccess && (
                            <div style={{ marginTop: '30px', animation: 'popIn 0.5s' }}>
                                <h2 style={{ color: '#00b894' }}>Bridge Repaired! 🎉</h2>
                                <p style={{ fontSize: '1.5rem' }}>Difference found: <strong>{gapTarget.top - gapTarget.bottom}</strong></p>
                            </div>
                        )}
                    </div>
                )}

            </div>

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <button onClick={() => navigate('/home')} style={{ padding: '10px 30px', background: '#636e72', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer' }}>⬅ Back to Home</button>
            </div>
        </div>
    );
};

// Styling Helpers
const tabStyle = (active) => ({
    padding: '10px 20px',
    fontSize: '1rem',
    borderRadius: '20px',
    border: 'none',
    background: active ? '#6c5ce7' : '#eee',
    color: active ? 'white' : '#333',
    cursor: 'pointer',
    transition: 'all 0.2s'
});

const btnStyle = (enabled) => ({
    padding: '10px 20px',
    background: enabled ? '#0984e3' : '#b2bec3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: enabled ? 'pointer' : 'not-allowed'
});

const legoBlockStyle = (color) => ({
    width: '50px',
    height: '50px',
    background: color,
    border: '2px solid rgba(0,0,0,0.1)',
    borderRadius: '8px',
    margin: '2px',
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1), 0 4px 0 rgba(0,0,0,0.2)',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
});



export default SubtractionFeatures;
