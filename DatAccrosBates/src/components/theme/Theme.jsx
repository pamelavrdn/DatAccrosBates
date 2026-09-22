import React from "react";
import { MdOutlineWbSunny } from "react-icons/md";
import { IoMoonOutline } from "react-icons/io5";
import "./theme.css";

const Theme = () => {
  const setDarkMode = () => {
    document.querySelector("body").setAttribute("data-theme", "dark");
  };

  const setLightMode = () => {
    document.querySelector("body").setAttribute("data-theme", "light");
  };

  const toggleMode = (e) => {
    if (e.target.checked) setDarkMode();
    else setLightMode();
  };

  return (
    <>
      <input
        className="dark-mode-input"
        type="checkbox"
        id="darkmode-toggle"
        onChange={toggleMode}
      />
      <label className="dark-mode-label" htmlFor="darkmode-toggle">
        <div className="svg">
          <MdOutlineWbSunny className="sun" data-testid="theme-sun-icon" />
          <IoMoonOutline className="moon" data-testid="theme-moon-icon" />
        </div>
      </label>
    </>
  );
};

export default Theme;
