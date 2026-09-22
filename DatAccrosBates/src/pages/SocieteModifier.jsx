import Societe from "./pagesOnglets/Societe";
import React, { useState } from "react";
import RechercheEtTri from "../components/rechercheEtTri/rechercheEtTri";
import SocieteListe from "../components/listes/SocieteListe";
import { useSocieteData } from "../data/Data";
import Success from "../components/success/Success";
import FormulaireSociete from "../components/formulaire/FormulaireSociete";

const SocieteModifier = () => {
  const [societe, setSociete] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const [searchSociete, setSearchSociete] = useState("");
  const [sortSociete, setSortSociete] = useState("nom");

  const [societeCliquee, setSocieteCliquee] = useState({});
  const [image, setImage] = useState(null);

  const { data: societesData } = useSocieteData();

  return (
    <>
      <Societe>
        {showSuccess && (
          <Success
            message={"Société modifiée avec succès"}
            onClose={() => setShowSuccess(false)}
          />
        )}
        <div className="box box-liste">
          <RechercheEtTri
            type="societe"
            onSearchChange={(searchSociete) => setSearchSociete(searchSociete)}
            onSortChange={(sortSociete) => setSortSociete(sortSociete)}
          />

          {societesData && (
            <SocieteListe
              societes={societesData}
              searchSociete={searchSociete}
              sortOptionSociete={sortSociete}
              onSocieteClick={(societeCliquee) =>
                setSocieteCliquee(societeCliquee)
              }
            />
          )}
        </div>

        {Object.keys(societeCliquee).length > 0 && (
          <FormulaireSociete
            isModify={true}
            societeAModifier={societeCliquee}
            societe={societe}
            setSociete={setSociete}
            setShowSuccess={setShowSuccess}
            image={image}
            setImage={setImage}
          />
        )}
      </Societe>
    </>
  );
};

export default SocieteModifier;
