/**
 * Classe qui represente un joueur
 * elle est composé d'un score, d'un nom, d'un mot, et un boolean qui permet de savoir si il est tout seul ou en equipe
 */

class Joueur{


    /**
     * Constructeur qui permet de creer un nouveau joueur
     * @param name nom du joueur
     * @param word mot qui doit lui etre attribué
     */

    constructor(name,word) {

        this.score = 0;
        this.name = name;
        this.word = word;
        this.solo = false;

    }

    /**
     * Methode uniquement graphique
     * Permet d'effacer le mot afficher a l'ecran
     */

    eraseWord()
    {

        document.querySelector("#word").innerHTML = "";

    }

    /**
     * Methode uniquement graphique
     * Permet d'afficher le mot du joueur
     * @param party portie dans laquelle le joueur se trouve
     */

    printWord(party)
    {

        if(party.joueurs.length===4) document.querySelector("#word").innerHTML = "Votre mot est "+this.word;

    }

    /**
     * Permet de remttre a jour le mot grace a l'envoie de la partie depuis le serveur
     * @param party envoyé depuis le serveur
     */

    setWordWithParty(party)
    {

        party.joueurs.forEach((element)=>{
           if(element.name===this.name) this.word = element.word;
        });

    }

}

