const express = require('express');
const {Joueur} = require('./models/Joueur');
const {Partie} = require('./models/Partie');
const {Dictionnary} = require('./models/Dictionnary');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let cookieParser = require('cookie-parser')();
let session = require('cookie-session');
let bodyparser = require('body-parser');
let urlEncodedParser = bodyparser.urlencoded({extended:false});
let p = new Partie();
let j;
let roundFinish = false;

const workspace = io.of("/EnderCover");
const sess = session({
    keys:['secretEnderCover']
});

app.use(cookieParser);
app.use(sess);

app.use(express.static(__dirname+"/public"));

app.get("/",(req,res)=>{

    res.sendFile(__dirname+'/index.html');

}).post("/user",urlEncodedParser,(req,res)=>{

    j = new Joueur(req.body.user,"test");
    p.addPlayer(j);
    res.redirect("EnderCover");

}).get("/EnderCover",(req,res)=>{

    res.sendFile(__dirname+"/EnderCover.html");

});

workspace.use((socket,cb)=>{
    let req = socket.handshake;
    let res = {};
    cookieParser(req,res,(err)=>{
        if(err) throw err;
        sess(req,res,cb);
    });
});

workspace.on("connection",(socket)=>{
    let d = new Dictionnary(__dirname+'/resources/dictionnary.json');
    socket.handshake.session.player = j;
    workspace.emit('join',j,p);
    socket.on('party_limit',()=>{
        p.resetPoint();
        d.words().then(result=>{
            p.setWords(result);
        });
        workspace.emit('word',p);
    });
    socket.on('vote',(party)=>{
        p.joueurs = party.joueurs;
        workspace.emit('party_vote',p);
    });
    socket.on('player_has_vote',(vote)=>{
        workspace.emit('vote_from_player',vote);
    });
    socket.on('finish',(party)=>{
        p.joueurs = party.joueurs;
        p.winner().then(result=>{
            workspace.emit('result_party',Array.from(result));
        });
        roundFinish = true;
    });
    socket.on('reset',()=>{
        if(roundFinish) {
            roundFinish = false;
            p.resetPoint();
            d.words().then(result => {
                p.setWords(result);
                workspace.emit('word', p);
            });
        }
    });
    socket.on('disconnect',()=>{
        if(socket.handshake.session.player !== undefined) {
            console.log(`Client disconnect details : Player => name : ${socket.handshake.session.player.name} score : ${socket.handshake.session.player.score} word : ${socket.handshake.session.player.word}`);
            p.removePlayer(socket.handshake.session.player);
            workspace.emit('client_disconnect', socket.handshake.session.player);
        }
    });
});

http.listen(3000,()=>{

    console.log("server running on 3000");

});
