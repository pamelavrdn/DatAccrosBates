/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "./rechercheEtTri.css";

const RechercheEtTri = ({ type, onSearchChange, onSortChange }) => {
  let placeholderText;
  let radioValue;
  let radioSpan;
  let radioName;

  if (type === "gymnaste") {
    placeholderText = "Rechercher un gymnaste";
    radioValue = ["nom", "categorie"];
    radioSpan = ["Nom", "Catégorie"];
    radioName = "radio-gymnaste";
  } else if (type === "concours") {
    placeholderText = "Rechercher un concours";
    radioValue = ["nom", "date"];
    radioSpan = ["Nom", "Date"];
    radioName = "radio-concours";
  } else if (type === "societe") {
    placeholderText = "Rechercher une société";
    radioValue = ["nom", "email"];
    radioSpan = ["Nom", "Email"];
    radioName = "radio-societe";
  } else if (type === "coach") {
    placeholderText = "Rechercher un coach";
    radioValue = ["nom", "email"];
    radioSpan = ["Nom", "Email"];
    radioName = "radio-coach";
  } else if (type === "admin") {
    placeholderText = "Rechercher un admin";
    radioValue = ["nom", "email"];
    radioSpan = ["Nom", "Email"];
    radioName = "radio-admin";
  } else if (type === "inscription") {
    placeholderText = "Rechercher un gymnaste";
    radioValue = ["", "M", "F"];
    radioSpan = ["Tous", "Homme", "Femme"];
    radioName = "radio-gymnaste";
  }

  const [selectedSortOption, setSelectedSortOption] = useState(radioValue[0]);

  const handleSortChange = (e) => {
    setSelectedSortOption(e.target.value);
    onSortChange(e.target.value);
  };

  return (
    <div className="filtre-tri">
      <input
        className="recherche"
        type="text"
        placeholder={placeholderText}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className="radio-inputs">
        {radioValue.map((value, index) => (
          <label className="radio" key={index}>
            <input
              type="radio"
              name={radioName}
              className="radio-input"
              value={value}
              checked={selectedSortOption === value}
              onChange={handleSortChange}
            />
            <span className="radio-span">{radioSpan[index]}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RechercheEtTri;
