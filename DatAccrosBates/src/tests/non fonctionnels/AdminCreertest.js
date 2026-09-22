import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import AdminCreer from '../../pages/AdminCreer';

// Mock de la fonction useAddAdmin
jest.mock('../data/Data', () => ({
  useAddAdmin: jest.fn(),
}));

describe('Page AdminCreer', () => {
  // Test pour vérifier si la page AdminCreer s'affiche correctement
  it('s\'affiche correctement', () => {
    // Affiche la page AdminCreer
    render(
      <Router>
        <AdminCreer />
      </Router>
    );

    // Vérifie si les éléments attendus sont présents sur la page
    const formulaireAdmin = screen.getByTestId('formulaire-admin');
    const Carte = screen.getByTestId('carte-creation');

    expect(formulaireAdmin).toBeInTheDocument();
    expect(Carte).toBeInTheDocument();
  });

  // Test pour vérifier si le succès s'affiche après la création d'un admin
  it('affiche le succès après la création d\'un admin', () => {
    // Affiche la page AdminCreer
    render(
      <Router>
        <AdminCreer />
      </Router>
    );

    // Obtient le bouton de soumission du formulaire
    const boutonSoumettre = screen.getByText('Soumettre');

    // Simule un clic sur le bouton de soumission
    fireEvent.click(boutonSoumettre);

    // Vérifie si le message de succès est affiché
    const messageSucces = screen.getByText('Admin créé.e avec succès');
    expect(messageSucces).toBeInTheDocument();
  });

  // Ajoutez d'autres tests ici selon vos besoins
});
