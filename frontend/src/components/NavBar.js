import React, { useState } from "react";
import "./NavBar.css"; // Import the corresponding CSS

const NavBar = () => {
  const [language, setLanguage] = useState("en");

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    // Here you could trigger a function to switch your site's locale and layout direction
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Replace with your new logo */}
        <img
          src="/path/to/your/new-logo.png"
          alt="Olive Branch News"
          className="navbar-logo"
        />
        <span className="navbar-title">Olive Branch News</span>
      </div>
      <div className="navbar-center">
        <ul className="navbar-links">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/Gaza">Gaza</a>
          </li>
          <li>
            <a href="/politics">Politics</a>
          </li>
          <li>
            <a href="/business">Business</a>
          </li>
          <li>
            <a href="/culture">Culture</a>
          </li>
          <li>
            <a href="/sports">Sports</a>
          </li>
          <li>
            <a href="/tech">Tech</a>
          </li>
        </ul>
      </div>
      <div className="navbar-right">
        <input type="text" placeholder="Search..." className="navbar-search" />
        <select
          value={language}
          onChange={handleLanguageChange}
          className="navbar-language"
        >
          <option value="en">EN</option>
          <option value="ar">AR</option>
        </select>
        {/* Placeholder for a user icon or login button */}
        <button className="navbar-user">
          <i className="fa fa-user"></i>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
