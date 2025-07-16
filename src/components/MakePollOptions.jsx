import React, { useState } from "react";

export default function MakePollOptions({ poll }) {
  return (
    <div className="form-group">
      <h2>Please provide at least 2 poll options:</h2>

      <div className="option-container">
        <label htmlFor="option1">Option 1:</label>
        <input type="text" name="option1" placeholder="Option 2" />
        <button type="button">Delete</button>
      </div>

      <div className="option-container">
        <label htmlFor="option2">Option 2:</label>
        <input type="text" name="option2" placeholder="Option 2" />
        <button type="button">Delete</button>
      </div>

      <div className="option-container">
        <label>New Option:</label>
        <input type="text" name="newOption" placeholder="New Option" />
        <button type="button">Add Option</button>
      </div>
    </div>
  );
}
