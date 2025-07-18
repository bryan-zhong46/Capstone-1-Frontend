import React from "react";
import "./Search.css";

const UserList = ({ users, text }) => {
  const filteredUsers = users.filter((data) => {
    if (text === "") {
      return data;
    } else {
      return data.username.toLowerCase().includes(text.toLowerCase());
    }
  });

  return (
    <div className="users-list">
      <div className="users-list-card">
        {filteredUsers.map((listUser) => (
          <div key={listUser.id} className="user-list-item">
            <span>{listUser.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
