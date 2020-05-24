import React from "react";
import "./Select.css";

const Select = (props) => {
  return (
    <select className="select" onChange={props.handleChange}>
      {props.options
        ? props.options.map((option, key) => (
            <option value={option.value} key={key}>
              {option.text}
            </option>
          ))
        : null}
    </select>
  );
};

export default Select;
