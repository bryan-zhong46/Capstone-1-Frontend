import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";

/**
 * Component for creating a new poll.
 * A user can provide the following properties:
 * - title: string (required)
 * - description: string (required)
 * - options: array of strings (required, at least two options)
 * - expirationDate: date (required)
 */

<<<<<<< Updated upstream
export default function MakePoll({ setUser }) {
=======
// const today = new Date();
// const todaysDateString = today.toDateString();

export default function MakePoll({ user }) {
  // Get the poll_id of the poll being edited from the url
  // const params = useParams();
  // const poll_id = Number(params.id);

>>>>>>> Stashed changes
  // State to hold poll data
  const [pollData, setPollData] = useState({
    title: "",
    description: "",
  });
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

    try {
      await axios.post(`${API_URL}/api/polls`, pollData);
      console.log("Poll created successfully");
    } catch (error) {
      console.error(error);
      console.log("Poll creation failed");
    }
  }

  function handleChange(e) {
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
            onChange={handleChange}
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
            onChange={handleChange}
            className={errors.description ? "error" : ""}
          ></textarea>
          {errors.description && (
            <span className="error-text">{errors.description}</span>
          )}
        </div>

        <div className="button-container">
          <button type="submit">Publish Poll</button>
        </div>
      </form>
      <p>Poll Title: {pollData.title}</p> <br></br>
      <p>Poll Description: {pollData.description}</p>
    </div>
  );
}
