import React from 'react';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">OpenUI</h1>
        <div className="form-container">
          <div className="email-cont">
            <label className="input-text">Email</label>
            <input type="text" className="top-field" />
          </div>
          <div className="pass-cont">  
            <label className="input-text">Password</label>
            <input type="password" className="top-field" />
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>
          <button className="login-button">Log In</button>
        </div>
      </header>
      
      <main className="main-content">
        <div className="icon-section">
          <img src={require('./images/signup.jpg')} alt="Icon" />
        </div>

        <div className="signup-form">
          <h2>Create an account</h2>
          <div className="name-group">
            <input type="text" placeholder="First Name" className="input-field" />
            <input type="text" placeholder="Last Name" className="input-field" />
          </div>
          <div className="email-group">
            <input type="email" placeholder="Email" className="input-field" />
          </div>
          <div className="password-group">
            <input type="password" placeholder="New Password" className="input-field" />
            <input type="password" placeholder="Retype Password" className="input-field" />
          </div>
          <div className="dob-group">
            <label>Date of Birth</label>
            <div className="dob-fields">
              <input type="text" className="day" placeholder="DD" maxLength={2}/>
              <input type="text" className="month" placeholder="MM" maxLength={2}/>
              <input type="text" className="year" placeholder="YYYY" maxLength={4}/>
            </div>
          </div>
          <div className="gender-group">
            <label>Gender</label>
            <div className="gender-options">
              <input type="radio" name="gender" value="female" /> Female
              <input type="radio" name="gender" value="male" /> Male
              <input type="radio" name="gender" value="other" /> Other
            </div>
          </div>
          <button className="signup-button">Create account</button>
        </div>
      </main>
    </div>
  );
}

export default App;