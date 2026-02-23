import React, { Component } from 'react';
import './FeedbackForm.css';

class FeedbackFormClass extends Component {
  state = {
    formStep: 1,
    childName: '',
    age: '',
    learning: '',
    audioHelp: '',
    features: [],
    rating: 0,
    feedback: '',
    showThankYou: false
  };

  toggleFeature = (f) => {
    this.setState(prev => ({
      features: prev.features.includes(f)
        ? prev.features.filter(x => x !== f)
        : [...prev.features, f]
    }));
  };

  nextStep = () => {
    const { childName, age, learning } = this.state;
    if (!childName || !age || !learning) {
      alert("Fill all fields first");
      return;
    }
    this.setState({ formStep: 2 });
  };

  submitForm = (e) => {
    e.preventDefault();
    const { audioHelp, rating } = this.state;

    if (!audioHelp || rating === 0) {
      alert("Complete all required fields");
      return;
    }

    this.setState({ showThankYou: true });
  };

  render() {
    const { goBack } = this.props;
    const {
      formStep, childName, age,
      rating, feedback, showThankYou
    } = this.state;

    return (
      <div className="feedback-wrapper">

        {showThankYou && (
          <div className="thankyou-overlay">
            <div className="welcome-box">
              <h1 className="welcome-title">Thank You!</h1>
              <p className="welcome-subtitle">
                Thanks for filling the form.
              </p>
              <button className="lets-go-btn" onClick={goBack}>
                Back to Learning
              </button>
            </div>
          </div>
        )}

        <div className="feedback-card">
          <h1>FEEDBACK</h1>

          {formStep === 1 && (
            <>
              <input
                className="text-input"
                placeholder="Child Name"
                value={childName}
                onChange={e => this.setState({ childName: e.target.value })}
              />

              <input
                className="text-input"
                type="number"
                placeholder="Age"
                value={age}
                onChange={e => this.setState({ age: e.target.value })}
              />

              <h3 className="field-label">What did the child learn?</h3>

              {["Traffic Signals", "Road Signs", "Both"].map(o => (
                <label className="option-row" key={o}>
                  <input
                    type="radio"
                    name="learn"
                    value={o}
                    checked={this.state.learning === o}
                    onChange={(e) =>
                      this.setState({ learning: e.target.value })
                    }
                  />
                  {o}
                </label>
              ))}


              <button className="submit-btn" onClick={this.nextStep}>
                Next →
              </button>
            </>
          )}

          {formStep === 2 && (
            <form onSubmit={this.submitForm}>
              <h3 className="field-label">Was audio helpful?</h3>

              <label className="option-row">
                <input
                  type="radio"
                  name="audioHelp"          // ✅ SAME NAME
                  value="Yes"
                  onChange={(e) => this.setState({ audioHelp: e.target.value })}
                />
                Yes
              </label>

              <label className="option-row">
                <input
                  type="radio"
                  name="audioHelp"          // ✅ SAME NAME
                  value="No"
                  onChange={(e) => this.setState({ audioHelp: e.target.value })}
                />
                No
              </label>


              {[1, 2, 3, 4, 5].map(n => (
                <span
                  key={n}
                  className={rating >= n ? "star selected" : "star"}
                  onClick={() => this.setState({ rating: n })}
                >
                  ★
                </span>
              ))}

              <textarea
                className="text-area"
                placeholder="Additional Feedback (optional)"
                value={feedback}
                onChange={e => this.setState({ feedback: e.target.value })}
              />

              <button type="submit" className="submit-btn">
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }
}

export default FeedbackFormClass;
