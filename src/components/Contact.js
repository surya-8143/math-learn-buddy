import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();

  // 1. STATE MANAGEMENT (Refactored to Hooks)
  const [formData, setFormData] = useState({ parentName: '', feedback: '' });
  const [submitted, setSubmitted] = useState(false);

  // Focus states for dynamic styling
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    // 2. FULL PAGE BACKGROUND (Deep Sleek Dark Theme)
    <div style={{
      minHeight: '100vh',
      background: '#0f172a', // Deep slate
      backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(15, 185, 177, 0.1), transparent 25%), radial-gradient(circle at 85% 30%, rgba(155, 89, 182, 0.1), transparent 25%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      fontFamily: "'Inter', 'Segoe UI', sans-serif"
    }}>

      {/* 3. GLASSMORPHISM CONTAINER */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.7)', // Dark semi-transparent
        backdropFilter: 'blur(20px)', // Premium glass blur
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.05)', // Very subtle white border
        borderRadius: '24px',
        padding: '50px 40px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)', // Strong drop shadow for depth
        color: '#f8fafc',
        textAlign: 'center',
        transition: 'all 0.5s ease'
      }}>

        {/* 6. SUCCESS STATE */}
        {submitted ? (
          <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '20px',
              animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s both'
            }}>
              ✨
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: '#0fb9b1' }}>
              Message Sent!
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '40px', lineHeight: '1.5' }}>
              Thank you, {formData.parentName}. Your feedback helps us make Math Buddy even better.
            </p>

            <button
              onClick={() => navigate('/home')}
              style={{
                padding: '15px 30px', background: '#0fb9b1', color: '#0f172a',
                border: 'none', borderRadius: '30px', fontSize: '1.1rem',
                fontWeight: 'bold', cursor: 'pointer',
                boxShadow: '0 10px 20px rgba(15, 185, 177, 0.2)',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 15px 25px rgba(15, 185, 177, 0.3)' }}
              onMouseOut={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 10px 20px rgba(15, 185, 177, 0.2)' }}
            >
              Return to Hub
            </button>
          </div>
        ) : (
          <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            {/* FORM HEADER */}
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📬</div>
            <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: '#f8fafc' }}>Get in Touch</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '40px' }}>
              Have ideas or issues? Drop us a note below.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* 4. MODERN INPUT: PARENT NAME */}
              <div style={{ position: 'relative', textAlign: 'left' }}>
                <input
                  type="text"
                  name="parentName"
                  placeholder="Your Name"
                  value={formData.parentName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  required
                  style={{
                    width: '100%', padding: '16px 20px',
                    background: 'rgba(15, 23, 42, 0.6)', // Darker inset
                    border: focusedField === 'name' ? '2px solid #0fb9b1' : '2px solid rgba(255,255,255,0.05)',
                    borderRadius: '12px', color: '#f8fafc', fontSize: '1rem',
                    outline: 'none', transition: 'all 0.3s ease',
                    boxShadow: focusedField === 'name' ? '0 0 15px rgba(15, 185, 177, 0.2)' : 'inset 0 2px 4px rgba(0,0,0,0.2)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* 4. MODERN INPUT: FEEDBACK */}
              <div style={{ position: 'relative', textAlign: 'left' }}>
                <textarea
                  name="feedback"
                  placeholder="Tell us what's on your mind..."
                  value={formData.feedback}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('feedback')}
                  onBlur={() => setFocusedField(null)}
                  required
                  style={{
                    width: '100%', padding: '16px 20px', minHeight: '140px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: focusedField === 'feedback' ? '2px solid #0fb9b1' : '2px solid rgba(255,255,255,0.05)',
                    borderRadius: '12px', color: '#f8fafc', fontSize: '1rem',
                    outline: 'none', transition: 'all 0.3s ease', resize: 'vertical',
                    boxShadow: focusedField === 'feedback' ? '0 0 15px rgba(15, 185, 177, 0.2)' : 'inset 0 2px 4px rgba(0,0,0,0.2)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* 5. GORGEOUS SUBMIT BUTTON */}
              <button
                type="submit"
                style={{
                  marginTop: '15px', padding: '16px', width: '100%',
                  background: '#0fb9b1', // Neon teal
                  color: '#0f172a', fontSize: '1.2rem', fontWeight: 'bold',
                  border: 'none', borderRadius: '12px', cursor: 'pointer',
                  boxShadow: '0 8px 15px rgba(15, 185, 177, 0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 12px 20px rgba(15, 185, 177, 0.3)' }}
                onMouseOut={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 15px rgba(15, 185, 177, 0.2)' }}
                onMouseDown={e => { e.target.style.transform = 'translateY(1px)'; e.target.style.boxShadow = '0 4px 10px rgba(15, 185, 177, 0.2)' }}
              >
                Send Feedback
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{
                  background: 'transparent', color: '#64748b',
                  border: 'none', marginTop: '5px', fontSize: '0.95rem',
                  cursor: 'pointer', transition: 'color 0.2s', fontWeight: '500'
                }}
                onMouseOver={e => e.target.style.color = '#f8fafc'}
                onMouseOut={e => e.target.style.color = '#64748b'}
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Global Keyframes for the success animation (Could also be in App.css) */}
      <style>
        {`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes popIn {
                        0% { opacity: 0; transform: scale(0.5); }
                        100% { opacity: 1; transform: scale(1); }
                    }
                `}
      </style>
    </div>
  );
};

export default Contact;