import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SidebarMenu = ({
  title,
  icon,
  link,
  children,
  activeParent,
  handleParentItemClick,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (child) => {
    if (handleParentItemClick) {
      handleParentItemClick();
    }
    navigate(child ? child.link : link);
  };

  return (
    <>
      <li
        className={`${activeParent === title ? "clique" : ""}`}
        onClick={() => (children ? null : handleItemClick())}
      >
        <div className="iconeEtTitre">
          <div id="icon">{icon}</div>
          <div id="title">{title}</div>
        </div>
        {children && (
          <div className="sousmenu">
            <ul>
              {children.map((child, childIndex) => (
                <li
                  key={childIndex}
                  className={`${
                    location.pathname === child.link ? "child-clique" : ""
                  }`}
                  onClick={() => handleItemClick(child)}
                >
                  <div id="title">{child.title}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>
    </>
  );
};

export default SidebarMenu;
