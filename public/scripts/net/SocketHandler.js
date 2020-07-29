class SocketHandler {

    /**
     * Renvoie le joueur qui join la room
     */

    join() {

        socket.on('join',(result,party)=>{
           if(j===undefined) j = new Joueur(result.name,result.word);
           p.joueurs = party.joueurs;
           p.printPlayers();
           p.limit();
           p.start();
        });

    }

    onWord()
    {

        socket.on('word',party=>{
            console.log(party);
            p.joueurs = party.joueurs;
            p.roundFinish().then(result=>{
                j.setWordWithParty(p);
                j.printWord(p);
                p.printWait(result);
                v.vote(p,j);
            });
        });

    }

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

    onVoteCB()
    {

        socket.on('vote_from_player',vote=>{
           let vte = new Vote();
           vte.player = vote.player;
           vte.player_vote = vote.player_vote;
           vte.renderVote();
        });

    }

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

}

