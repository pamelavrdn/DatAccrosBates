import { createReadStream } from 'fs';
import csv from 'csv-parser';
import { collection, doc, setDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../firebaseConfig';

const societesCollection = collection(firestore, 'cag_societe');

// Chemin vers le fichier CSV des sociétés
const csvFilePath = 'CSVFiles/societes.csv';

// Ajouter une ligne du CSV à Firestore pour les sociétés
const addRowFirestore = async (row) => {
    const { id, nom, email, logo } = row;

    // Construire l'URL de téléchargement du logo à partir du chemin dans le CSV
    const logoURL = await getDownloadURL(ref(storage, `logos/${logo}`));

    // Créer une référence de document pour la société
    const societeDocRef = doc(societesCollection, id);

    try {
        // Ajouter les données de la société à Firestore
        await setDoc(societeDocRef, {
            id,
            nom,
            email,
            logo : logoURL,
            gymnastes: [],
        });

        console.log(`Société ajoutée avec l'ID : ${id}`);
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la société :', error);
    }
};

// Lire le fichier CSV des sociétés et ajouter les données à Firestore
createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
        console.log('Ligne du CSV pour les sociétés :', row);
        addRowFirestore(row);
    })
    .on('end', () => {
        console.log('Importation des sociétés terminée.');
    });
