/**
 * Classe qui represente une partie
 * Elle est composée d'un tableau de 4 joueurs
 * d'un timer qui va afficher l'attente
 * et d'un timer qui va afficher l'attente des votes
 */

class Partie{

    /**
     * Constructeur basique sans parametre qui permet de creer une nouvelle partie
     */

    constructor() {
        this.joueurs = [];
        this.timer = 0;
        this.timer_wait = null;
    }

    /**
     * Methode asynchrone qui permet de savoir si un joueur dans la partie existe
     * @param player joueur concerné
     * @returns {Promise<boolean>} retourne une promesse contenant un boolean si oui le player existe
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
     * Permet d'ajouter un joueur dans la partie
     * @param player Joueur a ajouter dans la partie
     */

    addPlayer(player)
    {

        this.playerExists(player).then(result=>{
            if(!result)this.joueurs.push(player);
        });

    }

    /**
     * Methode uniquement graphique
     * Permet d'afficher les joueurs dans la partie
     */

    printPlayers() {

        let ul = document.querySelector('ul');
        let li = document.querySelectorAll('li');
        for (let i = li.length; i < this.joueurs.length; i++) {
            let nodeBubble = document.createElement("div");
            nodeBubble.classList.add("speech-bubble");
            nodeBubble.classList.add("start");
            nodeBubble.id = this.joueurs[i].name;
            let node = document.createElement("li");
            let textNode = document.createTextNode(this.joueurs[i].name);
            node.appendChild(textNode);
            ul.appendChild(nodeBubble);
            ul.appendChild(node);
        }

    }

    /**
     * Methode uniquement graphique
     * Permet d'effacer les emojis de vote sur les joueurs
     */

    eraseEmoji()
    {

        let li = document.querySelectorAll('li');
        li.forEach(element=>{
           element.innerHTML = Vote.removeEmoji(element.textContent);
        });

    }

    /**
     * Methode asynchrone qui permet d'avoir l'index d'un joueur dans la partie
     * @param player joueur concerné
     * @returns {Promise<int>} retourne une promesse qui contient l'entier qui correspond a l'index du joueur dans la partie
     */

    async indexOf(player)
    {

        const promise = new Promise((resolve) => {
            let i=0;
            this.joueurs.forEach((element)=>{
                if(player.name === element.name)
                    resolve(i);
                i++;
            });
        });

        return await promise;//Permet d'attendre la constante future promise

    }

    /**
     * Methode uniquement graphique
     * permet d'afficher un compteur de joueurs présent dans la partie
     */

    limit()
    {

        let span = document.querySelector("#compteur");
        span.innerHTML = this.joueurs.length+"/4";

    }

    /**
     * Methode qui envoie juste un event socket au serveur pour lancer la partie lorsqu'elle est pleine
     */

    start()
    {

        if(this.joueurs.length>=4)
        {
            socket.emit("party_limit");
        }


    }

    /**
     * Methode asynchrone qui permet de savoir si le tour de partie est finie
     * @returns {Promise<boolean>} retourne une promesse qui est un boolean qui est true si la partie est finie et false si elle est pas finie
     */

    async roundFinish()
    {

        let i = 0;
        this.joueurs.forEach((element)=>{
              i+=element.score;
        });

        return i >= 4;

    }

    /**
     * Permet de savoir si le timer est définie
     * @returns {boolean} retourne true si le timer est non définie et false si il est definie
     */

    get timer_Cool_Down()
    {

        return this.timer === 0;

    }

    /**
     * Methode qui permet d'afficher l'attente
     * @param finish boolean partie finie ou pas
     */

    printWait(finish) {

        let i = 0;
        let input = document.querySelector("#wait");
        if(this.timer_Cool_Down) {
            if(this.timer_wait!==null){
                clearInterval(this.timer_wait);
                this.timer_wait = null;
            }
            this.timer = setInterval(() => {
                let phrase = "Les joueurs sont en train de voter ";
                let load = "...";
                input.innerHTML = phrase + load.substr(0, i);
                i++;
                if (i === 4) i = 0;
            }, 1000);
        }
        if(finish) {
            clearInterval(this.timer);
            clearInterval(this.timer_wait);
            input.innerHTML = "";
            this.timer = 0;
        }
    }

