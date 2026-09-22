import Concours from "./pagesOnglets/Concours";
import React, { useState } from "react";
import ConcoursListe from "../components/listes/ConcoursListe";
import { useConcoursData } from "../data/Data";
import Success from "../components/success/Success";
import FormulaireConcours from "../components/formulaire/FormulaireConcours";

const ConcoursModifier = () => {
  const [concours, setConcours] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [triConcours, setTriConcours] = useState("asc");

  const handleTriConcours = () => {
    setTriConcours(triConcours === "asc" ? "desc" : "asc");
  };

  const [concoursClique, setConcoursClique] = useState({});

  const { data: concoursData } = useConcoursData();

  return (
    <>
      <Concours>
        {showSuccess && (
          <Success
            message={"Concours modifié avec succès"}
            onClose={() => setShowSuccess(false)}
          />
        )}
        <div className="box box-liste">
          {concoursData && (
            <>
              <p className="tri-date" onClick={handleTriConcours}>
                Trier par date
                {triConcours === "asc" ? " décroissante" : " croissante"}
              </p>
              <ConcoursListe
                concours={concoursData}
                onConcoursClick={(concoursClique) =>
                  setConcoursClique(concoursClique)
                }
                tri={triConcours}
              />
            </>
          )}
        </div>

        {Object.keys(concoursClique).length > 0 && (
          <FormulaireConcours
            isModify={true}
            concoursAModifier={concoursClique}
            concours={concours}
            setConcours={setConcours}
            setShowSuccess={setShowSuccess}
          />
        )}
      </Concours>
    </>
  );
};

export default ConcoursModifier;
