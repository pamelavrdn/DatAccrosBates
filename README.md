# Projet sur mandat_64-56 - DatAccrosBates

## Application Web React

Ce projet est une application Web développée en utilisant React. 

### But et Fonctionnement de l'application
Il s'agit d'une application pour gérer :
- Les gymnastes
- Les coachs
- Les concours
- Les administrateurs (membres de la commission d'Agrès Genève)

Sauvegarder les résultats des gymnastes, et les consulter.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les outils suivants sur votre machine :

- Node.js (v14.x ou supérieur) 
    - Lien d'installation (Mac OS, Windows) : [Installation de Node.js](https://nodejs.org/en/download)
- npm (v6.x ou supérieur)
    - npm s'install automatiquement avec Node.js (vérifier lors du processus d'installation de Node.js)
- GIT ( v2.24.3 ou supérieur)
    - Lien d'installation  (Mac OS, Windows) : [Installation de GIT](https://git-scm.com/downloads)

### vérifier l'installation
1. Ouvrir l'invite de commande (***touche windows*** puis chercher ***CMD*** et ***touche Enter***)
2. Entrer ces commandes
    - ``` node -v ```
    - ``` npm -v ```
    - ``` git -v ```
3. Un numéro de version apparait comme : V20.11.0 / 10.4.0 / git version 2.45.0.windows.1
4. Tout est bon

    <img src="PSM_DatAccrosBates\src\readme\readme-version.png" alt="Vérifier les versions installé" width="30%"  style="border-radius: 10px;">


## Installation

1. **Clonage du projet :**

    - Créer un dossier sur votre machine, puis ouvrez l'invite de commande (CMD)
    - Accédez au dossier que vous venez de créer (cd C:/chemin_de_votre_dossier)
    - et exécutez la commande suivante pour cloner le projet :

   ```
   git clone https://github.com/ChrisirhC1/DatAccrosBates.git
   ```

2. **Installation des dépendances :**

   Accédez au répertoire du projet et exécutez la commande suivante pour installer les dépendances :

   ```
   cd .\PSM_DatAccrosBates\
   npm install --legacy-peer-deps
   ```

3. **Aller dans la branche Main :**

   ```
   git checkout main
   ```



## Lancement de l'application

Une fois les dépendances installées et la configuration terminée, vous pouvez lancer l'application en utilisant la commande suivante :

```
npm run dev
```

Cette commande démarrera un serveur de développement. 

Une fois le serveur démarré, ouvrez votre navigateur et accédez à l'URL [http://localhost:5173/](http://localhost:5173/) pour voir votre application en cours d'exécution.

### Comptes de test (Coach Classique / Privilégié, Administrateur)
Contactez l'équipe pour les accès de test.


## Back-end

1. **Firebase :**

   Pour utiliser la console de Firebase, vous devez être autorisé à consulter le projet et vous rendre 
   sur [console Firebase du projet](https://console.firebase.google.com/project/dataccrobates/overview?hl=fr).

## Autres scripts disponibles


- **Tests unitaires et d'intégration :** 

  Pour exécuter les tests unitaires et d'intégration, utilisez la commande suivante :

  ```
  npm test
  ```

---

