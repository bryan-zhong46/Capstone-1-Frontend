import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";
import MakePollOptions from "./MakePollOptions";

/**
 * Component for creating a new poll.
 * A user can provide the following properties:
 * - title: string (required)
 * - description: string (required)
 * - options: array of objects like {id, option_text, poll_id} (required, at least two options)
 * - expirationDate: date (required)
 */

export default function MakePoll({ user }) {
  // State to hold poll data
  const [pollData, setPollData] = useState({
    title: "",
    creator_id: 0, // placeholder value
    description: "",
    auth_required: false,
    expiration: "2025-07-17",
  });

  // State to hold poll options data to be passed down to MakePollOptions component
  const [pollOptions, setPollOptions] = useState([]);
  
  // State to hold text of the options currently being created, to be passed down to MakePollOptions component
  const [newOption, setNewOption] = useState("");

  const [errors, setErrors] = useState({});
  // const [isLoading, setIsLoading] = useState(false);
  // const navigate = useNavigate();

  // Ensure that the form has a title and at least two options
  function validateForm() {
    const newErrors = {};

    // Check for title
    if (!pollData.title) {
      newErrors.title = "Title is required";
    }
    // Check for description
    if (!pollData.description) {
      newErrors.description = "Description is required";
    }

    // TODO: Check for at least two poll options

    // TODO: Check for an expiration date

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Handle form submission
  async function handleSubmit(e) {
    console.log("Submit");
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // axios call to polls api
    try {
      const response = await axios.post(`${API_URL}/api/polls`, pollData);
      console.log("POLLDATA", pollData);
      console.log("Poll created successfully");
      const new_poll_id = response.data.poll_id; // save the poll_id of the poll that was just created
      console.log("POLL ID", new_poll_id);
      setPollOptions(pollOptions.map(option => ({ ...option, poll_id: new_poll_id })));
      console.log("POLLOPTIONS", pollOptions);
    } catch (error) {
      console.error(error);
      console.log("Poll creation failed");
    }

    // axios call to options api
    // try {
    //   const response = await axios.post(`${API_URL}/api/options`, pollOptions)
    //   console.log("RESPONSE", response.date)
    //   console.log(`Options for poll ${new_poll_id} added succesfully.`)
    // } catch (error) {
    //   console.error(error);
    //   console.log(`Failed to add options for poll ${new_poll_id}.`)
    // }

  }

  function handleTextChange(e) {
    const { name, value } = e.target;
    setPollData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  }

  function handleDateChange(e) {
    setPollData({
      ...pollData,
      expiration: e.target.value,
    });
  }

  function handleCheckboxChange(e) {
    console.log("Changing auth requirement.");
    console.log(e.target.checked);
    setPollData({
      ...pollData,
      auth_required: e.target.checked,
    });
    console.log("auth_required", pollData.auth_required);
  }

  return (
    <div>
      <h1>Make a Poll</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Poll Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={pollData.title}
            onChange={handleTextChange}
            className={errors.title ? "error" : ""}
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Poll Description:</label>
          <textarea
            id="description"
            name="description"
            value={pollData.description}
            onChange={handleTextChange}
            className={errors.description ? "error" : ""}
          ></textarea>
          {errors.description && (
            <span className="error-text">{errors.description}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="exp-date">Expiration Date:</label>
          <input
            type="date"
            id="exp-date"
            name="exp-date"
            value={pollData.expiration}
            onChange={handleDateChange}
            className={errors.expiration ? "error" : ""}
          />
        </div>

        <div className="form-group">
          <label htmlFor="auth_required">Require Authentication?</label>
          <input
            type="checkbox"
            id="auth_required"
            name="auth_required"
            checked={pollData.auth_required}
            onChange={handleCheckboxChange}
          />
        </div>

        <MakePollOptions 
          pollOptions={pollOptions}
          setPollOptions={setPollOptions}
          newOption={newOption}
          setNewOption={setNewOption}
        />

        <div className="button-container">
          <button type="button">Save Draft</button>
          <button type="submit">Publish Poll</button>
        </div>
      </form>
      <p>Poll Title: {pollData.title}</p>
      <p>Poll Description: {pollData.description}</p>
      <p>Requires auth?: {pollData.auth_required}</p>
      <p>Expiration Date: {pollData.expiration}</p>
    </div>
  );
}
