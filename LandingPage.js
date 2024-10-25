import React from 'react';

const LandingPage = () => {
  return (
    <div className="App">
      <header className="App-header">
        <nav className="navbar">
          <div className="logo">OpenUI</div>
          <ul className="nav-links">
            <li><a href="#blog"><b>Blog</b></a></li>
            <li><a href="#contact"><b>Contact</b></a></li>
          </ul>
          <div className="auth-buttons">
            <button className="login">Log in</button>
            <button className="signup">Sign up</button>
          </div>
        </nav>
        <div className="ou"><p><b>OPENUI</b></p></div>
        <div className="header-content">
          <h1>Turn designs <br/>
            to functional code, instantly.</h1>
          <p className="description">
          <b>Convert UI designs into clean code.<span className='pp'> Import designs. Process components
            Export fully functional code with 1 click.</span></b>
          </p>
          </div>
        <div className="si">
          <a href="#signup" className="btn-signup">Sign up for free</a>
        </div>
      </header>
    </div>
  );
};

export default LandingPage;
