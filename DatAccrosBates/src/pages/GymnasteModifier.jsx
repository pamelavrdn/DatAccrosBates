import Gymnaste from "./pagesOnglets/Gymnaste";
import React, { useState } from "react";
import RechercheEtTri from "../components/rechercheEtTri/rechercheEtTri";
import GymnasteListe from "../components/listes/GymnasteListe";
import { useAllGymnastesData } from "../data/Data";
import Success from "../components/success/Success";
import FormulaireGymnaste from "../components/formulaire/FormulaireGymnaste";

const GymnasteModifier = () => {
  const [personne, setPersonne] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: gymnastesData } = useAllGymnastesData();

  const [searchGymnaste, setSearchGymnaste] = useState("");
  const [sortOptionGymnaste, setSortOptionGymnaste] = useState("nom");

  const [gymnaste, setGymnaste] = useState({});

  return (
    <Gymnaste>
      {showSuccess && (
        <Success
          message={"Gymnaste modifié.e avec succès"}
          onClose={() => setShowSuccess(false)}
        />
      )}
      <div className="box box-liste">
        <RechercheEtTri
          type="gymnaste"
          onSearchChange={(searchGymnaste) => setSearchGymnaste(searchGymnaste)}
          onSortChange={(sortOptionGymnaste) =>
            setSortOptionGymnaste(sortOptionGymnaste)
          }
        />

        {gymnastesData && (
          <GymnasteListe
            gymnastes={gymnastesData}
            searchGymnaste={searchGymnaste}
            sortOptionGymnaste={sortOptionGymnaste}
            onGymnasteClick={(gymnasteClique) => setGymnaste(gymnasteClique)}
            display={true}
          />
        )}
      </div>

      {Object.keys(gymnaste).length > 0 && (
        <FormulaireGymnaste
          isModify={true}
          isCoachConnected={false}
          personneAModifier={gymnaste}
          personne={personne}
          setPersonne={setPersonne}
          setShowSuccess={setShowSuccess}
        />
      )}
    </Gymnaste>
  );
};

export default GymnasteModifier;
