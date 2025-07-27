import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../shared";
import axios from "axios";
import "./Voting.css";

const Voting = ({ user }) => {
  const navigate = useNavigate();
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
  const params = user?.id ? { userid: user.id } : {}; // user ID as a query parameter
  const [showSubmitWarning, setShowSubmitWarning] = useState(false);

  // Initialize ballot data with empty entries for each option
  useEffect(() => {
    if (!ballotsExist) {
      if (options.length > 0) {
        const initialBallots = options.map((option) => ({
          option_id: option.option_id,
          rank: "",
          poll_id: pollID,
          user_id: user?.id,
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
          `${API_URL}/api/polls/${id}/published`,
          { params }
        );

        console.log(ballotsRes);

        if (ballotsRes.data && ballotsRes.data.length > 0) {
          setBallotsExist(true);
          setBallotData(ballotsRes.data);
          console.log("Ballot exists");
        }
        setIsLoaded(true);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAllData();

    console.log("fetching data");
  }, [pollID]);

  // Publishing a poll
  const handlePublish = async () => {
    const newStatusData = { ...statusData, poll_status: "published" };
    setStatusData(newStatusData);

    try {
      const response = await axios.patch(`${API_URL}/api/polls/${id}`, {
        pollData: newStatusData,
        isPublishing: true,
      });
      console.log("Published:", response);
    } catch (err) {
      console.error(err);
    }
  };

  // Closing a poll
  const handleClose = async () => {
    console.log("ballotsExist:", ballotsExist);
    const newStatusData = { ...statusData, poll_status: "closed" };
    setStatusData(newStatusData);

    try {
      const response = await axios.patch(`${API_URL}/api/polls/${id}`, {
        pollData: newStatusData,
      });
      console.log("Closed:", response);
    } catch (err) {
      console.error(err);
    }

    // set isSubmitted to true for each ballot
    if (ballotsExist) {
      for (const ballot of ballotData) {
        try {
          const response = await axios.patch(
            `${API_URL}/api/pollvotes/${ballot.pollvote_id}`,
            { isSubmitted: true }
          );
          console.log("Ballots patched to submitted:", response);

          const { data: updatedPollres } = await axios.get(
            `${API_URL}/api/polls/${id}`
          );
          const updatedPoll = {
            ...poll,
            number_of_votes: updatedPollres.number_of_votes,
          };
          setPoll(updatedPoll);
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  // Selecting a rank
  const handleRankChange = (optionId, rank) => {
    console.log("handleRankChange:", { optionId, rank, pollID, user });
    setBallotData((prev) =>
      prev.map((ballot) =>
        ballot.option_id === optionId
          ? {
              ...ballot,
              rank: rank,
              poll_id: pollID,
              user_id: user?.id,
            }
          : ballot
      )
    );
  };

  // Clear a poll
  const handleClear = (options) => {
    const optionIds = options.map((option) => option.option_id);

    setBallotData((prev) =>
      prev.map((ballot) =>
        optionIds.includes(ballot.option_id) ? { ...ballot, rank: "" } : ballot
      )
    );
  };

  // Saving Ballots
  const handleSaveRank = async () => {
    console.log(ballotData);
    console.log(ballotsExist);

    const hasEmptyRank = ballotData.some((b) => b.rank === 0);

    if (hasEmptyRank && !showSubmitWarning) {
      setShowSubmitWarning(true);
      return;
    }

    // check if ballots already exist. if they do then patch. if not then post.
    for (const ballot of ballotData) {
      try {
        if (ballotsExist) {
          const response = await axios.patch(
            `${API_URL}/api/pollvotes/${ballot.pollvote_id}`,
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
    }

    const ballotsRes = await axios.get(`${API_URL}/api/polls/${id}/published`, {
      params,
    });

    if (ballotsRes.data && ballotsRes.data.length > 0) {
      setBallotsExist(true);
      setBallotData(ballotsRes.data);
    }
  };

  //Disable a poll
  const handleDisable = async (e) => {
    const { checked } = e.target;

    if (!poll) return;

    try {
      setPoll((prev) => ({
        ...prev,
        isDisabled: checked,
        poll_status: "closed",
      }));

      await axios.patch(`${API_URL}/api/polls/${id}`, {
        isDisabled: checked,
        poll_status: "closed",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = () => {
    navigate(`/make-poll/${pollID}`);
  };

  if (!poll) {
    return <p>Poll is not found</p>;
  }

  if (!isLoaded) {
    return <p>Loading</p>;
  }

  return (
    <>
      {" "}
      {showSubmitWarning && (
        <p>You have not ranked all choices. Are you sure you want to submit?</p>
      )}
      <div className="poll-container">
        <div className="poll-card">
          <div className="poll-title">{poll?.title}</div>
          <div className="poll-body">
            <p>Description: {poll?.description}</p>
            <p>Expiration: {poll?.Expiration}</p>
            <p>Number of Votes: {poll?.number_of_votes}</p>
            <p>Poll status: {statusData?.poll_status}</p>
          </div>
        </div>

        <div className="buttons">
          {user?.id === poll.creator_id &&
            statusData.poll_status === "draft" && (
              <div>
                <p>Options:</p>
                <div className="poll-options-list">
                  {options.map((option) => (
                    <div key={option.option_id}>
                      <label>{option.option_text}</label>
                    </div>
                  ))}
                </div>
                <button onClick={handlePublish}>Publish</button>
                <button onClick={handleEdit}>Edit</button>
              </div>
            )}

          {statusData.poll_status === "published" && (
            <div>
              {!poll?.isDisabled && (
                <>
                  <form>
                    <h4>Rank the options:</h4>
                    {options.map((option) => (
                      <div key={option.option_id}>
                        <label>{option.option_text}</label>
                        <select
                          id={option.option_id}
                          name="rank"
                          value={
                            isLoaded &&
                            (ballotData.find(
                              (b) => b.option_id === option.option_id
                            )?.rank ??
                              "")
                          }
                          onChange={(e) =>
                            handleRankChange(
                              option.option_id,
                              Number(e.target.value)
                            )
                          }
                        >
                          <option value="" disabled>
                            Select rank
                          </option>

                          <option value=""></option>

                          {Array.from({ length: options.length }, (_, i) => {
                            const rank = i + 1;
                            const isUsed = ballotData.some(
                              (ballot) =>
                                ballot.option_id !== option.option_id &&
                                ballot.rank === rank
                            );
                            return (
                              <option key={rank} value={rank} disabled={isUsed}>
                                {rank}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    ))}
                  </form>
                  <div className="Button">
                    <button onClick={() => handleClear(options)}>Clear</button>
                    {user?.id === poll.creator_id ? (
                      <>
                        <button onClick={handleClose}>Close</button>
                        <button onClick={handleSaveRank}>Save</button>
                      </>
                    ) : (
                      <button onClick={handleSaveRank}>Vote</button>
                    )}
                  </div>
                </>
              )}
              {user?.isAdmin ? (
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="isDisabled"
                    checked={poll.isDisabled}
                    onChange={handleDisable}
                  />
                  <label>Disable this poll?</label>
                </div>
              ) : (
                <></>
              )}
            </div>
          )}

          {statusData.poll_status === "closed" && (
            <div>
              <p>Poll is closed</p>
              <button onClick={handlePublish}>Open the poll</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Voting;
