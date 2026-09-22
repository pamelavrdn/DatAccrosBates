import React, { useEffect, useState } from "react";
import Success from "../components/success/Success";
import FormulaireSociete from "../components/formulaire/FormulaireSociete";
import { useAuth } from "../hooks/authContext";

const SocieteGerer = () => {
  const [societe, setSociete] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [image, setImage] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    document.title = "Société";
  }, []);

  return (
    <>
      {showSuccess && (
        <Success
          message={"Société modifiée avec succès"}
          onClose={() => setShowSuccess(false)}
        />
      )}

      {user.societeSelectionnee && (
        <FormulaireSociete
          isModify={true}
          isCoachConnected={true}
          societeAModifier={user.societeSelectionnee}
          societe={societe}
          setSociete={setSociete}
          setShowSuccess={setShowSuccess}
          image={image}
          setImage={setImage}
        />
      )}
    </>
  );
};

export default SocieteGerer;
