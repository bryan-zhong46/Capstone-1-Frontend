import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./AppStyles.css";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import UserProfile from "./components/Profile/UserProfile";
import MakePoll from "./components/MakePoll";
import Search from "./components/Search/Search";
import Voting from "./components/Voting/Voting";
import { API_URL } from "./shared";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { auth0Config } from "./auth0-config";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const {
    isAuthenticated,
    user: auth0User,
    loginWithRedirect,
    logout: auth0Logout,
  } = useAuth0();

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      });
      setUser(response.data.user);
      console.log(response.data.user);
    } catch {
      console.log("Not authenticated");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Check authentication status on app load
  useEffect(() => {
    checkAuth();
  }, []);

  // Handle Auth0 authentication
  useEffect(() => {
    if (isAuthenticated && auth0User) {
      handleAuth0Login();
    }
  }, [isAuthenticated, auth0User]);

  const handleAuth0Login = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/auth0`,
        {
          auth0Id: auth0User.sub,
          email: auth0User.email,
          username:
            auth0User.nickname ||
            auth0User.email?.split("@")[0] ||
            `user_${Date.now()}`,
          picture: auth0User.picture,
        },
        {
          withCredentials: true,
        }
      );
      setUser(response.data.user);
    } catch (error) {
      console.error("Auth0 login error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      // Logout from our backend
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      setUser(null);

      // Logout from Auth0
      auth0Logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleAuth0LoginClick = () => {
    loginWithRedirect();
  };

  if (loading) {
    return <div className="app">Loading...</div>;
  }

  return (
    <div>
      <NavBar user={user} auth0User={auth0User} onLogout={handleLogout} />
      <div className="app">
        <Routes>
          <Route
            path="/login"
            element={
              <Login setUser={setUser} onAuth0Login={handleAuth0LoginClick} />
            }
          />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/make-poll" element={<MakePoll setUser={setUser} />} />
          <Route exact path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/users/:id" element={<UserProfile user={user} />} />
          <Route path="/search" element={<Search user={user} />} />
          <Route path="/polls/:id" element={<Voting />} />
        </Routes>
      </div>
    </div>
  );
};

const Root = () => {
  return (
    <Auth0Provider {...auth0Config}>
      <Router>
        <App />
      </Router>
    </Auth0Provider>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<Root />);
