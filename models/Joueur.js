let pool = require('./config/db');
const Partie = require('./Partie');

/**
 * Classe qui represente un joueur coté serveur ne contient aucune methode
 * pour l'instant mais permet la creation de la classe partie qui est composé
 * de plusieurs joueurs (tableau de joueurs)
 */

module.exports.Joueur = class Joueur {

    /**
     * Constructeur de la classe joueur
     * @param name nom du joueur
     * @param word mot qui lui est associé
     */

    constructor(name, word) {

        this.score = 0;
        this.name = name;
        this.word = word;
        this.solo = false;

    }

};

