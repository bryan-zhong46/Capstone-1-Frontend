import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
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

// const today = new Date();
// const todaysDateString = today.toDateString();

export default function MakePoll({ user, isEditing }) {
  // Get the poll_id of the poll being edited from the url
  const params = useParams();
  const poll_id = Number(params.id);
  console.log("POLL ID FROM URL", poll_id);

  // State to hold poll data
  const [pollData, setPollData] = useState({
    title: "",
    creator_id: 0, // placeholder value
    description: "",
    auth_required: false,
    expiration: "2025-07-23", // TODO set this to today's date
    poll_status: "draft",
  });

  // State to hold poll options data to be passed down to MakePollOptions component
  const [pollOptions, setPollOptions] = useState([]);

  // State to hold text of the options currently being created, to be passed down to    MakePollOptions component
  const [newOption, setNewOption] = useState("");

  const [errors, setErrors] = useState({});
  // const [isLoading, setIsLoading] = useState(false);
  // const navigate = useNavigate();

  // TODO Fetch data of a draft poll
  async function fetchDraft(poll_id) {
    // if (isEditing) {
    try {
      // get poll data of the draft poll
      const dPollResponse = await axios.get(`${API_URL}/api/polls/${poll_id}`);
      console.log("DRAFT POLL RESPONSE", dPollResponse);
      // get all poll options associated with the draft poll
      const dOptionsResponse = await axios.get(
        `${API_URL}/api/polls/${poll_id}/options`,
      );
      console.log(dOptionsResponse);
      const dPollData = dPollResponse.data;
      const dPollOptions = dOptionsResponse.data;
      setPollData(dPollData);
      setPollOptions(dPollOptions);
      console.log("DRAFT POLL DATA: ", dPollData);
      console.log("DRAFT POLL OPTIONS: ", dPollOptions);
    } catch (error) {
      console.log("Failed to fetch draft data");
      console.error(error);
    }
    // } else {
    //   return;
  }

  // Ensure that the form has a title and at least two options
  function validateForm() {
    const newErrors = {};

    // Check for title
    if (!pollData.title) {
      newErrors.title = "Title is required";
    }
    // Check for description
    // if (!pollData.description) {
    //   newErrors.description = "Description is required";
    // }

    // TODO: Check for at least two poll options

    // TODO: Check for an expiration date

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // // Handle saving poll as draft
  async function handleSave(e) {
    e.preventDefault();

    // axios call to polls API
    try {
      const response = await axios.post(`${API_URL}/api/polls`, {
        pollData,
        pollOptions,
      });
      console.log("RESPONSE", response);
      console.log("Poll saved successfully");
    } catch (error) {
      console.error(error);
      console.log("Failed to save poll");
    }
  }

  // Handle poll publication
  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // axios call to polls api
    try {
      const response = await axios.post(`${API_URL}/api/polls/published`, {
        pollData,
        pollOptions,
      });
      console.log("POLLDATA", pollData);
      console.log("POLL OPTIONS", pollOptions);
      console.log("Poll created successfully");
      console.log("POLL RESPONSE", response);
    } catch (error) {
      console.error(error);
      console.log("Poll creation failed");
    }
    // const new_poll_id = response.data.poll_id; // save the poll_id of the poll that was just created
    // console.log("POLL ID", new_poll_id);

    // setPollData({ ...pollData, poll_id: new_poll_id }); // <- this does not update
    // console.log("UPDATE POLLDATA", pollData);

    // setPollOptions(
    //   pollOptions.map((option) => ({ ...option, poll_id: new_poll_id })),
    // );
    // console.log("POLLOPTIONS", pollOptions);

    // assign the new poll_id to each option <- this does not work
    // setPollOptions(
    //   pollOptions.map((option) => ({ ...option, poll_id: pollData.poll_id })),
    // );
    // console.log("POLLOPTIONS", pollOptions);

    // axios call to options api
    //   try {
    //     const response = await axios.post(`${API_URL}/api/options`, pollOptions);
    //     console.log("OPTION RESPONSE", response.data);
    //     console.log(`Option added succesfully.`);
    //   } catch (error) {
    //     console.error(error);
    //     console.log(`Failed to add option.`);
    //   }
  } // end of handleSubmit

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
    // console.log("Changing auth requirement.");
    console.log(e.target.checked);
    setPollData({
      ...pollData,
      auth_required: e.target.checked,
    });
    // console.log("auth_required", pollData.auth_required);
  }

  useEffect(() => {
    fetchDraft(poll_id);
  }, []);

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
          <button type="button" onClick={handleSave}>
            Save Draft
          </button>
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
