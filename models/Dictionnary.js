const fs = require('fs');

/**
 * Classe qui represente le dictionnaire
 * Elle va en fait permetre de lire dans un fichier
 * qui regroupe plusieurs mots de meme categorie
 * (voir dans resources/dictionnary.json)
 */

module.exports.Dictionnary = class Dictionnary{

    /**
     * Permet de construire un dictionnaire
     * @param url fichier dont lequel on veut charger le dictionnaire
     * attribution de l'url a son attribut this.fileToRead
     */

    constructor(url) {

        this.fileToRead = url;

    }

    /**
     * Methode asynchrone qui va permettre de lire le fichier asynchrone donc l'utilisation d'un callback pour traiter le fichier
     * @returns {Promise<string>} retourne une promesse qui contient un string qui est le contenu du fichier json
     */

    async readJSON()
    {
        return new Promise((resolve, reject) => {
           fs.readFile(this.fileToRead,(err, data) => {
               if(err)throw err;
               resolve(data);
           });
        });
    }

    /**
     * Permet d'obtenir un entier aleatoire
     * @param min borne min incluse
     * @param max borne max incluse
     * @returns {int} random
     */

    static getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    /**
     * Methode asyncrhone qui permet d'obtenir deux mots differents de la meme categorie
     * @returns {Promise<array>} retourne une promesse contenant un tableau avec les deux mots differents
     */

    async words()
    {

        let data = await this.readJSON();
        data = JSON.parse(data).dictionnaire;
        let r1 = Dictionnary.getRndInteger(0,data.length-1);
        let category = await data[r1];
        let r2 = Dictionnary.getRndInteger(0,category.length-1);
        let r3 = Dictionnary.getRndInteger(0,category.length-1);
        while(r2===r3)r3 = Dictionnary.getRndInteger(0,category.length-1);
        return [category[r2], category[r3]];
    }

};