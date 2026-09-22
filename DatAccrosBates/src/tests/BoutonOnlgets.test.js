import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom'; // Importer MemoryRouter
import BoutonOnglets from '../components/boutons/BoutonOnglets';

describe('Composant BoutonOnglets', () => {
  // Test pour vérifier si le composant s'affiche correctement avec les onglets donnés
  it('s\'affiche correctement avec les onglets donnés', () => {
    const onglets = [
      { label: 'Créer', lien: '/creer' },
      { label: 'Modifier', lien: '/modifier' },
    ];

    // Affiche le composant avec les onglets dans un BrowserRouter
    render(
      <Router>
        <BoutonOnglets onglets={onglets} />
      </Router>
    );

    // Vérifie si les boutons pour les onglets sont présents
    const boutonCreer = screen.getByText('Créer');
    const boutonModifier = screen.getByText('Modifier');

    expect(boutonCreer).toBeInTheDocument();
    expect(boutonModifier).toBeInTheDocument();
  });

  // Test pour vérifier si le bouton correspondant à l'emplacement actuel est activé
  it('active le bouton correspondant à l\'emplacement actuel', () => {
    const onglets = [
      { label: 'Créer', lien: '/creer' },
      { label: 'Modifier', lien: '/modifier' },
    ];

    // Affiche le composant avec les onglets dans un MemoryRouter avec l'emplacement initial '/modifier'
    render(
      <MemoryRouter initialEntries={['/modifier']}>
        <BoutonOnglets onglets={onglets} />
      </MemoryRouter>
    );

    // Vérifie si le bouton pour l'onglet 'Modifier' est activé
    const boutonModifier = screen.getByText('Modifier');
    expect(boutonModifier).toHaveClass('active');
  });

  // Test pour vérifier si le clic sur un bouton de l'onglet navigue vers la route correcte
  it('navigue vers la route correcte lors du clic sur le bouton', () => {
    const onglets = [
      { label: 'Créer', lien: '/creer' },
      { label: 'Modifier', lien: '/modifier' },
    ];

    // Affiche le composant avec les onglets dans un BrowserRouter
    render(
      <Router>
        <BoutonOnglets onglets={onglets} />
      </Router>
    );

    // Obtient le bouton pour l'onglet 'Créer'
    const boutonCreer = screen.getByText('Créer');

    // Simule un clic sur le bouton 'Créer'
    fireEvent.click(boutonCreer);

    // Vérifie si la fenêtre est dirigée vers la route '/creer'
    expect(window.location.pathname).toEqual('/creer');
  });
});
