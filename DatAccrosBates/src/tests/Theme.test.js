import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import Theme from "../components/theme/Theme";

describe('Composant Theme', () => {
  // Test pour vérifier l'affichage initial du composant
  it('affiche le composant avec les icônes du thème', () => {
    // Rendu du composant
    render(<Theme />);

    // Assertions pour vérifier la présence des icônes du thème
    expect(screen.getByTestId('theme-sun-icon')).toBeInTheDocument();
    expect(screen.getByTestId('theme-moon-icon')).toBeInTheDocument();
  });

  // Test pour vérifier le basculement vers le mode sombre
  it('bascule vers le mode sombre lorsqu\'on active le bouton', () => {
    // Rendu du composant
    render(<Theme />);

    // Simulation du clic sur le bouton de basculement
    fireEvent.click(screen.getByRole('checkbox'));

    // Assertions pour vérifier que le thème sombre est appliqué
    expect(document.body.getAttribute('data-theme')).toBe('dark');
  });

  // Test pour vérifier le basculement vers le mode clair
  it('bascule vers le mode clair lorsqu\'on désactive le bouton', () => {
    // Rendu du composant
    render(<Theme />);

    // Simulation du clic sur le bouton de basculement pour activer le mode sombre
    fireEvent.click(screen.getByRole('checkbox'));

    // Simulation du clic sur le bouton de basculement pour revenir au mode clair
    fireEvent.click(screen.getByRole('checkbox'));

    // Assertions pour vérifier que le thème clair est appliqué
    expect(document.body.getAttribute('data-theme')).toBe('light');
  });
});
