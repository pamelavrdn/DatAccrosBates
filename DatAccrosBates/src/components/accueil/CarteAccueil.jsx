import "./carteAccueil.css";
import React from "react";
import { useNavigate } from "react-router-dom";

const CarteAccueil = ({ title, description, link }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(link); // Call navigate when the click event occurs
  };

  return (
    <div
      className="dashboard-section"
      // mettre le cursor:pointer quand on passe dessus le dashboard-section
      style={link ? { cursor: "pointer" } : { cursor: "default" }}
    >
      <div className="notification" onClick={handleClick}>
        <div className="notiglow"></div>
        <div className="notiborderglow"></div>
        <div className="notititle">{title}</div>
        <div className="notibody">{description}</div>
      </div>
    </div>
  );
};

export default CarteAccueil;
