import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConcoursListe from '../components/listes/ConcoursListe';
import { Timestamp } from 'firebase/firestore';


// Créer des objets Firestore Timestamp pour simuler des dates
const timestampA = Timestamp.fromDate(new Date('2024-05-01'));
const timestampB = Timestamp.fromDate(new Date('2024-05-15'));

describe('Composant ConcoursListe', () => {
  // Test d'affichage correct de la liste des concours
  it('affiche correctement la liste des concours', () => {
    // Données de test
    const concours = [
        { id: 1, nom: 'Concours A', lieu: 'Lieu A', date: timestampA },
        { id: 2, nom: 'Concours B', lieu: 'Lieu B', date: timestampB },
    ];

    // Rendu du composant avec les données de test
    render(
      <ConcoursListe
        concours={concours}
        onConcoursClick={() => {}}
        tri="asc"
      />
    );

    // Assertions pour vérifier l'affichage correct des concours
    const concoursA = screen.getByText('Concours A');
    const concoursB = screen.getByText('Concours B');
    const lieuA = screen.getByText('Lieu A');
    const lieuB = screen.getByText('Lieu B');
    const dateA = screen.getByText('1/5/2024');
    const dateB = screen.getByText('15/5/2024');

    expect(concoursA).toBeInTheDocument();
    expect(concoursB).toBeInTheDocument();
    expect(lieuA).toBeInTheDocument();
    expect(lieuB).toBeInTheDocument();
    expect(dateA).toBeInTheDocument();
    expect(dateB).toBeInTheDocument();
  });

  // Test du tri des concours par date ascendante
  it('trie les concours en fonction de l\'option de tri sélectionnée', () => {
    // Données de test
    const concours = [
        { id: 1, nom: 'Concours A', lieu: 'Lieu A', date: timestampA },
        { id: 2, nom: 'Concours B', lieu: 'Lieu B', date: timestampB },
    ];

    // Rendu du composant avec les données de test et une option de tri spécifique
    render(
      <ConcoursListe
        concours={concours}
        onConcoursClick={() => {}}
        tri="asc"
      />
    );

    // Sélection des cartes dans l'ordre
    const cartes = screen.getAllByTestId('carte-liste');

    // Assertions pour vérifier que les concours sont triés correctement par date
    expect(cartes[0]).toHaveTextContent('Concours A');
    expect(cartes[1]).toHaveTextContent('Concours B');
  });

  // Test du tri des concours par date descendante
  it('trie les concours en fonction de l\'option de tri sélectionnée', () => {
    // Données de test
    const concours = [
        { id: 1, nom: 'Concours A', lieu: 'Lieu A', date: timestampA },
        { id: 2, nom: 'Concours B', lieu: 'Lieu B', date: timestampB },
    ];

    // Rendu du composant avec les données de test et une option de tri spécifique
    render(
      <ConcoursListe
        concours={concours}
        onConcoursClick={() => {}}
        tri="desc"
      />
    );

    // Sélection des cartes dans l'ordre
    const cartes = screen.getAllByTestId('carte-liste');

    // Assertions pour vérifier que les concours sont triés correctement par date
    expect(cartes[0]).toHaveTextContent('Concours B');
    expect(cartes[1]).toHaveTextContent('Concours A');
  });

  // Test de la sélection d'un concours
  it('déclenche la fonction onConcoursClick avec les bonnes informations lorsqu\'un concours est sélectionné', () => {
    // Fonction de test simulée
    const mockOnConcoursClick = jest.fn();

    // Données de test
    const concours = [
        { id: 1, nom: 'Concours A', lieu: 'Lieu A', date: timestampA },
        { id: 2, nom: 'Concours B', lieu: 'Lieu B', date: timestampB },
    ];

    // Rendu du composant avec les données de test et la fonction de test simulée
    render(
      <ConcoursListe
        concours={concours}
        onConcoursClick={mockOnConcoursClick}
        tri="asc"
      />
    );

    // Sélection de la première carte et simulation du clic
    const cartes = screen.getAllByTestId('carte-liste');
    fireEvent.click(cartes[0]);

    // Vérification que la fonction de test simulée a été appelée avec les bonnes informations
    expect(mockOnConcoursClick).toHaveBeenCalledWith(concours[0]);
    expect(mockOnConcoursClick).toHaveBeenCalledTimes(1);
  });

  // Test de l'état de la carte cliquée
  it('ajoute la classe "cliquee" à la carte lorsqu\'elle est cliquée', () => {
    // Données de test
    const concours = [
        { id: 1, nom: 'Concours A', lieu: 'Lieu A', date: timestampA },
        { id: 2, nom: 'Concours B', lieu: 'Lieu B', date: timestampB },
    ];

    // Rendu du composant avec les données de test
    render(
      <ConcoursListe
        concours={concours}
        onConcoursClick={() => {}}
        tri="asc"
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
