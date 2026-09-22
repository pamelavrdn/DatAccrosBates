import React, { useEffect } from "react";
import "./success.css";
import { PiSealCheckFill } from "react-icons/pi";

const Success = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Appeler la fonction onClose après 3 secondes
    }, 3000);

    return () => {
      clearTimeout(timer); // Nettoyer le timer lorsque le composant est démonté
    };
  }, [onClose]);

  return (
    <div className="page">
      <h1 className="text">{message}</h1>
      <PiSealCheckFill className="logo" />
    </div>
  );
};

export default Success;
