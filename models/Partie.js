const {Dictionnary} = require('./Dictionnary');

module.exports.Partie = class Partie {

    constructor() {
        this.joueurs = [];
        this.timer = 0;
    }

    resetPoint()
    {

        this.joueurs.forEach(element=>{
           element.score = 0;
        });

    }

    setParty(party)
    {

        this.joueurs = party.joueurs;
        this.timer = party.timer;

    }

    addPlayer(player)
    {

        this.playerExists(player).then(result=>{
            if(!result)this.joueurs.push(player);
        });

    }

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

    async words()
    {

        return new Promise(resolve => {
            let result = [];
            result.push(this.joueurs[0].word);
            this.joueurs.forEach(element=>{
                if(element.word !== result[0])
                    result.push(element.word);
            });
            resolve(result);
        });

    }

    static motEquals(a, b) {

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