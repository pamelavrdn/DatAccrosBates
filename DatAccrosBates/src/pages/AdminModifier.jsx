import Admin from "./pagesOnglets/Admin";
import React, { useState } from "react";
import FormulaireAdmin from "../components/formulaire/FormulaireAdmin";
import RechercheEtTri from "../components/rechercheEtTri/rechercheEtTri";
import UtilisateurListe from "../components/listes/UtilisateurListe";
import { useAdminData } from "../data/Data";
import Success from "../components/success/Success";

const AdminModifier = () => {
  const [personne, setPersonne] = useState({});
  const [searchAdmin, setSearchAdmin] = useState("");
  const [sortOptionAdmin, setSortOptionAdmin] = useState("nom");
  const [showSuccess, setShowSuccess] = useState(false);

  const [admin, setAdmin] = useState({});

  const { data: adminsData } = useAdminData();

  return (
    <>
      <Admin>
        {showSuccess && (
          <Success
            message={"Admin modifié.e avec succès"}
            onClose={() => setShowSuccess(false)}
          />
        )}
        <div className="box box-liste">
          <RechercheEtTri
            type="admin"
            onSearchChange={(searchAdmin) => setSearchAdmin(searchAdmin)}
            onSortChange={(sortOptionAdmin) =>
              setSortOptionAdmin(sortOptionAdmin)
            }
          />
          {adminsData && (
            <UtilisateurListe
              utilisateurs={adminsData}
              searchUtilisateur={searchAdmin}
              sortOptionUtilisateur={sortOptionAdmin}
              onUtilisateurClick={(adminClique) => setAdmin(adminClique)}
            />
          )}
        </div>

        {Object.keys(admin).length > 0 && (
          <FormulaireAdmin
            isModify={true}
            personneAModifier={admin}
            personne={personne}
            setPersonne={setPersonne}
            setShowSuccess={setShowSuccess}
          />
        )}
      </Admin>
    </>
  );
};

export default AdminModifier;
