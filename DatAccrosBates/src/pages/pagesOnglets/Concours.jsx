import React, { useEffect } from "react";
import BoutonOnglets from "../../components/boutons/BoutonOnglets";

const Concours = ({ children }) => {
  useEffect(() => {
    document.title = "Concours";
  }, []);

  const onglets = [
    { label: "Créer", lien: "/creer-concours" },
    { label: "Modifier", lien: "/modifier-concours" },
  ];

  return (
    <>
      <BoutonOnglets onglets={onglets} />
      {children}
    </>
  );
};

export default Concours;
