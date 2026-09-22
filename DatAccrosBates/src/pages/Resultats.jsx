import "./resultats.css";
import GymnasteListe from "../components/listes/GymnasteListe";
import ConcoursListe from "../components/listes/ConcoursListe";
import ResultatsListe from "../components/listes/ResultatsListe";
import RechercheEtTri from "../components/rechercheEtTri/rechercheEtTri";
import { useState, useEffect } from "react";
import {
  formatDateLong,
  useAllGymnastesData,
  useParticipationData,
} from "../data/Data";

const Resultats = () => {
  useEffect(() => {
    document.title = "Résultats";
  }, []);

  /* données de gymnastes et de concours auxquels le gymnaste a participé */
  const { data: gymnastesData } = useAllGymnastesData();
  const [concours, setConcours] = useState([]);

  /* Le gymnaste et le concours sélectionnés (ainsi que les participations avec résultats, classement, etc) */
  const [selectedConcours, setSelectedConcours] = useState(null);
  const [selectedGymnaste, setSelectedGymnaste] = useState(null);
  const [selectedParticipation, setSelectedParticipation] = useState(null);

  const { data: participations } = useParticipationData(selectedGymnaste);

  /* pour la recherche et le tri */
  const [searchGymnaste, setSearchGymnaste] = useState("");
  const [sortGymnaste, setSortGymnaste] = useState("nom");
  const [triConcours, setTriConcours] = useState("asc");

  const handleSearchChangeGymnaste = (search) => {
    setSearchGymnaste(search);
  };

  const handleSortChangeGymnaste = (sort) => {
    setSortGymnaste(sort);
  };

  const handleGymnasteClick = (gymnaste) => {
    setSelectedGymnaste(gymnaste);
    setSelectedConcours(null);
    setSelectedParticipation(null);
  };

  // Mettre à jour la liste des concours lorsque le gymnaste sélectionné change
  useEffect(() => {
    if (selectedGymnaste && participations) {
      setConcours(
        participations.map((participation) => participation.concours)
      );
    }
  }, [participations, selectedGymnaste]);

  const handleConcoursClick = (concours) => {
    setSelectedConcours(concours);
    // Trouver la participation correspondante au concours sélectionné
    setSelectedParticipation(
      participations.find(
        (participation) => participation.concours.id === concours.id
      )
    );
  };

  const handleTriConcours = () => {
    setTriConcours(triConcours === "asc" ? "desc" : "asc");
  };

  return (
    <>
      {/* Sélection de gymnaste */}
      <div className="box box-gymnaste">
        <RechercheEtTri
          type="gymnaste"
          onSearchChange={handleSearchChangeGymnaste}
          onSortChange={handleSortChangeGymnaste}
        />

        <GymnasteListe
          gymnastes={gymnastesData}
          searchGymnaste={searchGymnaste}
          sortOptionGymnaste={sortGymnaste}
          display={false}
          onGymnasteClick={handleGymnasteClick}
        />
      </div>

      {/* Sélection de concours et résultats de la recherche */}
      <div className="box box-concours-resultat">
        <div className="concours">
          {selectedGymnaste && (
            <>
              {concours.length > 0 ? (
                <>
                  <p className="tri-date" onClick={handleTriConcours}>
                    Trier par date
                    {triConcours === "asc" ? " décroissante" : " croissante"}
                  </p>
                  <ConcoursListe
                    concours={concours}
                    onConcoursClick={handleConcoursClick}
                    tri={triConcours}
                  />
                </>
              ) : (
                <p>Aucun concours</p>
              )}
            </>
          )}
        </div>
        <div className="resultats">
          {selectedGymnaste && selectedConcours && (
            <>
              <div className="resultats-titre">
                <h3>
                  Résultats de {selectedGymnaste.prenom} {selectedGymnaste.nom}
                </h3>
                <h3>Catégorie {selectedParticipation.categorie}</h3>
                <h3>
                  {selectedConcours.nom}, {selectedConcours.lieu}
                </h3>
                <h3>
                  {selectedConcours.date &&
                    formatDateLong(selectedConcours.date)}
                </h3>
              </div>
              <ResultatsListe
                resultats={selectedParticipation.resultats}
                classement={selectedParticipation.classement}
                recompense={selectedParticipation.recompense}
                equipe={
                  selectedParticipation.equipe
                    ? selectedParticipation.equipe
                    : null
                }
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Resultats;
