import React, { useState, useEffect } from "react";
import "./ProgressBar.css"; // Assurez-vous d'avoir un fichier de style pour la barre de progression

const ProgressBar = ({ progress }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Mise à jour de la largeur de la barre de progression lorsque la valeur de la progression change
    setWidth(progress);
  }, [progress]);

  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${width}%` }}></div>
    </div>
  );
};

export default ProgressBar;
