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
let p = new Partie();
let j;

const workspace = io.of("/EnderCover");

app.use(session({secret:'secretEnderCover'}));

app.use(express.static(__dirname+"/public"));

app.get("/",(req,res)=>{

    res.sendFile(__dirname+'/index.html');

}).post("/user",urlEncodedParser,(req,res)=>{

    //req.session.player = new Joueur(req.body.user,"test");
    j = new Joueur(req.body.user,"test");
    p.addPlayer(j);
    res.redirect("EnderCover");

}).get("/EnderCover",(req,res)=>{

    res.sendFile(__dirname+"/EnderCover.html");

});

workspace.on("connection",(socket)=>{
    let d = new Dictionnary(__dirname+'/resources/dictionnary.json');
    let cookieString = socket.request.headers.cookie;
    let req = {headers:{cookie:cookieString}};
    session({ keys: ['secretEnderCover'] })(req, {}, function(){});
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
    });
});

http.listen(3000,()=>{

    console.log("server running on 3000");

});
