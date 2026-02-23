import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const LearningModule = () => {
  const { topic } = useParams();
  const navigate = useNavigate();

  // State to hold the current random numbers for Visual Topics
  const [currentQ, setCurrentQ] = useState({ n1: 2, n2: 2 });

  // ==========================================
  // 1. RANDOM GENERATOR (For Add, Sub, Mul, Div)
  // ==========================================
  const generateRandomExample = useCallback(() => {
    let n1, n2;

    switch (topic) {
      case 'addition':
        // Random numbers between 1 and 6
        n1 = Math.floor(Math.random() * 6) + 1;
        n2 = Math.floor(Math.random() * 6) + 1;
        break;

      case 'subtraction':
        // Total between 3 and 10. Removed is less than Total.
        n1 = Math.floor(Math.random() * 8) + 3;
        n2 = Math.floor(Math.random() * (n1 - 1)) + 1;
        break;

      case 'multiplication':
        // Groups (1-5), Items per group (1-5)
        n1 = Math.floor(Math.random() * 5) + 1;
        n2 = Math.floor(Math.random() * 5) + 1;
        break;

      case 'division':
        // Ensure perfect division
        n2 = Math.floor(Math.random() * 3) + 2; // Groups (2-4)
        const ans = Math.floor(Math.random() * 4) + 2; // Items per group
        n1 = n2 * ans; // Total
        break;

      default:
        n1 = 2; n2 = 2;
    }
    setCurrentQ({ n1, n2 });
  }, [topic]);

  // Generate numbers when topic changes
  useEffect(() => {
    if (["addition", "subtraction", "multiplication", "division"].includes(topic)) {
      generateRandomExample();
    }
  }, [topic, generateRandomExample]);

  // ==========================================
  // 2. CONFIG FOR VISUAL TOPICS
  // ==========================================
  const visualConfig = {
    addition: { title: "➕ Let's Add!", emoji: "🍎", color: "#ff7675" },
    subtraction: { title: "➖ Let's Subtract!", emoji: "🍕", color: "#fdcb6e" },
    multiplication: { title: "✖️ Multiplication", emoji: "🎈", color: "#0984e3" },
    division: { title: "➗ Division (Sharing)", emoji: "🍪", color: "#6c5ce7" }
  };

  // --- RENDER HELPERS (Visuals) ---
  const renderEmojis = (count, emoji) => {
    return Array(count).fill(emoji).map((e, i) => (
      <span key={i} style={{ fontSize: '2.5rem', margin: '0 2px', animation: 'popIn 0.5s' }}>{e}</span>
    ));
  };

  const renderSubtraction = (total, removed, emoji) => {
    return (
      <div style={{ display: 'flex', gap: '5px' }}>
        {Array(total).fill(emoji).map((e, i) => (
          <span key={i} style={{
            fontSize: '2.5rem',
            opacity: i >= (total - removed) ? 0.3 : 1,
            filter: i >= (total - removed) ? 'grayscale(100%)' : 'none',
            textDecoration: i >= (total - removed) ? 'line-through' : 'none'
          }}>
            {e}
          </span>
        ))}
      </div>
    );
  };

  const renderGroups = (groups, perGroup, emoji) => {
    return (
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {Array(groups).fill(0).map((_, i) => (
          <div key={i} style={{ border: '2px dashed #333', padding: '10px', borderRadius: '15px', background: 'white' }}>
            {Array(perGroup).fill(emoji).map((e, j) => (
              <span key={j} style={{ fontSize: '2rem' }}>{e}</span>
            ))}
          </div>
        ))}
      </div>
    );
  };

  // ==========================================
  // 3. STANDARD CONTENT (Fractions, Circles, Trigonometry)
  //    (These are kept exactly as you requested!)
  // ==========================================
  const standardContent = {
    fractions: {
      title: 'Fractions Addition',
      text: 'To add fractions with different denominators:',
      formula: 'a/b + c/d = (ad + bc) / bd',
      example: 'Example: 1/2 + 1/3 = (1*3 + 2*1) / (2*3) = 5/6'
    },

    circles: {
      title: 'Circle Formulas',
      text: 'Key properties of a circle:',
      formula: (
        <ul style={{ textAlign: 'left', listStyle: 'none', paddingLeft: '10px' }}>
          <li><strong>Area:</strong> A = πr²</li>
          <li><strong>Circumference:</strong> C = 2πr</li>
          <li><strong>Sector Area:</strong> (θ/360) × πr²</li>
          <li><strong>Arc Length:</strong> (θ/360) × 2πr</li>
        </ul>
      )
    },

    trigonometry: {
      title: 'Trigonometry Formulas',
      text: 'Standard Identities & Compound Angles:',
      formula: (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Left Side: Formulas */}
          <div style={{ flex: 1, minWidth: '300px', textAlign: 'left', fontSize: '0.9rem' }}>
            <p><strong>Basic Ratios:</strong></p>
            <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
              <li>Sin A = Opp / Hyp</li>
              <li>Cos A = Adj / Hyp</li>
              <li>Tan A = Sin A / Cos A</li>
            </ul>

            <hr style={{ margin: '10px 0' }} />

            <p><strong>✅ Cosine Identities:</strong></p>
            <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
              <li>cos(A + B) = cosA cosB − sinA sinB</li>
              <li>cos(A − B) = cosA cosB + sinA sinB</li>
            </ul>

            <p><strong>✅ Sine Identities:</strong></p>
            <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
              <li>sin(A + B) = sinA cosB + cosA sinB</li>
              <li>sin(A − B) = sinA cosB − cosA sinB</li>
            </ul>

            <p><strong>✅ Complementary Angles:</strong></p>
            <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
              <li>cos(90° − A) = sinA</li>
              <li>sin(90° − A) = cosA</li>
            </ul>
          </div>

          {/* Right Side: Your Image */}
          <div style={{ flex: 1, minWidth: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
              src="/trignometry.jpg"
              alt="Trigonometry Diagram"
              style={{
                maxWidth: '100%',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                border: '1px solid #ddd'
              }}
            />
          </div>
        </div>
      )
    }
  };

  // Determine Mode
  const isVisual = ["addition", "subtraction", "multiplication", "division"].includes(topic);
  const vConfig = visualConfig[topic];
  const standardData = standardContent[topic];

  return (
    <div className="learning-container">
      <div className="learning-card" style={{ maxWidth: '900px', textAlign: 'center' }}>

        {/* 🟢 VISUAL MODE (Random Interactive Emojis) */}
        {isVisual ? (
          <>
            <h1 style={{ color: vConfig.color }}>{vConfig.title}</h1>

            <div style={{
              background: '#f9f9f9', padding: '30px', borderRadius: '20px',
              margin: '20px 0', minHeight: '200px', display: 'flex',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>

              {/* ADDITION */}
              {topic === 'addition' && (
                <>
                  <h2>{currentQ.n1} Apples + {currentQ.n2} Apples</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <div>{renderEmojis(currentQ.n1, vConfig.emoji)}</div>
                    <div>+</div>
                    <div>{renderEmojis(currentQ.n2, vConfig.emoji)}</div>
                    <div>=</div>
                    <div><strong>{currentQ.n1 + currentQ.n2}</strong> {renderEmojis(currentQ.n1 + currentQ.n2, vConfig.emoji)}</div>
                  </div>
                  <button
                    onClick={() => navigate('/addition-interactive')}
                    style={{
                      marginTop: '20px', background: '#e17055', color: 'white',
                      padding: '10px 20px', borderRadius: '15px', border: 'none',
                      cursor: 'pointer', fontWeight: 'bold'
                    }}
                  >
                    ✨ Try Interactive Labs (Snapshot, Rhythm, & More) 🚀
                  </button>
                </>
              )}

              {/* SUBTRACTION */}
              {topic === 'subtraction' && (
                <>
                  <h2>{currentQ.n1} Slices - {currentQ.n2} Eaten</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {renderSubtraction(currentQ.n1, currentQ.n2, vConfig.emoji)}
                    <h3 style={{ marginTop: '15px' }}>{currentQ.n1} - {currentQ.n2} = <strong>{currentQ.n1 - currentQ.n2} Left!</strong></h3>
                  </div>
                </>
              )}

              {/* MULTIPLICATION */}
              {topic === 'multiplication' && (
                <>
                  <h2>{currentQ.n1} Groups of {currentQ.n2} Balloons</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {renderGroups(currentQ.n1, currentQ.n2, vConfig.emoji)}
                    <h3 style={{ marginTop: '15px' }}>{currentQ.n1} × {currentQ.n2} = <strong>{currentQ.n1 * currentQ.n2} Total</strong></h3>
                  </div>
                </>
              )}

              {/* DIVISION */}
              {topic === 'division' && (
                <>
                  <h2>{currentQ.n1} Cookies shared by {currentQ.n2} Kids</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>Total: {renderEmojis(currentQ.n1, vConfig.emoji)}</div>
                    <div style={{ borderTop: '2px solid #ccc', width: '100%', margin: '15px 0' }}></div>
                    <p>Shared into {currentQ.n2} groups:</p>
                    {renderGroups(currentQ.n2, currentQ.n1 / currentQ.n2, vConfig.emoji)}
                    <h3 style={{ marginTop: '15px' }}>Each gets <strong>{currentQ.n1 / currentQ.n2}</strong></h3>
                  </div>
                </>
              )}

            </div>

            <button
              className="start-quiz-btn"
              style={{ background: vConfig.color, fontSize: '1.2rem', padding: '15px 30px' }}
              onClick={generateRandomExample}
            >
              Next Example
            </button>
          </>
        ) : (
          /* 🟢 STANDARD MODE (Fractions, Circles, Trigonometry) */
          standardData ? (
            <>
              <h2>{standardData.title}</h2>
              <p>{standardData.text}</p>
              <div className="formula-box">
                {standardData.formula}
              </div>
              {standardData.example && <div className="example-box">{standardData.example}</div>}
            </>
          ) : (
            <h1>Topic Not Found</h1>
          )
        )}

        <br />
        <button className="back-btn" onClick={() => navigate('/home')}>
          ⬅ Back to Topics
        </button>
      </div>
    </div>
  );
};

export default LearningModule;