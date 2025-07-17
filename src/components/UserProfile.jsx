import React, { useEffect, useState } from "react";
import "./NavBarStyles.css";
import { API_URL } from "../shared";
import axios from "axios";
import { useParams } from "react-router-dom";

const UserProfile = ({ user }) => {
  const { id } = useParams();
  const userID = Number(id); //convert id from string to number

  const [isUser, setIsUser] = useState(false);
  const [userData, setUserData] = useState({});

  console.log(userID);

  const checkUser = () => {
    if (user?.id == userID) {
      setIsUser(true);
      console.log("Same user");
    } else {
      console.log("Not the same user");
    }
  };

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
  };

  useEffect(() => {
    //handleView;
    checkUser();
  }, [user]);

  useEffect(() => {
    if (isUser) {
      setUserData({
        email: "TestUser@gmail.com",
      });
    }
  }, []);

  return (
    <div>
      {isUser ? (
        <div>
          <p>User</p>
        </div>
      ) : (
        <div>
          <p>Not User</p>
        </div>
      )}

      <div>
        <h1>{user.username}'s Profile</h1>
        <button onClick={updateUser}>Confirm</button>
      </div>
    </div>
  );
};

export default UserProfile;
