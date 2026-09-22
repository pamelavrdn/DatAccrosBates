// Description: Ce composant permet de créer ou de modifier un coach. Il est utilisé dans la page coach.

// ============= Importations ====================
// *** CSS ***
import "./formulaire.css";
// *** React ***
import React, { useEffect, useState } from "react";
// *** Composants ***
import { generateRandomPassword } from "./PasswordGenerator";
import Switch from "../boutonsSwitch/Switch";
import BoutonForm from "../boutons/BoutonForm";
import Message from "./Message";
// *** Données ***
import {
  useSocieteData,
  useAddCoach,
  useSetCoach,
  useDeleteCoach,
} from "../../data/Data";
import { useAuth } from "../../hooks/authContext";
// *** MUI ***
import {
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { DialogContent } from "@material-ui/core";

const FormulaireCoach = ({
  personne,
  setPersonne,
  isModify,
  isCoachConnected,
  setShowSuccess,
  personneAModifier,
}) => {
  // ============= Déclaration des variables =============
  // *** Variables d'état ***
  const [id, setId] = useState("");
  const [ref, setRef] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [privilegie, setPrivilegie] = useState(false);
  const [societes, setSocietes] = useState([]);
  const [nomUtilisateur, setNomUtilisateur] = useState("");
  const [password, setPassword] = useState(
    !isModify ? generateRandomPassword(6) : ""
  );
  const [showPassword, setShowPassword] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  // *** OpenDialog ***
  const [openAlertInfo, setOpenAlertInfo] = useState(false);
  const [msgAlertInfo, setMsgAlertInfo] = useState("");
  // *** Données ***
  const { data: societesData } = useSocieteData();
  // *** Hooks personnalisés pour les mutations ***
  const { mutateAsync: mutateAddCoach } = useAddCoach(personne);
  const { mutateAsync: mutateSetCoach } = useSetCoach(personne);
  const { user } = useAuth();
  const { mutateAsync: mutateDeleteCoach } = useDeleteCoach(
    personne,
    user.societeSelectionnee
  );
  // ========================================================

  // ============= Elements du formulaire =============
  // *** définition des éléments du formulaire ***
  const formItems = {
    nom: () => (
      <>
        <div className="item">
          <label htmlFor="nom">Nom :</label>
          <input
            type="text"
            placeholder="Landi"
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
            placeholder="Laurent"
            id="prenom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            autoComplete="off"
          />
        </div>
      </>
    ),
    email: () => (
      <>
        <div className="item">
          <label htmlFor="email">E-mail :</label>
          <input
            type="email"
            id="email"
            placeholder="laurent.landi@mail.ch"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            disabled={isModify}
          />
        </div>
      </>
    ),
    classiquePrivilegie: () => (
      <>
        <div className="item" style={{ alignItems: "flex-end" }}>
          <Switch
            isChecked={privilegie}
            setIsChecked={setPrivilegie}
            texte1={"Classique"}
            texte2={"Privilégié"}
          />
        </div>
      </>
    ),
    societe: () => (
      <>
        <div className="item">
          <label htmlFor="societe">Sociétés :</label>
          <div className="column-container">
            {societesData &&
              societesData.map((societe) => (
                <div className="column-item" key={societe.id}>
                  <input
                    type="checkbox"
                    id={societe.id}
                    value={societe.id}
                    checked={societes.some((s) => s.path === societe.ref.path)}
                    onChange={(e) => handleSocieteChange(e.target.value)}
                    className="checkbox-custom"
                  />
                  <label htmlFor={societe.id}>{societe.nom}</label>
                </div>
              ))}
          </div>
        </div>
      </>
    ),
    nomUtilisateur: () => (
      <>
        <div className="item">
          <label htmlFor="nomUtilisateur">Nom d'utilisateur :</label>
          <input
            type="text"
            placeholder="nom_utilisateur"
            id="nomUtilisateur"
            value={nomUtilisateur}
            disabled={true}
            onChange={(e) => setNomUtilisateur(e.target.value)}
            autoComplete="off"
          />
        </div>
      </>
    ),
    password: () => (
      <>
        {isModify ? null : (
          <>
            <div className="item">
              <label htmlFor="societe">Mot de passe :</label>
              <div className="flex-item">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  id="password"
                  value={password}
                  disabled={!isModify}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                />

                <div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Masquer" : "Afficher"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    ),
  };
  // *** Fonction pour afficher les éléments du formulaire ***
  const renderFormItem = (itemName) => {
    const formItemFunction = formItems[itemName];
    return formItemFunction ? formItemFunction() : null;
  };
  // ========================================================

  // ============= Fonctions =============
  // *** Fonction pour réinitialiser les champs du formulaire ***
  const resetFormFields = () => {
    setNom("");
    setPrenom("");
    setEmail("");
    setPrivilegie(false);
    setSocietes([]);
    setNomUtilisateur("");
    setPassword(generateRandomPassword(6));
  };

  // *** Fonction pour valider le formulaire ***
  const validateForm = () => {
    const requiredFields = [
      nom,
      prenom,
      email,
      privilegie,
      societes,
      nomUtilisateur,
    ];
    const isFormValid =
      requiredFields.every((field) => field !== "") &&
      personne.societes?.length > 0 &&
      email.includes("@") &&
      email.includes(".");
    setFormIsValid(isFormValid);
  };

  // *** Fonction pour remplir le formulaire ***
  const remplirFormulaire = (personne) => {
    console.log(personne);
    setId(personne.id);
    setRef(personne.ref);
    setNom(personne.nom);
    setPrenom(personne.prenom);
    setEmail(personne.email);
    setSocietes(personne.societes);
    setPrivilegie(personne.role === "coachC" ? false : true);
    setNomUtilisateur(personne.nomUtilisateur);
  };

  // *** Fonction pour créer un nom d'utilisateur ***
  const createNomUtilisateur = () => {
    // Prendre uniquement le premier nom et le premier prénom
    const [premierNom] = nom.split(" ").filter(Boolean); // Filtrer pour exclure les chaînes vides
    const [premierPrenom] = prenom.split(" ").filter(Boolean); // Filtrer pour exclure les chaînes vides

    // Créer un nom d'utilisateur à partir du premier nom et du premier prénom
    let nomUtilisateur = "";
    premierNom &&
      premierPrenom &&
      (nomUtilisateur = `${premierNom.toLowerCase()}_${premierPrenom.toLowerCase()}`);
    setNomUtilisateur(nomUtilisateur);
  };

  // *** Fonction pour gérer la séléction de sociétés ***
  const handleSocieteChange = (societeId) => {
    const selectedSociete = societesData.find(
      (societe) => societe.id === societeId
    );
    const societeRef = selectedSociete ? selectedSociete.ref : null;
    // si la société est déjà dans la liste on la retire, sinon on ajoute
    if (societes.some((s) => s.path === societeRef.path)) {
      setSocietes(societes.filter((s) => s.path !== societeRef.path));
    } else {
      setSocietes([...societes, societeRef]);
    }
  };
  // ========================================================

  // ============= CRUD de coach =============
  // *** Fonction pour créer un coach ***
  const createPersonne = () => {
    console.log(personne);
    console.log(societes);
    setPersonne({
      ref: ref,
      id: id,
      nom: nom,
      prenom: prenom,
      email: email,
      role: privilegie ? "coachP" : "coachC",
      societes: isCoachConnected ? [user.societeSelectionnee.ref] : societes,
      nomUtilisateur: nomUtilisateur,
      password: password,
    });
  };

  useEffect(() => {
    console.log(personne);
  }, [personne]);

  // *** Fonction pour soumettre le formulaire ***
  const handleSubmit = async () => {
    // e.preventDefault();
    console.log(personne);
    try {
      await mutateAddCoach();
      setShowSuccess(true);
      resetFormFields();
    } catch (error) {
      // alert(error.message);
      setOpenAlertInfo(true);
      setMsgAlertInfo(error.message);
    }
  };

  // *** Fonction pour modifier un coach ***
  const handleModify = async () => {
    // e.preventDefault();
    console.log(personne);
    try {
      await mutateSetCoach();
      setShowSuccess(true);
    } catch (error) {
      // alert(error.message);
      setOpenAlertInfo(true);
      setMsgAlertInfo(error.message);
    }
  };

  // *** Fonction pour supprimer un coach ***
  const handleSupprimer = async () => {
    // e.preventDefault();
    console.log(personne);
    try {
      await mutateDeleteCoach();
      setShowSuccess(true);
    } catch (error) {
      alert(error.message);
    }
    // }
  };
  // ========================================================

  // ============= UseEffets =============
  useEffect(() => {
    if (isModify) {
      remplirFormulaire(personneAModifier);
    }
  }, [personneAModifier]);

  useEffect(() => {
    createPersonne();
  }, [nom, prenom, email, privilegie, societes, nomUtilisateur, password]);

  useEffect(() => {
    createNomUtilisateur();
    validateForm();
  }, [personne]);
  // ========================================================

  // ============= Rendu du formulaire =============
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
              <div className="flex-container">
                <div className="flex-item">
                  {renderFormItem("nom")}
                  {renderFormItem("prenom")}
                  {renderFormItem("classiquePrivilegie")}
                </div>
                <div className="flex-container">
                  <div className="flex-item">{renderFormItem("email")}</div>
                  {!isCoachConnected && (
                    <div className="flex-item">{renderFormItem("societe")}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="infos-container">
              <div className="flex-container">
                <div className="flex-item">
                  {renderFormItem("nomUtilisateur")}
                  {renderFormItem("password")}
                </div>
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

export default FormulaireCoach;
