import React, { useState } from "react";
import Admin from "./pagesOnglets/Admin";
import FormulaireAdmin from "../components/formulaire/FormulaireAdmin";
import Carte from "../components/formulaire/carte/Carte";
import Success from "../components/success/Success";

const AdminCreer = () => {
  const [personne, setPersonne] = useState({});
  const [image, setImage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <>
      <Admin>
        {showSuccess && (
          <Success
            message={"Admin créé.e avec succès"}
            onClose={() => setShowSuccess(false)}
          />
        )}
        <FormulaireAdmin
          isModify={false}
          personne={personne}
          setPersonne={setPersonne}
          setShowSuccess={setShowSuccess}
        />
        <Carte
          isAdmin={true}
          personne={personne}
          image={image}
          setImage={setImage}
        />
      </Admin>
    </>
  );
};

export default AdminCreer;
