import React, { useEffect, useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../data/firebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const Login = ({ setShowLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login";
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(firestore, "cag_utilisateurs", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserLoggedIn(true);
          setUserData(docSnap.data());
        }
      }
    });
  }, [userLoggedIn, userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        throw new Error("Email et mot de passe sont requis");
      }
      await signInWithEmailAndPassword(auth, email, password);
      const userRef = doc(firestore, "cag_utilisateurs", auth.currentUser.uid);
      const userDocSnap = await getDoc(userRef);
      const userData = userDocSnap.data();

      try {
        if (
          (userData.role === "coachC" || userData.role === "coachP") &&
          userData.societes.length === 0
        ) {
          await auth.signOut();
          navigate("/accueil", { state: true });
          setShowLogin(true);
          setUserLoggedIn(false);
          throw new Error("Pas de sociétés");
        } else {
          navigate("/accueil", { state: false });
          setShowLogin(false);
          setUserLoggedIn(true);
        }
      } catch (error) {
        console.error("Erreur lors de la connexion :", error.message);
        setMessage("Vous n'êtes associé\nà aucune société");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error.message);
      setMessage("Email ou mot de passe\nincorrect");
    }
  };

  const isValidEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const [message, setMessage] = useState(null);

  // Sinon, affiche le formulaire de connexion
  return (
    <div className="login">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="group">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            required={true}
            className="input"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setMessage(null);
            }}
            placeholder="exemple@mail.ch"
          />
        </div>
        <div className="group">
          <div className="password-input">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              required={true}
              className="input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setMessage(null);
              }}
              placeholder="********"
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </span>
          </div>
          <p
            className="forgot-password"
            onClick={async () => {
              try {
                if (email === "") {
                  throw new Error("Veuillez entrer votre email");
                } else if (isValidEmail(email)) {
                  await sendPasswordResetEmail(auth, email);
                  setMessage(
                    "Nous avons envoyé un email\nà l'adresse indiquée"
                  );
                } else {
                  throw new Error("Adresse email invalide");
                }
              } catch (error) {
                setMessage(error.message);
              }
            }}
          >
            Mot de passe oublié ?
          </p>
        </div>

        <div className="button-flex">
          <button
            className="submit"
            type="button"
            onClick={() => setShowLogin(false)}
          >
            Annuler
          </button>
          <button className="submit" type="submit">
            Se connecter
          </button>
        </div>

        {message && (
          <>
            <p className="alert-box">{message}</p>
          </>
        )}
      </form>
    </div>
  );
};

export default Login;
