import React, { useState } from "react";
import FormulaireSociete from "../components/formulaire/FormulaireSociete";
import Societe from "./pagesOnglets/Societe";
import Carte from "../components/formulaire/carte/Carte";
import Success from "../components/success/Success";

const SocieteCreer = () => {
  const [societe, setSociete] = useState({});
  const [image, setImage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <>
      <Societe>
        {showSuccess && (
          <Success
            message={"Société créée avec succès"}
            onClose={() => setShowSuccess(false)}
          />
        )}
        <FormulaireSociete
          isModify={false}
          societe={societe}
          setSociete={setSociete}
          setShowSuccess={setShowSuccess}
          image={image}
          setImage={setImage}
        />
        <Carte
          isSociete={true}
          personne={societe}
          image={image}
          setImage={setImage}
        />
      </Societe>
    </>
  );
};

export default SocieteCreer;
