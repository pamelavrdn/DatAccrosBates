import React, { useEffect } from "react";
import BoutonOnglets from "../../components/boutons/BoutonOnglets";

const Gymnaste = ({ children }) => {
  useEffect(() => {
    document.title = "Gymastes";
  }, []);

  const onglets = [
    { label: "Créer", lien: "/creer-gymnaste" },
    { label: "Modifier", lien: "/modifier-gymnaste" },
  ];

  return (
    <>
      <BoutonOnglets onglets={onglets} />
      {children}
    </>
  );
};

export default Gymnaste;
