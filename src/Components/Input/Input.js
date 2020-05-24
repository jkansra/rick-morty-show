import React from "react";
import "./Input.css";

const Input = (props) => {
  return (
    <input
      type="text"
      id={props.id}
      name={props.name}
      className="input"
      onChange={props.handleChange}
      placeholder={props.placeholder}
    />
  );
};

export default Input;
