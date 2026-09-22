import React, { useEffect, useRef } from "react";
import "./mentionsLegales.css";

import { useState } from "react";
import { IoArrowBackCircleSharp } from "react-icons/io5";

import ReactMarkdown from "react-markdown";

const MentionsLegales = ({ showMentionsLegales, setShowMentionsLegales }) => {
  const [closing, setClosing] = useState(!showMentionsLegales);
  const [markdownContent, setMarkdownContent] = useState("");
  const [headings, setHeadings] = useState([]);
  const headingsContainerRef = useRef(null);

  const handleCancel = () => {
    setClosing(true);
    setTimeout(() => {
      setShowMentionsLegales(false);
    }, 400);
  };

  const scrollHeadingIntoView = (headingText) => {
    const headings = headingsContainerRef.current.querySelectorAll("h2"); // Sélectionner tous les titres h2
    headings.forEach((heading) => {
      if (heading.textContent === headingText) {
        heading.scrollIntoView({ behavior: "smooth" });
      }
    });
  };

  useEffect(() => {
    // Utilisez une méthode de lecture de fichiers pour lire le contenu de mention.md
    fetch("./src/components/mentionsLegales/mentionsLegales.md")
      .then((response) => response.text())
      .then((data) => {
        setMarkdownContent(data);
        // Analyser le contenu Markdown pour extraire les titres de niveau 2
        const regex = /^##\s+(.*)/gm;
        const matches = data.matchAll(regex);
        const headingsArray = Array.from(matches, (match) => match[1]);
        setHeadings(headingsArray);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération du contenu du fichier markdown:",
          error
        );
      });
  }, []);

  return (
    <>
      <div className={`mentionsLegales ${closing ? "slide-down" : ""}`}>
        <div className="btn-retour">
          <IoArrowBackCircleSharp onClick={handleCancel} />
        </div>

        <div className="sommaire">
          <h2>Sommaire</h2>
          <ul>
            {headings.map((heading, index) => (
              <li key={index} onClick={() => scrollHeadingIntoView(heading)}>
                {heading}
              </li>
            ))}
          </ul>
        </div>

        <div className="titre">
          <h1>Mentions Légales</h1>
        </div>

        <div className="text" ref={headingsContainerRef}>
          <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </div>
      </div>
    </>
  );
};

export default MentionsLegales;
