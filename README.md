# API Users

## Overview
The API allows users to retrieve all of the users of the application in micro service through a REST architecture. This API will be mainly used for registed Accounts.

It will also create own users to recover data to the platform but is in no way related to the users collected via the crawling of profiles on Social Networks.

### [POST] Create user
Allows the creation of a single user.

|                            |                  |
|----------------------------|------------------|
| Requires authentication ?  | No               |
| Who can use it ?           | Owner and users  |
| Response formats           | application/json |

* HTTP request : POST → user/create

#### Parameters :
```javascript
{
  'firstname': String, // Optional
  'lastname': Number, // Optional
  'age': Number, // Optional
  'city': String // Optional
}
```

#### Response :
```javascript
  {
    _id: Object_ID,
    firstname: String,
    lastname: String,
    age: Number,
    city: String
  }
```

### [POST] Show user
Show an user by id.

|                            |                  |
|----------------------------|------------------|
| Requires authentication ?  | No               |
| Who can use it ?           | Owner and users  |
| Response formats           | application/json |

* HTTP request : GET → user/show/:id

#### Parameters :
```javascript
{
  id: String // Required
}
```

#### Response :
```javascript
  {
    _id: Object_ID,
    firstname: String,
    lastname: String,
    age: Number,
    city: String
  }
```

### Requirements
* node 16
* npm or yarn
* git
* mongodb (please configure config.js for link mongodb)

### Install
```yarn install```

### Production mode
```yarn prod```

### Dev mode
``` yarn dev```



# API Express & MongoDB Atlas avec JWT

Ce projet est une API construite avec Express et MongoDB Atlas, utilisant JWT pour l'authentification. Ce document décrit en détail comment configurer votre cluster MongoDB Atlas, paramétrer la base de données et lancer l'API, ainsi que quelques erreurs possibles et la différence entre les environnements de développement et de production.

## Table des Matières

