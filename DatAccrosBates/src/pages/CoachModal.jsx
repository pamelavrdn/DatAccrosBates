import React, { useEffect } from "react";
import Modal from "react-modal";
import { useAuth } from "../hooks/authContext";
import "./coachModal.css";
import BoutonGlobal from "../components/boutons/BoutonGlobal";

const CoachModal = ({ showCoachModal, setShowCoachModal }) => {
  const closeModal = () => {
    setShowCoachModal(false);
  };
  const { user } = useAuth();
  console.log("user", user);
  console.log("showCoachModal", showCoachModal);

  useEffect(() => {
    if (
      user &&
      user.societes?.length > 1 &&
      !user.societeSelectionnee &&
      (user.role === "coachC" || user.role === "coachP")
    ) {
      setShowCoachModal(true);
    }
    if (
      user &&
      user.societes?.length === 1 &&
      !user.societeSelectionnee &&
      (user.role === "coachC" || user.role === "coachP")
    ) {
      user.societeSelectionnee = user.societes[0];
    }
  }, [user]);

  return (
    <Modal
      className="coach-modal"
      isOpen={showCoachModal}
      onRequestClose={closeModal}
      style={{ overlay: { zIndex: 1000 }, content: { zIndex: 1000 } }}
    >
      {user ? (
        <>
          <div className="titre">
            <h2>Bienvenue Coach {user.prenom}</h2>
            <h3>Voici les sociétés auxquelles vous avez accès :</h3>
          </div>
          <div className="boutons-societes">
            {user.societes &&
              user.societes.map((societe, index) => {
                return (
                  <BoutonGlobal
                    key={index}
                    style={{ margin: "10px 0" }}
                    texte={societe.nom}
                    onClick={() => {
                      user.societeSelectionnee = societe;
                      console.log(
                        "Societe sélectionnée:",
                        user.societeSelectionnee
                      );
                      closeModal();
                    }}
                  />
                );
              })}
          </div>
        </>
      ) : (
        <p>Chargement...</p>
      )}
    </Modal>
  );
};

export default CoachModal;
