// Description: Ce composant permet de créer ou de modifier un gymnaste. Il est utilisé dans la page Gymnaste.

// ============= Importations =============
// *** CSS ***
import "./formulaire.css";
// *** React ***
import React, { useEffect, useState } from "react";
// *** Composants ***
import Switch from "../boutonsSwitch/Switch";
import BoutonForm from "../boutons/BoutonForm";
import Message from "./Message";
// *** Données ***
import {
  useSocieteData,
  useAnciensGymnastes,
  useAddGymnaste,
  useSetGymnaste,
  useDeleteGymnaste,
} from "../../data/Data";
import { useAuth } from "../../hooks/authContext";
// *** React Icons ***
import { MdOutlineSearch } from "react-icons/md";
// *** Dialog MUI ***
import {
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { DialogContent } from "@material-ui/core";
// ==========================================

const FormulaireGymnaste = ({
  personne,
  setPersonne,
  isModify,
  isCoachConnected,
  setShowSuccess,
  personneAModifier,
}) => {
  // ============= Déclaration des variables =============
  // *** Variables états formulaire ***
  const [id, setId] = useState("");
  const [ref, setRef] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [homme, setHomme] = useState(false);
  const [dateNaissance, setDateNaissance] = useState("");
  const [fsgNumber, setFsgNumber] = useState("");
  const [categorie, setCategorie] = useState("");
  const [societe, setSociete] = useState("");
  const [formIsValid, setFormIsValid] = useState(false);
  const [confirmerRecuperation, setConfirmerRecuperation] = useState(false);
  // *** constantes ***
  const [categorieList] = useState([1, 2, 3, 4, 5, 6, 7, "H", "D"]);
  // *** Variables de recherche ***
  const [chercherNom, setChercherNom] = useState("");
  // *** Dialog ***
  const [openDialogAncien, setOpenDialogAncien] = useState(false);
  const [openAlertInfo, setOpenAlertInfo] = useState(false);
  const [msgAlertInfo, setMsgAlertInfo] = useState("");
  // *** Données ***
  const { data: societesData } = useSocieteData();
  const { data: anciensGymnastes } = useAnciensGymnastes();
  const [anciensGymnastesFiltres, setAnciensGymnastesFiltres] = useState([]);
  // *** Hooks personnalisés pour les mutations ***
  const { mutateAsync: mutateAddGymnaste } = useAddGymnaste(
    personne,
    confirmerRecuperation
  );
  const { mutateAsync: mutateSetGymnaste } = useSetGymnaste(personne);
  const { mutateAsync: mutateDeleteGymnaste } = useDeleteGymnaste(personne);
  const { user } = useAuth();
  // ==========================================

  // =============== Elements du formulaire ===============
  // *** Définition des éléments du formulaire ***
  const formItems = {
    anciensGymnastes: () => (
      <>
        <div className="item" style={{ flexDirection: "row" }}>
          <MdOutlineSearch className="item-search" />
          <input
            type="text"
            placeholder="Chercher un ancien gymnaste ..."
            id="nom"
            value={chercherNom}
            onChange={(e) => setChercherNom(e.target.value)}
            autoComplete="off"
          />
        </div>
        {chercherNom.trim() !== "" && (
          <div className="liste-anciens-gymnastes">
            {anciensGymnastesFiltres.length > 0 ? (
              <ul>
                {anciensGymnastesFiltres.map((gymnaste) => (
                  <li
                    key={gymnaste.id}
                    onClick={() => remplirFormulaire(gymnaste)}
                  >
                    {gymnaste.nom} {gymnaste.prenom} -{" "}
                    {gymnaste.dateNaissance.toDate().toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: "14px" }}>Aucun gymnaste trouvé</p>
            )}
          </div>
        )}
      </>
    ),

    nom: () => (
      <>
        <div className="item">
          <label htmlFor="nom">Nom :</label>
          <input
            type="text"
            placeholder="Biles"
            id="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            autoComplete="off"
          />
        </div>
      </>
    ),
    prenom: () => (
      <>
        <div className="item">
          <label htmlFor="prenom">Prénom :</label>
          <input
            type="text"
            placeholder="Simone"
            id="prenom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            autoComplete="off"
          />
        </div>
      </>
    ),
    hommeFemme: () => (
      <>
        <div className="item" style={{ alignItems: "flex-end" }}>
          <Switch
            isChecked={homme}
            setIsChecked={setHomme}
            texte1={"Femme"}
            texte2={"Homme"}
          />
        </div>
      </>
    ),
    noFSG: () => (
      <>
        <div className="item">
          <label htmlFor="fsgNumber">Numéro FSG :</label>
          <input
            type="text"
            placeholder="1234.5678.9101"
            id="fsgNumber"
            value={fsgNumber}
            onChange={(e) => setFsgNumber(e.target.value)}
            autoComplete="off"
          />
        </div>
      </>
    ),
    dateNaissance: () => (
      <>
        <div className="item">
          <label htmlFor="date">Date de naissance : </label>
          <input
            type="date"
            id="date"
            value={dateNaissance}
            onChange={(e) => setDateNaissance(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            autoComplete="off"
          />
        </div>
      </>
    ),
    categorie: () => (
      <>
        <div className="item">
          <label htmlFor="categorie">Catégorie :</label>
          <select
            id="categorie"
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
          >
            <option value="" disabled={true}>
              -- Sélectionner une catégorie --
            </option>
            {categorieList.map((categorie, index) => (
              <option key={index} value={categorie}>
                {categorie}
              </option>
            ))}
          </select>
        </div>
      </>
    ),
    societe: () => (
      <>
        <div className="item">
          <label htmlFor="societe">Société :</label>
          <select
            id="societe"
            value={societe.id || ""}
            onChange={(e) => {
              const selectedSociete = societesData.find(
                (societe) => societe.id === e.target.value
              );
              setSociete(selectedSociete.ref);
            }}
          >
            <option value="" disabled={true}>
              -- Sélectionner une société --
            </option>
            {societesData &&
              societesData.map((societe) => (
                <option key={societe.id} value={societe.id}>
                  {societe.nom}
                </option>
              ))}
          </select>
        </div>
      </>
    ),
  };
  // *** Fonction pour afficher les éléments du formulaire ***
  const renderFormItem = (itemName) => {
    const formItemFunction = formItems[itemName];
    return formItemFunction ? formItemFunction() : null;
  };
  // ==========================================

  // =============== Fonctions ===============
  // *** Fonction pour réinitialiser les champs du formulaire ***
  const resetFormFields = () => {
    setNom("");
    setPrenom("");
    setHomme(false);
    setFsgNumber("");
    setDateNaissance("");
    setCategorie("");
    setSociete("");
  };

  // *** Fonction pour valider le formulaire ***
  const validateForm = () => {
    const requiredFields = [
      nom,
      prenom,
      homme,
      fsgNumber,
      dateNaissance,
      categorie,
    ];
    const isFormValid =
      requiredFields.every((field) => field !== "") &&
      personne.idSociete !== "";
    return setFormIsValid(isFormValid);
  };

  // *** Fonction pour remplir le formulaire ***
  const remplirFormulaire = (personne) => {
    console.log(personne);
    setId(personne.id || "");
    setRef(personne.ref || "");
    setNom(personne.nom || "");
    setPrenom(personne.prenom || "");
    setHomme(personne.sexe === "M" ? true : false);
    setFsgNumber(personne.noFSG || "");
    setSociete(personne.idSociete || "");
    const dateNaissance = new Date(personne.dateNaissance.seconds * 1000)
      .toISOString()
      .split("T")[0];
    setDateNaissance(dateNaissance);
    setCategorie(personne.categorie || "");

    setChercherNom("");
  };
  // *** Fonction pour filtrer les anciens gymnastes ***
  const getAnciensGymnastesFiltres = async () => {
    const gymnastesFiltres = anciensGymnastes.filter((gymnaste) => {
      const nom = gymnaste.nom.toLowerCase();
      const prenom = gymnaste.prenom.toLowerCase();
      const chercherTexte = chercherNom.trim().toLowerCase();
      return (
        (nom + " " + prenom).includes(chercherTexte) ||
        (prenom + " " + nom).includes(chercherTexte)
      );
    });
    setAnciensGymnastesFiltres(gymnastesFiltres); // Affecter la liste de documents filtrés
  };
  // ==========================================

  // =============== CRUD de gymnaste ===============
  // *** Fonction pour créer un gymnaste ***
  const createPersonne = () => {
    setPersonne({
      ref: ref,
      id: id,
      nom: nom,
      prenom: prenom,
      sexe: homme ? "M" : "F",
      noFSG: fsgNumber,
      idSociete: isCoachConnected ? user.societeSelectionnee.ref : societe,
      dateNaissance: dateNaissance,
      categorie: categorie,
    });
  };

  // *** Fonction pour soumettre le formulaire ***
  const handleSubmit = async () => {
    // e.preventDefault();
    console.log(personne);
    try {
      await mutateAddGymnaste();
      setShowSuccess(true);
      resetFormFields();
      setConfirmerRecuperation(false);
    } catch (error) {
      if (error.message.includes("AjoutAncienGymnaste")) {
        setOpenDialogAncien(true);
      } else {
        // alert(error.message);
        setOpenAlertInfo(true);
        setMsgAlertInfo(error.message);
      }
    }
  };

  // *** Fonction pour modifier un gymnaste ***
  const handleModify = async () => {
    // e.preventDefault();
    console.log(personne);
    try {
      await mutateSetGymnaste();
      setShowSuccess(true);
    } catch (error) {
      // alert(error.message);
      setOpenAlertInfo(true);
      setMsgAlertInfo(error.message);
    }
  };

  // *** Fonction pour supprimer un gymnaste (de la société) ***
  const handleSupprimer = async () => {
    // e.preventDefault();
    console.log(personne);
    try {
      await mutateDeleteGymnaste();
      setShowSuccess(true);
    } catch (error) {
      alert(error.message);
    }
    // }
  };
  // ==========================================

  // =============== UseEffets ===============
  useEffect(() => {
    if (isModify) {
      remplirFormulaire(personneAModifier);
    }
  }, [personneAModifier]);

  useEffect(() => {
    createPersonne();
    if (chercherNom) {
      getAnciensGymnastesFiltres();
    }
  }, [
    nom,
    prenom,
    homme,
    fsgNumber,
    societe,
    dateNaissance,
    categorie,
    chercherNom,
  ]);

  useEffect(() => {
    validateForm();
  }, [personne]);
  // ==========================================

  // =============== Rendu du formulaire ===============
  return (
    <>
      <form
        className="box box-form"
        style={isModify ? { gridColumn: "4/-1" } : null}
      >
        <div className="form-background">
          <div className="form-input">
            <Message formIsValid={formIsValid} />
            <div className="infos-container">
              {!isModify && (
                <div className="flex-container" style={{ gap: "0px" }}>
                  {renderFormItem("anciensGymnastes")}
                </div>
              )}
              <div className="flex-container">
                <div className="flex-item">
                  {renderFormItem("nom")}

                  {renderFormItem("prenom")}

                  {renderFormItem("hommeFemme")}
                </div>
                {renderFormItem("noFSG")}

                {renderFormItem("dateNaissance")}

                {renderFormItem("categorie")}

                {!isCoachConnected && (
                  <div className="flex-item">{renderFormItem("societe")}</div>
                )}
              </div>
            </div>
          </div>

          <BoutonForm
            isDeletable={isCoachConnected && isModify}
            isModify={isModify}
            handleSubmit={handleSubmit}
            handleModify={handleModify}
            handleSupprimer={handleSupprimer}
            formIsValid={formIsValid}
          />
        </div>
      </form>

      <Dialog
        open={openDialogAncien}
        onClose={() => setOpenDialogAncien(false)}
      >
        <DialogTitle>Activation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ce gymnaste a déjà été ajouté dans le passé. Voulez-vous le
            réactiver ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialogAncien(false)}>Annuler</Button>
          <Button
            variant="contained"
            onClick={() => {
              setOpenDialogAncien(false),
                handleSubmit(),
                setConfirmerRecuperation(true);
            }}
            autoFocus
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAlertInfo} onClose={() => setOpenAlertInfo(false)}>
        <DialogTitle>Information</DialogTitle>
        <DialogContent>
          <DialogContentText>{msgAlertInfo}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAlertInfo(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FormulaireGymnaste;
