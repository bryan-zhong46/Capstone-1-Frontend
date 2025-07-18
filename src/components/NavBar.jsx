import React from "react";
import { Link } from "react-router-dom";
import "./NavBarStyles.css";

const NavBar = ({ user, onLogout, auth0User }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Capstone I</Link>
      </div>

      <div className="nav-links">
        {user ? (
          <div className="user-section">
            <Link to={`/users/${user.id}`}>Profile</Link>
            <span className="username">Welcome, {user.username}!</span>
            <img
              src={auth0User?.picture}
              className="auth-profile-picture"
            ></img>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
            {user.isAdmin ? (
              <>
                <Link to={`/search`}>Search</Link>
              </>
            ) : (
              <></>
            )}
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
