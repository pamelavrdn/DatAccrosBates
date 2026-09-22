import "./boutonForm.css";
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const BoutonForm = ({
  isDeletable,
  isModify,
  handleModify,
  handleSubmit,
  handleSupprimer,
  formIsValid,
}) => {
  const [openConfirmationSave, setOpenConfirmationSave] = useState(false);
  const [openConfirmationDelete, setOpenConfirmationDelete] = useState(false);

  const handleSaveClick = () => {
    // Afficher la boîte de dialogue de confirmation pour l'enregistrement
    setOpenConfirmationSave(true);
  };

  const handleDeleteClick = () => {
    // Afficher la boîte de dialogue de confirmation pour la suppression
    setOpenConfirmationDelete(true);
  };

  const handleConfirmDelete = () => {
    setOpenConfirmationDelete(false);
    handleSupprimer();
  };

  const handleConfirmSave = () => {
    setOpenConfirmationSave(false);
    // Appeler la méthode correspondante pour l'enregistrement
    if (isModify) {
      handleModify();
    } else {
      handleSubmit();
    }
  };

  return (
    <>
      <div className="form-button">
        {isDeletable && (
          <>
            <Button
              variant="contained"
              className="btn-supprimer"
              onClick={handleDeleteClick}
            >
              Supprimer
            </Button>
          </>
        )}
        <Button
          variant="contained"
          onClick={handleSaveClick}
          disabled={!formIsValid}
        >
          ENREGISTRER
        </Button>
      </div>
      <Dialog
        open={openConfirmationSave}
        onClose={() => setOpenConfirmationSave(false)}
      >
        <DialogTitle style={{ color: "black" }}>
          Confirmer l'enregistrement
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir enregistrer ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmationSave(false)}>
            Annuler
          </Button>
          <Button variant="contained" onClick={handleConfirmSave} autoFocus>
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openConfirmationDelete}
        onClose={() => setOpenConfirmationDelete(false)}
      >
        <DialogTitle>Confirmer la suppresison</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmationDelete(false)}>
            Annuler
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: "red", color: "white" }}
            onClick={handleConfirmDelete}
            autoFocus
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BoutonForm;
