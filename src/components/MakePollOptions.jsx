import React, { useState } from "react";

let nextId = 0;

export default function MakePollOptions() {
  const [pollOptions, setPollOptions] = useState([]);
  const [newOption, setNewOption] = useState("");

  function handleAddOption() {
    setPollOptions([...pollOptions, { id: nextId++, text: newOption }]);
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
          <li key={option.id}>
            {option.text}{" "}
            <button
              type="button"
              onClick={() => {
                setPollOptions(pollOptions.filter((o) => o.id !== option.id));
              }}
            >
              Delete
            </button>
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
    </div>
  );
}
