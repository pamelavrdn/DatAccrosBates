import React, { useState } from "react";
import FormulaireConcours from "../components/formulaire/FormulaireConcours";
import Concours from "./pagesOnglets/Concours";
import Success from "../components/success/Success";

const ConcoursCreer = () => {
  const [concours, setConcours] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <>
      <Concours>
        {showSuccess && (
          <Success
            message={"Concours créé avec succès"}
            onClose={() => setShowSuccess(false)}
          />
        )}
        <FormulaireConcours
          isModify={false}
          concours={concours}
          setConcours={setConcours}
          setShowSuccess={setShowSuccess}
        />
      </Concours>
    </>
  );
};

export default ConcoursCreer;
