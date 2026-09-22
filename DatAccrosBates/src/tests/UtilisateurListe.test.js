import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UtilisateurListe from '../components/listes/UtilisateurListe';

describe('Composant UtilisateurListe', () => {
  // Test d'affichage correct de la liste des utilisateurs
  it('affiche correctement la liste des utilisateurs', () => {
    // Données de test
    const utilisateurs = [
      { id: 1, nom: 'Doe', prenom: 'John', email: 'john.doe@example.com' },
      { id: 2, nom: 'Smith', prenom: 'Jane', email: 'jane.smith@example.com' },
    ];

    // Rendu du composant avec les données de test
    render(
      <UtilisateurListe
        utilisateurs={utilisateurs}
        searchUtilisateur=""
        sortOptionUtilisateur="nom"
        onUtilisateurClick={() => {}}
      />
    );

    // Assertions pour vérifier l'affichage correct des utilisateurs
    const utilisateur1 = screen.getByText('Doe John');
    const utilisateur2 = screen.getByText('Smith Jane');
    const email1 = screen.getByText('Email : john.doe@example.com');
    const email2 = screen.getByText('Email : jane.smith@example.com');

    expect(utilisateur1).toBeInTheDocument();
    expect(utilisateur2).toBeInTheDocument();
    expect(email1).toBeInTheDocument();
    expect(email2).toBeInTheDocument();
  });

  // Test du filtre des utilisateurs en fonction de la recherche
  it('filtre les utilisateurs en fonction de la recherche', () => {
    // Données de test
    const utilisateurs = [
      { id: 1, nom: 'Doe', prenom: 'John', email: 'john.doe@example.com' },
      { id: 2, nom: 'Smith', prenom: 'Jane', email: 'jane.smith@example.com' },
    ];

    // Rendu du composant avec les données de test et une recherche spécifique
    render(
      <UtilisateurListe
        utilisateurs={utilisateurs}
        searchUtilisateur="john"
        sortOptionUtilisateur="nom"
        onUtilisateurClick={() => {}}
      />
    );

    // Vérification que seul l'utilisateur correspondant à la recherche est affiché
    const utilisateur1 = screen.getByText('Doe John');
    const utilisateur2 = screen.queryByText('Smith Jane'); // 'Smith Jane' ne doit pas être visible car il ne correspond pas à la recherche

    expect(utilisateur1).toBeInTheDocument();
    expect(utilisateur2).not.toBeInTheDocument();
  });

  // Test du tri des utilisateurs en fonction de l'option de tri sélectionnée (nom)
  it('trie les utilisateurs en fonction de l\'option de tri sélectionnée', () => {
    // Données de test
    const utilisateurs = [
        { id: 1, nom: 'Smith', prenom: 'Jane', email: 'jane.smith@example.com' },
        { id: 2, nom: 'Doe', prenom: 'John', email: 'john.doe@example.com' },
    ];

    // Rendu du composant avec les données de test et une option de tri spécifique
    render(
      <UtilisateurListe
        utilisateurs={utilisateurs}
        searchUtilisateur=""
        sortOptionUtilisateur="nom"
        onUtilisateurClick={() => {}}
      />
    );

    // Sélection des cartes dans l'ordre
    const cartes = screen.getAllByTestId('carte-liste');

    // Assertions pour vérifier que les utilisateurs sont triés correctement
    expect(cartes[0]).toHaveTextContent('Doe John');
    expect(cartes[1]).toHaveTextContent('Smith Jane');
  });

    // Test du tri des utilisateurs en fonction de l'option de tri sélectionnée (email)
    it('trie les utilisateurs en fonction de l\'option de tri sélectionnée', () => {
        // Données de test
        const utilisateurs = [
            { id: 1, nom: 'Smith', prenom: 'Jane', email: 'jane.smith@example.com' },
            { id: 2, nom: 'Doe', prenom: 'John', email: 'john.doe@example.com' },
        ];

        // Rendu du composant avec les données de test et une option de tri spécifique
        render(
        <UtilisateurListe
            utilisateurs={utilisateurs}
            searchUtilisateur=""
            sortOptionUtilisateur="email"
            onUtilisateurClick={() => {}}
        />
        );

        // Sélection des cartes dans l'ordre
        const cartes = screen.getAllByTestId('carte-liste');

        // Assertions pour vérifier que les utilisateurs sont triés correctement
        expect(cartes[0]).toHaveTextContent('jane.smith@example.com');
        expect(cartes[1]).toHaveTextContent('john.doe@example.com');
    });


  // Test de la sélection d'un utilisateur
  it('déclenche la fonction onUtilisateurClick avec les bonnes informations lorsqu\'un utilisateur est sélectionné', () => {
    // Fonction de test simulée
    const mockOnUtilisateurClick = jest.fn();

    // Données de test
    const utilisateurs = [
      { id: 1, nom: 'Doe', prenom: 'John', email: 'john.doe@example.com' },
      { id: 2, nom: 'Smith', prenom: 'Jane', email: 'jane.smith@example.com' },
    ];

    // Rendu du composant avec les données de test et la fonction de test simulée
    render(
      <UtilisateurListe
        utilisateurs={utilisateurs}
        searchUtilisateur=""
        sortOptionUtilisateur="nom"
        onUtilisateurClick={mockOnUtilisateurClick}
      />
    );

    // Sélection de la première carte et simulation du clic
    const cartes = screen.getAllByTestId('carte-liste');
    fireEvent.click(cartes[0]);

    // Vérification que la fonction de test simulée a été appelée avec les bonnes informations
    expect(mockOnUtilisateurClick).toHaveBeenCalledWith(utilisateurs[0]);
    expect(mockOnUtilisateurClick).toHaveBeenCalledTimes(1);
  });

  // Test de l'état de la carte cliquée
  it('ajoute la classe "cliquee" à la carte lorsqu\'elle est cliquée', () => {
    // Données de test
    const utilisateurs = [
      { id: 1, nom: 'Doe', prenom: 'John', email: 'john.doe@example.com' },
      { id: 2, nom: 'Smith', prenom: 'Jane', email: 'jane.smith@example.com' },
    ];

    // Rendu du composant avec les données de test
    render(
      <UtilisateurListe
        utilisateurs={utilisateurs}
        searchUtilisateur=""
        sortOptionUtilisateur="nom"
        onUtilisateurClick={() => {}}
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
