import React, { useEffect } from "react";
import BoutonOnglets from "../../components/boutons/BoutonOnglets";

const Societe = ({ children }) => {
  useEffect(() => {
    document.title = "Sociétés";
  }, []);

  const onglets = [
    { label: "Créer", lien: "/creer-societe" },
    { label: "Modifier", lien: "/modifier-societe" },
  ];

  return (
    <>
      <BoutonOnglets onglets={onglets} />
      {children}
    </>
  );
};

export default Societe;
