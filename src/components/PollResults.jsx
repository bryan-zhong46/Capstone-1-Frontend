import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from '../shared';

const PollResults = ({ pollId }) => {
  const [ballots, setBallots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await axios.get(`${API_URL}/api/polls/${pollId}/results`);
        const votes = res.data;

        // Group by user_id to create ballots
        const ballotMap = {};
        for (const vote of votes) {
          if (!ballotMap[vote.user_id]) {
            ballotMap[vote.user_id] = [];
          }
          ballotMap[vote.user_id].push(vote.option_id); 
        }

        const ballotsArray = Object.values(ballotMap); // just the arrays
        setBallots(ballotsArray);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch results.");
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [pollId]);

  if (loading) return <p>Loading poll results...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Poll Results (Ballots)</h2>
      <ul>
        {ballots.map((ballot, index) => (
          <li key={index}>
            Ballot {index + 1}: {ballot.join(" , ")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PollResults;
