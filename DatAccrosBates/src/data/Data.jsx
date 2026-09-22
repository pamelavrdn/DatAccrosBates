import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { firestore, auth, storage } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  list,
  deleteObject,
} from "firebase/storage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ================== Fonctions de requête pour les données ==================

// pour page Résultats et Compte Admin (peut voir toutes les données des gymnastes de Firestore)
const useAllGymnastesData = () => {
  return useQuery({
    queryKey: ["gymnastesData"],
    queryFn: async () => {
      const gymnasteCollection = collection(firestore, "cag_gymnaste");
      const gymnasteSnapshot = await getDocs(gymnasteCollection);
      return gymnasteSnapshot.docs.map((doc) => ({
        ref: doc.ref,
        id: doc.id,
        ...doc.data(),
      }));
    },
  });
};

// pour page Résultats, récupérer les participations du gymnaste cliqué
const useParticipationData = (gymnasteDoc) => {
  return useQuery({
    queryKey: ["participationData", gymnasteDoc ? gymnasteDoc.id : null],
    queryFn: async () => {
      if (!gymnasteDoc) {
        return [];
      }
      const participationCollection = collection(
        gymnasteDoc.ref,
        "participation"
      );
      const participationSnapshot = await getDocs(participationCollection);
      const participations = await Promise.all(
        participationSnapshot.docs.map(async (participationDoc) => {
          const participationData = {
            id: participationDoc.id,
            ...participationDoc.data(),
          };
          // Récupérer le document de concours correspondant à la référence dans la participation
          const concoursDoc = await getDoc(participationData.idConcours);
          if (concoursDoc.exists()) {
            participationData.concours = {
              id: concoursDoc.id,
              ...concoursDoc.data(),
            };
          }
          return participationData;
        })
      );

      return participations;
    },
  });
};

// pour création de gymnaste, possibilité de chercher les gymnastes déjà existants mais non associés à une société
const useAnciensGymnastes = () => {
  return useQuery({
    queryKey: ["anciensGymnastes"],
    queryFn: async () => {
      const gymnastesCollection = collection(firestore, "cag_gymnaste");
      const querySnapshot = await getDocs(
        query(gymnastesCollection, where("idSociete", "==", null))
      );

      return querySnapshot.docs.map((doc) => ({
        ref: doc.ref,
        id: doc.id,
        ...doc.data(),
      }));
    },
  });
};

// récupérer les gymnastes associés à une société spécifique
const useGymnastesSocieteData = (societeDoc) => {
  return useQuery({
    queryKey: ["gymnastesData", societeDoc ? societeDoc.id : ""],
    queryFn: async () => {
      if (!societeDoc) {
        return [];
      }
      // Obtenir le document de la société et les références des gymnastes
      const societe = await getDoc(societeDoc.ref);

      // Obtenir la liste de références des gymnastes associés à la société
      const gymnastesRefs = societe.data().gymnastes || [];

      // Récupérer les données des gymnastes associés
      const gymnastesData = await Promise.all(
        gymnastesRefs.map(async (gymnasteRef) => {
          const gymnasteDoc = await getDoc(gymnasteRef);
          return {
            ref: gymnasteDoc.ref,
            id: gymnasteDoc.id,
            ...gymnasteDoc.data(),
          };
        })
      );

      return gymnastesData;
    },
    enabled: !!societeDoc, // La requête ne s'exécute que si societeDoc est défini
  });
};

// récupérer toutes les sociétés
const useSocieteData = () => {
  return useQuery({
    queryKey: ["societeData"],
    queryFn: async () => {
      const societeCollection = collection(firestore, "cag_societe");
      const societeSnapshot = await getDocs(societeCollection);

      return societeSnapshot.docs.map((doc) => ({
        ref: doc.ref,
        id: doc.id,
        ...doc.data(),
      }));
    },
  });
};

