/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from '@testing-library/react';
import { connectFirestoreEmulator, collection } from 'firebase/firestore';
import { firestore } from '../../data/firebaseConfig';
import * as Data from '../../data/Data';
import { TestWrapper } from './testUtils';

connectFirestoreEmulator(firestore, 'localhost', 8081);

// Fonction pour compter les documents d'une collection
const getCount = async (collectionRef) => {
    const coll = collection(firestore, collectionRef);
    const snapshot = await getCountFromServer(coll);
    console.log("le nb de docs : ", snapshot.data().count);
    return snapshot.data().count;
};

// Test pour useAllGymnastesData
test('useAllGymnastesData returns data from Firestore', async () => {
  // connectFirestoreEmulator(firestore, 'localhost', 8081);
  // Remplir la collection avec des données de test
  await fillCollectionWithTestData();

  const { result } = renderHook(() => Data.useAllGymnastesData(), { wrapper: TestWrapper });

  // Effectuez la requête d'agrégation count() sur la collection
  const count = await getCount("cag_gymnaste");
  //const count = 2;

  // Vérifiez si le résultat est correct en comparant avec le nombre attendu de documents
  await waitFor(() => result.current.isSuccess);
  console.log("Data returned:", result.current.data); 
  expect(result.current.data).toHaveLength(count);
});

// Test pour useAllGymnastesData
/*test('useAllGymnastesData returns data from Firestore', async () => {
    // Définit les données simulées à renvoyer par getDocs
    const mockData = [
        { id: '1', name: 'Gymnaste 1', age: 20 },
        { id: '2', name: 'Gymnaste 2', age: 22 },
    ];

    // Configure le mock pour renvoyer les données simulées lors de l'appel à getDocs
    getDocs.mockResolvedValue( mockData );

    const { result } = renderHook(() => Data.useAllGymnastesData(), { wrapper: TestWrapper });

    // Effectuez la requête d'agrégation count() sur la collection
    //const { count } = await getCount("cag_gymnaste");

    // Vérifiez si le résultat est correct en comparant avec le nombre attendu de documents
    await waitFor(() => result.current.isSuccess);
    console.log("Data returned:", result.current.data); // Ajout d'un console.log pour vérifier les données
    expect(result.current.data).toHaveLength(mockData.length);
});*/