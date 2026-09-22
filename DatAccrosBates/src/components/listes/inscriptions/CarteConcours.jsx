import React, { useState } from "react";
import { formatDateLong } from "../../../data/Data";
import "./carteConcours.css";

const CarteConcours = ({ concours, setSelectedConcours, selectedConcours }) => {
  const [showMore, setShowMore] = useState(false);

  const handleClick = () => {
    setSelectedConcours(concours);
  };

  return (
    <>
      <div
        className={
          "card" +
          (selectedConcours && selectedConcours.nom === concours.nom
            ? "-selected"
            : "")
        }
        onClick={handleClick}
        onMouseEnter={() => setShowMore(true)}
        onMouseLeave={() => setShowMore(false)}
      >
        <div className="card-more">
          {showMore && (
            <p className="text-body">
              {concours.equipe ? "Equipe" : "Individuel"}
            </p>
          )}
        </div>
        <div className="card-details">
          <p className="text-title">{concours.nom}</p>
          <p className="text-body">
            {formatDateLong(concours.date)} <br />
            {concours.lieu} <br />
            {"C" + concours.categories.join(", C")}
          </p>
        </div>
        <button className="card-button">Choisir ce concours</button>
      </div>
    </>
  );
};

export default CarteConcours;
