import "./boutonGlobal.css";
import React from "react";

const BoutonGlobal = ({ texte, onClick }) => {
  return (
    <button className="bouton-global" onClick={onClick}>
      <p className="bouton-texte">{texte}</p>
    </button>
  );
};

export default BoutonGlobal;
