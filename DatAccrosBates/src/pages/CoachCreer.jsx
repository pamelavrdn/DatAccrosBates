import React, { useState } from "react";
import FormulaireCoach from "../components/formulaire/FormulaireCoach";
import Coach from "./pagesOnglets/Coach";
import Carte from "../components/formulaire/carte/Carte";
import Success from "../components/success/Success";

const CoachCreer = () => {
  const [personne, setPersonne] = useState({});
  const [image, setImage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <Coach>
      {showSuccess && (
        <Success
          message={"Coach créé.e avec succès"}
          onClose={() => setShowSuccess(false)}
        />
      )}
      <FormulaireCoach
        isModify={false}
        isCoachConnected={false}
        personne={personne}
        setPersonne={setPersonne}
        setShowSuccess={setShowSuccess}
      />
      <Carte
        isCoach={true}
        personne={personne}
        image={image}
        setImage={setImage}
      />
    </Coach>
  );
};

export default CoachCreer;
