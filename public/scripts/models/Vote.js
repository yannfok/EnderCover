const emoji = ["&#127877;","&#127947;","&#128110;","&#129332;"];//constante -> code html des emojis lors de vote
/**
 * Classe qui represente un vote
 * Permet de mettre le joueur qui vote et le joueur qui a été voté par ce dernier
 * et ajoute un cooldown pour le timer de vote
 */
class Vote{

    /**
     * Permet de construire un nouveau vote
     */
    constructor() {

        this.coolDown = true;
        this.player = "";
        this.player_vote = "";

    }

    /**
     * Permet de lancer le vote et donc de l'envoyer vers le serveur pour ensuite le traiter
     * @param party la partie concerné par le vote
     * @param player le joueur qui vote
     */

    vote(party,player)
    {

        let players_li = document.querySelectorAll("li");
        players_li.forEach((element)=>{
           element.addEventListener('click',()=>{
               if(this.coolDown){
                   if(player.name !== Vote.removeEmoji(element.textContent)) {
                       party.joueurs.forEach((player) => {
                           if (player.name === Vote.removeEmoji(element.textContent))
                               player.score++;
                       });
                       socket.emit('vote', party);
                       party.indexOf(player).then((result)=>{
                           let re = new Vote();
                           re.player = Vote.getEmojiDec(result);
                           re.player_vote = element.textContent;
                           socket.emit('player_has_vote',re);
                       });
                       this.coolDown = false;
                   }
               }
           });
        });
    }

    /**
     * Methode statique qui permet d'obtenir l'emoji du joueur en fonction de son index dans la partie
     * @param index index dans la partie du joueur
     * @returns {string} retourne le code de l'emoji pour permettre de l'afficher dans une balise html
     */
    static getEmojiDec(index) {
        return emoji[index];
    }

    /**
     * Methode graphique qui permet d'afficher le vote du joueur
     */

    renderVote()
    {

        let li = document.querySelectorAll('li');
        const promise = new Promise((resolve) => {
            li.forEach((element) => {
                if (element.textContent === this.player_vote) resolve(element);
            });
        });

        promise.then((result)=>{
            result.innerHTML = result.textContent + this.player;
        });

    }

    /**
     * Methode statique qui permet de purger d'une chaine de caractere les emojis des joueurs
     * @param string la chaine de caractere qui doit etre purgée
     * @returns {string} chaine purgée
     */

    static removeEmoji(string)
    {

        return string.replace("🤴","").replace("🎅","").replace("👮","").replace("🏋","");

    }

}