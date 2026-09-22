import "./carteListe.css";
import React from "react";

const CarteListe = ({
  textePrincipal,
  texteSecondaire,
  texteComplementaire,
}) => {
  return (
    <>
      <div className="texte">
        <div className="texte-principal">
          <span>{textePrincipal}</span>
          <span>{texteComplementaire}</span>
        </div>
        <span className="texte-secondaire">{texteSecondaire}</span>
      </div>
    </>
  );
};

export default CarteListe;
