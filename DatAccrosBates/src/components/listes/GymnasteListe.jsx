import React, { useState, useEffect } from "react";
import CarteListe from "./CarteListe";

const GymnasteListe = ({
  gymnastes,
  searchGymnaste,
  sortOptionGymnaste,
  onGymnasteClick,
  display,
}) => {
  const [listeGymnastes, setListeGymnastes] = useState([]);
  const [clickedId, setClickedId] = useState(null);

  const handleClick = (gymnaste) => {
    setClickedId(gymnaste.id);
    onGymnasteClick(gymnaste);
  };

  useEffect(() => {
    // Vérifie si display est faux et s'il n'y a pas de recherche
    if (!display && searchGymnaste.trim() === "") {
      setListeGymnastes([]);
      return;
    }

    const nouvelleListe = gymnastes
      .filter(
        (gymnaste) =>
          (searchGymnaste.trim() !== "" && // Condition appliquée uniquement si la recherche n'est pas vide
            ((gymnaste.prenom + " " + gymnaste.nom || "")
              .toString()
              .toLowerCase()
              .includes(searchGymnaste.toLowerCase()) ||
              (gymnaste.nom + " " + gymnaste.prenom || "")
                .toString()
                .toLowerCase()
                .includes(searchGymnaste.toLowerCase()) ||
              (gymnaste.noFSG || "")
                .toString()
                .toLowerCase()
                .includes(searchGymnaste.toLowerCase()) ||
              `c${(gymnaste.categorie || "").toLowerCase()}` ===
                searchGymnaste.toLowerCase())) ||
          searchGymnaste.trim() === "" // Tous les gymnastes sont affichées si la recherche est vide
      )
      .sort((a, b) =>
        sortOptionGymnaste === "nom"
          ? a.nom?.localeCompare(b.nom)
          : a.categorie?.localeCompare(b.categorie)
      );
    setListeGymnastes(nouvelleListe);
  }, [searchGymnaste, sortOptionGymnaste, gymnastes]);

  return (
    <div className="liste">
      {listeGymnastes.map((gymnaste, index) => (
        <div
          key={index}
          className={`carte-liste ${
            clickedId === gymnaste.id ? "cliquee" : ""
          }`}
          onClick={() => handleClick(gymnaste)}
          data-testid="carte-liste"
        >
          <CarteListe
            textePrincipal={`${gymnaste.nom || ""} ${gymnaste.prenom || ""}`}
            texteSecondaire={`N° fsg : ${gymnaste.noFSG || ""}`}
            texteComplementaire={`C${gymnaste.categorie || ""}`}
          />
        </div>
      ))}
    </div>
  );
};

export default GymnasteListe;