// récupérer tous les concours
const useConcoursData = () => {
  return useQuery({
    queryKey: ["concoursData"],
    queryFn: async () => {
      const concoursCollection = collection(firestore, "cag_concours");

      // Déterminer la saison actuelle en fonction de la date actuelle
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      // Si on est en septembre ou plus tard, la saison a commencé cette année, sinon elle a commencé l'année dernière
      // Saison entre 1er septembre et 31 août de l'année suivante
      let startSeasonDate, endSeasonDate;
      if (currentMonth >= 9) {
        startSeasonDate = new Date(currentYear, 8, 1); // 1er septembre de l'année actuelle
        endSeasonDate = new Date(currentYear + 1, 7, 31); // 31 août de l'année suivante
      } else {
        startSeasonDate = new Date(currentYear - 1, 8, 1); // 1er septembre de l'année précédente
        endSeasonDate = new Date(currentYear, 7, 31); // 31 août de l'année actuelle
      }
      const querySnapshot = await getDocs(
        query(
          concoursCollection,
          where("date", ">=", startSeasonDate),
          where("date", "<=", endSeasonDate)
        )
      );

      return querySnapshot.docs.map((doc) => ({
        ref: doc.ref,
        id: doc.id,
        ...doc.data(),
      }));
    },
  });
};

// récupérer tous les administrateurs
const useAdminData = () => {
  return useQuery({
    queryKey: ["adminData"],
    queryFn: async () => {
      const utilisateurCollection = collection(firestore, "cag_utilisateurs");
      const querySnapshot = await getDocs(
        query(utilisateurCollection, where("role", "==", "admin"))
      );

      return querySnapshot.docs.map((doc) => ({
        ref: doc.ref,
        id: doc.id,
        ...doc.data(),
      }));
    },
  });
};

// récupérer tous les coachs
const useCoachData = () => {
  return useQuery({
    queryKey: ["coachData"],
    queryFn: async () => {
      const utilisateurCollection = collection(firestore, "cag_utilisateurs");
      const querySnapshot = await getDocs(
        query(utilisateurCollection, where("role", ">=", "coach"))
      );

      return querySnapshot.docs.map((doc) => ({
        ref: doc.ref,
        id: doc.id,
        ...doc.data(),
      }));
    },
  });
};

// récupérer les coachs associés à une société spécifique
const useCoachSocieteData = (societeDoc) => {
  return useQuery({
    queryKey: ["coachData", societeDoc ? societeDoc.id : ""],
    queryFn: async () => {
      if (!societeDoc) {
        return [];
      }
      const coachCollection = collection(firestore, "cag_utilisateurs");
      const querySnapshot = await getDocs(
        query(
          coachCollection,
          where("societes", "array-contains", societeDoc.ref)
        )
      );

      return querySnapshot.docs.map((doc) => ({
        ref: doc.ref,
        id: doc.id,
        ...doc.data(),
      }));
    },
  });
};

// récupérer les gymnastes d'une société inscrits à un concours spécifique
const useInscriptionData = (societeDoc, concoursDoc) => {
  return useQuery({
    queryKey: [
      "gymnastesData",
      societeDoc ? societeDoc.id : null,
      concoursDoc ? concoursDoc.id : null,
    ],
    queryFn: async () => {
      // Collection inscription
      const inscriptionCollection = collection(societeDoc.ref, "inscription");
      // Récupérer la référence du document d'inscription de la société pour ce concours
      const inscriptionQuery = query(
        inscriptionCollection,
        where("idConcours", "==", concoursDoc.ref)
      );
      const inscriptionSnapshot = await getDocs(inscriptionQuery);

      if (inscriptionSnapshot.empty) {
        // Si aucune inscription n'est trouvée, créer un nouveau document d'inscription vide
        await addDoc(collection(societeDoc.ref, "inscription"), {
          idConcours: concoursDoc.ref,
          gymnastesInscrits: [],
        });
        return [];
      }

      // Si une inscription est trouvée, retournez les données d'inscription existantes
      // Récupérer le premier document d'inscription trouvé (il ne devrait y en avoir qu'un seul)
      const inscriptionDoc = inscriptionSnapshot.docs[0].data();
      // Parcourir les gymnastes inscrits dans cette inscription
      const inscriptionsData = await Promise.all(
        inscriptionDoc.gymnastesInscrits.map(async (gymnasteInscrit) => {
          if (gymnasteInscrit.gymnaste) {
            // Obtenir les informations du gymnaste à partir de sa référence
            const gymnasteDoc = await getDoc(gymnasteInscrit.gymnaste);
            const gymnaste = {
              ref: gymnasteDoc.ref,
              id: gymnasteDoc.id,
              categorieConcours: gymnasteInscrit.categorie,
              categorieSup: gymnasteInscrit.catUp,
              ...gymnasteDoc.data(),
            };

            if (concoursDoc.equipe) {
              gymnaste.equipe = gymnasteInscrit.equipe || null;
            }

            return gymnaste;
          }
        })
      );
      return inscriptionsData;
    },
    enabled: !!societeDoc && !!concoursDoc, // La requête ne s'exécute que si societeDoc et concoursDoc sont définis
  });
};

