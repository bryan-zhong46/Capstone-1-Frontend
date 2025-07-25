import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../shared";
import axios from "axios";
import "./Voting.css";

const Voting = ({ user }) => {
  const { id } = useParams();
  const pollID = Number(id);
  const [poll, setPoll] = useState(null);
  const [options, setOptions] = useState([]);
  const [statusData, setStatusData] = useState({
    poll_status: null,
  });
  const [ballotData, setBallotData] = useState([]);

  const [ballotsExist, setBallotsExist] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize ballot data with empty entries for each option
  useEffect(() => {
    if (!ballotsExist) {
      if (options.length > 0) {
        const initialBallots = options.map((option) => ({
          option_id: option.options_id,
          rank: "",
          poll_id: pollID,
          user_id: user.id,
        }));
        setBallotData(initialBallots);
      }
    }
    console.log("initalizing ballot with empty");
  }, [options, ballotsExist]);

  // fetching
  useEffect(() => {
    if (!pollID) return;
    const fetchAllData = async () => {
      try {
        // fetch poll
        const pollRes = await axios.get(`${API_URL}/api/polls/${id}`);
        setPoll(pollRes.data);
        setStatusData({ poll_status: pollRes.data.poll_status });

        // fetch options
        const optionRes = await axios.get(`${API_URL}/api/options/polls/${id}`);
        setOptions(optionRes.data);

        // fetch ballot
        const ballotsRes = await axios.get(
          `${API_URL}/api/polls/${id}/results`
        );

        if (ballotsRes.data && ballotsRes.data.length > 0) {
          setBallotsExist(true);
          setBallotData(ballotsRes.data);
          console.log("Ballot exists");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchAllData();
    setIsLoaded(true);
    console.log("fetching data");
  }, [pollID]);

  // Publishing a poll
  const handlePublish = async () => {
    const newStatusData = { ...statusData, poll_status: "published" };
    setStatusData(newStatusData);

    try {
      const response = await axios.patch(
        `${API_URL}/api/polls/${id}`,
        newStatusData
      );
      console.log("Published:", response);
    } catch (err) {
      console.error(err);
    }
  };

  // Selecting a rank
  const handleRankChange = (optionId, rank) => {
    console.log("handleRankChange:", { optionId, rank, pollID, user });
    setBallotData((prev) =>
      prev.map((ballot) =>
        ballot.option_id === optionId
          ? { ...ballot, rank: rank, poll_id: pollID, user_id: user.id }
          : ballot
      )
    );
  };

  // Saving Ballots
  const handleSaveRank = () => {
    console.log(ballotData);
    console.log(ballotsExist);

    // check if ballots already exist. if they do then patch. if not then post.
    ballotData.forEach(async (ballot) => {
      try {
        if (ballotsExist) {
          const response = await axios.patch(
            `${API_URL}/api/${ballot.pollvote_id}`,
            ballot
          );
          console.log("Ballots patched:", response);
        } else if (!ballotsExist) {
          const response = await axios.post(
            `${API_URL}/api/pollVotes/`,
            ballot
          );
          console.log("Ballots posted:", response);
        }
      } catch (err) {
        console.error(err);
      }
    });
  };

  if (!poll) {
    return <p>Poll is not found</p>;
  }

  if (!isLoaded) {
    return <p>Loading</p>;
  }

  return (
    <div className="poll-container">
      <div className="poll-card">
        <div className="poll-title">{poll?.title}</div>
        <div className="poll-body">
          <p>Description: {poll?.description}</p>
          <p>Expiration: {poll?.Expiration}</p>
          <p>Number of Votes: {poll?.number_of_votes}</p>
          <p>Poll status: {poll?.poll_status}</p>
        </div>
      </div>

      <div className="buttons">
        {statusData.poll_status === "draft" && (
          <div>
            <p>Options:</p>
            <div className="poll-options-list">
              {options.map((option) => (
                <div key={option.options_id}>
                  <label>{option.option_text}</label>
                </div>
              ))}
            </div>
            <button onClick={handlePublish}>Publish</button>
            <button>Edit</button>
            <button>Save</button>
          </div>
        )}

        {statusData.poll_status === "published" && (
          <div>
            <form>
              <h4>Rank the options:</h4>
              {options.map((option) => (
                <div key={option.options_id}>
                  <label>{option.option_text}</label>
                  <select
                    id={`${option.options_id}`}
                    name="rank"
                    value={
                      isLoaded &&
                      (ballotData.find((b) => b.option_id === option.options_id)
                        ?.rank ||
                        "")
                    }
                    onChange={(e) =>
                      handleRankChange(option.options_id, e.target.value)
                    }
                  >
                    <option value="" disabled>
                      Select rank
                    </option>
                    {Array.from({ length: options.length }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </form>

            <button>Close</button>
            <button onClick={handleSaveRank}>Save</button>
          </div>
        )}

        {statusData.poll_status === "closed" && (
          <div>
            <p>Poll is closed</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Voting;
