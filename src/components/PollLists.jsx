import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";

const PollLists = () => {
  const [polls, setPolls] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllPolls = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/polls`);
        setPolls(response.data);
      } catch (err) {
        console.error("Error fetching all polls:", err);
        setError(err.message || "Failed to fetch all polls.");
      } finally {
        setLoading(false);
      }
    };

    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users`);
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching all users:", err);
        setError(err.message || "Failed to fetch all users.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllPolls();
    fetchAllUsers();
  }, []);

  if (loading) {
    return <div className="poll-list-container">Loading all polls...</div>;
  }

  if (error) {
    return <div className="poll-list-container error">Error: {error}</div>;
  }

  if (polls.length === 0) {
    return <div className="poll-list-container">No polls available.</div>;
  }

  return (
    <div className="poll-list-container">
      <h2>All Available Polls</h2>
      <ul className="poll-list">
        {polls.map((poll) => (
          <li key={poll.poll_id} className="poll-item">
            <h3>
              <Link to={`/polls/${poll.poll_id}`}>{poll.title}</Link>
            </h3>
            {poll.creator_id && (
              <p className="poll-creator">
                Created by:{" "}
                <Link to={`/users/${poll.creator_id}`}>
                  {users.find((user) => user?.user_id === poll.creator_id)
                    ?.username ?? ""}
                </Link>
                {" | "}
                <Link to={`/users/${poll.creator_id}/polls`}>
                  View all polls by this user
                </Link>
              </p>
            )}
            <p className="poll-status">Status: {poll.poll_status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PollLists;
