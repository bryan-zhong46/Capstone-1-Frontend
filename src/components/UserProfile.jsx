import React, { useEffect, useState } from "react";
import "./NavBarStyles.css";
import "./Profile.css";
import { API_URL } from "../shared";
import axios from "axios";
import { useParams, NavLink } from "react-router-dom";

const UserProfile = ({ user }) => {
  const { id } = useParams();
  const userID = Number(id); //convert id from string to number

  const [profileUser, setProfileUser] = useState(null);
  const [isUser, setIsUser] = useState(false);
  const [userData, setUserData] = useState({
    isAdmin: user.isAdmin,
    isDisabled: user.isDisabled,
  });

  const checkUser = () => {
    if (user?.id === userID) {
      setIsUser(true);
      console.log("Same user");
    } else {
      console.log("Not the same user");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/${id}`);
        setProfileUser(response.data);
      } catch (err) {
        console.error("Error fetching student:", err);
      }
    };

    fetchUser();
    checkUser();
  }, [userID, user]);

  useEffect(() => {
    if (profileUser) {
      setUserData({
        isAdmin: profileUser.isAdmin,
        isDisabled: profileUser.isDisabled,
      });
    }
  }, [profileUser]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/users/${id}`,
        userData
      );
      const refreshed = await axios.get(`${API_URL}/api/users/${id}`);
      console.log(refreshed.data);
      setProfileUser(refreshed.data);
      console.log("Status: ", response.status);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {profileUser?.isDisabled ? <p>Account is disabled</p> : <></>}
      {isUser || user.isAdmin ? (
        <div>
          {user.isAdmin ? (
            <div>
              <form>
                <input
                  type="checkbox"
                  name="isAdmin"
                  checked={userData.isAdmin}
                  onChange={handleCheckboxChange}
                />
                <label>Make this user Admin?</label>
                <input
                  type="checkbox"
                  name="isDisabled"
                  checked={userData.isDisabled}
                  onChange={handleCheckboxChange}
                />
                <label>Disable this account?</label>
              </form>
              <button onClick={handleSave}>Save</button>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div>
          <p>Not User</p>
        </div>
      )}

      <div className="user-profile-card">
        <div className="user-profile-title">
          <h1>{user.username}'s Profile</h1>
        </div>

        <div className="user-profile-body">
          <p>Username: {user.username}</p>
          <p>UserID: {user.id}</p>
          <p>Email: {user.email}</p>
        </div>
        <NavLink to="./">View Polls</NavLink>
      </div>
    </div>
  );
};

export default UserProfile;
