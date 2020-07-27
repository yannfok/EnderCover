class SocketHandler {

    player_vote() {

        socket.on('player_vote', (party) => {
            p.joueurs = party.joueurs;
            p.timer = party.timer;
            p.roundFinish().then(async (result) => {
                await p.printWait(result);
                if (result)
                    socket.emit("round_finish", p);
            });
        });

    }

    word() {

        socket.on('word', (party) => {
            p.joueurs = party.joueurs;
            j.setWordWithParty(p);
            j.printWord(p);
            p.roundFinish().then(result => p.printWait(result));
            v.vote(p, j);
        });

    }

    playerR() {

        socket.on('playerR', (player) => {
            p.maximum();
            j = new Joueur(player.name, player.word);
            p.addPlayer(player);
            p.printPlayers();
            p.limit();
        });

    }

    join() {

        socket.on('join', (player) => {
            p.maximum();
            p.addPlayer(player);
            p.printPlayers();
            p.limit();
        });

    }

    playerVoteScreen() {

        socket.on('player_vote_screen', (result) => {
            let v = new Vote();
            v.player = result.player;
            v.player_vote = result.player_vote;
            v.renderVote();
        });

    }

    endRound()
    {

        socket.on('winner_loser',(tab)=>{
           let result = new Map(tab);
           p.printResult(result);
           setTimeout(()=>{
               p.reset();
           },5000);
        });

    }

}

