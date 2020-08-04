const {Partie} = require('../Partie');

/**
 * Classe qui represente la gestion des rooms (tableau de tableau qui permet de faire une association bidirectionnel cf BiMap ex Java)
 * une room est associé a une partie et a un boolean
 */

module.exports.RoomHandler = class RoomHandler{

    /**
     * Constructeur vide qui permet de creer une nouvelle gestion des rooms
     */

    constructor() {
        this.association = [];
    }

    /**
     * Ajoutez dans la pile de room une nouvelle room
     * @param k la room a ajouter autrement dit k pour key
     * @param v la partie associé a la room autrement dit v pour value
     * NB : La troisieme association est un boolean qui permet de mettre un cooldown lors de l'envoie la partie lors du reset du round permet d'envoyé uniquement
     * une fois la partie aux sockets au lieu de l'envoyé x fois aux sockets
     */

    push(k,v)
    {

        if(!this.existsKey(k)) {

            Partie.count_room++;
            this.association.push([k+Partie.count_room, v, false]);

        }
    }

    /**
     * Permet de savoir si la room existe
     * @param key = clé donc la room
     * @returns {boolean} retourne un boolean true si existe et false si existe pas
     */

    existsKey(key)
    {

        for(let obj of this.association)
            if(obj[0] === key) return true;
        return false

    }

    /***
     * Retourne l'index de l'association a partir d'une clé
     * @param key la clé (cf la room)
     * @returns {number} index de l'association
     */

    getIndexByKey(key)
    {

        let i = 0;
        for(let j of this.association) {
            if (j[0] === key) break;
            i++;
        }
        return i;

    }

    /**
     * Methode qui permet de retourner l'association pour le joueur
     * cad sa room associé a sa partie et le boolean
     * @returns {null|array} null si non trouvé
     * NB : Lors de retour de null cela veut dire qu'il faut certainement créer une nouvelle association
     */

    get party()
    {

        for(let obj of this.association)
            if(obj[1].numberPlayers()<4)
                return obj;
        return null;
    }

    /**
     * Permet d'obtenir l'association qui correspond au joueur
     * @param player joueur qui veut obtenir son association1
     * @returns {null|array} null si non trouvé
     */

    getAssociationByPlayer(player)
    {

        for(let i of this.association)
        {

           for(let j of i[1].joueurs)
           {
               if(player.name === j.name)
                   return i;
           }

        }

        return null;

    }

};