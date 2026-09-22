import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GymnasteListe from '../components/listes/GymnasteListe';

describe('Composant GymnasteListe', () => {
  // Test d'affichage correct de la liste des gymnastes
  it('affiche correctement la liste des gymnastes', () => {
    // Données de test
    const gymnastes = [
      { id: 1, nom: 'Doe', prenom: 'John', noFSG: '12345', categorie: '1' },
      { id: 2, nom: 'Smith', prenom: 'Alice', noFSG: '67890', categorie: 'D' },
    ];

    // Rendu du composant avec les données de test
    render(
      <GymnasteListe
        gymnastes={gymnastes}
        searchGymnaste=""
        sortOptionGymnaste="nom"
        onGymnasteClick={() => {}}
        display={true} // true pour afficher la liste
      />
    );

    // Assertions pour vérifier l'affichage correct des gymnastes
    const gymnaste1 = screen.getByText('Doe John');
    const gymnaste2 = screen.getByText('Smith Alice');
    const noFSG1 = screen.getByText('N° fsg : 12345');
    const noFSG2 = screen.getByText('N° fsg : 67890');
    const categorie1 = screen.getByText('C1');
    const categorie2 = screen.getByText('CD');

    expect(gymnaste1).toBeInTheDocument();
    expect(gymnaste2).toBeInTheDocument();
    expect(noFSG1).toBeInTheDocument();
    expect(noFSG2).toBeInTheDocument();
    expect(categorie1).toBeInTheDocument();
    expect(categorie2).toBeInTheDocument();
  });

    // Test de l'affichage de la liste des gymnastes lorsque display est false
    it('ne montre pas la liste des gymnastes lorsque display est false', () => {
        // Données de test
        const gymnastes = [
        { id: 1, nom: 'Doe', prenom: 'John', noFSG: '12345', categorie: '1' },
        { id: 2, nom: 'Smith', prenom: 'Alice', noFSG: '67890', categorie: 'D' },
        ];
    
        // Rendu du composant avec les données de test et display à false
        render(
        <GymnasteListe
            gymnastes={gymnastes}
            searchGymnaste=""
            sortOptionGymnaste="nom"
            onGymnasteClick={() => {}}
            display={false} // false pour ne pas afficher la liste
        />
        );
    
        // Vérification qu'aucun gymnaste n'est affiché
        const gymnaste1 = screen.queryByText('Doe John');
        const gymnaste2 = screen.queryByText('Smith Alice');
        const noFSG1 = screen.queryByText('N° fsg : 12345');
        const noFSG2 = screen.queryByText('N° fsg : 67890');
        const categorie1 = screen.queryByText('C1');
        const categorie2 = screen.queryByText('CD');
    
        expect(gymnaste1).not.toBeInTheDocument();
        expect(gymnaste2).not.toBeInTheDocument();
        expect(noFSG1).not.toBeInTheDocument();
        expect(noFSG2).not.toBeInTheDocument();
        expect(categorie1).not.toBeInTheDocument();
        expect(categorie2).not.toBeInTheDocument();
    });
  

  // Test du filtrage des gymnastes en fonction de la recherche
  it('filtre les gymnastes en fonction de la recherche', () => {
    // Données de test
    const gymnastes = [
      { id: 1, nom: 'Doe', prenom: 'John', noFSG: '12345', categorie: '1' },
      { id: 2, nom: 'Smith', prenom: 'Alice', noFSG: '67890', categorie: 'D' },
    ];

    // Rendu du composant avec les données de test et une recherche spécifique
    render(
      <GymnasteListe
        gymnastes={gymnastes}
        searchGymnaste="John"
        sortOptionGymnaste="nom"
        onGymnasteClick={() => {}}
        display={true}
      />
    );

    // Assertions pour vérifier que seul le gymnaste correspondant à la recherche est affiché
    const gymnaste1 = screen.getByText('Doe John');
    const gymnaste2 = screen.queryByText('Smith Alice'); // Ne devrait pas être visible car ne correspond pas à la recherche

    expect(gymnaste1).toBeInTheDocument();
    expect(gymnaste2).not.toBeInTheDocument();
  });

  // Test du tri des gymnastes en fonction de l'option de tri sélectionnée (nom)
  it('trie les gymnastes en fonction de l\'option de tri sélectionnée', () => {
    // Données de test
    const gymnastes = [
        { id: 1, nom: 'Smith', prenom: 'Alice', noFSG: '67890', categorie: 'D' },
        { id: 2, nom: 'Doe', prenom: 'John', noFSG: '12345', categorie: '1' },
    ];

    // Rendu du composant avec les données de test et une option de tri spécifique
    render(
      <GymnasteListe
        gymnastes={gymnastes}
        searchGymnaste=""
        sortOptionGymnaste="nom"
        onGymnasteClick={() => {}}
        display={true}
      />
    );

    // Assertions pour vérifier que les gymnastes sont triés correctement par nom
    const cartes = screen.getAllByTestId('carte-liste');

    expect(cartes[0]).toHaveTextContent('Doe John');
    expect(cartes[1]).toHaveTextContent('Smith Alice');
  });

    // Test du tri des gymnastes en fonction de l'option de tri sélectionnée (catégorie)
    it('trie les gymnastes en fonction de l\'option de tri sélectionnée', () => {
        // Données de test
        const gymnastes = [
            { id: 1, nom: 'Doe', prenom: 'John', noFSG: '12345', categorie: '1' },
            { id: 2, nom: 'Smith', prenom: 'Alice', noFSG: '67890', categorie: 'D' },
            { id: 2, nom: 'Martin', prenom: 'Camille', noFSG: '67890', categorie: '3' },
        ];

        // Rendu du composant avec les données de test et une option de tri spécifique
        render(
        <GymnasteListe
            gymnastes={gymnastes}
            searchGymnaste=""
            sortOptionGymnaste="nom"
            onGymnasteClick={() => {}}
            display={true}
        />
        );

        // Assertions pour vérifier que les gymnastes sont triés correctement par nom
        const cartes = screen.getAllByTestId('carte-liste');

        expect(cartes[0]).toHaveTextContent('Doe John');
        expect(cartes[1]).toHaveTextContent('Martin Camille');
        expect(cartes[2]).toHaveTextContent('Smith Alice');
    });

  // Test de la sélection d'un gymnaste
  it('déclenche la fonction onGymnasteClick avec les bonnes informations lorsqu\'un gymnaste est sélectionné', () => {
    // Fonction de test simulée
    const mockOnGymnasteClick = jest.fn();

    // Données de test
    const gymnastes = [
      { id: 1, nom: 'Doe', prenom: 'John', noFSG: '12345', categorie: '1' },
      { id: 2, nom: 'Smith', prenom: 'Alice', noFSG: '67890', categorie: 'D' },
    ];

    // Rendu du composant avec les données de test et la fonction de test simulée
    render(
      <GymnasteListe
        gymnastes={gymnastes}
        searchGymnaste=""
        sortOptionGymnaste="nom"
        onGymnasteClick={mockOnGymnasteClick}
        display={true}
      />
    );

    // Sélection de la première carte et simulation du clic
    const cartes = screen.getAllByTestId('carte-liste');
    fireEvent.click(cartes[0]);

    // Vérification que la fonction de test simulée a été appelée avec les bonnes informations
    expect(mockOnGymnasteClick).toHaveBeenCalledWith(gymnastes[0]);
    expect(mockOnGymnasteClick).toHaveBeenCalledTimes(1);
  });

  // Test de l'ajout de la classe "cliquee" à la carte lorsqu'elle est cliquée
  it('ajoute la classe "cliquee" à la carte lorsqu\'elle est cliquée', () => {
    // Données de test
    const gymnastes = [
      { id: 1, nom: 'Doe', prenom: 'John', noFSG: '12345', categorie: '1' },
      { id: 2, nom: 'Smith', prenom: 'Alice', noFSG: '67890', categorie: 'D' },
    ];

    // Rendu du composant avec les données de test
    render(
      <GymnasteListe
        gymnastes={gymnastes}
        searchGymnaste=""
        sortOptionGymnaste="nom"
        onGymnasteClick={() => {}}
        display={true}
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