// ================== Fonctions d'ajout dans la base de données ==================

const useAddGymnaste = (gymnaste, confirmerRecuperation) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const gymnastesCollection = collection(firestore, "cag_gymnaste");
      const gymnasteRef = doc(gymnastesCollection, gymnaste.noFSG);
      const queryGymnasteExistant = await getDocs(
        query(
          gymnastesCollection,
          where("noFSG", "==", gymnaste.noFSG),
          where("idSociete", "!=", null)
        )
      );
      const queryAncienGymnaste = await getDocs(
        query(
          gymnastesCollection,
          where("noFSG", "==", gymnaste.noFSG),
          where("idSociete", "==", null)
        )
      );

      // Si le no FSG existe déjà et que le gymnaste possède déjà une société
      if (!queryGymnasteExistant.empty) {
        throw new Error("Le gymnaste avec ce numéro FSG existe déjà.");
      }

      // Si le gymnaste a déjà été ajouté dans le passé, on lui permet de le réactiver
      if (!queryAncienGymnaste.empty && !confirmerRecuperation) {
        throw new Error("AjoutAncienGymnaste");
      }

      // ajout du gymnaste dans la collection "cag_gymnaste"
      await setDoc(gymnasteRef, {
        nom: gymnaste.nom,
        prenom: gymnaste.prenom,
        dateNaissance: new Date(gymnaste.dateNaissance),
        sexe: gymnaste.sexe,
        noFSG: gymnaste.noFSG,
        categorie: gymnaste.categorie,
        idSociete: gymnaste.idSociete,
      });

      // ajout du gymnaste à la liste des gymnastes de la société
      await updateDoc(gymnaste.idSociete, {
        gymnastes: arrayUnion(gymnasteRef),
      });
    },
    onSuccess: () => {
      // Enlever le cache de la liste des gymnastes car elle a été modifiée
      queryClient.removeQueries({ queryKey: ["gymnastesData"] });
      queryClient.removeQueries({ queryKey: ["anciensGymnastes"] });

      console.log("Gymnaste ajouté avec succès à Firestore :", gymnaste);
      console.log("Mutation réussie !");
    },
    onError: (error) => {
      console.error("Erreur lors de la mutation :", error.message);
    },
  });
};

const useAddCoach = (coach) => {
  const queryClient = useQueryClient();
  const userCoach = auth.currentUser;

  return useMutation({
    mutationFn: async () => {
      let coachRef;

      // Vérifier si le coach existe déjà dans la collection 'cag_utilisateurs'
      const existingCoachQuery = query(
        collection(firestore, "cag_utilisateurs"),
        where("email", "==", coach.email)
      );
      const existingCoachSnapshot = await getDocs(existingCoachQuery);

      // Si le coach existe déjà, on ne le crée pas à nouveau
      if (!existingCoachSnapshot.empty) {
        coachRef = existingCoachSnapshot.docs[0].ref;
        // Récupérer les sociétés existantes
        const existingSocietes = existingCoachSnapshot.docs[0].data().societes;

        // Concaténer les nouvelles sociétés avec les existantes
        coach.societes = [...existingSocietes, ...coach.societes];
      } else {
        // Sinon, on crée un nouveau coach
        // Créer le compte du coach dans Firebase Authentication
        const tempUser = await createUserWithEmailAndPassword(
          auth,
          coach.email,
          coach.password
        );

        await sendPasswordResetEmail(auth, coach.email);

        console.log("tempUser", tempUser.user.uid);

        // Créer le compte du coach dans Firebase Authentication
        coachRef = doc(firestore, "cag_utilisateurs", tempUser.user.uid);

        console.log("user", userCoach);
        await auth.updateCurrentUser(userCoach);
      }

      // Ajouter/modifier le coach à la collection 'cag_utilisateurs'
      await setDoc(coachRef, {
        nom: coach.nom,
        prenom: coach.prenom,
        email: coach.email,
        role: coach.role,
        nomUtilisateur: coach.nomUtilisateur,
        societes: coach.societes,
      });
    },
    onSuccess: () => {
      // Enlever le cache des données des coachs car elles ont été modifiées
      queryClient.removeQueries({ queryKey: ["coachData"] });

      console.log("Coach ajouté avec succès à Firestore :", coach);
      console.log("Mutation réussie !");
    },
    onError: (error) => {
      console.error("Erreur lors de la mutation :", error.message);
    },
  });
};

