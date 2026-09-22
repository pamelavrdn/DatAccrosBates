import "./checkBox.css";
import React from "react";

const CheckBox = ({
  categoriesChoisies,
  setCategoriesChoisies,
  categorieList,
}) => {
  const togglelabelCheck = (e, categorie) => {
    // Met à jour la liste des catégories sélectionnées
    if (e.target.checked) {
      setCategoriesChoisies([...categoriesChoisies, categorie]);
    } else {
      setCategoriesChoisies(
        categoriesChoisies.filter((cat) => cat !== categorie)
      );
    }
  };

  return (
    <>
      {categorieList.map((categorie, index) => (
        <div
          className="checkbox-item"
          key={index}
          onClick={(e) => togglelabelCheck(e, categorie)}
        >
          <div className="checkbox-wrapper-12">
            <div className="cbx">
              <input
                checked={
                  categoriesChoisies
                    ? categoriesChoisies.includes(categorie)
                    : false
                }
                type="checkbox"
                id={index}
                onChange={() => {}} // Utilise onChange vide pour éviter les avertissements de console
              />
              <label></label>
              <svg fill="none" viewBox="0 0 15 14" height="14" width="15">
                <path d="M2 8.36364L6.23077 12L13 2"></path>
              </svg>
            </div>

            <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="goo-12">
                  <feGaussianBlur
                    result="blur"
                    stdDeviation="4"
                    in="SourceGraphic"
                  ></feGaussianBlur>
                  <feColorMatrix
                    result="goo-12"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7"
                    mode="matrix"
                    in="blur"
                  ></feColorMatrix>
                  <feBlend in2="goo-12" in="SourceGraphic"></feBlend>
                </filter>
              </defs>
            </svg>
          </div>
          <label htmlFor="Categorie">Catégorie {categorie}</label>
        </div>
      ))}
    </>
  );
};

export default CheckBox;
