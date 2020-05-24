import React from "react";
import "./Badge.css";

const Badge = (props) => {
  return (
    <div className="badge">
      <span className="badge__text" title={props.text}>
        {props.text}
      </span>
      <span className="badge__icon">
        <i className={`fa ${props.icon} fa-lg`}></i>
      </span>
    </div>
  );
};

export default Badge;
