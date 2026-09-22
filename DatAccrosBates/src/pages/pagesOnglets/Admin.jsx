import React, { useEffect } from "react";
import BoutonOnglets from "../../components/boutons/BoutonOnglets";

const Admin = ({ children }) => {
  useEffect(() => {
    document.title = "Admins";
  }, []);

  const onglets = [
    { label: "Créer", lien: "/creer-admin" },
    { label: "Modifier", lien: "/modifier-admin" },
  ];

  return (
    <>
      <BoutonOnglets onglets={onglets} />
      {children}
    </>
  );
};

export default Admin;
