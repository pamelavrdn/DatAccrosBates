import "./importerExporterCsv.css";
import ProgressBar from "../components/progressBar/ProgressBar";

import { exportCSV, importCSV } from "../data/Data";
import { FaCloudArrowUp, FaCloudArrowDown, FaFileCsv } from "react-icons/fa6";
import React, { useEffect, useState, useRef } from "react";
import ConcoursListe from "../components/listes/ConcoursListe";
import { useConcoursData } from "../data/Data";
import BoutonGlobal from "../components/boutons/BoutonGlobal";
import { useQueryClient } from "@tanstack/react-query";
import Success from "../components/success/Success";

const ImporterExporterCsv = () => {
  //const concoursData = ServicesData.getConcours();
  const { data: concoursData } = useConcoursData();
  const queryClient = useQueryClient();

  const [importFile, setImportFile] = useState(null);
  const [exportFileName, setExportFileName] = useState("");
  const [selectedConcours, setSelectedConcours] = useState(null);

  const [importVisible, setImportVisible] = useState(false);
  const [exportVisible, setExportVisible] = useState(false);
  const [importClicked, setImportClicked] = useState(false);
  const [exportClicked, setExportClicked] = useState(false);

  const [progress, setProgress] = useState(0);

  const [showSuccess, setShowSuccess] = useState(false);

  const inputRef = useRef(null); // Référence à l'élément d'entrée de fichier

  const handleSelectFileClick = () => {
    // Accéder à l'élément d'entrée de fichier associé à la référence et déclencher son événement de clic
    inputRef.current.click();
  };

  // Fonction pour gérer la sélection d'un concours
  const handleConcoursClick = (selectedConcours) => {
    setSelectedConcours(selectedConcours);
    setExportFileName(
      selectedConcours.nom.toLowerCase().replace(/\s+/g, "_") + ".csv"
    );
  };

  const handleImportClick = () => {
    setImportClicked(true);
    setExportClicked(false);
    setExportVisible(false);
    setImportVisible(true);
  };

  const handleExportClick = () => {
    setExportClicked(true);
    setImportClicked(false);
    setExportVisible(true);
    setImportVisible(false);
  };

  const handleDeleteClick = () => {
    setProgress(0);
    setImportFile(null);
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files[0]);
  };

  const handleFileSelect = (event) => {
    event.preventDefault();
    handleFile(event.target.files[0]);
  };

  const handleFile = (file) => {
    if (file.type === "text/csv") {
      setImportFile(file);
      console.log("Fichier CSV valide :", file);

      // Simuler une progression de téléchargement
      let progress = 0;
      const interval = setInterval(() => {
        progress += 25;
        setProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 500);
    } else {
      alert("Veuillez déposer uniquement des fichiers CSV.");
    }
  };

  const handleImportFile = () => {
    // Importer le fichier CSV
    if (!selectedConcours || !importFile) {
      alert("Veuillez sélectionner un concours et déposer un fichier CSV.");
      return;
    }
    console.log("Fichier importé :", importFile.name);
    importCSV(selectedConcours, importFile, queryClient);
    handleDeleteClick();
    setShowSuccess(true);
  };

  const handleExportFile = () => {
    // Exporter le fichier CSV
    if (!selectedConcours) {
      alert("Veuillez sélectionner un concours.");
      return;
    }
    console.log("Fichier exporté :", exportFileName);
    exportCSV(selectedConcours, exportFileName);
  };

  useEffect(() => {
    document.title = "Import Export CSV";
  }, []);

  return (
    <>
      {showSuccess && (
        <Success
          message={"Fichier importé avec succès"}
          onClose={() => setShowSuccess(false)}
        />
      )}
      <div className="detail">
        <h2>1. Choisir un concours</h2>
        <h2>
          2.{" "}
          <span
            className={importClicked ? "clicked" : ""}
            onClick={handleImportClick}
          >
            Importer
          </span>{" "}
          ou{" "}
          <span
            className={exportClicked ? "clicked" : ""}
            onClick={handleExportClick}
          >
            Exporter
          </span>
        </h2>
      </div>
      <div className="box ie-box-concours">
        {concoursData && (
          <ConcoursListe
            concours={concoursData}
            onConcoursClick={handleConcoursClick}
            tri={"asc"}
          />
        )}
      </div>
      {importVisible && (
        <div
          className="box ie-box-import"
          id="import-form"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          // Limite les types de fichiers acceptés à CSV uniquement
          accept=".csv"
        >
          <div className="file-upload-label">
            <div className="ie-box-file-upload">
              <FaFileCsv />
              <div className="file-upload-content">
                {importFile && <p className="p-ie">{importFile.name}</p>}
                <ProgressBar progress={progress} />
              </div>
              <button
                className="bouton-close"
                onClick={() => handleDeleteClick()}
              >
                <span className="X"></span>
                <span className="Y"></span>
              </button>
            </div>
            <div className="ie-bouton-confirmer confirmer-importer">
              <BoutonGlobal
                texte="Importer"
                onClick={handleImportFile}
              ></BoutonGlobal>
            </div>
          </div>
          <div className="file-upload-design">
            <FaCloudArrowUp />
            <p className="p-ie">Drag and Drop</p>
            <p className="p-ie">ou</p>
            <div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                ref={inputRef}
                style={{ display: "none" }}
              />
              <BoutonGlobal
                texte="Sélectionner un fichier"
                onClick={handleSelectFileClick}
              />
            </div>
          </div>
        </div>
      )}

      {exportVisible && (
        <div className="box ie-box-export" id="export-form">
          <div className="file-upload-label">
            <div className="file-upload-design">
              <FaCloudArrowDown />
              {exportFileName && (
                <>
                  <div className="file-and-title">
                    <FaFileCsv style={{ fontSize: "30px" }} />
                    <h1>{exportFileName}</h1>
                  </div>
                  <p className="file-status">Prêt à être téléchargé</p>
                </>
              )}
              <div className="ie-bouton-confirmer confirmer-exporter">
                <BoutonGlobal texte="Exporter" onClick={handleExportFile} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImporterExporterCsv;
