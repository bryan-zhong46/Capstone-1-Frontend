import React from "react";
import "./Search.css";
import { Link } from "react-router-dom";

const UserList = ({ users, text }) => {
  const filteredUsers = users.filter((user) => {
    if (text === "") {
      return user;
    } else {
      return user.username.toLowerCase().includes(text.toLowerCase());
    }
  });

  return (
    <div className="users-list">
      <div className="users-list-card">
        {filteredUsers.map((listUser) => (
          <div key={listUser.user_id} className="user-list-item">
            <span>
              <Link to={`/users/${listUser.user_id}`} className="link-list">
                {listUser.username}
              </Link>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
