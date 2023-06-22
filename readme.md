# Mate

Mate est une application de réseautage social conçue pour faciliter la rencontre de nouvelles personnes par le biais d'activités partagées.

## Installation

Pour installer les dépendances, exécutez :

npm install


## Exécution de l'application en mode développement

Mate utilise Expo pour le développement. Pour démarrer le serveur de développement, exécutez :

npx expo start

Ensuite à l'aide de l'application mobile expo go ouvrez l'application. 
Il est recommandé d'utiliser expo cli pour le développement.

## Fonctionnalités principales

- Authentification des utilisateurs : L'application utilise Firebase pour l'authentification des utilisateurs.
- Création d'activités : Les utilisateurs peuvent créer de nouvelles activités. (À décrire plus en détail après l'examen du code de `CreateActivity.js`).
- Navigation : L'application utilise `react-navigation` pour gérer la navigation entre les différents écrans.

## Structure du code

Le point d'entrée de l'application est `App.js`, qui importe `RootNavigation` du module de navigation. `RootNavigation` utilise le hook personnalisé `useAuthentication` pour déterminer si un utilisateur est connecté et affiche soit le `UserStack`, soit le `AuthStack` en conséquence. `AuthStack` définit la pile de navigation pour les utilisateurs non authentifiés, tandis que `UserStack` définit la pile de navigation pour les utilisateurs authentifiés.

## Composants clés

- `HeaderRight` : Un bouton dans l'en-tête qui, lorsqu'il est cliqué, navigue vers l'écran `ActivitiesMap`.
- `LogoutButton` : Un bouton qui, lorsqu'il est cliqué, déconnecte l'utilisateur.
- `UserDatasForm` : Un formulaire pour recueillir les informations de l'utilisateur, y compris le prénom, le nom, la date de naissance et le sexe.

## Hooks personnalisés

- `useAuthentication` : Un hook qui utilise l'API firebase/auth pour déterminer si un utilisateur est connecté.
