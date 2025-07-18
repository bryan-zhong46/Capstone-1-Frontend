import React, { useEffect, useState } from "react";
import { API_URL } from "../../shared";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../NavBarStyles.css";
import "./Search.css";

const Search = ({ user }) => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("*");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const response = await axios.get(`${API_URL}/api/users/`);
      console.log(response.data);
      setUsers(response.data);
    };

    fetchAllUsers();
  }, [users]);

  return (
    <>
      <input type="text" placeholder="Search.." />
      <div className="users-list">
        <div className="users-list-card">
          {users.map((user) => (
            <div key={user.id} className="user-list-item">
              <span>{user.username}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Search;
