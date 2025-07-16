import React, { useEffect, useState } from "react";
import "./NavBarStyles.css";
import { API_URL } from "../shared";
import axios from "axios";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const { userId } = useParams();
  const { user, setUser } = useState();
  //const navigate = useNavigate();

  /*
  const handleView = () => {
    navigate(`/users/${user.userid}`);
  };
  */

  const { isUser, setIsUser } = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/${userId}`);
        console.log(response);
        setUser(response.data);

        if (response.data.user.user_id === userId) {
          setIsUser(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser;
    //handleView;
  }, [userId]);

  return (
    <div>
      {isUser ? (
        <div>
          <h1>{user}'s Profile</h1>
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
