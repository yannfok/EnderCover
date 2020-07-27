const {Dictionnary} = require('./Dictionnary');

module.exports.Partie = class Partie {

    constructor(party) {
        this.joueurs = party.joueurs;
        this.timer = party.timer;
    }

    static setWords(party, words) {

        let partie = new Partie(party);
        let r = Dictionnary.getRndInteger(0, 3);
        partie.joueurs[r].word = words[0];
        partie.joueurs[r].solo = true;
        for (let i = 0; i < partie.joueurs.length; i++) {

            if (i === r) continue;
            partie.joueurs[i].word = words[1];
            partie.joueurs[i].solo = false;

        }

        return partie;

    }

    async winner() {

        let best_player = this.joueurs[0];
        this.joueurs.forEach((element) => {
            if (element.score > best_player.score) best_player = element;
        });

        return await this.state_players(best_player);

    }

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