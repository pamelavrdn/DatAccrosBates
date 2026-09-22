// Description: Ce composant permet de créer ou de modifier un admin. Il est utilisé dans la page Admins.

// ============= Importations =============
// *** CSS ***
import "./formulaire.css";
// *** React ***
import React, { useEffect, useState } from "react";
// *** Composants ***
import { generateRandomPassword } from "./PasswordGenerator";
import BoutonForm from "../boutons/BoutonForm";
import Message from "./Message";
// *** Données ***
import { useAddAdmin, useSetAdmin } from "../../data/Data";
import {
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { DialogContent } from "@material-ui/core";
// ====================================

const FormulaireAdmin = ({
  personne,
  setPersonne,
  isModify,
  setShowSuccess,
  personneAModifier,
}) => {
  // ============= Déclaration des variables =============
  // *** Variables états formulaire ***
  const [id, setId] = useState("");
  const [ref, setRef] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [nomUtilisateur, setNomUtilisateur] = useState("");
  const [password, setPassword] = useState(generateRandomPassword(6));
  const [formIsValid, setFormIsValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // *** OpenDialog ***
  const [openAlertInfo, setOpenAlertInfo] = useState(false);
  const [msgAlertInfo, setMsgAlertInfo] = useState("");
  // *** Hooks personnalisés pour les mutations ***
  const { mutateAsync: mutateAddAdmin } = useAddAdmin(personne);
  const { mutateAsync: mutateSetAdmin } = useSetAdmin(personne);
  // ====================================

  // ============= Elements du fomrulaire =============
  // *** Définition des éléments du formulaire ***
  const formItems = {
    nom: () => (
      <>
        <div className="item">
          <label htmlFor="nom">Nom :</label>
          <input
            type="text"
            placeholder="Tesla"
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
            placeholder="Nikola"
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
            placeholder="nikola.tesla@mail.ch"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            disabled={isModify}
          />
        </div>
      </>
    ),
    nomUtilisateur: () => (
      <>
        <div className="item">
          <label htmlFor="email">Nom d'utilisateur :</label>
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
              <label htmlFor="email">Mot de passe :</label>
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
  // ==========================================

  // ============= Fonctions =============
  // *** Fonction pour réinitialiser les champs du formulaire ***
  const resetFormFields = () => {
    setNom("");
    setPrenom("");
    setEmail("");
    setNomUtilisateur("");
    setPassword(generateRandomPassword(6));
  };

  // *** Fonction pour valider le formulaire ***
  const validateForm = () => {
    const requiredFields = [nom, prenom, email, nomUtilisateur];
    const isFormValid =
      requiredFields.every((field) => field !== "") &&
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
    setNomUtilisateur(personne.nomUtilisateur);
  };

  // *** Fonction pour créer un nom d'utilisateur ***
  const createNomUtilisateur = () => {
    // Créer un nomUtilisateur à partir du nom et du prénom (marc.dupont)
    const nomUtilisateur =
      nom && prenom ? nom.toLowerCase() + "_" + prenom.toLowerCase() : "";
    setNomUtilisateur(nomUtilisateur);
  };
  // ===============================================

  // ============= CRUD d'Admin =============
  // *** Fonction pour créer un Admin ***
  const createPersonne = () => {
    setPersonne({
      ref: ref,
      id: id,
      nom: nom,
      prenom: prenom,
      email: email,
      nomUtilisateur: nomUtilisateur,
      password: password,
    });
  };

  // *** Fonction pour soumettre le formulaire ***
  const handleSubmit = async () => {
    // e.preventDefault();
    console.log(personne);
    try {
      await mutateAddAdmin();
      setShowSuccess(true);
      resetFormFields();
    } catch (error) {
      // alert(error.message);
      setOpenAlertInfo(true);
      setMsgAlertInfo(error.message);
    }
  };

  // *** Fonction pour modifier un Admin ***
  const handleModify = async () => {
    // e.preventDefault();
    console.log(personne);
    try {
      await mutateSetAdmin();
      setShowSuccess(true);
    } catch (error) {
      // alert(error.message);
      setOpenAlertInfo(true);
      setMsgAlertInfo(error.message);
    }
  };
  // ====================================

  // ============= UseEffets =============
  useEffect(() => {
    if (isModify) {
      remplirFormulaire(personneAModifier);
    }
  }, [personneAModifier]);

  useEffect(() => {
    createPersonne();
  }, [nom, prenom, email, nomUtilisateur, password]);

  useEffect(() => {
    createNomUtilisateur();
    validateForm();
  }, [personne]);
  // ====================================

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
                </div>
                <div className="flex-container">{renderFormItem("email")}</div>
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

export default FormulaireAdmin;
