import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared";

// === Helper functions ===
const roundResults = (ballots) => {
  const scoreMap = {};
  for (const ballot of ballots) {
    const topChoice = ballot.find((vote) => vote.rank === 1);
    console.log("Top choice for ballot:", topChoice);
    if (topChoice) {
      if (!scoreMap[topChoice.option_id]) {
        scoreMap[topChoice.option_id] = 0;
      }
      scoreMap[topChoice.option_id] += 1;
    }
  }
  console.log("Score map after roundResults:", scoreMap);
  return scoreMap;
};

const getRankedChoiceWinner = (ballots) => {
  let remainingOptionIds = new Set();
  ballots.forEach((ballot) => {
    ballot.forEach((vote) => remainingOptionIds.add(vote.option_id));
  });

  let currentBallots = ballots.map((b) => [...b]);
  const rounds = [];

  while (true) {
    const voteCounts = {};

    for (const ballot of currentBallots) {
      const top = ballot.find((vote) => remainingOptionIds.has(vote.option_id));
      if (top) {
        voteCounts[top.option_id] = (voteCounts[top.option_id] || 0) + 1;
      }
    }

    const totalVotes = Object.values(voteCounts).reduce((a, b) => a + b, 0);

    const roundSnapshot = {
      counts: { ...voteCounts },
      eliminated: [],
    };

    // Check for winner
    for (const [optionId, count] of Object.entries(voteCounts)) {
      if (count > totalVotes / 2) {
        rounds.push(roundSnapshot);
        return {
          winner: optionId,
          rounds,
          tiedBetween: [],
        };
      }
    }

    const minVotes = Math.min(...Object.values(voteCounts));
    const toEliminate = Object.keys(voteCounts).filter(
      (optionId) => voteCounts[optionId] === minVotes
    );

    roundSnapshot.eliminated = [...toEliminate];
    rounds.push(roundSnapshot);

    if (toEliminate.length === remainingOptionIds.size) {
      return {
        winner: null,
        tiedBetween: Array.from(remainingOptionIds),
        rounds,
      };
    }

    for (const id of toEliminate) {
      remainingOptionIds.delete(Number(id));
    }

    currentBallots = currentBallots.map((ballot) =>
      ballot.filter((vote) => remainingOptionIds.has(vote.option_id))
    );
  }
};

// === Main component ===
const PollResults = ({ pollId }) => {
  const [ballots, setBallots] = useState([]);
  const [optionMap, setOptionMap] = useState({});
  const [scores, setScores] = useState({});
  const [rankedResult, setRankedResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchResults() {
      try {
        const votesRes = await axios.get(
          `${API_URL}/api/polls/${pollId}/results`
        );
        const optionsRes = await axios.get(
          `${API_URL}/api/polls/${pollId}/options`
        );

        const votes = votesRes.data;
        const options = optionsRes.data;
        console.log("Votes raw:", votes);
        console.log("Options raw:", options);

        const map = {};
        for (const option of options) {
          map[option.option_id] = option.option_text;
        }
        setOptionMap(map);

        const ballotMap = {};
        for (const vote of votes) {
          if (!ballotMap[vote.user_id]) ballotMap[vote.user_id] = [];
          ballotMap[vote.user_id].push({
            option_id: vote.option_id,
            rank: vote.rank,
          });
        }

        const ballotsArray = Object.values(ballotMap).map((ballot) =>
          ballot.sort((a, b) => a.rank - b.rank)
        );

        console.log("Grouped ballots:", ballotsArray);

        setBallots(ballotsArray);
      } catch (err) {
        console.error("Error fetching poll results:", err);
        setError("Failed to fetch results.");
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [pollId]);

  useEffect(() => {
    if (ballots.length === 0) return;

    try {
      const newScores = roundResults(ballots);
      const newResult = getRankedChoiceWinner(ballots);

      setScores(newScores);
      setRankedResult(newResult);
    } catch (err) {
      console.error("Error calculating results:", err);
      setError("Failed to calculate poll results.");
    }
  }, [ballots]);

  if (loading) return <p>Loading poll results...</p>;
  if (error) return <p>{error}</p>;

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
      <h3>Round-by-Round Breakdown</h3>
      {rankedResult?.rounds.map((round, index) => (
        <div key={index}>
          <strong>Round {index + 1}:</strong>
          <ul>
            {Object.entries(round.counts).map(([optionId, count]) => (
              <li key={optionId}>
                {optionMap[optionId] || `Option ${optionId}`}: {count} vote
                {count !== 1 ? "s" : ""}
              </li>
            ))}
          </ul>
          {round.eliminated.length > 0 && (
            <p>
              Eliminated:{" "}
              {round.eliminated
                .map((id) => `${optionMap[id]}`)
                .join(", ")}
            </p>
          )}
        </div>
      ))}
      <h3>Ranked-Choice Winner</h3>
      {rankedResult ? (
        rankedResult.winner ? (
          <p>
            Winner: {optionMap[rankedResult.winner]}
          </p>
        ) : (
          <p>
            No clear winner. Final round was a tie between:{" "}
            {rankedResult.tiedBetween
              .map((id) => `${optionMap[id]} (Option ${id})`)
              .join(", ")}
          </p>
        )
      ) : (
        <p>Calculating winner...</p>
      )}
    </div>
  );
};

export default PollResults;
