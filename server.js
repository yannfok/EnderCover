const express = require('express');
const {Joueur} = require('./models/Joueur');
const {Partie} = require('./models/Partie');
const {Dictionnary} = require('./models/Dictionnary');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let session = require('cookie-session');
let bodyparser = require('body-parser');
let urlEncodedParser = bodyparser.urlencoded({extended:false});

app.use(session({secret:'secretEnderCover'}));

app.use(express.static(__dirname+"/public"));

app.get("/",(req,res)=>{

    res.sendFile(__dirname+'/index.html');

}).post("/user",urlEncodedParser,(req,res)=>{

    req.session.player = new Joueur(req.body.user,"test");
    res.redirect("EnderCover");

}).get("/EnderCover",(req,res)=>{

    res.sendFile(__dirname+"/EnderCover.html");
    io.sockets.emit('join',req.session.player);
    io.on("connect",(socket)=>{
        socket.emit('playerR',req.session.player);
    });
    let d = new Dictionnary(__dirname+'/resources/dictionnary.json');
    io.sockets.on('connection',(socket)=>{
        socket.on('party_limit',async (resolve)=>{
            req.session.party = await Partie.setWords(resolve,await d.words());
            io.sockets.emit('word',req.session.party);
        });
        socket.on('vote',(resolve)=>{
           req.session.party = new Partie(resolve);
           console.log(req.session.party);
           io.sockets.emit('player_vote',req.session.party);
        });
        socket.on('player_has_vote',(res)=>{
            io.sockets.emit('player_vote_screen',res);
        });
        socket.on('round_finish',(res)=>{
           req.session.party = new Partie(res);
           req.session.party.winner().then(result=>socket.emit("winner_loser",Array.from(result)));
        });
    });
});

http.listen(3000,()=>{

   console.log("server running on 3000");

});
