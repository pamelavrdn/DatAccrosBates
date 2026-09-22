import "./boutonLogin.css";
import React from "react";

const BoutonLogin = ({ onClick, texte }) => {
  return (
    <button className="bouton-login" onClick={onClick}>
      <span className="circle1"></span>
      <span className="circle2"></span>
      <span className="circle3"></span>
      <span className="circle4"></span>
      <span className="circle5"></span>
      <span className="texte">{texte}</span>
    </button>
  );
};

export default BoutonLogin;