const useAddAdmin = (admin) => {
  const queryClient = useQueryClient();
  const userAdmin = auth.currentUser;

  return useMutation({
    mutationFn: async () => {
      // Créer le compte de l'admin dans Firebase Authentication
      const tempUser = await createUserWithEmailAndPassword(
        auth,
        admin.email,
        admin.password
      );

      // Envoyer un e-mail de vérification à l'utilisateur
      await sendPasswordResetEmail(auth, admin.email);

      console.log("tempUser", tempUser.user.uid);

      const adminRef = doc(firestore, "cag_utilisateurs", tempUser.user.uid);

      console.log("userAdmin", userAdmin);
      await auth.updateCurrentUser(userAdmin);

      // Ajouter l'admin à la collection 'cag_utilisateurs' avec le rôle "admin"
      await setDoc(adminRef, {
        nom: admin.nom,
        prenom: admin.prenom,
        email: admin.email,
        nomUtilisateur: admin.nomUtilisateur,
        role: "admin",
      });
      console.log("adminRef", adminRef);
    },
    onSuccess: () => {
      // Enlever le cache des données des admins car elles ont été modifiées
      queryClient.removeQueries({ queryKey: ["adminData"] });

      console.log("Admin ajouté avec succès à Firestore :", admin);
      console.log("Mutation réussie !");
    },
    onError: (error) => {
      console.error("Erreur lors de la mutation :", error.message);
    },
  });
};

const useAddSociete = (societe) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      // Ajout de la société dans Firestore
      const societeDocRef = await addDoc(collection(firestore, "cag_societe"), {
        nom: societe.nom,
        email: societe.email,
        logo: "", // Le logo sera mis à jour après l'ajout du document
        gymnastes: [],
      });

      // Téléversement du logo de la société avec l'ID généré
      const extension = societe.logo.name.split(".").pop(); // Obtient l'extension du fichier
      const storageRef = ref(
        storage,
        `logos/logo_${societeDocRef.id}.${extension}`
      );
      await uploadBytes(storageRef, societe.logo);

      // Obtention de l'URL du logo téléversé
      const logoUrl = await getDownloadURL(storageRef);

      // Mettre à jour le champ logo dans Firestore avec l'URL du logo
      await updateDoc(societeDocRef, { logo: logoUrl });
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["societeData"] });

      console.log("Société ajoutée avec succès à Firestore :", societe);
      console.log("Logo téléversé avec succès sur Firebase Storage.");
      console.log("Mutation réussie !");
    },
    onError: (error) => {
      console.error("Erreur lors de la mutation :", error.message);
    },
  });
};

const useAddConcours = (concours) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      // Ajout d'un nouveau document concours à la collection "cag_concours"
      await addDoc(collection(firestore, "cag_concours"), {
        nom: concours.nom,
        date: new Date(concours.date),
        dateInscription: new Date(concours.dateLimite),
        lieu: concours.lieu,
        categories: concours.categoriesChoisies,
        equipe: concours.concoursEquipe,
      });
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["concoursData"] });

      console.log("Concours ajouté avec succès à Firestore :", concours);
      console.log("Mutation réussie !");
    },
    onError: (error) => {
      console.error("Erreur lors de la mutation :", error.message);
    },
  });
};

