import BoutonOnglets from "../../components/boutons/BoutonOnglets";
import React, { useEffect } from "react";

const Coach = ({ children }) => {
  const onglets = [
    { label: "Créer", lien: "/creer-coach" },
    { label: "Modifier", lien: "/modifier-coach" },
  ];

  useEffect(() => {
    document.title = "Coachs";
  }, []);

  return (
    <>
      <BoutonOnglets onglets={onglets} />
      {children}
    </>
  );
};

export default Coach;
