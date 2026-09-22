import React, { useEffect, useState } from "react";
import "./sidebar.css";
import {
  SidebarPublic,
  SidebarAdmin,
  SidebarCoachClassique,
  SidebarCoachPrivilegie,
} from "./SidebarUtilisateur";
import SidebarMenu from "./SidebarMenu";
import { useNavigate } from "react-router-dom";
import BoutonLogin from "../boutons/BoutonLogin";
import Theme from "../theme/Theme";
import logo from "./logo.png";
import { auth } from "../../data/firebaseConfig";

import { useAuth } from "../../hooks/authContext";

const Sidebar = ({
  showLogin,
  setShowLogin,
  showMentionsLegales,
  setShowMentionsLegales,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Obtenez les informations sur l'utilisateur connecté
  const [sidebarUtilisateur, setSidebarElements] = useState([]);
  const [activeParent, setActiveParent] = useState(null); // ne pas effacer, ça a une utilité !

  useEffect(() => {
    // Utilisez les informations sur l'utilisateur pour déterminer le contenu de la sidebar
    if (user) {
      // Récupérez le rôle de l'utilisateur à partir du contexte d'authentification
      const { role } = user;
      console.log("Role de l'utilisateur:", role);

      // Déterminez le contenu de la sidebar en fonction du rôle de l'utilisateur
      switch (role) {
        case "admin":
          setSidebarElements(SidebarAdmin);
          break;
        case "coachC":
          setSidebarElements(SidebarCoachClassique);
          break;
        case "coachP":
          setSidebarElements(SidebarCoachPrivilegie);
          break;
        default:
          setSidebarElements(SidebarPublic);
      }
    } else {
      // Si aucun utilisateur n'est connecté, affichez la sidebar public par défaut
      setSidebarElements(SidebarPublic);
    }
  }, [user]);

  // Fonction pour gérer la déconnexion de l'utilisateur
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <>
      <div className="sidebar-logo">
        <img className="logo" src={logo} onClick={() => navigate("/accueil")} />
      </div>

      <ul className="sidebar-menu">
        {sidebarUtilisateur.map((item, index) => (
          <SidebarMenu
            key={index}
            {...item}
            activeParent={activeParent}
            handleParentItemClick={() => setActiveParent(item.title)}
          ></SidebarMenu>
        ))}
      </ul>

      <div className="sidebar-login">
        {/* Condition pour afficher le nom de l'utilisateur connecté */}
        {user ? (
          <>
            <p className="welcome-message">Bienvenue {user.nomUtilisateur}</p>
            {user.societeSelectionnee && (
              <p className="welcome-message">{user.societeSelectionnee.nom}</p>
            )}
            <BoutonLogin onClick={handleLogout} texte={"Logout"} />
          </>
        ) : (
          <BoutonLogin
            onClick={() => setShowLogin(!showLogin)}
            texte={"Login"}
          />
        )}
      </div>
      <div className="sidebar-theme-mentions">
        <Theme />
        <p
          className="mentions-legales"
          onClick={() => setShowMentionsLegales(!showMentionsLegales)}
        >
          Mentions légales
        </p>
      </div>
    </>
  );
};

export default Sidebar;
