import React, { useState, useEffect } from "react";
import CarteListe from "./CarteListe";

const SocieteListe = ({
  societes,
  searchSociete,
  sortOptionSociete,
  onSocieteClick,
}) => {
  const [listeSocietes, setListeSocietes] = useState([]);
  const [clickedId, setClickedId] = useState(null);

  const handleClick = (societe) => {
    setClickedId(societe.id);
    onSocieteClick(societe);
  };

  useEffect(() => {
    const nouvelleListe = societes
      .filter(
        (societe) =>
          (searchSociete.trim() !== "" && // Condition appliquée uniquement si la recherche n'est pas vide
            (societe.nom.toLowerCase().includes(searchSociete.toLowerCase()) ||
              societe.email
                .toLowerCase()
                .includes(searchSociete.toLowerCase()))) ||
          searchSociete.trim() === "" // Toutes les sociétés sont affichées si la recherche est vide
      )
      .sort((a, b) =>
        sortOptionSociete === "nom"
          ? a.nom?.localeCompare(b.nom)
          : a.email?.localeCompare(b.email)
      );

    setListeSocietes(nouvelleListe);
  }, [searchSociete, sortOptionSociete, societes]);

  return (
    <div className="liste">
      {listeSocietes.map((societe, index) => (
        <div
          key={index}
          className={`carte-liste ${clickedId === societe.id ? "cliquee" : ""}`}
          onClick={() => handleClick(societe)}
          data-testid="carte-liste"
        >
          <CarteListe
            textePrincipal={societe.nom}
            texteSecondaire={`E-mail : ${societe.email}`}
          />
        </div>
      ))}
    </div>
  );
};

export default SocieteListe;
