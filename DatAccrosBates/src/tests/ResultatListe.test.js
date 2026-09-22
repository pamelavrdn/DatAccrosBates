import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResultatsListe from '../components/listes/ResultatsListe';

describe('Composant ResultatsListe', () => {
  // Test d'affichage correct des résultats pour chaque engin
  it('affiche correctement la liste des résultats pour chaque engin', () => {
    // Données de test
    const resultats = {
      bf: 14.5,
      bp: 13.8,
      sol: 12.3,
    };

    // Rendu du composant avec les données de test
    render(
      <ResultatsListe
        resultats={resultats}
        classement={1}
        recompense="Or"
        equipe={null}
      />
    );

    // Assertions pour vérifier l'affichage correct des résultats pour chaque engin
    expect(screen.getByText('Barre fixe')).toBeInTheDocument();
    expect(screen.getByText('Barres parallèles')).toBeInTheDocument();
    expect(screen.getByText('Sol')).toBeInTheDocument();

    expect(screen.getByText('14.50')).toBeInTheDocument();
    expect(screen.getByText('13.80')).toBeInTheDocument();
    expect(screen.getByText('12.30')).toBeInTheDocument();
  });

  // Test de tri des résultats par clé d'engin dans l'ordre alphabétique
  it('trie les résultats par clé d\'engin dans l\'ordre alphabétique', () => {
    // Données de test
    const resultats = {
      sol: 12.3,
      bf: 14.5,
      bp: 13.8,
      anneaux: 11.9,
      saut: 13.0,
    };

    // Rendu du composant avec les données de test
    render(
      <ResultatsListe
        resultats={resultats}
        classement={1}
        recompense="Or"
        equipe={null}
      />
    );

    // Assertions pour vérifier que les résultats sont triés par clé d'engin dans l'ordre alphabétique
    const engins = screen.getAllByTestId('carte-engin');
    expect(engins[0]).toHaveTextContent('Anneaux');
    expect(engins[1]).toHaveTextContent('Barre fixe');
    expect(engins[2]).toHaveTextContent('Barres parallèles');
    expect(engins[3]).toHaveTextContent('Saut');
    expect(engins[4]).toHaveTextContent('Sol');
  });

  // Test de calcul correct du résultat total
  it('calcule correctement le résultat total', () => {
    // Données de test
    const resultats = {
      bf: 14.5,
      bp: 13.8,
      sol: 12.3,
    };

    // Rendu du composant avec les données de test
    render(
      <ResultatsListe
        resultats={resultats}
        classement={1}
        recompense="Or"
        equipe={null}
      />
    );

    // Assertion pour vérifier que le résultat total est correct et qu'il n'y a pas de résultat d'équipe
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('40.60')).toBeInTheDocument();
    expect(screen.queryByText('Équipe')).not.toBeInTheDocument();
  });

  // Test d'affichage correct du classement et des récompenses
  it('affiche correctement le classement et les récompenses', () => {
    // Données de test
    const resultats = {
      bf: 14.5,
      bp: 13.8,
      sol: 12.3,
    };

    // Rendu du composant avec les données de test
    render(
      <ResultatsListe
        resultats={resultats}
        classement={1}
        recompense="Or"
        equipe={null}
      />
    );

    // Assertions pour vérifier l'affichage correct du classement et de la récompense
    expect(screen.getByText('Classement')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByTestId('gold')).toBeInTheDocument();
  });

  // Test d'affichage correct des résultats d'équipe si fournis
  it('affiche correctement les résultats d\'équipe si fournis', () => {
    // Données de test
    const resultats = {
      bf: 14.5,
      bp: 13.8,
      sol: 12.3,
    };

    // Rendu du composant avec les données de test
    render(
      <ResultatsListe
        resultats={resultats}
        classement={1}
        recompense="Or"
        equipe={{ total: 42.5, classement: 3 }}
      />
    );

    // Récupérer tous les éléments contenant le texte 'Équipe'
    const equipeElements = screen.getAllByText('Équipe');

    // Vérifier que le mot 'Équipe' est présent deux fois
    expect(equipeElements.length).toBe(2);

    // Assertions pour vérifier l'affichage correct des résultats d'équipe
    expect(screen.getByText('42.5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // Classement de l'équipe
  });
});
