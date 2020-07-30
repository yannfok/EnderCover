class Partie{

    constructor() {
        this.joueurs = [];
        this.timer = 0;
        this.timer_wait = null;
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

    addPlayer(player)
    {

        this.playerExists(player).then(result=>{
            if(!result)this.joueurs.push(player);
        });

    }

    printPlayers() {

        let ul = document.querySelector('ul');
        let li = document.querySelectorAll('li');
        for (let i = li.length; i < this.joueurs.length; i++) {
            let node = document.createElement("li");
            let textNode = document.createTextNode(this.joueurs[i].name);
            node.appendChild(textNode);
            ul.appendChild(node);
        }

    }

    eraseEmoji()
    {

        let li = document.querySelectorAll('li');
        li.forEach(element=>{
           element.innerHTML = Vote.removeEmoji(element.textContent);
        });

    }

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

        return await promise;

    }

    limit()
    {

        let span = document.querySelector("#compteur");
        span.innerHTML = this.joueurs.length+"/4";

    }

    start()
    {

        if(this.joueurs.length>=4)
        {
            socket.emit("party_limit");
        }


    }

    async roundFinish()
    {

        let i = 0;
        this.joueurs.forEach((element)=>{
              i+=element.score;
        });

        return i >= 4;

    }

    get timer_Cool_Down()
    {

        return this.timer === 0;

    }

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

    removePlayer(player)
    {

        for(let i = 0;i<this.joueurs.length;i++) {
            if (player.name === this.joueurs[i].name) {
                this.joueurs.splice(i, 1);
                this.removePlayerGraphic(player);
            }
        }
    }

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

    printDisconnect(player) {

        let popup = document.getElementById("popup");
        popup.innerHTML = `${player.name} disconnected from the party`;
        popup.classList.toggle('show');
        popup.addEventListener('webkitAnimationEnd',evt => {popup.classList.remove("show")},false);

    }

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

    removePlayerGraphic(player)
    {

        let li = document.querySelectorAll('li');
        let ul = document.querySelector('ul');
        li.forEach(element=>{
            if(Vote.removeEmoji(element.textContent)===player.name)
                ul.removeChild(element);
        });

    }

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