const useAddInscription = (societeDoc, concoursDoc, gymnastes) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      // Collection inscription
      const inscriptionCollection = collection(societeDoc.ref, "inscription");
      // Récupérer la référence du document d'inscription de la société pour ce concours
      const inscriptionQuery = query(
        inscriptionCollection,
        where("idConcours", "==", concoursDoc.ref)
      );
      const inscriptionSnapshot = await getDocs(inscriptionQuery);

      // Vérifier si le document d'inscription existe (censé exister car créé avec useInscriptionData)
      if (inscriptionSnapshot.empty) {
        console.error("Document d'inscription non trouvé");
        return;
      }

      // Récupérer le premier document d'inscription trouvé (il ne devrait y en avoir qu'un seul)
      const inscriptionDoc = inscriptionSnapshot.docs[0];

      // Vider la liste des gymnastes inscrits
      await setDoc(
        inscriptionDoc.ref,
        { gymnastesInscrits: [] },
        { merge: true }
      );

      // Créer un tableau avec les nouvelles données des gymnastes inscrits
      const nouveauxGymnastesData = gymnastes.map((gymnaste) => {
        const nouveauGymnaste = {
          catUp: gymnaste.categorieSup,
          categorie: gymnaste.categorieConcours,
          gymnaste: gymnaste.ref,
        };

        // Ajouter le champ equipe si fourni dans les données du gymnaste
        if (concoursDoc.equipe) {
          nouveauGymnaste.equipe = gymnaste.equipe || null;
        }

        return nouveauGymnaste;
      });
      console.log("nouveauxGymnastesData", nouveauxGymnastesData);
      // Ajouter les nouveaux gymnastes à la liste des gymnastes inscrits
      await setDoc(
        inscriptionDoc.ref,
        { gymnastesInscrits: nouveauxGymnastesData },
        { merge: true }
      );
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["gymnastesData"] });

      console.log("Inscription ajoutée avec succès dans Firestore");
      console.log("Mutation réussie !");
    },
    onError: (error) => {
      console.error("Erreur lors de la mutation :", error.message);
    },
  });
};

// ================== Fonctions de modification dans la base de données ==================

const useSetGymnaste = (gymnaste) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      // Obtenir la référence de l'idSociete du gymnaste
      const societeRef = gymnaste.idSociete;

      // Supprimer la référence du gymnaste de la liste des gymnastes de la société si pas null
      if (societeRef) {
        await updateDoc(societeRef, {
          gymnastes: arrayRemove(gymnaste.ref),
        });
      }

      const updateGymnaste = {
        nom: gymnaste.nom,
        prenom: gymnaste.prenom,
        dateNaissance: new Date(gymnaste.dateNaissance),
        sexe: gymnaste.sexe,
        noFSG: gymnaste.noFSG,
        categorie: gymnaste.categorie,
        idSociete: gymnaste.idSociete,
      };

      await setDoc(gymnaste.ref, updateGymnaste, { merge: true });

      // ajout du gymnaste à la liste des gymnastes de la société
      await updateDoc(gymnaste.idSociete, {
        gymnastes: arrayUnion(gymnaste.ref),
      });
    },

    onSuccess: () => {
      // Enlever le cache de la liste des gymnastes car elle a été modifiée
      queryClient.removeQueries({ queryKey: ["gymnastesData"] });
      queryClient.removeQueries({ queryKey: ["anciensGymnastes"] });

      console.log("Gymnaste modifié avec succès dans Firestore :", gymnaste);
      console.log("Mutation réussie !");
    },
    onError: (error) => {
      console.error("Erreur lors de la mutation :", error.message);
    },
  });
};

// n'efface pas de la base de données, mais dissocie le gymnaste de la société
const useDeleteGymnaste = (gymnaste) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      // Met à jour le champ societe du gymnaste pour le dissocier de toute société
      await setDoc(gymnaste.ref, { idSociete: null }, { merge: true });

      // Si le gymnaste est bien dissocié de la société, on met à jour la liste de gymnastes de la société
      await updateDoc(gymnaste.idSociete, {
        gymnastes: arrayRemove(gymnaste.ref),
      });
    },
    onSuccess: () => {
      // Enlever le cache de la liste des gymnastes car elle a été modifiée
      queryClient.removeQueries({ queryKey: ["gymnastesData"] });
      queryClient.removeQueries({ queryKey: ["anciensGymnastes"] });

      console.log(
        "Gymnaste dissocié avec succès d'une société dans Firestore :",
        gymnaste
      );
      console.log("Mutation réussie !");
    },
    onError: (error) => {
      console.error("Erreur lors de la mutation :", error.message);
    },
  });
};

