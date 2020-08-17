/**
 * Classe qui s'occupe du net-code
 * definition de plusieurs methode lors de l'emition d'evenement coté serveur
 * utilisé le constructeur de base
 */

class SocketHandler {

    /**
     * Traite une nouvelle connexion dans la room
     */

    join() {

        socket.on('join',(result,party,room)=>{
           if(j===undefined) j = new Joueur(result.name,result.word);
           p.joueurs = party.joueurs;
           p.printPlayers();
           p.printRoom(room);
           p.limit();
           p.start();
           if(p.joueurs.length<4)
               p.printWaitRoom();
        });

    }

    /**
     * Traite lorsque les joueurs on recu leurs mots
     */

    onWord()
    {

        socket.on('word',party=>{
            p.joueurs = party.joueurs;
            j.sendMessage();
            p.roundFinish().then(result=>{
                j.setWordWithParty(p);
                j.printWord(p);
                p.printWait(result);
                v.vote(p,j);
            });
        });

    }

    /**
     * Traitement des envoi de message coté client
     */

    onMessage()
    {

        socket.on("message_cb",(message,joueur)=>{
            let temp = new Joueur(joueur.name,joueur.word);
            temp.displayMessage(message);
        });

    }

    /**
     * Traitement lors d'un vote
     */

    onVote()
    {

        socket.on('party_vote',(result)=>{
            p.joueurs = result.joueurs;
            p.roundFinish().then(finish=>{
               p.printWait(finish);
               if(finish)socket.emit('finish',p);
            });
        });

    }

    /**
     * Traitement lors du vote d'un joueurs different de soi meme
     */

    onVoteCB()
    {

        socket.on('vote_from_player',vote=>{
           let vte = new Vote();
           vte.player = vote.player;
           vte.player_vote = vote.player_vote;
           vte.renderVote();
        });

    }

    /**
     * Traitement lors de la fin d'une partie
     */

    onFinish()
    {

        socket.on('result_party',(result)=>{
            let map = new Map(result);
            p.printResult(map);
            setTimeout(()=>{
                p.reset();
            },5000);
        })

    }

    /**
     * Traitement lorsque quelqu'un quitte la partie
     */

    onQuit()
    {

        socket.on('client_disconnect',(player)=>{
            if(p.timer_wait!==null)clearInterval(p.timer_wait);
            p.timer_wait = null;
            p.printDisconnect(player);
            p.removePlayer(player);
            p.playerQuit();
        });

    }

}

