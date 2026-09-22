import React, { useState, useEffect } from "react";
import CarteListe from "./CarteListe";

const UtilisateurListe = ({
  utilisateurs,
  searchUtilisateur,
  sortOptionUtilisateur,
  onUtilisateurClick,
}) => {
  const [listeUtilisateurs, setListeUtilisateurs] = useState([]);
  const [clickedId, setClickedId] = useState(null);

  const handleClick = (utilisateur) => {
    setClickedId(utilisateur.id);
    onUtilisateurClick(utilisateur);
  };

  useEffect(() => {
    const nouvelleListe = utilisateurs
      .filter(
        (utilisateur) =>
          (searchUtilisateur.trim() !== "" && // Condition appliquée uniquement si la recherche n'est pas vide
            ((utilisateur.nom + " " + utilisateur.prenom || "")
              .toString()
              .toLowerCase()
              .includes(searchUtilisateur.toLowerCase()) ||
              (utilisateur.prenom + " " + utilisateur.nom || "")
                .toString()
                .toLowerCase()
                .includes(searchUtilisateur.toLowerCase()) ||
              (utilisateur.email || "")
                .toString()
                .toLowerCase()
                .includes(searchUtilisateur.toLowerCase()))) ||
          searchUtilisateur.trim() === "" // Tous les coachs sont affichées si la recherche est vide
      )
      .sort((a, b) =>
        sortOptionUtilisateur === "nom"
          ? a.nom?.localeCompare(b.nom)
          : a.email?.localeCompare(b.email)
      );

    setListeUtilisateurs(nouvelleListe);
  }, [searchUtilisateur, sortOptionUtilisateur, utilisateurs]);

  return (
    <div className="liste">
      {listeUtilisateurs.map((utilisateur, index) => (
        <div
          key={index}
          className={`carte-liste ${
            clickedId === utilisateur.id ? "cliquee" : ""
          }`}
          onClick={() => handleClick(utilisateur)}
          data-testid="carte-liste"
        >
          <CarteListe
            textePrincipal={`${utilisateur.nom || ""} ${
              utilisateur.prenom || ""
            }`}
            texteSecondaire={`Email : ${utilisateur.email || ""}`}
          />
        </div>
      ))}
    </div>
  );
};

export default UtilisateurListe;
