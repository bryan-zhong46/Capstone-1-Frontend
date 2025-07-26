import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared";

const PollResults = ({ pollId }) => {
  const [ballots, setBallots] = useState([]);
  const [optionMap, setOptionMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchResults() {
      try {
        const [votesRes, optionsRes] = await Promise.all([
          axios.get(`${API_URL}/api/polls/${pollId}/results`),
          axios.get(`${API_URL}/api/polls/${pollId}/options`),
        ]);

        const votes = votesRes.data;
        const options = optionsRes.data;

        // Create a map of option_id to option text
        const map = {};
        for (const option of options) {
          map[option.option_id] = option.option_text; // or option.option_text depending on your model
        }
        setOptionMap(map);

        // Group by user_id to create ballots
        const ballotMap = {};
        for (const vote of votes) {
          if (!ballotMap[vote.user_id]) {
            ballotMap[vote.user_id] = [];
          }
          ballotMap[vote.user_id].push({
            option_id: vote.option_id,
            rank: vote.rank,
          });
        }

        // Sort each user's ballot by rank
        const ballotsArray = Object.values(ballotMap).map((ballot) =>
          ballot.sort((a, b) => a.rank - b.rank)
        );

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

  const roundResults = (ballots) => {
    const scoreMap = {};

    for (const ballot of ballots) {
      const topChoice = ballot.find((vote) => vote.rank === 1);
      if (topChoice) {
        if (!scoreMap[topChoice.option_id]) {
          scoreMap[topChoice.option_id] = 0;
        }
        scoreMap[topChoice.option_id] += 1;
      }
    }

    return scoreMap;
  };

  const scores = roundResults(ballots);

  return (
    <div>
      <h2>Poll Results (Ballots)</h2>
      <ul>
        {ballots.map((ballot, index) => (
          <li key={index}>
            Ballot {index + 1}:{" "}
            {ballot
              .map(
                (vote) =>
                  `${optionMap[vote.option_id] || vote.option_id} (Rank ${
                    vote.rank
                  })`
              )
              .join(", ")}
          </li>
        ))}
      </ul>
      <h3>First-Choice Vote Count</h3>
      <ul>
        {Object.entries(scores).map(([optionId, count]) => (
          <li key={optionId}>
            {optionMap[optionId] || `Option ${optionId}`}: {count} first-choice
            vote{count !== 1 ? "s" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PollResults;
