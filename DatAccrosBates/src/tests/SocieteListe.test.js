import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SocieteListe from '../components/listes/SocieteListe';

describe('Composant SocieteListe', () => {
  // Test d'affichage correct de la liste des sociétés
  it('affiche correctement la liste des sociétés', () => {
    // Données de test
    const societes = [
      { id: 1, nom: 'Societe A', email: 'societea@example.com' },
      { id: 2, nom: 'Societe B', email: 'societeb@example.com' },
    ];

    // Rendu du composant avec les données de test
    render(
      <SocieteListe
        societes={societes}
        searchSociete=""
        sortOptionSociete="nom"
        onSocieteClick={() => {}}
      />
    );

    // Assertions pour vérifier l'affichage correct des sociétés
    const societeANom = screen.getByText('Societe A');
    const societeBNom = screen.getByText('Societe B');
    const societeAEmail = screen.getByText('E-mail : societea@example.com');
    const societeBEmail = screen.getByText('E-mail : societeb@example.com');

    expect(societeANom).toBeInTheDocument();
    expect(societeBNom).toBeInTheDocument();
    expect(societeAEmail).toBeInTheDocument();
    expect(societeBEmail).toBeInTheDocument();
  });

  // Test du filtre des sociétés en fonction de la recherche
  it('filtre les sociétés en fonction de la recherche', () => {
    // Données de test
    const societes = [
      { id: 1, nom: 'Societe A', email: 'societea@example.com' },
      { id: 2, nom: 'Societe B', email: 'societeb@example.com' },
    ];

    // Rendu du composant avec les données de test et une recherche spécifique
    render(
      <SocieteListe
        societes={societes}
        searchSociete="Societea"
        sortOptionSociete="nom"
        onSocieteClick={() => {}}
      />
    );

    // Vérification que la société A est affichée et la société B ne l'est pas
    const societeANom = screen.getByText('Societe A');
    const societeBNom = screen.queryByText('Societe B'); // 'Societe B' ne doit pas être visible car il ne correspond pas à la recherche

    expect(societeANom).toBeInTheDocument();
    expect(societeBNom).not.toBeInTheDocument()
  });

  // Test du tri des sociétés en fonction de l'option de tri sélectionnée
  it('trie les sociétés en fonction de l\'option de tri sélectionnée', () => {
    // Données de test
    const societes = [
      { id: 1, nom: 'Societe C', email: 'societec@example.com' },
      { id: 2, nom: 'Societe A', email: 'societeb@example.com' },
      { id: 3, nom: 'Societe B', email: 'societea@example.com' },
    ];

    // Rendu du composant avec les données de test et une option de tri spécifique
    render(
      <SocieteListe
        societes={societes}
        searchSociete=""
        sortOptionSociete="nom"
        onSocieteClick={() => {}}
      />
    );

    // Sélection des cartes dans l'ordre
    const cartes = screen.getAllByTestId('carte-liste');

    // Assertions pour vérifier que les sociétés sont triées correctement
    expect(cartes[0]).toHaveTextContent('Societe A');
    expect(cartes[1]).toHaveTextContent('Societe B');
    expect(cartes[2]).toHaveTextContent('Societe C');
  });

  // Test de la sélection d'une société
  it('déclenche la fonction onSocieteClick avec les bonnes informations lorsqu\'une société est sélectionnée', () => {
    // Fonction de test simulée
    const mockOnSocieteClick = jest.fn();

    // Données de test
    const societes = [
      { id: 1, nom: 'Societe A', email: 'societea@example.com' },
      { id: 2, nom: 'Societe B', email: 'societeb@example.com' },
    ];

    // Rendu du composant avec les données de test et la fonction de test simulée
    render(
      <SocieteListe
        societes={societes}
        searchSociete=""
        sortOptionSociete="nom"
        onSocieteClick={mockOnSocieteClick}
      />
    );

    // Sélection de la première carte et simulation du clic
    const cartes = screen.getAllByTestId('carte-liste');
    fireEvent.click(cartes[0]);

    // Vérification que la fonction de test simulée a été appelée avec les bonnes informations
    expect(mockOnSocieteClick).toHaveBeenCalledWith(societes[0]);
    expect(mockOnSocieteClick).toHaveBeenCalledTimes(1);
  });

  // Test de l'état de la carte cliquée
  it('ajoute la classe "cliquee" à la carte lorsqu\'elle est cliquée', () => {
    // Données de test
    const societes = [
      { id: 1, nom: 'Societe A', email: 'societea@example.com' },
      { id: 2, nom: 'Societe B', email: 'societeb@example.com' },
    ];

    // Rendu du composant avec les données de test
    render(
      <SocieteListe
        societes={societes}
        searchSociete=""
        sortOptionSociete="nom"
        onSocieteClick={() => {}}
      />
    );

    // Sélection de la première carte et simulation du clic
    const cartes = screen.getAllByTestId('carte-liste');
    fireEvent.click(cartes[0]);

    // Vérification que la classe "cliquee" est ajoutée à la carte cliquée et pas à l'autre
    expect(cartes[0]).toHaveClass('cliquee');
    expect(cartes[1]).not.toHaveClass('cliquee');
  });
});