// n'efface pas de la base de données, mais dissocie le coach de la société
const useDeleteCoach = (coach, societeDoc) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      // arrayRemove pour supprimer la référence de la société
      await updateDoc(coach.ref, {
        societes: arrayRemove(societeDoc.ref),
      });
    },
    onSuccess: () => {
      // Enlever le cache de la liste des coachs car elle a été modifiée
      queryClient.removeQueries({ queryKey: ["coachData"] });

      console.log(
        "Coach dissocié avec succès de la société dans Firestore :",
        coach
      );
      console.log("Mutation réussie !");
    },
    onError: (error) => {
      console.error("Erreur lors de la mutation :", error.message);
    },
  });
};

const useSetCoach = (coach) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const updateCoach = {
        nom: coach.nom,
        prenom: coach.prenom,
        email: coach.email,
        role: coach.role,
        nomUtilisateur: coach.nomUtilisateur,
        societes: coach.societes,
      };

      await setDoc(coach.ref, updateCoach, { merge: true });
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["coachData"] });

      console.log("Coach modifié avec succès dans Firestore :", coach);
      console.log("Mutation réussie !");
    },
    onError: (error) => {
      console.error("Erreur lors de la mutation :", error.message);
    },
  });
};

const useSetAdmin = (admin) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const updateAdmin = {
        nom: admin.nom,
        prenom: admin.prenom,
        email: admin.email,
        nomUtilisateur: admin.nomUtilisateur,
      };

      // Mettre à jour les données de l'admin dans Firestore
      await setDoc(admin.ref, updateAdmin, { merge: true });
    },
    onSuccess: () => {
      // Enlever le cache des données des admins car elles ont été modifiées
      queryClient.removeQueries({ queryKey: ["adminData"] });

      console.log("Admin modifié avec succès dans Firestore :", admin);
      console.log("Mutation réussie !");
    },
    onError: (error) => {
      console.error("Erreur lors de la mutation :", error.message);
    },
  });
};

const useSetSociete = (societe) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      let logoUrl = societe.logo;
      // Si un nouveau logo a été téléversé, le mettre à jour (sinon, conserver le lien actuel)
      if (societe.logo.name) {
        // Construire le chemin de référence pour le dossier contenant les logos de la société
        const dossierLogosRef = ref(storage, "logos");

        // Récupérer le premier fichier correspondant à l'ancien logo dans le dossier des logos de la société
        const listeFichiers = await list(dossierLogosRef);
        const ancienLogo = listeFichiers.items.find((item) =>
          item.name.startsWith(`logo_${societe.id}`)
        );

        // Vérifier si un ancien logo a été trouvé et le supprimer le cas échéant
        if (ancienLogo) {
          await deleteObject(ancienLogo);
          console.log(`Ancien logo "${ancienLogo.name}" supprimé.`);
        } else {
          console.log("Aucun ancien logo trouvé.");
        }
        // Téléverser le nouveau logo
        const extension = societe.logo.name.split(".").pop(); // Obtient l'extension du fichier
        const storageRef = ref(
          storage,
          `logos/logo_${societe.id}.${extension}`
        );
        await uploadBytes(storageRef, societe.logo);
        logoUrl = await getDownloadURL(storageRef);
        console.log("logoUrl", logoUrl);
      }

      // Mettre à jour les données de la société dans Firestore
      await setDoc(
        societe.ref,
        {
          nom: societe.nom,
          email: societe.email,
          logo: logoUrl,
        },
        { merge: true }
      );
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["societeData"] });

      console.log("Société modifiée avec succès dans Firestore :", societe);
      console.log("Mutation réussie !");
    },
    onError: (error) => {
      console.error("Erreur lors de la mutation :", error.message);
    },
  });
};

