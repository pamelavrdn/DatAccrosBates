// Description: Ce composant permet de créer ou de modifier une société. Il est utilisé dans la page Societe.

// ============= Importations =============
// *** CSS ***
import "./formulaire.css";
// *** React ***
import React, { useEffect, useState } from "react";
// *** Composants ***
import BoutonForm from "../boutons/BoutonForm";
import Message from "./Message";
import LoadersSpin from "../loaders/LoadersSpin";
// *** Données ***
import { useAddSociete, useSetSociete } from "../../data/Data";
// *** React Icons ***
import { FcOk } from "react-icons/fc";
// *** Dialog ***
import {
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { DialogContent } from "@material-ui/core";
// =======================================

const FormulaireSociete = ({
  societe,
  setSociete,
  isModify,
  isCoachConnected,
  setShowSuccess,
  societeAModifier,
  image,
  setImage,
}) => {
  // =============== Déclaration des variables ===============
  // *** Variables états formulaire ***
  const [id, setId] = useState("");
  const [ref, setRef] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [formIsValid, setFormIsValid] = useState(false);
  const [isImageSelected, setIsImageSelected] = useState(
    isModify ? true : false
  );
  // *** OpenDialog ***
  const [openAlertInfo, setOpenAlertInfo] = useState(false);
  const [msgAlertInfo, setMsgAlertInfo] = useState("");
  // *** Hooks personalisé pour les mutations ***
  const { mutateAsync: mutateAddSociete } = useAddSociete(societe);
  const { mutateAsync: mutateSetSociete } = useSetSociete(societe);

  // =============== Elements du formulaire ===============
  // *** Définition des éléments du formulaire ***
  const formItems = {
    nom: () => (
      <>
        <div className="item">
          <label htmlFor="nom">Nom :</label>
          <input
            type="text"
            placeholder="FSG Lancy, ..."
            id="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
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
            placeholder="exemple@mail.ch"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
          />
        </div>
      </>
    ),
    image: () => (
      <>
        {!isModify ? (
          <>
            {!isImageSelected ? (
              <>
                <div className="item">
                  <label htmlFor="email">Logo :</label>
                  <label
                    htmlFor="image"
                    className={nom ? "input-file" : "input-file-disabled"}
                  >
                    {nom
                      ? "Choisir une image de club"
                      : "Veuillez d'abord saisir le nom du club"}
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      id="image"
                      onChange={(e) => {
                        setImage(e.target.files[0]);
                        setIsImageSelected(true);
                      }}
                      disabled={!nom}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
              </>
            ) : (
              <>
                <div className="item">
                  <label htmlFor="email">Logo :</label>
                  <div
                    className="item"
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <FcOk />
                    <button
                      className="btn-delete-image"
                      onClick={() => {
                        setImage(null);
                        setIsImageSelected(false);
                      }}
                    >
                      Supprimer l'image
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div
              className="flex-item"
              style={{ flexDirection: "row", alignItems: "flex-start" }}
            >
              <div className="flex-item">
                <div className="item">
                  <label htmlFor="email">Logo actuel :</label>
                  {image ? (
                    <img
                      src={image}
                      alt="logo"
                      style={{ width: "100px", height: "100px" }}
                    />
                  ) : (
                    <>
                      <LoadersSpin />
                    </>
                  )}
                  <label
                    htmlFor="image"
                    className={!isModify ? "input-file-disabled" : "input-file"}
                  >
                    Changer l'image
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      id="image"
                      onChange={(e) => {
                        setNewImage(e.target.files[0]);
                      }}
                      style={{ display: "none" }}
                      disabled={!isModify}
                    />
                  </label>
                </div>
              </div>
              {newImage && (
                <>
                  <div className="flex-item">
                    <div className="item">
                      <label htmlFor="email">Nouveau logo :</label>
                      <img
                        src={URL.createObjectURL(newImage)}
                        alt="logo"
                        style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "10px",
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
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
  // ======================================================

  // ================ Fonctions =================
  // *** Fonction pour réinitialiser les champs du formulaire ***
  const resetFormFields = () => {
    setNom("");
    setEmail("");
  };

  // *** Fonction pour valider le formulaire ***
  const validateForm = () => {
    const requiredFields = [nom, email];
    const isFormValid =
      requiredFields.every((field) => field !== "") &&
      email.includes("@") &&
      email.includes(".") &&
      (isCoachConnected ? true : isImageSelected);
    setFormIsValid(isFormValid);
  };

  // *** Fonction pour remplir le formulaire ***
  const remplirFormulaire = (societe) => {
    // console.log(societe);
    setId(societe.id);
    setRef(societe.ref);
    setNom(societe.nom);
    setEmail(societe.email);
    setImage(societe.logo);
    setNewImage(null);
  };
  // ======================================================

  // =============== CRUD de la société ===============
  // *** Fonction pour créer la société ***
  const createSociete = () => {
    setSociete({
      ref: ref,
      id: id,
      nom: nom,
      email: email,
      logo: newImage ? newImage : image,
    });
  };

  // *** Fonction pour soumettre le formulaire ***
  const handleSubmit = async () => {
    // e.preventDefault();
    try {
      await mutateAddSociete();
      setShowSuccess(true);
      resetFormFields();
    } catch (error) {
      // alert(error.message);
      setOpenAlertInfo(true);
      setMsgAlertInfo(error.message);
    }
  };

  // *** Fonction pour modifier la société ***w
  const handleModify = async () => {
    // e.preventDefault();
    try {
      await mutateSetSociete();
      setShowSuccess(true);
    } catch (error) {
      // alert(error.message);
      setOpenAlertInfo(true);
      setMsgAlertInfo(error.message);
    }
  };
  // ======================================================

  // =============== UseEffets =================
  useEffect(() => {
    if (isModify) {
      remplirFormulaire(societeAModifier);
    }
  }, [societeAModifier]);

  useEffect(() => {
    createSociete();
  }, [nom, email, newImage, image]);

  useEffect(() => {
    validateForm();
  }, [societe]);
  // ======================================================

  // =============== Rendu du formulaire ===============
  return (
    <>
      <form
        className="box box-form"
        style={
          isModify
            ? isCoachConnected
              ? { gridColumn: "3/9" }
              : { gridColumn: "4/-1" }
            : null
        }
      >
        <div className="form-background">
          <div className="form-input">
            <Message formIsValid={formIsValid} />
            <div className="infos-container">
              <div className="flex-container">
                {renderFormItem("nom")}

                {renderFormItem("email")}

                {renderFormItem("image")}
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

export default FormulaireSociete;
