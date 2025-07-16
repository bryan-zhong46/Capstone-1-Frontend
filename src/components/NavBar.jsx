import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBarStyles.css";

const NavBar = ({ user, onLogout, auth0User }) => {
  const navigate = useNavigate();

  const handleView = () => {
    console.log(user);
    navigate(`/users/${user.id}`);
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Capstone I</Link>
      </div>

      <div className="nav-links">
        {user ? (
          <div className="user-section">
            <button onClick={handleView}>Profile</button>
            <span className="username">Welcome, {user.username}!</span>
            <img
              src={auth0User?.picture}
              className="auth-profile-picture"
            ></img>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup" className="nav-link">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
