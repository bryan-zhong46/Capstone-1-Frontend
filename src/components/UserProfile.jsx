import React, { useEffect, useState } from "react";
import "./NavBarStyles.css";
import "./Profile.css";
import { API_URL } from "../shared";
import axios from "axios";
import { useParams, NavLink, useNavigate } from "react-router-dom";

const UserProfile = ({ user }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  //const location = useLocation();
  /*
  const [isEditing, setIsEditing] = useState(
    location.state?.isEditing || false
  );*/

  const userID = Number(id); //convert id from string to number

  const [isUser, setIsUser] = useState(false);
  const [userData, setUserData] = useState({
    isAdmin: user.isAdmin,
    isDisabled: user.isDisabled,
  });

  //For admin users, add the ability to disable an account, or make a account admin

  const checkUser = () => {
    if (user?.id == userID) {
      setIsUser(true);
      console.log("Same user");
    } else {
      console.log("Not the same user");
    }
  };

  /*
  const updateUser = async () => {
    if (isUser) {
      try {
        const response = await axios.patch(
          `${API_URL}/api/users/${id}`,
          userData
        );
        console.log("Status: ", response.status);
      } catch (error) {
        console.log(error);
      }
    }
  }; */

  // edit user
  //const editUser = async () => {};

  useEffect(() => {
    checkUser();
  }, [user]);

  const fetchUser = async () => {
    const res = await axios.get(`${API_URL}/api/users/${id}`);
    setUserData(res.data);
  };

  const handleAdminChange = async (e) => {
    const adminState = e.target.checked;
    setUserData((prev) => ({
      ...prev,
      isAdmin: adminState,
    }));
  };

  const handleDisableChange = async (e) => {
    const disableState = e.target.checked;
    setUserData((prev) => ({
      ...prev,
      isDisabled: disableState,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/users/${id}`,
        userData
      );
      fetchUser();
      console.log("Status: ", response.status);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {isUser || user.isAdmin ? (
        <div>
          {user.isAdmin ? (
            <div>
              <form>
                <input
                  type="checkbox"
                  checked={userData.isAdmin}
                  onChange={handleAdminChange}
                />
                <label>Make this user Admin?</label>
                <input
                  type="checkbox"
                  checked={userData.isDisabled}
                  onChange={handleDisableChange}
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
