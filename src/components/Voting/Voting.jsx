import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../shared";
import axios from "axios";

const Voting = () => {
  const { id } = useParams();
  const pollID = Number(id);
  const [poll, setPoll] = useState(null);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/polls/${id}`);
        setPoll(response);
        console.log(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPoll();
  }, [pollID, poll]);

  return <div></div>;
};

export default Voting;
