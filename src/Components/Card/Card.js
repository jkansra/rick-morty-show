import React from "react";
import "./Card.css";

const Card = (props) => {
  return (
    <div className="card">
      <div className="card__header">
        <img
          src={props.image}
          className="card__header__image"
          alt="character"
        />
        <div className="card__header__heading">
          <p className="card__header__heading__name">{props.name}</p>
          <p className="card__header__heading__description">
            id: {props.id}&nbsp;
            <span className="card__header__heading__description__created">
              - created {props.created} years ago
            </span>
          </p>
        </div>
      </div>
      <div className="card__content">
        <div className="card__content__data">
          <span className="card__content__data__key">Status</span>
          <span className="card__content__data__value">{props.status}</span>
        </div>
        <div className="card__content__data">
          <span className="card__content__data__key">SPECIES</span>
          <span className="card__content__data__value">{props.species}</span>
        </div>
        <div className="card__content__data">
          <span className="card__content__data__key">GENDER</span>
          <span className="card__content__data__value">{props.gender}</span>
        </div>
        <div className="card__content__data">
          <span className="card__content__data__key">ORIGIN</span>
          <span className="card__content__data__value">{props.origin}</span>
        </div>
        <div className="card__content__data">
          <span className="card__content__data__key">LAST LOCATION</span>
          <span className="card__content__data__value">{props.location}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
