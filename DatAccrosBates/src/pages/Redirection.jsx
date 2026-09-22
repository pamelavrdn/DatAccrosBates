import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FcOk } from "react-icons/fc";
import "./redirection.css";

const Redirection = () => {
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();
  const [message, setMessage] = useState(
    "Vous avez été déconnecté avec succès !"
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (countdown > 1) {
        setCountdown(countdown - 1);
      } else {
        navigate("/accueil");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="redirect-container">
      <p className="redirect-message">
        {message} <FcOk />
      </p>
      <p className="redirect-countdown">
        Redirection dans ... <p>{countdown}</p>
      </p>
    </div>
  );
};

export default Redirection;
