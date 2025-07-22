import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";

const UserPolls = () => {
  const { userId } = useParams();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(`User ${userId}`);

  useEffect(() => {
    const fetchUserAndPolls = async () => {
      if (!userId) {
        setLoading(false);
        setError("User ID not provided in URL.");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const userResponse = await axios.get(`${API_URL}/api/users/${userId}`);
        if (userResponse.data && userResponse.data.username) {
          setUserName(userResponse.data.username);
        }
        const pollsResponse = await axios.get(`${API_URL}/api/polls`);
        setPolls(pollsResponse.data);
      } catch (err) {
        console.error(`Error fetching polls for user ${userId}:`, err);
        setError(
          err.response?.data?.message ||
            `Failed to fetch polls for user ${userId}.`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPolls();
  }, [userId]);

  if (loading) {
    return (
      <div className="user-polls-container">
        Loading polls for {userName}...
      </div>
    );
  }

  if (error) {
    return <div className="user-polls-container error">Error: {error}</div>;
  }

  if (polls.length === 0) {
    return (
      <div className="user-polls-container">No polls found for {userName}.</div>
    );
  }

  return (
    <div className="user-polls-container">
      <h2>Polls Created by {userName}</h2>
      <ul className="poll-list">
        {polls.map((poll) => (
          <li key={poll.poll_id} className="poll-item">
            <h3>
              <Link to={`/polls/${poll.poll_id}`}>{poll.title}</Link>
            </h3>
            <p className="poll-description">{poll.description}</p>
            <p className="poll-status">Status: {poll.poll_status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserPolls;
