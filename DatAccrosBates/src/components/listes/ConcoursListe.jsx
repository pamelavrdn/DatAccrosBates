import React, { useEffect, useState } from "react";
import CarteListe from "./CarteListe";
import { formatDateSlash } from "../../data/Data";

const ConcoursListe = ({ concours, onConcoursClick, tri }) => {
  const [clickedConcoursId, setClickedConcoursId] = useState(null);
  const [concoursTri, setConcoursTri] = useState([]);

  useEffect(() => {
    const concoursTriParDate = [...concours].sort((a, b) =>
      tri === "asc"
        ? a.date?.toDate() - b.date?.toDate()
        : b.date?.toDate() - a.date?.toDate()
    );
    setConcoursTri(concoursTriParDate);
  }, [concours, tri]);

  useEffect(() => {
    setClickedConcoursId(null);
  }, [concours]);

  const handleClick = (selectedConcours) => {
    setClickedConcoursId(selectedConcours.id);
    onConcoursClick(selectedConcours);
  };

  return (
    <div className="liste">
      {concoursTri.map((concours, index) => (
        <div
          key={index}
          className={`carte-liste ${
            clickedConcoursId === concours.id ? " cliquee" : ""
          }`}
          onClick={() => handleClick(concours)}
          data-testid="carte-liste"
        >
          <CarteListe
            textePrincipal={concours.nom}
            texteSecondaire={concours.lieu}
            texteComplementaire={
              concours.date && formatDateSlash(concours.date)
            }
          />
        </div>
      ))}
    </div>
  );
};

export default ConcoursListe;
