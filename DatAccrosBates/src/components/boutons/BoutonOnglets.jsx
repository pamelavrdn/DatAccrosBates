import "./boutonOnglets.css";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BoutonOnglets = ({ onglets }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="onglets">
      {onglets.map((onglet, index) => (
        <button
          key={index}
          className={`bouton-onglet ${
            location.pathname === onglet.lien ? "active" : ""
          }`}
          onClick={() => navigate(onglet.lien)}
        >
          {onglet.label}
          <div className="barre-onglet"></div>
        </button>
      ))}
    </div>
  );
};

export default BoutonOnglets;