const useSetConcours = (concours) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const updateConcours = {
        nom: concours.nom,
        date: new Date(concours.date),
        dateInscription: new Date(concours.dateLimite),
        lieu: concours.lieu,
        categories: concours.categoriesChoisies,
        equipe: concours.concoursEquipe,
      };

      // Mettre à jour le document dans Firestore
      await setDoc(concours.ref, updateConcours, { merge: true });
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["concoursData"] });

      console.log("Concours modifié avec succès dans Firestore :", concours);
      console.log("Mutation réussie !");
    },
    onError: (error) => {
      console.error("Erreur lors de la mutation :", error.message);
    },
  });
};

// ================== Fonctions pour l'import/export ==================

const exportCSV = async (concours, fileName) => {
  let csvContent =
    "noFSG;nom;prenom;dateDeNaissance;sexe;categorie;catUp;societe";

  // Ajouter la colonne noEquipe si  le concours se fait par équipe
  if (concours.equipe) {
    csvContent += ";noEquipe";
  }

  csvContent += "\n";

  // Parcourir les sociétés
  const societesSnapshot = await getDocs(collection(firestore, "cag_societe"));
  await Promise.all(
    societesSnapshot.docs.map(async (societeDoc) => {
      // Vérifier si la société a une sous-collection "inscription"
      const inscriptionsCollection = collection(societeDoc.ref, "inscription");

      // Obtenir les inscriptions pour le concours spécifié
      const inscriptionsQuery = query(
        inscriptionsCollection,
        where("idConcours", "==", concours.ref)
      );
      const inscriptionsSnapshot = await getDocs(inscriptionsQuery);

      // Parcourir les inscriptions pour le concours spécifié
      await Promise.all(
        inscriptionsSnapshot.docs.map(async (inscriptionDoc) => {
          // Parcourir les gymnastes inscrits dans cette inscription
          await Promise.all(
            inscriptionDoc
              .data()
              .gymnastesInscrits.map(async (gymnasteInscrit) => {
                if (gymnasteInscrit.gymnaste) {
                  // Obtenir les informations du gymnaste à partir de sa référence
                  const gymnasteDoc = await getDoc(gymnasteInscrit.gymnaste);
                  const gymnasteData = gymnasteDoc.data();

                  // Formatter les informations dans une ligne CSV
                  let line = `${gymnasteData.noFSG};${gymnasteData.nom};${
                    gymnasteData.prenom
                  };${formatDatePoint(gymnasteData.dateNaissance)};${
                    gymnasteData.sexe
                  };${gymnasteInscrit.categorie};${gymnasteInscrit.catUp};${
                    societeDoc.data().nom
                  }`;

                  // Ajouter le numéro d'équipe s'il est présent dans la map
                  if (concours.equipe && gymnasteInscrit.equipe) {
                    line += `;${gymnasteInscrit.equipe}`;
                  }

                  line += "\n";
                  // Ajouter la ligne au contenu CSV
                  csvContent += line;
                  console.log("Ligne ajoutée :", line);
                }
              })
          );
        })
      );
    })
  );

  // Pour affichage sur Excel
  const bom = "\uFEFF";
  csvContent = bom + csvContent;

  console.log("Contenu CSV final :", csvContent);

  // Créer un blob contenant le contenu CSV
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Créer un URL pour le blob
  const url = window.URL.createObjectURL(blob);

  // Créer un lien pour télécharger le fichier CSV
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);

  // Cliquer sur le lien pour démarrer le téléchargement
  link.click();

  // Nettoyer l'URL créé
  window.URL.revokeObjectURL(url);
};

