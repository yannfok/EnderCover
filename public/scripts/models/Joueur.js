class Joueur{

    constructor(name,word) {

        this.score = 0;
        this.name = name;
        this.word = word;
        this.solo = false;

    }

    eraseWord()
    {

        document.querySelector("#word").innerHTML = "";

    }

    printWord(party)
    {

        if(party.joueurs.length===4) document.querySelector("#word").innerHTML = "Votre mot est "+this.word;

    }

    setWordWithParty(party)
    {

        party.joueurs.forEach((element)=>{
           if(element.name===this.name) this.word = element.word;
        });

    }

}

