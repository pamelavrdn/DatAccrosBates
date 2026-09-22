import { Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/authContext";

import Accueil from "./pages/Accueil";
import Resultats from "./pages/Resultats";
import GymnasteGerer from "./pages/GymnasteGerer";
import GymnasteModifier from "./pages/GymnasteModifier";
import GymnasteCreer from "./pages/GymnasteCreer";
import GymnasteInscrire from "./pages/GymnasteInscrire";
import SocieteModifier from "./pages/SocieteModifier";
import CoachCreer from "./pages/CoachCreer";
import CoachModifier from "./pages/CoachModifier";
import CoachGerer from "./pages/CoachGerer";
import AdminCreer from "./pages/AdminCreer";
import AdminModifier from "./pages/AdminModifier";
import SocieteCreer from "./pages/SocieteCreer";
import ConcourCreer from "./pages/ConcoursCreer";
import ConcourModifier from "./pages/ConcoursModifier";
import ImporterExporterCSV from "./pages/ImporterExporterCsv";
import NotFound from "./components/notFound/NotFound";
import SocieteGerer from "./pages/SocieteGerer";
import Redirection from "./pages/Redirection";

const AppRoutes = () => {
  const { user } = useAuth(); // Obtenez les informations sur l'utilisateur connecté depuis le hook useAuth

  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/accueil" element={<Accueil />} />
      <Route path="/resultats" element={<Resultats />} />

      {/* <Route path="/redirect" element={<Redirection />} /> */}

      {/* Routes spécifiques aux différents utilisateurs */}
      {user && (
        <>
          {user.role === "admin" && (
            <>
              {/* Routes pour admin */}
              <Route path="/creer-concours" element={<ConcourCreer />} />
              <Route path="/modifier-concours" element={<ConcourModifier />} />
              <Route
                path="/importer-exporter"
                element={<ImporterExporterCSV />}
              />
              <Route path="/creer-coach" element={<CoachCreer />} />
              <Route path="/modifier-coach" element={<CoachModifier />} />
              <Route path="/creer-admin" element={<AdminCreer />} />
              <Route path="/modifier-admin" element={<AdminModifier />} />
              <Route path="/creer-gymnaste" element={<GymnasteCreer />} />
              <Route path="/modifier-gymnaste" element={<GymnasteModifier />} />
              <Route path="/creer-societe" element={<SocieteCreer />} />
              <Route path="/modifier-societe" element={<SocieteModifier />} />
            </>
          )}

          {user.role === "coachC" && (
            <>
              {/* Routes pour coach classique */}
              <Route path="/inscrire-gymnaste" element={<GymnasteInscrire />} />
              <Route path="/gerer-gymnastes" element={<GymnasteGerer />} />
              <Route path="/accueil?state" element={<Accueil />} />
            </>
          )}

          {user.role === "coachP" && (
            <>
              {/* Routes pour coach privilégié */}
              <Route path="/inscrire-gymnaste" element={<GymnasteInscrire />} />
              <Route path="/gerer-gymnastes" element={<GymnasteGerer />} />
              <Route path="/gerer-coachs" element={<CoachGerer />} />
              <Route path="/gerer-societe" element={<SocieteGerer />} />
              <Route path="/accueil?state" element={<Accueil />} />
            </>
          )}
        </>
      )}
      {!user && (
        <>
          <Route path="/creer-concours" element={<Redirection />} />
          <Route path="/modifier-concours" element={<Redirection />} />
          <Route path="/importer-exporter" element={<Redirection />} />
          <Route path="/creer-coach" element={<Redirection />} />
          <Route path="/modifier-coach" element={<Redirection />} />
          <Route path="/creer-admin" element={<Redirection />} />
          <Route path="/modifier-admin" element={<Redirection />} />
          <Route path="/creer-gymnaste" element={<Redirection />} />
          <Route path="/modifier-gymnaste" element={<Redirection />} />
          <Route path="/creer-societe" element={<Redirection />} />
          <Route path="/modifier-societe" element={<Redirection />} />
          <Route path="/inscrire-gymnaste" element={<Redirection />} />
          <Route path="/gerer-gymnastes" element={<Redirection />} />
          <Route path="/inscrire-gymnaste" element={<Redirection />} />
          <Route path="/gerer-gymnastes" element={<Redirection />} />
          <Route path="/gerer-coachs" element={<Redirection />} />
          <Route path="/gerer-societe" element={<Redirection />} />
        </>
      )}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
