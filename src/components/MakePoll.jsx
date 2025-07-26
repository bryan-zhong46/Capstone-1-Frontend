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

export default function MakePoll({ user }) {
  // Get the poll_id of the poll being edited from the url
  const params = useParams();
  const urlId = Number(params.id);
  console.log("POLL ID FROM URL", urlId);

  // State to hold poll data
  const [pollData, setPollData] = useState({
    title: "",
    creator_id: 0, // placeholder value
    // creator_id: user.id,
    description: "",
    auth_required: false,
    expiration: "2025-07-23", // TODO set this to today's date
    poll_status: "draft",
  });

  // State to hold poll options data to be passed down to MakePollOptions component
  const [pollOptions, setPollOptions] = useState([]);

  // State to hold text of the options currently being created, to be passed down to MakePollOptions component
  const [newOption, setNewOption] = useState("");

  const [errors, setErrors] = useState({});
  // const [isLoading, setIsLoading] = useState(false);
  // const navigate = useNavigate();
  // Variable to track if poll is being published or not
  let isPublishing = false;
  // Fetch data of a draft poll
  async function fetchDraft(urlId) {
    // const poll_id = Number(params.id);
    try {
      // get poll data of the provided poll_id
      const dPollResponse = await axios.get(`${API_URL}/api/polls/${urlId}`);
      console.log("DRAFT POLL RESPONSE", dPollResponse);
      // get all poll options associated with the provided poll_id
      const dOptionsResponse = await axios.get(
        `${API_URL}/api/polls/${urlId}/options`
      );
      console.log(dOptionsResponse);
      // set the state
      const dPollData = dPollResponse.data;
      const dPollOptions = dOptionsResponse.data;
      console.log("DRAFT POLL DATA: ", dPollData);
      console.log("DRAFT POLL OPTIONS: ", dPollOptions);
      setPollData(dPollData);
      setPollOptions(dPollOptions);
    } catch (error) {
      console.log("Failed to fetch draft data");
      console.error(error);
    }
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

    // Check that the poll currently being edited hasn't already been published
    if (pollData.poll_status === "published") {
      newErrors.published =
        "This poll has already been published and cannot be edited.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // // Handle saving poll as draft
  async function handleSave(e) {
    e.preventDefault();

    // If a poll ID was provided in the URL, then use the patch route to update the existing poll.
    // Otherwise, use a post route to save/publish a new poll.
    if (isNaN(urlId)) {
      // no poll id provided, creating a new draft poll
      // axios POST call to polls API
      try {
        const response = await axios.post(`${API_URL}/api/polls`, {
          pollData,
          pollOptions,
          isPublishing,
        });
        console.log("RESPONSE", response);
        console.log("New poll saved successfully");
      } catch (error) {
        console.error(error);
        console.log("Failed to save poll");
      }
    } else {
      // poll id was provided, updating a draft poll and saving the changes
      // axios PATCH call to polls API
      try {
        const response = await axios.patch(`${API_URL}/api/polls/${urlId}`, {
          pollData,
          pollOptions,
          isPublishing,
        });
        console.log("PATCHED POLLDATA: ", pollData);
        console.log("PATCHED POLLOPTIONS: ", pollOptions);
        console.log("RESPONSE", response);
        console.log("Poll updated and saved successfully");
      } catch (error) {
        console.error(error);
        console.log("Failed to save poll");
      }
    }
  }

  // Handle poll publication
  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    isPublishing = true;
    // If a poll ID was provided in the URL, then use the patch route to update the existing poll.
    // Otherwise, use a post route to save/publish a new poll.
    if (isNaN(urlId)) {
      // no poll_id provided, publishing a brand new poll
      // axios POST call to polls API
      try {
        const response = await axios.post(`${API_URL}/api/polls`, {
          pollData,
          pollOptions,
          isPublishing,
        });
        console.log("POLLDATA", pollData);
        console.log("POLL OPTIONS", pollOptions);
        console.log("New poll published successfully");
        console.log("POLL RESPONSE", response);
      } catch (error) {
        console.error(error);
        console.log("Poll creation failed");
      }
    } else {
      // poll_id was provided, publishing a poll that was in draft mode
      // axios PATCH call to polls API
      try {
        const response = await axios.patch(`${API_URL}/api/polls/${urlId}`, {
          pollData,
          pollOptions,
          isPublishing,
        });
        console.log("POLLDATA", pollData);
        console.log("POLL OPTIONS", pollOptions);
        console.log("Draft poll published successfully");
        console.log("POLL RESPONSE", response);
      } catch (error) {
        console.error(error);
        console.log("Poll creation failed");
      }
    }
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
    fetchDraft(urlId);
  }, [urlId]);

  return (
    <div>
      {errors.published && (
        <span className="error-text">{errors.published}</span>
      )}
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
    </div>
  );
}
