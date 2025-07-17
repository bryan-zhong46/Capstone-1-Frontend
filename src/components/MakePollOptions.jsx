import React, { useState } from "react";

export default function MakePollOptions() {
  const [pollOptions, setPollOptions] = useState([]);
  const [newOption, setNewOption] = useState("");

  function handleAddOption(e) {
    e.preventDefault();

    console.log("Adding new option.");
    setPollOptions([...pollOptions, newOption]);
    setNewOption("");
  }
  
  function handleChange(e) {
    setNewOption(e.target.value);
  }

  return (
    <div className="form-group">
      <h2>Please provide at least 2 poll options:</h2>

      <ul>
        {pollOptions.map((option) => (
          <li>
            {option}
            <button type="button">Delete</button>
          </li>
        ))}
      </ul>

      <div className="option-container">
        <label>New Option:</label>
        <input
          type="text"
          name="newOption"
          placeholder="New Option"
          value={newOption}
          onChange={handleChange}
        />
        <button type="button" onClick={handleAddOption}>
          Add Option
        </button>
      </div>

      <p>Poll Options: {pollOptions}</p>
    </div>
  );
}
