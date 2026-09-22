import "./accueil.css";
import React, { useEffect } from "react";
import CarteAccueil from "../components/accueil/CarteAccueil";

const DashboardPublic = () => {
  // Remplacez le contenu fictif par les données réelles du tableau de bord
  const dashboardData = [
    {
      id: 1,
      title: "Résultats",
      description: "Consulter les gymnastes",
      link: "/resultats",
    },
    { id: 2, title: "Concours", description: "Prochain concours dans 3 jours" },
    { id: 3, title: "Concours", description: "Prochain concours dans 3 jours" },
    { id: 4, title: "Section 4", description: "Résultats du dernier concours" },
    { id: 5, title: "Section 5", description: "Résultats du dernier concours" },
    { id: 6, title: "Section 6", description: "Résultats du dernier concours" },
    // Ajoutez autant de sections que nécessaire
  ];

  useEffect(() => {
    document.title = "Accueil";
  }, []);

  return (
    <>
      <div className="dashboard-sections">
        {dashboardData.map((section) => (
          <CarteAccueil
            key={section.id}
            title={section.title}
            description={section.description}
            link={section.link}
          />
        ))}
      </div>
    </>
  );
};

export default DashboardPublic;
