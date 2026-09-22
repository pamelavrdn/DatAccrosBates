import React, { useEffect, useState, useContext } from "react";
import RechercheEtTri from "../components/rechercheEtTri/rechercheEtTri";
import Success from "../components/success/Success";
import GymnasteListe from "../components/listes/GymnasteListe";
import FormulaireGymnaste from "../components/formulaire/FormulaireGymnaste";
import { useGymnastesSocieteData } from "../data/Data";
import { useAuth } from "../hooks/authContext";
import Carte from "../components/formulaire/carte/Carte";
import "./coachGymnasteGerer.css";

const GymnasteGerer = () => {
  const [personne, setPersonne] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [image, setImage] = useState(null);

  const { user } = useAuth();
  const { data: gymnastesData } = useGymnastesSocieteData(
    user.societeSelectionnee
  );

  const [searchGymnaste, setSearchGymnaste] = useState("");
  const [sortOptionGymnaste, setSortOptionGymnaste] = useState("nom");

  const [gymnaste, setGymnaste] = useState({});

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
    document.title = "Mes Gymnastes";
  }, []);

  return (
    <>
      <p className="ajout-modif">
        <span
          className={modifClicked ? "clicked" : ""}
          onClick={handleModifClick}
        >
          Mes gymnastes
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
              message={"Gymnaste modifié.e avec succès"}
              onClose={() => setShowSuccess(false)}
            />
          )}
          <div className="box box-gymnaste">
            <RechercheEtTri
              type="gymnaste"
              onSearchChange={(searchGymnaste) =>
                setSearchGymnaste(searchGymnaste)
              }
              onSortChange={(sortOptionGymnaste) =>
                setSortOptionGymnaste(sortOptionGymnaste)
              }
            />

            {gymnastesData && (
              <GymnasteListe
                gymnastes={gymnastesData}
                searchGymnaste={searchGymnaste}
                sortOptionGymnaste={sortOptionGymnaste}
                onGymnasteClick={(gymnasteClique) =>
                  setGymnaste(gymnasteClique)
                }
                display={true}
              />
            )}
          </div>

          {Object.keys(gymnaste).length > 0 && (
            <FormulaireGymnaste
              isModify={true}
              isCoachConnected={true}
              personneAModifier={gymnaste}
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
              message={"Gymnaste créé.e avec succès"}
              onClose={() => setShowSuccess(false)}
            />
          )}
          <FormulaireGymnaste
            isModify={false}
            isCoachConnected={true}
            personne={personne}
            setPersonne={setPersonne}
            setShowSuccess={setShowSuccess}
          />
          <Carte
            isGymnaste={true}
            personne={personne}
            image={image}
            setImage={setImage}
          />
        </>
      )}
    </>
  );
};

export default GymnasteGerer;
