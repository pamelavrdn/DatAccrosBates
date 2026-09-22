import Coach from "./pagesOnglets/Coach";
import React, { useState } from "react";
import RechercheEtTri from "../components/rechercheEtTri/rechercheEtTri";
import UtilisateurListe from "../components/listes/UtilisateurListe";
import { useCoachData } from "../data/Data";
import Success from "../components/success/Success";
import FormulaireCoach from "../components/formulaire/FormulaireCoach";

const CoachModifier = () => {
  const [personne, setPersonne] = useState({});
  const [searchCoach, setSearchCoach] = useState("");
  const [sortOptionCoach, setSortOptionCoach] = useState("nom");
  const [showSuccess, setShowSuccess] = useState(false);

  const [coach, setCoach] = useState({});

  const { data: coachsData } = useCoachData();

  return (
    <>
      <Coach>
        {showSuccess && (
          <Success
            message={"Coach modifié.e avec succès"}
            onClose={() => setShowSuccess(false)}
          />
        )}
        <div className="box box-liste">
          <RechercheEtTri
            type="coach"
            onSearchChange={(searchCoach) => setSearchCoach(searchCoach)}
            onSortChange={(sortOptionCoach) =>
              setSortOptionCoach(sortOptionCoach)
            }
          />
          {coachsData && (
            <UtilisateurListe
              utilisateurs={coachsData}
              searchUtilisateur={searchCoach}
              sortOptionUtilisateur={sortOptionCoach}
              onUtilisateurClick={(coachClique) => setCoach(coachClique)}
            />
          )}
        </div>

        {Object.keys(coach).length > 0 && (
          <FormulaireCoach
            isModify={true}
            isCoachConnected={false}
            personneAModifier={coach}
            personne={personne}
            setPersonne={setPersonne}
            setShowSuccess={setShowSuccess}
          />
        )}
      </Coach>
    </>
  );
};

export default CoachModifier;
