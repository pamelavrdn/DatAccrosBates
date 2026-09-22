import "./App.css";
import { useState } from "react";
import AppRoutes from "./AppRoutes";
import Sidebar from "./components/sidebar/Sidebar";
import Login from "./pages/Login";
import MentionsLegales from "./components/mentionsLegales/MentionsLegales";
import { AuthProvider } from "./hooks/authContext";
import CoachModal from "./pages/CoachModal";
//import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showCoachModal, setShowCoachModal] = useState(false);
  const [showMentionsLegales, setShowMentionsLegales] = useState(false);

  return (
    <>
      <AuthProvider>
        <div className="container">
          {showLogin && <Login setShowLogin={setShowLogin} />}

          <CoachModal
            showCoachModal={showCoachModal}
            setShowCoachModal={setShowCoachModal}
          />

          {showMentionsLegales && (
            <MentionsLegales
              showMentionsLegales={showMentionsLegales}
              setShowMentionsLegales={setShowMentionsLegales}
            />
          )}

          <div className="sidebar">
            <Sidebar
              showLogin={showLogin}
              setShowLogin={setShowLogin}
              showMentionsLegales={showMentionsLegales}
              setShowMentionsLegales={setShowMentionsLegales}
            />
          </div>

          <div className="main">
            <AppRoutes />
          </div>
        </div>
      </AuthProvider>
    </>
  );
}
