const express = require('express');
const {Joueur} = require('./models/Joueur');
const {Partie} = require('./models/Partie');
const {Dictionnary} = require('./models/Dictionnary');
const {RoomAssociation} = require('./models/RoomAssociation');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let cookieParser = require('cookie-parser')();
let session = require('cookie-session');
let bodyparser = require('body-parser');
let urlEncodedParser = bodyparser.urlencoded({extended:false});
let p = new Partie();
let associative_room_party = new RoomAssociation();
let array_association;
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
    associative_room_party.push("room1",p);
    array_association = associative_room_party.getKeyPartyJoinable();

}).post("/user",urlEncodedParser,(req,res)=>{

    j = new Joueur(req.body.user,"test");
    array_association[1].addPlayer(j);
    associative_room_party.modify(array_association);
    res.redirect("EnderCover");

}).get("/EnderCover",(req,res)=>{

    res.sendFile(__dirname+"/EnderCover.html");
    if(associative_room_party.association[1]!==undefined)
        console.log(associative_room_party.association[1][1]);

});

workspace.use((socket,cb)=>{
    let req = socket.handshake;
    let res = {};
    cookieParser(req,res,(err)=>{
        if(err) throw err;
        sess(req,res,cb);
    });
});

workspace.on('connection',(socket)=>{
    let room = array_association[0];
    let rm = workspace.in(room);
    socket.join(room);
    let d = new Dictionnary(__dirname+'/resources/dictionnary.json');
    socket.handshake.session.player = j;
    socket.handshake.session.room = rm;
    socket.handshake.session.party = array_association[1];
    socket.handshake.session.room.emit('join',j,socket.handshake.session.room);
    socket.on('party_limit',()=>{
        if(!associative_room_party.getLastValue().empty)
            associative_room_party.push("room"+Partie.count_room,new Partie());
        socket.handshake.session.party.resetPoint();
        d.words().then(result=>{
            socket.handshake.session.party.setWords(result);
        });
        socket.handshake.session.room.emit('word',socket.handshake.session.party);
    });
    socket.on('vote',(party)=>{
        socket.handshake.session.party.joueurs = party.joueurs;
        socket.handshake.session.room.emit('party_vote',socket.handshake.session.party);
    });
    socket.on('player_has_vote',(vote)=>{
        socket.handshake.session.room.emit('vote_from_player',vote);
    });
    socket.on('finish',(party)=>{
        socket.handshake.session.party.joueurs = party.joueurs;
        socket.handshake.session.party.winner().then(result=>{
            socket.handshake.session.room.emit('result_party',Array.from(result));
        });
        roundFinish = true;
    });
    socket.on('reset',()=>{
        if(roundFinish) {
            roundFinish = false;
            socket.handshake.session.party.resetPoint();
            d.words().then(result => {
                socket.handshake.session.party.setWords(result);
                socket.handshake.session.room.emit('word', socket.handshake.session.party);
            });
        }
    });
    socket.on('disconnect',()=>{
        if(socket.handshake.session.player !== undefined) {
            console.log(`Client disconnect details : Player => name : ${socket.handshake.session.player.name} score : ${socket.handshake.session.player.score} word : ${socket.handshake.session.player.word}`);
            socket.handshake.session.party.removePlayer(socket.handshake.session.player);
            associative_room_party.modify(array_association);
            socket.handshake.session.room.emit('client_disconnect', socket.handshake.session.player);
        }
    });
});

http.listen(3000,()=>{

    console.log("server running on 3000");

});
