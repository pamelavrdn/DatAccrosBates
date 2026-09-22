import { createReadStream } from 'fs';
import csv from 'csv-parser';
import { collection, doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';

const gymnasteCollection = collection(firestore, 'cag_gymnaste');
const societeCollection = collection(firestore, 'cag_societe');

// Chemin vers le fichier CSV
const csvFilePath = 'CSVFiles/gymnastes.csv';

// Ajouter une ligne du CSV à Firestore
const addRowFirestore = async (row) => {
    const { noFSG, nom, prenom, sexe, dateNaissance, categorie, idSociete  } = row;

    // Numéro FSG comme identifiant du document
    const gymnasteDocRef = doc(gymnasteCollection, noFSG);
    // Le référence du document de la société
    const societeDocRef = doc(societeCollection, idSociete);

    try {
        await setDoc(gymnasteDocRef, {
            noFSG,
            nom,
            prenom,
            sexe,
            dateNaissance : new Date(dateNaissance),
            categorie,
            idSociete: societeDocRef,
        });
        console.log(`Gymnaste ajouté avec le numéro FSG : ${noFSG}`);

        // Mettre à jour le document de la société pour ajouter le gymnaste à la liste
        //const societeDocRef = doc(societeCollection, `cag_societe/${idSociete}`);
        await updateDoc(societeDocRef, {
            gymnastes: arrayUnion(gymnasteDocRef), // Ajouter la référence du gymnaste à la liste
        });

        console.log(`Gymnaste ajouté à la société avec l'ID : ${idSociete}`);
    } catch (error) {
        console.error('Erreur lors de l\'ajout du gymnaste :', error);
    }
};


// Lire le fichier CSV et ajouter les données à Firestore
createReadStream(csvFilePath)
.pipe(csv())
    .on('data', (row) => {
        console.log('Ligne du CSV :', row); // Pour afficher le contenu de chaque ligne
        addRowFirestore(row);
    })
    .on('end', () => {
        console.log('Importation terminée.');
    });