- [MongoDB Atlas Setup](#mongodb-atlas-setup)
- [Configuration de la Base de Données](#configuration-de-la-base-de-données)
- [Connexion à MongoDB depuis VS Code](#connexion-à-mongodb-depuis-vs-code)
- [Clonage du Repository et Configuration de l'Application](#clonage-du-repository-et-configuration-de-lapplication)
- [Démarrage de l'Application](#démarrage-de-lapplication)
- [Gestion des Erreurs](#gestion-des-erreurs)
- [Différence entre Environnements (Développement vs. Production)](#différence-entre-environnements-développement-vs-production)
- [Aperçu du Code Serveur](#aperçu-du-code-serveur)
- [Dépendances](#dépendances)

## MongoDB Atlas Setup

1. **Création du Cluster dans Atlas**
   - Connectez-vous à [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (vous pouvez utiliser Google pour faciliter l'accès) et cliquez sur **Deploy your cluster**.
   - Sélectionnez l'option **Free**.
   - Choisissez un nom pour votre cluster.
   - Pour le provider, sélectionnez **AWS**.
   - Choisissez votre région (par exemple, Paris – `eu-west-3`).
   - Attendez que l'indicateur passe au vert pour confirmer que le cluster est en ligne.

## Configuration de la Base de Données

### a. Database Access
- Rendez-vous dans **Database Access**.
- Créez un nouvel utilisateur avec accès à **All Resources**.
- Modifiez le mot de passe de cet utilisateur en cliquant sur l'icône du stylo (Edit), saisissez le nouveau mot de passe, puis cliquez sur **Update**.

### b. Network Access
- Dans **Network Access**, ajoutez votre adresse IP actuelle (ou utilisez `0.0.0.0/0` pour autoriser toutes les IP – moins sécurisé, pensez à le supprimer ensuite).
- Vérifiez que votre IP apparaisse avec un statut vert (valide).

### c. Création de la Base de Données et de la Collection
- Dans votre cluster, cliquez sur **Browse Collections**.
- Cliquez sur **Create Database**.
  - **Database Name** : Donnez le nom que vous souhaitez (exemple : `demo`).
  - **Collection Name** : Indiquez `users` (correspond à la collection utilisée dans le code).

> **Exemple de modèle Mongoose :**
> 
> ```js
> const mongoose = require('mongoose');
> 
> const Schema = new mongoose.Schema({
>   name: String,
>   role: String,
>   avatar: String
> }, {
>   collection: 'users', // La collection s'appelle "users"
>   minimize: false,
>   versionKey: false
> }).set('toJSON', {
>   transform: (doc, ret) => {
>     ret.id = ret._id;
>     delete ret._id;
>   }
> });
> 
> module.exports = Schema;
> ```

## Connexion à MongoDB depuis VS Code

- Dans Atlas, allez dans **Clusters** puis cliquez sur **Connect**.
- Choisissez **Connect to your application**.
- Sélectionnez **Connecting with MongoDB for VS Code**.
- Copiez le lien de connexion proposé, par exemple :
mongodb+srv://LucasVarsavaux:<db_password>@clusterlucas.sdesg.mongodb.net/

## Clonage du Repository et Configuration de 
Ouvrir votre terminal : 
1. **Cloner le dépôt Git** 
	git clone <lien_git>
2. **Accéder au dossier de l'API** 
	cd api
3. **Basculer sur la branche** Passez à la branche `express-mongodb-atlas-jwt`** 
	git checkout express-mongodb-atlas-jwt
4. **Modifier la configuration** Dans le fichier `config.js`, remplacez les liens de 
	> **Exemple de modèle Mongoose :**
> 
> ```js
>module.exports = {
>  development: {
> type: 'development',
   > port: 3000,
    >mongodb: 'mongodb+srv://LucasVarsavaux:Lucas@clusterlucas.sdesg.mongodb.net/demo'
  >},
  >production: {
   > type: 'production',
    >port: 3000,
   > mongodb: 'mongodb+srv://LucasVarsavaux:Lucas@clusterlucas.sdesg.mongodb.net/demo'
 > }
>}
> ```
_Note :_ Assurez-vous d'utiliser le nom de votre base de données (ici, `demo`).
-Note : _Assurer de bien mettre votre nom de database et mot de passe.

## Démarrage de l'Application

1.  **Installer Node.js et les dépendances**
    
    -   Vérifiez que Node.js est installé (version 16 ou plus) :
		node --version
		Si ce n'est pas le cas, téléchargez-le depuis le [site officiel de Node.js](https://nodejs.org/).
	- Dans le dossier `api`, installez les dépendances :
	 npm install
2. **Lancer le Serveur**
		npm run dev

## Gestion des Erreurs

Lors de l'exécution du serveur, plusieurs erreurs peuvent survenir, par exemple :

-   **Mauvais mot de passe ou informations de connexion erronées :**  
    Si le mot de passe dans la chaîne de connexion est incorrect, vous verrez un message tel que :
    [ERROR] users api dbConnect() -> mongodb error
	Le serveur tentera de se reconnecter automatiquement après 5 secondes.
    
-   **Autres erreurs de connexion :**  
    Les erreurs liées à des problèmes de réseau ou à une IP non autorisée déclencheront des messages similaires et une tentative de reconnexion.

## Différence entre Environnements (Développement vs. Production)

-   **Développement (development)**
    
    -   Utilisé pendant la phase de développement.
    -   Peut inclure des outils de débogage et des configurations moins restrictives.
    -   Ici, les paramètres de connexion sont identiques à la production, mais ils peuvent être adaptés pour un usage local (par exemple, nom de base de données différent).
-   **Production**
    
    -   Utilisé lorsque l'application est déployée pour les utilisateurs finaux.
    -   Inclut généralement des configurations plus sécurisées et optimisées pour la performance.
    -   Il est recommandé d'ajuster les chaînes de connexion et les paramètres sensibles pour correspondre aux exigences de production.

## Dépendances

Ce projet utilise les dépendances principales suivantes :

-   **Express** : Framework web pour Node.js
-   **Mongoose** : Outil de modélisation pour MongoDB
-   **JWT** : Pour la gestion des authentifications
-   **Body-parser, Compression, CORS, Helmet** : Middleware pour le parsing des requêtes, la compression des réponses, la gestion du cross-origin et la sécurité

	
	
## PostMan 

- **Requête Post** : Mettre localhost:3000/user/


