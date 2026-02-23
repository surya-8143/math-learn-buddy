import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Ensure CSS is imported

const Feedback = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    rating: 0,
    comment: ''
  });
  const [showThankYou, setShowThankYou] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleStarClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) {
      alert("Please select a star rating!");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5001/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setShowThankYou(true);
      // Wait for 3 seconds then go home
      setTimeout(() => {
        navigate('/home');
      }, 3000);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError("Failed to connect to the server. Is the backend running?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-wrapper">
      <div className="feedback-card">
        <h1>We Value Your Feedback!</h1>

        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="question-block">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              className="text-input"
              placeholder="Your Name (Optional)"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Rating Stars */}
          <div className="question-block">
            <label>Rate Your Experience:</label>
            <div className="star-group">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${formData.rating >= star ? 'selected' : ''}`}
                  onClick={() => handleStarClick(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Comment Area */}
          <div className="question-block">
            <label>Any suggestions?</label>
            <textarea
              name="comment"
              className="text-area"
              placeholder="Tell us what you liked or what we can improve..."
              value={formData.comment}
              onChange={handleChange}
            ></textarea>
          </div>

          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>

      {/* Thank You Overlay */}
      {showThankYou && (
        <div className="thankyou-overlay">
          <div className="welcome-box">
            <h1 className="welcome-title">THANK YOU!</h1>
            <p className="welcome-text">Your feedback helps us grow!</p>
            <button className="lets-go-btn" onClick={() => navigate('/home')}>
              Go Home 🏠
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;