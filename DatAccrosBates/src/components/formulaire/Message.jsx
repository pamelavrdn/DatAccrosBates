// Description: Ce composant permet d'afficher un message d'erreur ou de validation en fonction de la validité du formulaire.

// ======================= Importations =======================
import React from "react";
// *** CSS ***
import "./message.css";
// *** React Icons ***
import { FcOk } from "react-icons/fc";
import { FcHighPriority } from "react-icons/fc";

const Message = ({ formIsValid }) => {
  return (
    <div className="form-message">
      {!formIsValid && (
        <>
          <p className="invalid">
            <FcHighPriority /> Veuillez remplir tous les champs
          </p>
        </>
      )}

      {formIsValid && (
        <>
          <p className="valid">
            <FcOk /> Tous les champs sont remplis
          </p>
        </>
      )}
    </div>
  );
};

export default Message;
