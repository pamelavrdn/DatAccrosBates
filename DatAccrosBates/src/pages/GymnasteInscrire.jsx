// ================== IMPORTATIONS ==================
// *** CSS ***
import "./GymnasteInscrire.css";
// *** REACT ***
import React, { useEffect, useState } from "react";
// *** COMPOSANTS ***
import GymnasteTable from "../components/listes/inscriptions/GymnasteTable";
import CarteConcours from "../components/listes/inscriptions/CarteConcours";
// *** ICONS ***
import { MdExpandLess, MdExpandMore } from "react-icons/md";
// *** REACT-COLLAPSIBLE ***
import Collapsible from "react-collapsible";
// *** DONNEES ***
import {
  useConcoursData,
  useGymnastesSocieteData,
  useInscriptionData,
  useAddInscription,
  formatDatePoint,
  formatDateLong,
} from "../data/Data";
import { useAuth } from "../hooks/authContext";
import { Button, Typography } from "@material-ui/core";
import Success from "../components/success/Success";

const GymnasteInscrire = () => {
  // ================= DECLARATION DES VARIABLES ===================
  // ** DONNEES **
  const { user } = useAuth();
  const { data: concoursData } = useConcoursData();
  const { data: gymnastesData } = useGymnastesSocieteData(
    user.societeSelectionnee
  );

  // ** VARIABLES **
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedConcours, setSelectedConcours] = useState("");
  const [gymnastesInscrits, setGymnastesInscrits] = useState([]);
  useState([]);
  const [modifiable, setModifiable] = useState(false);

  // Données des gymnastes déjà inscrits
  const { data: gymnastesDejaInscritsData } = useInscriptionData(
    user.societeSelectionnee,
    selectedConcours
  );
  const { mutateAsync: mutateAddInscription } = useAddInscription(
    user.societeSelectionnee,
    selectedConcours,
    gymnastesInscrits
  );

  // Données des équipes
  const [equipesData, setEquipesData] = useState([]);

  // ** ETATS (FRONT-END) **
  const [tableauGridRow, setTableauGridRow] = useState("2 / 12");
  const [tableauMarginTop, setTableauMarginTop] = useState("0px");
  const [zIndexVar, setZIndexVar] = useState(10);
  const [textCollapsed, setTextCollapsed] = useState(
    <span>
      <MdExpandMore /> Liste des concours <MdExpandMore />
    </span>
  );
  const [collapsed, setCollapsed] = useState(!selectedConcours);
  // ======================================================

  /* ================= fonction BACK-END =================== */
  // Fonction pour ajouter un gymnaste inscrit
  const addGymnaste = (gymnaste, gymnasteInfos) => {
    // Vérifie si le gymnaste est déjà présent dans la liste
    const gymnasteExistant = gymnastesInscrits.find(
      (g) => g.id === gymnaste.id
    );

    // Si le gymnaste n'existe pas déjà, l'ajouter à la liste
    if (!gymnasteExistant) {
      // si aucune information supplémentaire n'est fournie, ajouter le gymnaste avec les informations par défaut
      gymnaste.categorieConcours =
        gymnasteInfos.categorieConcours || gymnaste.categorie;
      gymnaste.categorieSup = gymnasteInfos.catSup || false;
      if (selectedConcours.equipe) {
        gymnaste.equipe = gymnasteInfos.equipe || null;
      }
      setGymnastesInscrits((prevGymnastesInscrits) => [
        ...prevGymnastesInscrits,
        gymnaste,
      ]);
    }
  };
  // Fonction pour supprimer un gymnaste inscrit
  const removeGymnaste = (gymnaste) => {
    let updatedGymnastesInscrits;

    // Met à jour la liste des gymnastes inscrits
    if (selectedConcours.equipe) {
      delete gymnaste.equipe;
      updatedGymnastesInscrits = gymnastesInscrits
        .filter((g) => "equipe" in g)
        .filter((g) => g.id !== gymnaste.id);
    } else {
      updatedGymnastesInscrits = gymnastesInscrits.filter(
        (g) => g.id !== gymnaste.id
      );
    }
    // Filtrer les gymnastes qui ont un champ "equipe" défini
    setGymnastesInscrits(updatedGymnastesInscrits);
  };

  // ======================================================

  /* ================= fonction FRONT-END =================== */
  const handleOpening = () => {
    setTableauGridRow("2 / 12");
    setTableauMarginTop("0px");
    setZIndexVar(10);
    setTextCollapsed(
      <span>
        <MdExpandMore /> Liste des concours <MdExpandMore />
      </span>
    );
  };
  const handleClosing = () => {
    setTableauGridRow("2 / 12");
    setTableauMarginTop("0px");
    setZIndexVar(22);
    setTextCollapsed(
      <span>
        <MdExpandLess /> Liste des concours <MdExpandLess />
      </span>
    );
  };
  const calculateDaysRemaining = (dateInscription) => {
    dateInscription = formatDatePoint(dateInscription);
    const [day, month, year] = dateInscription.split(".");
    const deadline = new Date(year, month - 1, day); // Soustraire 1 du mois car les mois en JavaScript sont indexés à partir de 0
    const now = new Date();
    const differenceInTime = deadline.getTime() - now.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };

  // ======================================================

  /* ================= useEffect =================== */
  useEffect(() => {
    document.title = "Inscriptions";
  }, []);

  useEffect(() => {
    if (gymnastesDejaInscritsData) {
      setGymnastesInscrits(gymnastesDejaInscritsData);
    }
  }, [gymnastesDejaInscritsData]);

  useEffect(() => {
    setEquipesData([]);
  }, [selectedConcours]);

  useEffect(() => {
    selectedConcours ? setCollapsed(false) : setCollapsed(true);
    if (selectedConcours) {
      const [day, month, year] = formatDatePoint(
        selectedConcours.dateInscription
      ).split(".");
      const concoursDateInscription = new Date(year, month - 1, day);
      setModifiable(concoursDateInscription < new Date());
    }
  }, [
    selectedConcours,
    gymnastesInscrits,
    gymnastesData,
    user.societeSelectionnee,
  ]);

  // ======================================================

  /* ================= Render =================== */
  return (
    <>
      {showSuccess && (
        <Success
          message={"Inscription sauvegardée avec succès"}
          onClose={() => setShowSuccess(false)}
        />
      )}

      {/* ============== LISTE DES CONCOURS ==============*/}

      <Collapsible
        trigger={textCollapsed}
        onOpening={handleOpening}
        onClosing={handleClosing}
        open={collapsed}
        transitionTime={100}
      >
        <div className="flex-list">
          {/* Liste horizontale des concours */}
          {concoursData &&
            concoursData.map((concours) => (
              <CarteConcours
                key={concours.id}
                concours={concours}
                setSelectedConcours={setSelectedConcours}
                selectedConcours={selectedConcours}
              />
            ))}
        </div>
      </Collapsible>
      {/* =========================================== */}

      {/* ============== TABLEAU ==============*/}

      {selectedConcours && (
        <>
          <div
            className="gymnaste-disponibles"
            style={{
              gridRow: tableauGridRow,
              marginTop: tableauMarginTop,
              zIndex: zIndexVar,
            }}
          >
            <h2>Gymnastes disponibles</h2>{" "}
            <h3>
              Concours : {selectedConcours.nom} -{" "}
              {"(C" + selectedConcours.categories.join(", C") + ")"}
            </h3>
            {/* Tableau des gymnastes disponibles */}
            <GymnasteTable
              gymnastes={gymnastesData}
              concours={selectedConcours}
              addGymnaste={addGymnaste}
              inscrits={gymnastesInscrits}
              tableType={"disponibles"}
              equipesData={equipesData}
              setEquipesData={setEquipesData}
              setShowSuccess={setShowSuccess}
            />
          </div>
          <div
            className="gymnaste-inscrits"
            style={{
              gridRow: tableauGridRow,
              marginTop: tableauMarginTop,
              zIndex: zIndexVar,
            }}
          >
            <h2>Gymnastes inscrits</h2>
            {/* Tableau des gymnastes inscrits */}
            <GymnasteTable
              gymnastes={gymnastesInscrits}
              concours={selectedConcours}
              removeGymnaste={removeGymnaste}
              inscrits={gymnastesInscrits}
              tableType={"inscrits"}
              equipesData={equipesData}
              setEquipesData={setEquipesData}
              addGymnaste={false}
            />
            {/* <button
              onClick={async () => {
                await mutateAddInscription();
              }}
            >Confirmer l'inscription</button> */}

            <Button
              className="add-btn"
              variant="contained"
              color="primary"
              onClick={async () => {
                await mutateAddInscription();
                setShowSuccess(true);
              }}
              disabled={modifiable}
            >
              confirmer l'inscription
            </Button>
            <Typography
              variant="body1"
              color={modifiable ? "error" : "primary"}
              align="left"
            >
              {modifiable
                ? "Les inscriptions sont closes (contactez un administrateur)"
                : "Date limite d'inscription : " +
                  formatDateLong(selectedConcours.dateInscription) +
                  " (" +
                  calculateDaysRemaining(selectedConcours.dateInscription) +
                  " jours restants)"}
            </Typography>
          </div>
        </>
      )}
      {/* =========================================== */}
    </>
  );
};

export default GymnasteInscrire;
