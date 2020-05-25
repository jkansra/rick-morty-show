import React from "react";
import "./Checkbox.css";

const Checkbox = (props) => {
  return (
    <div className="checkbox">
      <input
        type="checkbox"
        onChange={props.handleCheckbox}
        id={props.id}
        value={props.label}
        checked={props.isChecked}
      />
      <label htmlFor={props.id} className="checkbox__label">
        {props.label}
      </label>
    </div>
  );
};

export default Checkbox;
