import React, { useEffect, useState } from "react";
import { API_URL } from "../../shared";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../NavBarStyles.css";
import "./Search.css";
import UserList from "./UserList";

const Search = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [text, setText] = useState("");
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
  }, []);

  const handleTextChange = (e) => {
    const textSearch = e.target.value;
    setText(textSearch);
  };

  return (
    <>
      <div className="search-bar">
        <input type="text" placeholder="Search.." onChange={handleTextChange} />
      </div>
      <div className="search-content">
        <span>List of Users:</span>
        <UserList users={users} text={text} />
      </div>
    </>
  );
};

export default Search;
