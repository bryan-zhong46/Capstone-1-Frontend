import React, { useEffect, useState } from "react";
import "../NavBarStyles.css";
import "./Profile.css";
import { API_URL } from "../../shared";
import axios from "axios";
import { useParams, NavLink, useNavigate } from "react-router-dom";

const UserProfile = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const userID = Number(id); //convert id from string to number

  const [profileUser, setProfileUser] = useState(null);
  const [isUser, setIsUser] = useState(false);
  const [userData, setUserData] = useState({
    isAdmin: user?.isAdmin,
    isDisabled: user?.isDisabled,
    profile_image: user?.profile_image,
  });
  const [selectedFile, setSelectedFile] = useState(null);

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
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
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
        profile_image: profileUser.profile_image,
      });
    }
  }, [profileUser]);

  const handleFileChange = (e) => {
    e.preventDefault();
    setSelectedFile(e.target.files[0]);
  };

  const uploadImage = async () => {
    try {
      // Get s3 url from backend
      const res = await axios.get(`${API_URL}/s3Url`);
      const { url } = res.data;
      console.log(url);

      // Upload file to s3 bucket
      await axios.put(url, selectedFile, {
        headers: {
          "Content-Type": selectedFile.type,
        },
      });

      // Get imageUrl
      const imageUrl = url.split("?")[0];
      console.log("Image uploaded:", imageUrl);

      // Update backend
      await axios.patch(`${API_URL}/api/users/${id}`, {
        profile_image: imageUrl,
      });

      setUserData((prev) => ({
        ...prev,
        profile_image: imageUrl,
      }));
    } catch (error) {
      console.error("Error fetching S3 URL:", error);
    }
  };

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !profileUser) {
      navigate("*");
    }
  }, [loading, profileUser, navigate]);

  if (loading) return <p>Loading user...</p>;

  return (
    <div className="profile-container">
      {profileUser?.isDisabled ? (
        <p style={{ color: "red" }}>Account is disabled</p>
      ) : (
        <></>
      )}
      {isUser || user?.isAdmin ? (
        <div>
          {user?.isAdmin ? (
            <>
              <label>Admin Panel</label>
              <div className="admin-controls">
                <form className="admin-form">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      name="isAdmin"
                      checked={userData.isAdmin}
                      onChange={handleCheckboxChange}
                    />
                    <label>Make this user Admin?</label>
                  </div>
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      name="isDisabled"
                      checked={userData.isDisabled}
                      onChange={handleCheckboxChange}
                    />
                    <label>Disable this account?</label>
                  </div>
                </form>
                <button onClick={handleSave} className="save-button">
                  Save
                </button>
              </div>
            </>
          ) : (
            <></>
          )}
          <input type="file" onChange={handleFileChange}></input>
        </div>
      ) : (
        <div>
          <p>Not User</p>
        </div>
      )}

      <div className="user-profile-card">
        <div className="user-profile-title">
          <h1>{profileUser?.username}</h1>
        </div>

        {userData.profile_image ? (
          <div className="user-profile-picture">
            <img src={userData.profile_image}></img>
          </div>
        ) : (
          <></>
        )}

        <div className="user-profile-body">
          <p>Username: {profileUser?.username}</p>
          <p>UserID: {profileUser?.user_id}</p>
          <p>Email: {profileUser?.email}</p>
        </div>
      </div>
      {isUser ? (
        <NavLink to="../my-polls">View Polls</NavLink>
      ) : (
        <NavLink to={`../users/${userID}/polls`}>View Polls</NavLink>
      )}
      {isUser ? <button onClick={uploadImage}>Upload Image</button> : <></>}
    </div>
  );
};

export default UserProfile;
