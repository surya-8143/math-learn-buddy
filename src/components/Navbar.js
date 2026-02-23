import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  // Don't show Navbar on Landing Page
  if (location.pathname === '/') return null;

  return (
    <nav className="navbar">
      <h3>🧩 MathBuddy</h3>
      <div>
        {/* Added Home Link Here */}
        <Link to="/home">Home</Link>
        <Link to="/details">Details</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/">Exit</Link>
      </div>
    </nav>
  );
};

export default Navbar;