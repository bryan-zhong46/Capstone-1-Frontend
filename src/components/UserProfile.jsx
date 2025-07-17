import React, { useEffect, useState } from "react";
import "./NavBarStyles.css";
import { API_URL } from "../shared";
import axios from "axios";
import { useParams } from "react-router-dom";

const UserProfile = ({ user }) => {
  const { id } = useParams();
  const userID = Number(id);

  const [isUser, setIsUser] = useState(false);

  console.log(userID);

  const checkUser = () => {
    if (user?.id == userID) {
      setIsUser(true);
      console.log("It is the same user");
    } else {
      console.log("It is not the same user");
    }
  };

  useEffect(() => {
    //handleView;
    checkUser();
  }, []);

  return (
    <div>
      {isUser ? (
        <div>
          <h1>{user.username}'s Profile</h1>
        </div>
      ) : (
        <div>
          <p>test</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
