// Desctiption : Ce composant permet de créer ou de modifier un concours.

// ============== Importations ===================
// *** CSS ***
import "./formulaire.css";
// *** React ***
import React, { useEffect, useState } from "react";
// *** Composants ***
import CheckBox from "../checkBox/CheckBox";
import Switch from "../boutonsSwitch/Switch";
import BoutonForm from "../boutons/BoutonForm";
import Calendrier from "./calendrier/Calendrier";
import Message from "./Message";
// *** Données ***
import { useAddConcours, useSetConcours } from "../../data/Data";
// *** Material UI ***
import {
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { DialogContent } from "@material-ui/core";
// ======================================

const FormulaireConcours = ({
  concours,
  setConcours,
  isModify,
  setShowSuccess,
  concoursAModifier,
}) => {
  // ============== Déclarations des variables ================
  // *** Variables d'état formulaire ***
  const [id, setId] = useState("");
  const [ref, setRef] = useState("");
  const [nom, setNom] = useState("");
  const [concoursEquipe, setConcoursEquipe] = useState(false);
  const [date, setDate] = useState(new Date());
  const [dateLimite, setDateLimite] = useState("");
  const [lieu, setLieu] = useState("");
  const [categoriesChoisies, setCategoriesChoisies] = useState([]);
  const [formIsValid, setFormIsValid] = useState(false);
  // *** OpenDialog ***
  const [openAlertInfo, setOpenAlertInfo] = useState(false);
  const [msgAlertInfo, setMsgAlertInfo] = useState("");
  // *** constantes ***
  const [categorieList] = useState([
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "H",
    "D",
  ]);
  // *** Hooks personalisé pour les mutations ***
  const { mutateAsync: mutateAddConcours } = useAddConcours(concours);
  const { mutateAsync: mutateSetConcours } = useSetConcours(concours);
  // ========================================================

  // ============= Elements du fomrulaire =============
  // *** Définition des éléments du formulaire ***
  const formItems = {
    nom: () => (
      <>
        <div className="item">
          <label htmlFor="nom">Nom :</label>
          <input
            type="text"
            placeholder="Nom"
            id="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            autoComplete="off"
          />
        </div>
      </>
    ),
    dateConcours: () => (
      <>
        <div className="item-calendrier">
          <div className="item-date">
            <label className="label-date">
              Date du concours : {date ? formatDate(date) : ""}
            </label>
          </div>
          <div className="item-calendrier">
            <Calendrier
              date={date}
              setDate={setDate}
              isLimite={false}
              isModify={isModify}
            />
          </div>
        </div>
      </>
    ),
    dateLimite: () => (
      <>
        <div className="item-calendrier">
          <div className="item-date">
            <label className="label-date">
              Date d'inscription limite :{" "}
              {dateLimite ? formatDate(dateLimite) : ""}
            </label>
          </div>
          <div className="item-calendrier">
            <Calendrier
              date={dateLimite}
              setDate={setDateLimite}
              isLimite={date}
              isModify={isModify}
            />
          </div>
        </div>
      </>
    ),
    concoursEquipe: () => (
      <>
        <div className="item" style={{ alignItems: "flex-end" }}>
          <Switch
            isChecked={concoursEquipe}
            setIsChecked={setConcoursEquipe}
            texte1={"Individuel"}
            texte2={"Equipe"}
          />
        </div>
      </>
    ),
    lieu: () => (
      <>
        <div className="item">
          <label htmlFor="lieu">Lieu :</label>
          <input
            type="text"
            placeholder="Choisir un lieu ..."
            id="lieu"
            value={lieu}
            onChange={(e) => setLieu(e.target.value)}
            autoComplete="off"
          />
        </div>
      </>
    ),
    categorieList: () => (
      <>
        <div className="item">
          {/* Il y a 9 cateories, et je peux en sélectionner plusieurs pour mettre la liste dans "categorieList" i lfaut des checkboxes*/}
          <label htmlFor="lieu">Catégories :</label>
          <div className="checkbox-container">
            <CheckBox
              categoriesChoisies={categoriesChoisies}
              setCategoriesChoisies={setCategoriesChoisies}
              categorieList={categorieList}
            />
          </div>
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

  // ============= Fonctions =============
  // *** Fonction pour réinitialiser les champs du formulaire ***
  const resetFormFields = () => {
    setNom("");
    setConcoursEquipe(false);
    setLieu("");
    setDate("");
    setDateLimite("");
    setCategoriesChoisies([]);
  };

  // *** Fonction pour valider le formulaire ***
  const validateForm = () => {
    const requiredFields = [
      nom,
      concoursEquipe,
      categoriesChoisies,
      date,
      dateLimite,
      lieu,
    ];
    const isFormValid =
      requiredFields.every((field) => field !== "") &&
      categoriesChoisies.length > 0;
    setFormIsValid(isFormValid);
  };

  // *** Fonction pour remplir le formulaire ***
  const remplirFormulaire = (concours) => {
    console.log(concours.equipe);
    setId(concours.id);
    setRef(concours.ref);
    setNom(concours.nom);
    setConcoursEquipe(concours.equipe);
    setCategoriesChoisies(concours.categories);
    // const date = new Date(concours.date.seconds * 1000)
    //     .toISOString()
    //     .split("T")[0];
    const date = new Date(concours.date.seconds * 1000);
    setDate(date);
    // const dateLimite = new Date(concours.dateInscription.seconds * 1000)
    //     .toISOString()
    //     .split("T")[0];
    const dateLimite = new Date(concours.dateInscription.seconds * 1000);
    setDateLimite(dateLimite);
    setLieu(concours.lieu);
  };

  // *** Fonction pour formater la date ***
  const formatDate = (date) => {
    const day = String(new Date(date).getDate()).padStart(2, "0"); // Jour (format sur 2 chiffres)
    const month = String(new Date(date).getMonth() + 1).padStart(2, "0"); // Mois (format sur 2 chiffres, commence à 0)
    const year = new Date(date).getFullYear(); // Année

    const formattedDate = `${day}-${month}-${year}`;
    return <strong>{formattedDate}</strong>;
  };

  // ==========================================

  // ============= CRUD de concours =============
  // *** Fonction pour créer un concours ***
  const createConcours = () => {
    setConcours({
      ref: ref,
      id: id,
      nom: nom,
      concoursEquipe: concoursEquipe,
      categoriesChoisies: categoriesChoisies,
      date: date,
      dateLimite: dateLimite,
      lieu: lieu,
    });
  };

  // *** Fonction pour soumettre le formulaire ***
  const handleSubmit = async () => {
    // e.preventDefault();
    console.log(concours);
    try {
      await mutateAddConcours();
      setShowSuccess(true);
      resetFormFields();
    } catch (error) {
      // alert(error.message);
      setOpenAlertInfo(true);
      setMsgAlertInfo(error.message);
    }
  };

  // *** Fonction pour modifier un concours ***
  const handleModify = async () => {
    // e.preventDefault();
    console.log(concours);
    try {
      await mutateSetConcours();
      setShowSuccess(true);
    } catch (error) {
      // alert(error.message);
      setOpenAlertInfo(true);
      setMsgAlertInfo(error.message);
    }
  };
  // ==========================================

  // ============= UseEffets =================
  useEffect(() => {
    if (isModify) {
      remplirFormulaire(concoursAModifier);
    }
  }, [concoursAModifier]);

  useEffect(() => {
    createConcours();
    validateForm();
  }, [nom, concoursEquipe, categoriesChoisies, date, dateLimite, lieu]);
  // ==========================================

  // ============= Rendu du Formulaire =============
  return (
    <>
      <form
        className="box box-form"
        style={isModify ? { gridColumn: "4/-1" } : { gridColumn: "2/10" }}
      >
        <div className="form-background">
          <div className="form-input">
            <Message formIsValid={formIsValid} />
            <div className="infos-container">
              <div className="flex-container">
                <div className="flex-item">
                  {renderFormItem("nom")}
                  {renderFormItem("lieu")}
                  {renderFormItem("concoursEquipe")}
                </div>
                <div className="flex-container">
                  <div className="flex-item-calendrier">
                    {renderFormItem("dateConcours")}
                    {renderFormItem("dateLimite")}
                  </div>
                  {renderFormItem("categorieList")}
                </div>
              </div>
            </div>
          </div>

          <BoutonForm
            isDeletable={false}
            isModify={isModify}
            handleSubmit={handleSubmit}
            handleModify={handleModify}
            formIsValid={formIsValid}
          />
        </div>
      </form>
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

export default FormulaireConcours;
