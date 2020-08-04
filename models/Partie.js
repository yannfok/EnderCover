const {Dictionnary} = require('./Dictionnary');

/**
 * Classe partie  qui represente une partie coté serveur
 * elle est en fait composé d'un tableau de joueurs
 */

module.exports.Partie = class Partie {

    static count_room = 0;//Attribut statique qui represente le nombre de room existant

    /**
     * Constructeur de la classe Partie
     */

    constructor() {
        this.joueurs = [];
        this.timer = 0;
        this.id_room = Partie.count_room;
    }

    /**
     * Permet de remettre les points des joueurs de toute la partie a 0
     */

    resetPoint()
    {

        this.joueurs.forEach(element=>{
           element.score = 0;
        });

    }

    /**
     * Permet de mettre a jour la party grace au coté client
     * @param party JSON Envoyé grace au client
     * NB : Ne pas trop utilisé il est plus viable de regler soit meme les attributs de la classe grace au json
     * sachant que les visibilités n'existe pas en js
     */

    setParty(party)
    {

        this.joueurs = party.joueurs;
        this.timer = party.timer;

    }

    /**
     * Permet de retourner le nombre de joueurs dans la partie
     * @returns {number}
     */

    numberPlayers()
    {

        return this.joueurs.length;

    }

    /**
     * Permet de savoir si la partie est vide
     * @returns {boolean} true si vide et false si contient au moins un joueur
     */

    get empty()
    {

        return this.numberPlayers() === 0;

    }

    /**
     * Permet d'ajouter un joueur dans la partie
     * @param player joueur a rajouter dans la partie
     */

    addPlayer(player)
    {

        this.playerExists(player).then(result=>{
            if(!result)this.joueurs.push(player);
        });

    }

    /**
     * Methode asynchrone qui permet de savoir si un joueur exist dans la partie
     * @param player joueur a testé
     * @returns {Promise<boolean>} false si existe pas et true si existe
     */

    async playerExists(player)
    {

        return new Promise(resolve => {
            let result = false;
            this.joueurs.forEach(element=>{
                if(element.name === player.name) result = true;
            });
            resolve(result);
        });

    }

    /**
     * Permet de mettre les mots des joueurs
     * @param words le tableau de mots depuis le dictionnaire (cf la classe Dictionnary)
     */

    setWords(words) {

        let r = Dictionnary.getRndInteger(0, 3);
        this.joueurs[r].word = words[0];
        this.joueurs[r].solo = true;
        for (let i = 0; i < this.joueurs.length; i++) {

            if (i === r) continue;
            this.joueurs[i].word = words[1];
            this.joueurs[i].solo = false;

        }

    }

    /**
     * Methode asynchrone qui permet d'obtenir les mots de la partie
     * @returns {Promise<array>} promesse avec le tableau de mots
     */

    async words()
    {

        return new Promise(resolve => {
            let result = [];
            result.push(this.joueurs[0].word);
            for(let j of this.joueurs){
                if(j.word !== result[0])
                    result.push(j.word);
                if(result.length===2) break;
            }
            resolve(result);
        });

    }

    /**
     * Methode statique qui permet de savoir si le tableau de mots est le meme que celui passé en parametre
     * @param a premier mot
     * @param b deuxieme mot
     * @returns {boolean|boolean} true si egal et false si non egal l'odre n'est pas pris en compte
     */

    static motEquals(a, b) {

        return (a[0]===b[0] || a[0] === b[1]) && (a[1] === b[0] || a[1] === b[1]);

    }

    /**
     * Methode asynchrone qui donne les gagnants du round de la partie
     * @returns {Promise<Map<any, any>>} promesse contenant un map avec le ou les gagnants et le ou les perdants
     */

    async winner() {

        let best_player = this.joueurs[0];
        this.joueurs.forEach((element) => {
            if (element.score > best_player.score) best_player = element;
        });

        return await this.state_players(best_player);

    }

    /**
     * Methode qui permet de supprimer un joueur de la partie
     * @param player joueur qui doit etre supprimer
     */

    removePlayer(player)
    {

        for(let i = 0;i<this.joueurs.length;i++)
            if(player.name === this.joueurs[i].name)
                this.joueurs.splice(i,1);

    }

    /**
     * Methode asynchrone qui permet de creer la map des gagnants
     * @param player joueur qui a le plus grand nombre de votes
     * @returns {Promise<Map<any, any>>} promesse qui contient le map
     */

    async state_players(player) {

        let result = new Map();
        result.set("winner",[]);
        result.set("loser",[]);
        if(player.solo) {
            result.get("loser").push(player);
            this.joueurs.forEach((element)=>{
               if(!element.solo)result.get("winner").push(element);
            });
        }else{
            this.joueurs.forEach((element)=>{
               if(!element.solo) result.get("loser").push(element);
               else result.get("winner").push(element);
            });
        }

        return result;
    }

};