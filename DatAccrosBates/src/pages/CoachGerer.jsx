import React, { useEffect, useState } from "react";
import RechercheEtTri from "../components/rechercheEtTri/rechercheEtTri";
import UtilisateurListe from "../components/listes/UtilisateurListe";
import { useCoachSocieteData } from "../data/Data";
import Success from "../components/success/Success";
import FormulaireCoach from "../components/formulaire/FormulaireCoach";
import { useAuth } from "../hooks/authContext";
import "./coachGymnasteGerer.css";
import Carte from "../components/formulaire/carte/Carte";

const CoachGerer = () => {
  const { user } = useAuth();
  const { data: coachsData } = useCoachSocieteData(user.societeSelectionnee);

  const [personne, setPersonne] = useState({
    societes: [user.societeSelectionnee?.ref || ""],
  });
  const [searchCoach, setSearchCoach] = useState("");
  const [sortOptionCoach, setSortOptionCoach] = useState("nom");
  const [showSuccess, setShowSuccess] = useState(false);
  const [image, setImage] = useState(null);

  const [coach, setCoach] = useState({});

  const [modifVisible, setModifVisible] = useState(true);
  const [ajoutVisible, setAjoutVisible] = useState(false);
  const [modifClicked, setModifClicked] = useState(true);
  const [ajoutClicked, setAjoutClicked] = useState(false);

  const handleModifClick = () => {
    setModifClicked(true);
    setAjoutClicked(false);
    setAjoutVisible(false);
    setModifVisible(true);
  };

  const handleAjoutClick = () => {
    setAjoutClicked(true);
    setModifClicked(false);
    setAjoutVisible(true);
    setModifVisible(false);
  };

  useEffect(() => {
    document.title = "Mes Coachs";
  }, []);

  return (
    <>
      <p className="ajout-modif">
        <span
          className={modifClicked ? "clicked" : ""}
          onClick={handleModifClick}
        >
          Mes coachs
        </span>
        <span
          className={ajoutClicked ? "clicked" : ""}
          onClick={handleAjoutClick}
        >
          Ajouter
        </span>
      </p>
      {modifVisible && (
        <>
          {showSuccess && (
            <Success
              message={"Coach modifié.e avec succès"}
              onClose={() => setShowSuccess(false)}
            />
          )}
          <div className="box box-gymnaste">
            <RechercheEtTri
              type="coach"
              onSearchChange={(searchCoach) => setSearchCoach(searchCoach)}
              onSortChange={(sortOptionCoach) =>
                setSortOptionCoach(sortOptionCoach)
              }
            />
            {coachsData && (
              <UtilisateurListe
                utilisateurs={coachsData}
                searchUtilisateur={searchCoach}
                sortOptionUtilisateur={sortOptionCoach}
                onUtilisateurClick={(coachClique) => setCoach(coachClique)}
                display={true}
              />
            )}
          </div>

          {Object.keys(coach).length > 0 && (
            <FormulaireCoach
              isModify={true}
              isCoachConnected={true}
              personneAModifier={coach}
              personne={personne}
              setPersonne={setPersonne}
              setShowSuccess={setShowSuccess}
            />
          )}
        </>
      )}

      {ajoutVisible && (
        <>
          {showSuccess && (
            <Success
              message={"Coach créé.e avec succès"}
              onClose={() => setShowSuccess(false)}
            />
          )}
          <FormulaireCoach
            isModify={false}
            isCoachConnected={true}
            personne={personne}
            setPersonne={setPersonne}
            setShowSuccess={setShowSuccess}
          />
          <Carte
            isCoach={true}
            personne={personne}
            image={image}
            setImage={setImage}
          />
        </>
      )}
    </>
  );
};

export default CoachGerer;
