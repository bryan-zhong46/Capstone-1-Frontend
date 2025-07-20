import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";

/* 
Component for user to see the details of a particular poll and submit their ranked-choice votes.
The user will be able to see the title and description of the poll, as well as all available
options. Each option will have a drop-down menu that allows the user to assign a rank to it.
The user will not be able to submit if 2 or more options have the same rank. 
*/
export default function VoteForm({ user }) {
    
    // const [pollVotes, setPollVotes] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("")

    const poll_id = 1; // poll_id of the poll being voted on, using a placeholder for now 


    // TODO get the title and description of the selected poll
    async function fetchPoll(poll_id) {
        try {
            const response = await axios.get(`${API_URL}/api/polls/1`);
            // console.log("RESPONSE", response);
            setTitle(response.data.title);
            setDescription(response.data.description);
        } catch (error) {
            console.error(error);
            console.log("Error fetching poll data");
        }     
    }

    useEffect(() => {
        fetchPoll();
    }, []);
    
    // TODO get the poll options of the associated poll
    // TODO write an Express route to get all options associated with a poll

    return (
        <div className="">
            <h1>Submit Your Vote!</h1>
            <p>Poll Title: {title}</p>
            <p>Poll Description: {description}</p>
        </div>
    );
}