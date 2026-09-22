import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, firestore } from "../data/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const authContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        console.log(
          "Authentification réussie pour l'utilisateur :",
          authUser.uid
        );

        const userRef = doc(firestore, "cag_utilisateurs", authUser.uid);
        const userDocSnap = await getDoc(userRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();

          if (userData.role === "coachP" || userData.role === "coachC") {
            const companyDataPromises = userData.societes.map((societeRef) =>
              getDoc(societeRef)
            );
            const companyDocSnaps = await Promise.all(companyDataPromises);
            const companies = companyDocSnaps
              .map((docSnap) => {
                if (docSnap.exists()) {
                  return {
                    ref: docSnap.ref,
                    id: docSnap.id,
                    ...docSnap.data(),
                  };
                } else {
                  return null;
                }
              })
              .filter((company) => company !== null);

            setUser({
              ...userData,
              societes: companies,
            });
          } else {
            setUser(userData);
          }
        }
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <authContext.Provider value={{ user, setUser }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
