import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';

// Mock de Firebase
jest.mock('../data/firebaseConfig', () => ({
    __esModule: true,
    auth: jest.fn(() => ({
      currentUser: {
        email: "admin@admin.ch",
        role: "admin",
        nom: "admin",
        prenom: "admin",
        nomUtilisateur: "admin_admin",
      }
    })),
}));
  
// Mock du hook useAuth
jest.mock('../hooks/authContext', () => ({
    __esModule: true,
    useAuth: jest.fn(() => ({
      user: {
        email: "admin@admin.ch",
        role: "admin",
        nom: "admin",
        prenom: "admin",
        nomUtilisateur: "admin_admin",
      }
    })),
}));


describe('Sidebar component', () => {
  it('renders without crashing', () => {
    const { container  } = render(
      <Router>
        <Sidebar /> 
      </Router>
    );
    expect(container).toBeTruthy();
  });

  /*
  test('displays logo', () => {
    const { getByAltText } = render(
      <Router>
        <Sidebar /> 
      </Router>
    );
    expect(getByAltText('logo')).toBeInTheDocument();
  });

  test('displays sidebar items with correct links', () => {
    const { getByText } = render(
      <Router>
        <Sidebar /> 
      </Router>
    );
    expect(getByText('Accueil').closest('a')).toHaveAttribute('href', '/accueil');
    // Ajoute d'autres attentes similaires pour les autres éléments de la barre latérale
  });

  test('navigates to correct page on sidebar item click', () => {
    const { getByText } = render(
      <Router>
        <Sidebar /> 
      </Router>
    );
    const accueilLink = getByText('Accueil').closest('a');

    fireEvent.click(accueilLink);
    expect(window.location.pathname).toBe('/accueil');

  });*/
});
