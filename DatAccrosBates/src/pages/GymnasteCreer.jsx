import React, { useState } from "react";
import FormulaireGymnaste from "../components/formulaire/FormulaireGymnaste";
import Gymnaste from "./pagesOnglets/Gymnaste";
import Carte from "../components/formulaire/carte/Carte";
import Success from "../components/success/Success";

const GymnasteCreer = () => {
  const [personne, setPersonne] = useState({});
  const [image, setImage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <>
      <Gymnaste>
        {showSuccess && (
          <Success
            message={"Gymnaste créé.e avec succès"}
            onClose={() => setShowSuccess(false)}
          />
        )}
        <FormulaireGymnaste
          isModify={false}
          isCoachConnected={false}
          personne={personne}
          setPersonne={setPersonne}
          setShowSuccess={setShowSuccess}
        />
        <Carte
          isGymnaste={true}
          personne={personne}
          image={image}
          setImage={setImage}
        />
      </Gymnaste>
    </>
  );
};

export default GymnasteCreer;
