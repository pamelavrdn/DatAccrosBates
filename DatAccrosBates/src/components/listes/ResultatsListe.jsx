import React, { useState, useEffect } from "react";
import { LiaMedalSolid } from "react-icons/lia";
import { TfiMedallAlt } from "react-icons/tfi";

const ResultatsListe = ({ resultats, classement, recompense, equipe }) => {
  const [sortedResultats, setSortedResultats] = useState([]);

  // Modifier le nom de l'engin pour l'affichage
  const getEngin = (cle) => {
    switch (cle.toLowerCase()) {
      case "bf":
        return "Barre fixe";
      case "bp":
        return "Barres parallèles";
      case "sol":
        return "Sol";
      case "saut":
        return "Saut";
      case "anneaux":
        return "Anneaux";
      default:
        return "";
    }
  };

  // Déterminer le composant de récompense et la classe CSS en fonction de la récompense
  let MedalComponent;
  let medalCssClass = "";
  let testId = "";
  switch ((recompense || "").toLowerCase()) {
    case "or":
      MedalComponent = LiaMedalSolid;
      medalCssClass = "gold";
      testId = "gold";
      break;
    case "argent":
      MedalComponent = LiaMedalSolid;
      medalCssClass = "silver";
      testId = "silver";
      break;
    case "bronze":
      MedalComponent = LiaMedalSolid;
      medalCssClass = "bronze";
      testId = "bronze";
      break;
    case "distinction":
      MedalComponent = TfiMedallAlt;
      medalCssClass = "distinction";
      testId = "distinction";
      break;
    default:
      break;
  }

  // Effet pour trier les résultats une fois qu'ils sont mis à jour
  useEffect(() => {
    // Vérifiez si les résultats existent
    if (resultats) {
      // Triez les résultats par clé d'engin
      const keys = Object.keys(resultats);
      keys.sort(); // Triez les clés par ordre alphabétique
      // Créez un tableau trié des résultats basé sur les clés triées
      const sortedResultsArray = keys.map((key) => ({
        engin: key,
        valeur: resultats[key],
      }));
      setSortedResultats(sortedResultsArray);
    }
  }, [resultats]);

  // Calcul du résultat total
  const totalResultat =
    resultats && Object.values(resultats).length > 0
      ? Object.values(resultats)
          .reduce((acc, valeur) => acc + valeur, 0)
          .toFixed(2)
      : null;

  return (
    <>
      <div className="resultats-liste">
        {resultats &&
          sortedResultats.map((resultat, index) => (
            <div key={index} className="carte-engin" data-testid="carte-engin">
              <span>{getEngin(resultat.engin)}</span>
              <span className="resultat">{resultat.valeur.toFixed(2)}</span>
            </div>
          ))}
      </div>
      <div className="resultats-total">
        {totalResultat && (
          <>
            <div className="carte-total-classement">
              <div className="texte">
                <span>Total</span>
                <span>{totalResultat}</span>
              </div>
              {equipe && (
                <>
                  <div className="texte bordure">
                    <span>Équipe</span>
                    <span>{equipe.total}</span>
                  </div>
                </>
              )}
            </div>
            <div className="carte-total-classement">
              <div className="texte">
                <span>Classement</span>
                <div className="classement-icon">
                  <span>{classement}</span>
                  <div className="medal-icon">
                    {MedalComponent && (
                      <MedalComponent
                        className={medalCssClass}
                        data-testid={testId}
                      />
                    )}{" "}
                  </div>
                </div>
              </div>
              {equipe && (
                <>
                  <div className="texte bordure">
                    <span>Équipe</span>
                    <span>{equipe.classement}</span>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ResultatsListe;
