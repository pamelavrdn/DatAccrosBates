import React from "react";
import "./switch.css";

const Switch = ({ texte1, texte2, isChecked, setIsChecked }) => {
  return (
    <>
      <div className="mydict">
        <div>
          <label>
            <input
              type="radio"
              name="radio"
              onChange={() => setIsChecked(false)}
              checked={!isChecked}
            />
            <span>{texte1}</span>
          </label>

          <label>
            <input
              type="radio"
              name="radio"
              onChange={() => setIsChecked(true)}
              checked={isChecked}
            />
            <span>{texte2}</span>
          </label>
        </div>
      </div>
    </>
  );
};

export default Switch;
