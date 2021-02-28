# EnderCover

## But du projet

Le but de ce projet a été de créer un jeu multijoueur sur le web. (À travers plusieurs PC)

##### But du jeu :
Pour pouvoir lancer le jeu il faut que 4 joueurs se connecte dans une salle. Pour rejoindre une salle on doit entrer son pseudo et l'application redirigera automatiquement vers une salle avec des autres joueurs connectés.

Une fois les 4 joueurs connectés chaque joueur disposera d'un mot au hasard, 3 personnes auront le même mot par exemple avion et la dernière personne appelé l'intrus aura un mot qui ressemble au mot des autres joueurs
par exemple bus (les deux mots entrent dans la catégorie des transports).

Les joueurs devront donc à travers le chat communiquer et trouver l'intrus.

Si on pense avoir trouvé l'intrus il faut voter pour la personne et cliqué sur son pseudo, la personne qui obtiendra le plus de vote sera donc désigné en tant qu'intrus.

Si la personne qui obtient le plus de vote n'est pas l'intrus alors l'intrus gagne, si inversement alors l'intrus perd et les autres joueurs gagnent.


## Lancer le projet en local

Pour pouvoir tester le jeu il faut une machine qui lance le serveur en LAN pour cela il faut cloner le projet et suivre les étapes ci-dessous :

### 1. Avoir les prérequis
- Installer node.js sur sa machine

### 2. Installer les dépendances depuis la source du dépôt
- _A la racine du dépôt_ `npm install`

### 3. Lancer le serveur
- _A la racine du dépôt_  `npm start`

### 4. Lancer le navigateur sur le pc
Ouvrez un navigateur (chrome de preference) et tapez l'URL ```http:\\localhost:80``` et vous pourrez enfin accéder au jeu.

## Infos complémentaires

Ce projet a été fait tout seul en tant que divertissement et en tant qu'amateur, il se peut qu'on puisse rencontrer des bugs. À vous de proposer des améliorations !