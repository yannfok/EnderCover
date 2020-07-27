class Partie{

    constructor() {
        this.joueurs = [];
        this.timer = 0;
    }

    addPlayer(player)
    {

        this.joueurs.push(player);

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
        if(this.joueurs.length>=4)
        {
            socket.emit("party_limit",this);
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
            this.timer = setInterval(() => {
                let phrase = "Les joueurs sont en train de voter";
                let load = "...";
                input.innerHTML = phrase + load.substr(0, i);
                i++;
                if (i === 4) i = 0;
            }, 1000);
        }
        if(finish) {
            clearInterval(this.timer);
            input.innerHTML = "";
            this.timer = 0;
            console.log(this);
        }
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

    maximum()
    {

        //TODO UTILISER LES URLS

    }

    reset()
    {

        this.joueurs.forEach((element)=>{
            element.word="";
            element.score=0;
        });
        v.coolDown = true;
        let elements = document.querySelectorAll("li");
        let i = 0;
        elements.forEach((element)=>{
           element.innerHTML = this.joueurs[i].name;
           i++;
        });
        socket.emit("party_limit",this);

    }

}