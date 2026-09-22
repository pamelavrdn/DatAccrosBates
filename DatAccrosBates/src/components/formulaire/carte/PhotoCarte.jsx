// Description : Ce composant permet d'afficher la photo de profil d'un gymnaste, d'un coach, d'une société ou d'un admin.

// ================= Importations ====================
// *** React ***
import React, { useState, useEffect } from "react";
// *** Images ***
import jeuneHomme from "./image/JeuneHomme.jpg";
import jeuneFemme from "./image/JeuneFemme.jpg";
import homme from "./image/Homme.jpg";
import femme from "./image/Femme.jpg";
import coach from "./image/Coach.jpg";
import imageNotFound from "./image/ImageNotFound.png";
import admin from "./image/Admin.jpg";
// ===================================================

const PhotoCarte = ({
  gender,
  date,
  personne,
  isGymnaste,
  isCoach,
  isAdmin,
  isSociete,
  image,
  setImage,
}) => {
  // =============== Déclaration des variables ===============
  const [isNom, setIsNom] = useState(false);
  // ========================================================

  // =============== Fonctions ===============

  // *** Fonction pour calculer l'âge à partir de la date de naissance ***
  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // *** Fonction pour déterminer quelle photo afficher en fonction du rôle et des données ***
  const photo = () => {
    let selectedImage = femme; // Par défaut, utilisez l'image femme si aucune autre condition n'est remplie

    if (isGymnaste) {
      if (gender === "M") {
        selectedImage = calculateAge(date) < 18 ? jeuneHomme : homme;
      } else if (gender === "F") {
        selectedImage = calculateAge(date) < 18 ? jeuneFemme : femme;
      }
    } else if (isCoach) {
      selectedImage = coach;
    } else if (isAdmin) {
      selectedImage = admin;
    } else if (isSociete) {
      selectedImage = image;
    }

    setImage(selectedImage);
  };
  // ========================================

  // =============== UseEffect ===============
  useEffect(() => {
    photo();
    setIsNom(personne.nom === ""); // Mettre à jour isNom en vérifiant si personne.nom n'est pas une chaîne vide
  }),
    [
      personne.nom,
      setIsNom,
      gender,
      date,
      isGymnaste,
      isCoach,
      isAdmin,
      isSociete,
      image,
    ];
  // ========================================

  // =============== Rendu de la photo ===============
  return (
    <>
      <img
        src={
          isSociete
            ? image
              ? URL.createObjectURL(image)
              : imageNotFound
            : image
        }
        alt="Photo de profil"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </>
  );
};

export default PhotoCarte;
