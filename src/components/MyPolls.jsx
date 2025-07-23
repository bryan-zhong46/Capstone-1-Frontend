import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import { Link } from "react-router-dom";

const MyPolls = ({ loggedInUser }) => {
  //const [publishedPolls, setPublishedPolls] = useState([]);
  //const [draftPolls, setDraftPolls] = useState([]);
  // const [participatedPolls, setParticipatedPolls] = useState([]);
  const [polls, setPolls] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolls = async () => {
      if (!loggedInUser || !loggedInUser.id) {
        setLoading(false);
        setError(
          "User not logged in or user ID not available. Please log in to view your polls."
        );
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${API_URL}/api/polls/user/${loggedInUser.id}`
        );
        setPolls(response.data);
        console.log(response.data);
      } catch (err) {
        console.error("Failed to fetch polls:", err);
        setError(err.response?.data?.message || "Failed to fetch polls.");
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, [loggedInUser]);

  if (loading)
    return <div className="my-polls-container">Loading your polls...</div>;
  if (error)
    return <div className="my-polls-container error">Error: {error}</div>;
  return (
    <div className="my-polls-container">
      <h2>Your Polls</h2>
      <PollSection title="Published Polls" polls={polls} status={"published"} />
      <PollSection title="Draft Polls" polls={polls} status={"draft"} />
      <PollSection title="Closed Polls" polls={polls} status={"closed"} />
    </div>
  );
};

const PollSection = ({ title, polls, status }) => {
  const filteredPolls = polls.filter((poll) => {
    return poll.poll_status == status;
  });

  return (
    <div className="poll-section">
      <h3>{title}</h3>
      {filteredPolls.length === 0 ? (
        <p>No {title.toLowerCase()}.</p>
      ) : (
        <ul className="poll-list">
          {filteredPolls.map((poll) => (
            <li key={poll.poll_id} className="poll-item">
              <strong>
                <Link to={`/polls/${poll.poll_id}`}>{poll.title}</Link>
              </strong>{" "}
              – {new Date(poll.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyPolls;
