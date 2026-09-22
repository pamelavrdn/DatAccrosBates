// Description : Ce composant permet de générer un mot de passe aléatoire de longueur donnée.

// =============== Importations ====================
// *** React ***
import React from "react";
// ===================================================

// ============== Fonction pour générer un mot de passe aléatoire ==============
// Définissez la fonction generateRandomPassword en dehors du composant PasswordGenerator
export const generateRandomPassword = (length) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$_!?/";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};
// ============================================================================

const PasswordGenerator = () => {
  // Utilisez la fonction generateRandomPassword pour générer le mot de passe aléatoire
  const randomPassword = generateRandomPassword(6);

  return (
    <>
      {/* ajouter d'autres fonctionnalités du composant si nécessaire */}
    </>
  );
};

export default PasswordGenerator;