const importCSV = async (concours, file, queryClient) => {
  // Lire le contenu du fichier CSV
  const content = await file.text();
  // Séparer les lignes du fichier CSV
  const lines = content.split("\n");

  // Parcourir chaque ligne du fichier CSV
  for (let i = 1; i < lines.length; i++) {
    // Commencer à l'index 1 pour ignorer l'en-tête
    const line = lines[i].trim(); // Supprimer les espaces blancs de chaque côté

    if (line !== "") {
      // Vérifier si la ligne n'est pas vide
      const values = line.split(";");

      // Récupérer le noFSG du gymnaste à partir de la première colonne du CSV
      const noFSG = values[0].trim();

      // Rechercher le gymnaste avec le noFSG correspondant dans la collection cag_gymnaste
      const gymnasteQuery = query(
        collection(firestore, "cag_gymnaste"),
        where("noFSG", "==", noFSG)
      );
      const gymnasteQuerySnapshot = await getDocs(gymnasteQuery);

      try {
        // Vérifier si le gymnaste existe
        if (gymnasteQuerySnapshot.empty || gymnasteQuerySnapshot.size !== 1) {
          throw new Error(
            "Problème avec le gymnaste suivant : " +
              noFSG +
              ". Le gymnaste n'existe pas ou il y a plusieurs gymnastes avec le même numéro FSG."
          );
        }

        const gymnasteDoc = gymnasteQuerySnapshot.docs[0];

        // Construire l'objet de participation pour ce gymnaste
        const participationData = {
          idConcours: concours.ref,
          classement: parseFloat(values[8].trim()), // Convertir le classement en nombre
          recompense: values[9].trim() !== "" ? values[9].trim() : null, // Vérifier si la recompense est présente
          categorie: values[10].trim(), // Récupérer la catégorie depuis le CSV
          passageCat: values[11].trim().toLowerCase() === "true", // Convertir en boolean
          resultats: {
            // Les résultats de chaque engin
            sol: parseFloat(values[3].trim()), // Convertir en nombre
            anneaux: parseFloat(values[4].trim()), // Convertir en nombre
            saut: parseFloat(values[5].trim()), // Convertir en nombre
            bf: parseFloat(values[6].trim()), // Convertir en nombre
          },
        };

        // Vérifier si le champ pour bp n'est pas vide
        if (values[7].trim() !== "") {
          participationData.resultats.bp = parseFloat(values[7].trim()); // Ajouter le champ bp
        }

        // Vérifier si le CSV contient des champs pour les équipes
        if (values.length >= 13) {
          // Vérifier si les champs pour les équipes ne sont pas vides
          if (
            values[12].trim() !== "" &&
            values[13].trim() !== "" &&
            values[14].trim() !== ""
          ) {
            // Ajouter les champs pour les équipes
            participationData.equipe = {
              no: values[12].trim(),
              classement: parseFloat(values[13].trim()),
              total: parseFloat(values[14].trim()),
            };
          }
        }

        // Ajouter le document de participation dans la collection correspondante pour ce gymnaste
        await addDoc(
          collection(gymnasteDoc.ref, "participation"),
          participationData
        );

        // Modifier la catégorie du gymnaste si passageCat est true
        if (participationData.passageCat) {
          await updateDoc(gymnasteDoc.ref, {
            categorie: participationData.categorie,
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
  // Nettoyer le cache des requêtes concernant les gymnastes et les participations
  queryClient.removeQueries({ queryKey: ["gymnastesData"] });
  queryClient.removeQueries({ queryKey: ["participationData"] });
};

// ================== Fonctions de formatage de date ==================
const formatDateSlash = (date) => {
  const toDate = date.toDate();
  const jour = toDate.getDate();
  const mois = toDate.getMonth() + 1;
  const annee = toDate.getFullYear();
  return `${jour}/${mois}/${annee}`;
};

const formatDatePoint = (date) => {
  const toDate = date.toDate();
  const jour = toDate.getDate();
  const mois = toDate.getMonth() + 1;
  const annee = toDate.getFullYear();
  return `${jour}.${mois}.${annee}`;
};

const formatDateLong = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toDate().toLocaleDateString("fr-FR", options);
};

export {
  useAllGymnastesData,
  useAnciensGymnastes,
  useGymnastesSocieteData,
  useConcoursData,
  useSocieteData,
  useAdminData,
  useCoachData,
  useParticipationData,
  formatDateSlash,
  formatDatePoint,
  formatDateLong,
  useAddGymnaste,
  useSetGymnaste,
  useDeleteGymnaste,
  useAddCoach,
  useSetCoach,
  useDeleteCoach,
  useAddAdmin,
  useSetAdmin,
  useAddConcours,
  useSetConcours,
  useAddSociete,
  useSetSociete,
  useInscriptionData,
  useAddInscription,
  exportCSV,
  importCSV,
  useCoachSocieteData,
};