    /**
     * Permet de supprimer un joueur de la partie notamment lors de la deconnexion de celui ci
     * @param player joueur qui doit etre supprimé
     */

    removePlayer(player)
    {

        for(let i = 0;i<this.joueurs.length;i++) {
            if (player.name === this.joueurs[i].name) {
                this.joueurs.splice(i, 1);
                this.removePlayerGraphic(player);
            }
        }
    }

    /**
     * Afficher le timer sur l'attente des joueurs
     */

    printWaitRoom()
    {

        let i = 0;
        let input = document.querySelector("#wait");
        if(this.timer_wait===null) {
            this.timer_wait = setInterval(() => {
                let phrase = "En attente de joueurs ";
                let load = "...";
                input.innerHTML = phrase + load.substr(0, i);
                i++;
                if (i === 4) i = 0;
            }, 1000);
        }
    }

    /**
     * Methode qui permet de traiter la deconnexion d'une joueur
     */

    playerQuit(){

        if(!this.timer_Cool_Down) clearInterval(this.timer);
        this.printPlayers();
        this.limit();
        this.printWaitRoom();
        this.eraseEmoji();
        j.eraseWord();
        this.timer = 0;
        v.coolDown = true;

    }

    /**
     * Methode uniquement graphique
     * Affiche en haut a droite la room a laquelle est connecté l'utilisateur
     * @param room a laquelle est connecté l'utilisateur
     */

    printRoom(room)
    {

        document.querySelector("#room").innerHTML = "room_id : " + room;

    }

    /**
     * Methode uniquement graphique
     * affiche un popup pour les autres utilisateurs de la deconnexion des autres utilisateurs
     * @param player joueur qui a deconnecté
     */

    printDisconnect(player) {

        let alert_msg = document.querySelector(".alert");
        alert_msg.style.display = "block";
        document.querySelector('.msg').innerHTML = `${player.name} disconnected from the party`;
        alert_msg.classList.add("show");
        alert_msg.classList.remove("hide");
        alert_msg.classList.add("showAlert");
        setTimeout(()=>{
            alert_msg.classList.remove("show");
            alert_msg.classList.add("hide");
            alert_msg.addEventListener("webkitAnimationEnd",displayAlertNone);
        },5000);

        function displayAlertNone()
        {

            alert_msg.style.display = "none";
            alert_msg.removeEventListener("webkitAnimationEnd",displayAlertNone);

        }

    }

    /**
     * Methode uniquement graphique
     * permet d'afficher le resultat de la partie
     * @param map envoyé par le serveur qui est composée des gagnants et des perdants
     */

    printResult(map)
    {

        document.querySelector("#word").innerHTML = "";
        let input = document.querySelector("#wait");
        if(map.get("winner").length===1)input.innerHTML = "Le gagnant de ce tour est "+map.get("winner")[0].name;
        else {
            input.innerHTML = "Les gagnants de ce tour sont ";
            map.get("winner").forEach((value) => {
                input.innerHTML = input.textContent+value.name+" ";
            });
        }
    }

    /**
     * Methode uniquement graphique
     * permet d'effacer le joueur de la partie
     * @param player joueur qui doit etre supprimé
     */

    removePlayerGraphic(player)
    {

        let li = document.querySelectorAll('li');
        let ul = document.querySelector('ul');
        for(let i of ul.children)
        {

            if(i.id === player.name)
                ul.removeChild(i);

        }
        li.forEach(element=>{
            if(Vote.removeEmoji(element.textContent)===player.name)
                ul.removeChild(element);
        });

    }

    /**
     * Methode qui permet de reset le round
     */

    reset()
    {

        this.joueurs.forEach((element)=>{
            element.score=0;
        });
        v.coolDown = true;
        let elements = document.querySelectorAll("li");
        let i = 0;
        elements.forEach((element)=>{
           element.innerHTML = this.joueurs[i].name;
           i++;
        });
        socket.emit("reset");

    }

}