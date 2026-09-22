// Description : Ce composant permet d'afficher et de remplir la carte de membre d'un gymnaste, d'un coach, d'une société ou d'un admin.

// ================= Importations ====================
// *** CSS ***
import "./carte.css";
// *** React ***
import React, { useState, useEffect } from "react";
// *** Données ***
import { getDoc } from "firebase/firestore";
// *** Composants ***
import PhotoCarte from "./PhotoCarte";
// ===================================================

const Carte = ({
  isGymnaste,
  isCoach,
  isSociete,
  isAdmin,
  personne,
  image,
  setImage,
}) => {
  // =============== Déclaration des variables ===============
  const [societeData, setSocieteData] = useState([]);
  // ========================================================

  // =============== UseEffect ===============
  useEffect(() => {
    // *** Fonction pour récupérer les sociétés ***
    const fetchSocietes = async () => {
      console.log("fetching societes");
      if (isCoach) {
        const societes = await Promise.all(
          personne.societes.map(async (societe) => {
            //const societeData = await findSocieteById(societe.id, societesData);
            const societeData = await getDoc(societe);
            return societeData.data();
          })
        );
        setSocieteData(societes);
      } else if (isGymnaste && personne.idSociete) {
        const societe = await getDoc(personne.idSociete);
        console.log(societe);
        setSocieteData([societe.data()]);
      }
    };

    if ((isGymnaste && personne.idSociete) || (isCoach && personne.societes)) {
      fetchSocietes();
    }
  }, [
    isGymnaste,
    isCoach,
    isSociete,
    isAdmin,
    personne.societes,
    personne.idSociete,
  ]);
  // ========================================

  // =============== Fonctions ===============
  // *** Définition des éléments de la carte ***
  const formItems = {
    photo: () => (
      <div className="carte-photo">
        <PhotoCarte
          isGymnaste={isGymnaste}
          isCoach={isCoach}
          isAdmin={isAdmin}
          isSociete={isSociete}
          personne={personne}
          gender={personne.sexe}
          date={personne.dateNaissance}
          image={image}
          setImage={setImage}
        />
      </div>
    ),
    nom: () => (
      <p className="label-input" style={{ fontWeight: "bold" }}>
        {" "}
        {personne.nom}{" "}
      </p>
    ),
    prenom: () => (
      <p className="label-input" style={{ fontWeight: "bold" }}>
        {" "}
        {personne.prenom}{" "}
      </p>
    ),
    date: () => (
      <p className="label-input" style={{ whiteSpace: "nowrap" }}>
        {" "}
        {personne.dateNaissance}{" "}
      </p>
    ),
    societe: () => (
      <>
        {societeData.length > 0 && (
          <>
            {societeData.length > 1 && (
              <p className="label-input" style={{ whiteSpace: "nowrap" }}>
                Sociétés :
              </p>
            )}
            {societeData.map((societe) => (
              <p className="label-input" key={societe.id}>
                {societeData.length > 1 && "- "}
                {societe.nom}
              </p>
            ))}
          </>
        )}
      </>
    ),
    categorie: () =>
      personne.categorie && (
        <p className="label-input">C{personne.categorie}</p>
      ),
    privilegie: () => (
      <p className="label-input" style={{ whiteSpace: "nowrap" }}>
        Coach privilégié{" "}
      </p>
    ),

    email: () => (
      <>
        {personne.email && (
          <>
            <p className="label-input" style={{ whiteSpace: "nowrap" }}>
              Email :
            </p>
            <p className="label-input">{personne.email}</p>
          </>
        )}
      </>
    ),
    footerGymnaste: () => <p className="footer-label"> GYMNASTE </p>,
    footerCoach: () => <p className="footer-label"> COACH </p>,
    footerSociete: () => <p className="footer-label"> SOCIÉTÉ </p>,
    footerAdmin: () => <p className="footer-label"> ADMIN </p>,
    codeBarreGymnaste: () => (
      <div className="code-barre">
        <p className="code-barre-input">{personne.noFSG}</p>
      </div>
    ),
    codeBarreUser: () => (
      <div className="code-barre">
        <p className="code-barre-input">{personne.nomUtilisateur}</p>
      </div>
    ),
    codeBarreSociete: () => (
      <div className="code-barre">
        <p className="code-barre-input">{personne.email}</p>
      </div>
    ),
  };
  // *** Fonction pour afficher les éléments de la carte ***
  const renderFormItem = (itemName) => {
    const formItemFunction = formItems[itemName];
    return formItemFunction ? formItemFunction() : null;
  };
  // ========================================

  // =============== Rendu de la carte ===============
  return (
    <>
      {/* ============= GYMNASTE ============= */}
      {isGymnaste && (
        <>
          <div className="carte-container">
            <div className="carte-photo-infos">
              {renderFormItem("photo")}
              <div className="carte-infos">
                <div className="carte-infos-item">
                  <div className="infos-groupe">
                    {renderFormItem("nom")}
                    {renderFormItem("prenom")}
                  </div>
                  <div className="infos-groupe">{renderFormItem("date")}</div>
                  <div className="infos-groupe">
                    {renderFormItem("societe")} {renderFormItem("categorie")}
                  </div>
                </div>
              </div>
            </div>
            <div className="carte-footer">
              {renderFormItem("footerGymnaste")}
              {renderFormItem("codeBarreGymnaste")}
            </div>
          </div>
        </>
      )}

      {/* ============= COACH ============= */}
      {isCoach && (
        <>
          <div className="carte-container">
            <div className="carte-photo-infos">
              {renderFormItem("photo")}
              <div className="carte-infos">
                <div className="carte-infos-item">
                  <div className="infos-groupe">
                    {renderFormItem("nom")}
                    {renderFormItem("prenom")}
                  </div>
                  {personne.role === "coachP" && (
                    <div className="infos-groupe">
                      {renderFormItem("privilegie")}
                    </div>
                  )}
                  <div className="infos-groupe">{renderFormItem("email")}</div>
                  <div>{renderFormItem("societe")}</div>
                </div>
              </div>
            </div>
            <div className="carte-footer">
              {renderFormItem("footerCoach")}
              {renderFormItem("codeBarreUser")}
            </div>
          </div>
        </>
      )}

      {/* ============= SOCIETE ============= */}
      {isSociete && (
        <>
          <div className="carte-container">
            <div className="carte-photo-infos">
              {renderFormItem("photo")}
              <div className="carte-infos">
                <div className="carte-infos-item">
                  <div className="infos-groupe">{renderFormItem("nom")}</div>
                </div>
              </div>
            </div>
            <div className="carte-footer">
              {renderFormItem("footerSociete")}
              {renderFormItem("codeBarreSociete")}
            </div>
          </div>
        </>
      )}

      {/* ============= ADMIN ============= */}
      {isAdmin && (
        <>
          <div className="carte-container">
            <div className="carte-photo-infos">
              {renderFormItem("photo")}
              <div className="carte-infos">
                <div className="carte-infos-item">
                  <div className="infos-groupe">
                    {renderFormItem("nom")}
                    {renderFormItem("prenom")}
                  </div>
                  <div className="infos-groupe">{renderFormItem("email")}</div>
                </div>
              </div>
            </div>
            <div className="carte-footer">
              {renderFormItem("footerAdmin")}
              {renderFormItem("codeBarreUser")}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Carte;
