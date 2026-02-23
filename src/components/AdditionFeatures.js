import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';

const AdditionFeatures = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('snapshot'); // snapshot, spacebar, hidden, numberline
    const [gallery, setGallery] = useState([]);
    const sandboxRef = useRef(null);

    // --- 1. SNAPSHOT SANDBOX STATE ---
    const [apples, setApples] = useState([]);
    const [basket, setBasket] = useState([]);
    const [isDropping, setIsDropping] = useState(false);

    const [targets, setTargets] = useState({ red: 3, green: 2 });
    const [message, setMessage] = useState("Drag 3 Red and 2 Green apples into the basket!");
    const [showSuccess, setShowSuccess] = useState(false);


    // --- 2. SPACEBAR STATE ---
    const [spaceCount, setSpaceCount] = useState(0);
    const [spaceTarget, setSpaceTarget] = useState({ n1: 2, n2: 3, sum: 5 });
    const [blocks, setBlocks] = useState([]);
    const [spaceSuccess, setSpaceSuccess] = useState(false);

    // --- 3. HIDDEN PICTURE STATE ---
    const [hiddenInput, setHiddenInput] = useState("");
    const [isRevealed, setIsRevealed] = useState(false);

    // --- 4. NUMBER LINE STATE ---
    const [hoverNum, setHoverNum] = useState(null);

    // ==============================
    // 1. SNAPSHOT LOGIC
    // ==============================
    const addApple = (color) => {
        const id = Date.now() + Math.random();
        setApples([...apples, { id, color, x: 0, y: 0 }]);
    };

    const handleDragStart = (e, id) => {
        e.dataTransfer.setData("id", id);
    };

    const handleDrop = (e) => {
        const id = parseFloat(e.dataTransfer.getData("id"));
        const apple = apples.find(a => a.id === id);
        if (apple) {
            setBasket([...basket, apple]);
            setApples(apples.filter(a => a.id !== id));
            setIsDropping(true);
            setTimeout(() => setIsDropping(false), 500);
        }
    };

    const checkAndSnap = async () => {
        const redCount = basket.filter(a => a.color === 'red').length;
        const greenCount = basket.filter(a => a.color === 'green').length;

        if (redCount === targets.red && greenCount === targets.green) {
            setShowSuccess(true);
            if (sandboxRef.current) {
                const canvas = await html2canvas(sandboxRef.current);
                const imgData = canvas.toDataURL("image/png");
                setGallery([...gallery, imgData]);
            }
        } else {
            alert(`Oops! You have ${redCount} Red and ${greenCount} Green apples. We need ${targets.red} Red and ${targets.green} Green!`);
        }
    };

    const startNewChallenge = () => {
        const newRed = Math.floor(Math.random() * 5) + 1;
        const newGreen = Math.floor(Math.random() * 5) + 1;
        setTargets({ red: newRed, green: newGreen });
        setBasket([]);
        setApples([]);
        setShowSuccess(false);
        setMessage(`Drag ${newRed} Red and ${newGreen} Green apples into the basket!`);

        // Scroll to the challenge area
        setTimeout(() => {
            const element = document.getElementById('snapshot-area');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    };


    // ==============================
    // 2. SPACEBAR LOGIC
    // ==============================

    const startSpaceChallenge = () => {
        const n1 = Math.floor(Math.random() * 5) + 1;
        const n2 = Math.floor(Math.random() * 5) + 1;
        setSpaceTarget({ n1, n2, sum: n1 + n2 });
        setSpaceCount(0);
        setBlocks([]);
        setSpaceSuccess(false);
    };

    useEffect(() => {
        if (activeTab === 'spacebar' && !spaceSuccess) {
            const handleKeyDown = (e) => {
                if (e.code === 'Space') {
                    e.preventDefault();
                    if (spaceCount < spaceTarget.sum) {
                        const newCount = spaceCount + 1;
                        setSpaceCount(newCount);
                        setBlocks(prev => [...prev, { id: Date.now(), left: Math.random() * 80 + 10 }]);

                        // Play sound
                        const audio = new Audio('https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3');
                        audio.play().catch(e => console.log("Audio play failed", e));

                        // CHECK COMPLETION
                        if (newCount === spaceTarget.sum) {
                            setSpaceSuccess(true);
                            const successAudio = new Audio('https://codeskulptor-demos.commondatastorage.googleapis.com/pang/arrow.mp3');
                            successAudio.play().catch(e => console.log("Audio play failed", e));

                            // Auto-reset after 2 seconds
                            setTimeout(() => {
                                startSpaceChallenge();
                            }, 2000);
                        }
                    }
                }
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [activeTab, spaceCount, spaceTarget, spaceSuccess]);

    // ==============================
    // 3. HIDDEN PICTURE LOGIC
    // ==============================
    const checkHiddenAnswer = () => {
        const val = hiddenInput.toLowerCase().trim();
        // Problem: 5 + 2 = 7
        if (val === '7' || val === 'seven' || val === '*******') {
            setIsRevealed(true);
        } else {
            alert("Try again!");
        }
    };

    // ==============================
    // 4. NUMBER LINE LOGIC
    // ==============================
    const [numberLineTarget, setNumberLineTarget] = useState({ start: 4, add: 3, sum: 7 });
    const [numLineSuccess, setNumLineSuccess] = useState(false);

    const startNumberLineChallenge = () => {
        const start = Math.floor(Math.random() * 6); // 0-5
        const add = Math.floor(Math.random() * 4) + 1; // 1-4
        setNumberLineTarget({ start, add, sum: start + add });
        setNumLineSuccess(false);
    };

    const checkNumberLineAnswer = (n) => {
        if (n === numberLineTarget.sum) {
            setNumLineSuccess(true);
            const audio = new Audio('https://codeskulptor-demos.commondatastorage.googleapis.com/pang/arrow.mp3');
            audio.play().catch(e => console.log(e));
            setTimeout(() => {
                startNumberLineChallenge();
            }, 2000);
        }
    };

    return (
        <div className="addition-features-container" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1>✨ Interactive Addition Lab ✨</h1>

            <div className="tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
                <button onClick={() => setActiveTab('snapshot')} className={activeTab === 'snapshot' ? 'active-tab' : ''}>📸 Snapshot</button>
                <button onClick={() => setActiveTab('spacebar')} className={activeTab === 'spacebar' ? 'active-tab' : ''}>🎹 Rhythm Count</button>
                <button onClick={() => setActiveTab('hidden')} className={activeTab === 'hidden' ? 'active-tab' : ''}>🕵️ Hidden Pic</button>
                <button onClick={() => setActiveTab('numberline')} className={activeTab === 'numberline' ? 'active-tab' : ''}>📏 Number Line</button>
            </div>

            <div className="feature-content" style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>

                {/* --- SNAPSHOT TAB --- */}
                {activeTab === 'snapshot' && (
                    <div className="snapshot-mode" id="snapshot-area">

                        {/* FLEX CONTAINER FOR SIDE-BY-SIDE LAYOUT */}
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

                            {/* LEFT COLUMN: WORK AREA */}
                            <div style={{ flex: 2 }}>
                                <h2>Show Your Work!</h2>

                                {/* QUESTION DISPLAY */}
                                <div style={{
                                    background: '#e17055', color: 'white', padding: '15px',
                                    borderRadius: '15px', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 'bold'
                                }}>
                                    {message}
                                </div>

                                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
                                    <button className="action-btn red-btn" onClick={() => addApple('red')}>🍎 Add Red</button>
                                    <button className="action-btn green-btn" onClick={() => addApple('green')}>🍏 Add Green</button>
                                </div>

                                <div
                                    ref={sandboxRef}
                                    style={{
                                        border: '3px dashed #ccc', minHeight: '300px', position: 'relative',
                                        background: '#fcfcfc', borderRadius: '15px', padding: '20px'
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', minHeight: '50px' }}>
                                        {apples.map(app => (
                                            <div
                                                key={app.id} draggable
                                                onDragStart={(e) => handleDragStart(e, app.id)}
                                                style={{ fontSize: '3rem', cursor: 'grab' }}
                                            >
                                                {app.color === 'red' ? '🍎' : '🍏'}
                                            </div>
                                        ))}
                                    </div>

                                    <div
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={handleDrop}
                                        className={`basket-container ${isDropping ? 'basket-shake' : ''}`}
                                    >
                                        <div className="basket-label">BASKET</div>
                                        <div className="basket-contents">
                                            {basket.map(app => (
                                                <span key={app.id} className="basket-item">{app.color === 'red' ? '🍎' : '🍏'}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={checkAndSnap}
                                    className="snap-btn"
                                    style={{ marginTop: '20px' }}
                                >
                                    📷 Check & Save
                                </button>
                            </div>

                            {/* RIGHT COLUMN: STICKER BOOK */}
                            {/* Always show this column to maintain layout, or show placeholder */}
                            <div style={{ flex: 1, borderLeft: '2px solid #eee', paddingLeft: '20px', minHeight: '400px' }}>
                                <h3>📔 My Sticker Book</h3>
                                {gallery.length === 0 ? (
                                    <p style={{ color: '#888', fontStyle: 'italic' }}>Your saved work will appear here!</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '500px', overflowY: 'auto' }}>
                                        {gallery.map((img, i) => (
                                            <div key={i} style={{ border: '5px solid white', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                                                <img src={img} alt={`Work ${i + 1}`} style={{ width: '100%', display: 'block' }} />
                                                <div style={{ padding: '5px', background: '#f9f9f9', fontSize: '0.8rem', textAlign: 'center' }}>Snapshot #{i + 1}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>

                        {showSuccess && (
                            <div style={{
                                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                                background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                                zIndex: 1000
                            }}>
                                <div style={{
                                    background: 'white', padding: '40px', borderRadius: '30px', textAlign: 'center',
                                    border: '10px solid #6c5ce7', animation: 'popIn 0.5s', maxWidth: '500px'
                                }}>
                                    <h1 style={{ fontSize: '4rem', margin: 0 }}>🎉</h1>
                                    <h2 style={{ color: '#2d3436', fontSize: '2.5rem' }}>Correct!</h2>
                                    <p style={{ fontSize: '1.5rem', color: '#636e72' }}>You counted correctly!</p>
                                    <img src={gallery[gallery.length - 1]} alt="Success" style={{ width: '200px', borderRadius: '15px', margin: '20px 0', border: '5px solid #dfe6e9' }} />
                                    <br />
                                    <button
                                        onClick={startNewChallenge}
                                        style={{
                                            padding: '15px 30px', fontSize: '1.2rem', background: '#00b894', color: 'white',
                                            border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold'
                                        }}
                                    >
                                        Start New Challenge
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- SPACEBAR TAB --- */}
                {activeTab === 'spacebar' && (
                    <div className="spacebar-mode" style={{ textAlign: 'center' }}>
                        <h2>Use the SPACEBAR to add!</h2>

                        {spaceSuccess ? (
                            <div style={{ animation: 'popIn 0.5s' }}>
                                <h2 style={{ fontSize: '3rem', color: '#00b894' }}>Great Job! 🎉</h2>
                                <p>Loading next question...</p>
                            </div>
                        ) : (
                            <>
                                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
                                    {spaceTarget.n1} + {spaceTarget.n2} = <span style={{ color: '#0984e3' }}>{spaceCount}</span> / {spaceTarget.sum}
                                </div>
                                <p>Press SPACE {spaceTarget.sum - spaceCount} more times!</p>
                            </>
                        )}

                        <div style={{ height: '300px', borderBottom: '5px solid #333', position: 'relative', overflow: 'hidden' }}>
                            {blocks.map(b => (
                                <div
                                    key={b.id}
                                    style={{
                                        position: 'absolute', left: `${b.left}%`, bottom: '0',
                                        fontSize: '3rem', animation: 'fall 0.5s ease-out'
                                    }}
                                >
                                    🟦
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- HIDDEN PICTURE TAB --- */}
                {activeTab === 'hidden' && (
                    <div className="hidden-mode" style={{ textAlign: 'center' }}>
                        <h2>Hidden Picture Puzzle</h2>
                        <p>Solve: <strong>5 + 2 = ?</strong></p>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>(Try "7", "seven", or "*******")</p>

                        <div style={{ position: 'relative', width: '300px', height: '300px', margin: '20px auto', border: '5px solid #333' }}>
                            {/* The Hidden Image */}
                            <img
                                src="https://img.freepik.com/free-vector/pirate-ship-cartoon-style_1308-43899.jpg"
                                alt="Hidden"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />

                            {/* The Lock Overlay */}
                            {!isRevealed && (
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                    background: 'rgba(0,0,0,0.9)', color: 'white', display: 'flex',
                                    flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                                }}>
                                    <div style={{ fontSize: '3rem' }}>🔒</div>
                                    <input
                                        type="text"
                                        value={hiddenInput}
                                        onChange={(e) => setHiddenInput(e.target.value)}
                                        placeholder="Answer?"
                                        style={{ padding: '10px', fontSize: '1.2rem', marginTop: '10px', textAlign: 'center' }}
                                    />
                                    <button onClick={checkHiddenAnswer} style={{ marginTop: '10px', padding: '5px 15px' }}>Unlock</button>
                                </div>
                            )}
                        </div>
                        {isRevealed && <h3>🎉 Pirate Ship Revealed!</h3>}
                    </div>
                )}

                {/* --- NUMBER LINE TAB --- */}
                {activeTab === 'numberline' && (
                    <div className="numberline-mode">
                        <h2>Interactive Number Line</h2>

                        {numLineSuccess ? (
                            <div style={{ animation: 'popIn 0.5s', padding: '20px' }}>
                                <h2 style={{ fontSize: '3rem', color: '#00b894' }}>Correct! 🎉</h2>
                                <p>Next problem coming...</p>
                            </div>
                        ) : (
                            <>
                                <p>Problem: <strong>Start at <span style={{ color: '#e17055', fontSize: '1.5rem' }}>{numberLineTarget.start}</span>, Add <span style={{ color: '#0984e3', fontSize: '1.5rem' }}>{numberLineTarget.add}</span></strong></p>
                                <p style={{ fontStyle: 'italic', color: '#666' }}>Hover to see jumps. <strong>Click the answer!</strong></p>
                            </>
                        )}

                        <div style={{ marginTop: '100px', position: 'relative', padding: '0 20px' }}>
                            {/* SVG Arcs */}
                            <svg style={{ position: 'absolute', top: '-60px', left: '0', width: '100%', height: '60px', overflow: 'visible', pointerEvents: 'none' }}>
                                {hoverNum !== null && (
                                    <path
                                        d={`M ${numberLineTarget.start * 9 + 4.5}% 50 Q ${(numberLineTarget.start * 9 + 4.5) + ((hoverNum - numberLineTarget.start) * 4.5)}% -50 ${hoverNum * 9 + 4.5}% 50`}
                                        fill="none" stroke="#e17055" strokeWidth="4" strokeDasharray="5,5"
                                    />
                                )}
                            </svg>

                            {/* Numbers */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '4px solid #333', position: 'relative' }}>
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                    <div
                                        key={n}
                                        onMouseEnter={() => setHoverNum(n)}
                                        onMouseLeave={() => setHoverNum(null)}
                                        onClick={() => checkNumberLineAnswer(n)}
                                        style={{
                                            position: 'relative', cursor: 'pointer', textAlign: 'center', width: '40px',
                                            transition: 'transform 0.2s',
                                            transform: hoverNum === n ? 'scale(1.2)' : 'scale(1)'
                                        }}
                                    >
                                        <div style={{ width: '2px', height: '15px', background: '#333', margin: '0 auto' }}></div>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: n === numberLineTarget.start ? '#e17055' : 'inherit' }}>{n}</span>

                                        {/* Helper marker for Start */}
                                        {n === numberLineTarget.start && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '35px',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                fontSize: '0.7rem',
                                                color: '#e17055',
                                                fontWeight: 'bold',
                                                whiteSpace: 'nowrap'
                                            }}>START</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* MOVED BACK BUTTON TO BOTTOM CENTER */}
            <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '20px' }}>
                <button
                    className="nav-back-btn"
                    onClick={() => navigate('/home')}
                    style={{
                        padding: '12px 25px',
                        fontSize: '1.1rem',
                        background: '#636e72',
                        color: 'white',
                        border: 'none',
                        borderRadius: '30px',
                        cursor: 'pointer',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >
                    ⬅ Back to Home
                </button>
            </div>
        </div>
    );
};

export default AdditionFeatures;
