//Fichier contenant le traitement côté serveur
//Contient une partie socket qui permet la communication en temps réel de l'application
const port = process.env.PORT || 80;
let baseHost = process.env.WEBSITE_HOSTNAME || 'localhost';
//Chargement des dépendances NPM et chargement des classes côté serveur de l'application
const express = require('express');
const {Joueur} = require('./models/Joueur');
const {Partie} = require('./models/Partie');
const {Dictionnary} = require('./models/Dictionnary');
const {RoomHandler} = require("./models/config/RoomHandler");
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let cookieParser = require('cookie-parser')();
let session = require('cookie-session');
let bodyparser = require('body-parser');
let urlEncodedParser = bodyparser.urlencoded({extended:false});

//Déclaration de certaines variables globales permettant la configuration du serveur
let p = new Partie();
let room = "room";
let j;
let rh = new RoomHandler();
rh.push(room,p);

//Constante qui permet au socket de definir le chemin ou il doit agir
const workspace = io.of("/EnderCover");

//Définition d'une constante qui est utile aux objets sessions
const sess = session({
    keys:['secretEnderCover']
});

//Utilisation des fichiers statiques pour l'application
app.use(cookieParser);
app.use(sess);
app.use(express.static(__dirname+"/public"));

//Définition du comportement de l'application quand l'utilisateur effectue un get ou un post
//TODO DEFINIR LES CHEMINS INACESSIBLES ET ENVOYER UN CODE 404
app.get("/",(req,res)=>{

    res.sendFile(__dirname+'/index.html');

}).post("/user",urlEncodedParser,(req,res)=>{

    j = new Joueur(req.body.user,"test");
    if(rh.party!==null)
        rh.party[1].addPlayer(j);
    else {
        rh.push("room", new Partie());
        rh.party[1].addPlayer(j);
    }
    res.redirect("EnderCover");

}).get("/EnderCover",(req,res)=>{

    res.sendFile(__dirname+"/EnderCover.html");

});

//définition des objets sessions lors de l'utilisation des sockets
io.of("/EnderCover").use((socket,cb)=>{
    let req = socket.handshake;
    let res = {};
    cookieParser(req,res,(err)=>{
        if(err) throw err;
        sess(req,res,cb);
    });
});

//Partie communication en temps réel avec les sockets communiquants avec la partie client js
//TODO Définir une classe contenant la partie socket donc communication en temps réel pour avoir un code plus clair
workspace.on("connection",(socket)=>{
    let d = new Dictionnary(__dirname+'/resources/dictionnary.json');
    socket.join(rh.getAssociationByPlayer(j)[0]);//Rejoins la room et communique avec uniquement cette room
    //Définition des variables de session
    socket.handshake.session.player = j;
    socket.handshake.session.room = rh.getAssociationByPlayer(j)[0];
    socket.handshake.session.p = rh.getAssociationByPlayer(j)[1];
    socket.handshake.session.finish = rh.getAssociationByPlayer(j)[2];

    //Ecouteur d'evenement socket et traitement des evenements
    workspace.to(socket.handshake.session.room).emit('join',j, socket.handshake.session.p,socket.handshake.session.room);
    socket.on('party_limit',()=>{
        socket.handshake.session.p.resetPoint();
        d.words().then(result=>{
            socket.handshake.session.p.setWords(result);
        });
        workspace.to(socket.handshake.session.room).emit('word',socket.handshake.session.p);
    });
    socket.on('vote',(party)=>{
        socket.handshake.session.p.joueurs = party.joueurs;
        workspace.to(socket.handshake.session.room).emit('party_vote',socket.handshake.session.p);
    });
    socket.on('player_has_vote',(vote)=>{
        workspace.to(socket.handshake.session.room).emit('vote_from_player',vote);
    });
    socket.on("message",(message,joueur)=>{
        workspace.to(socket.handshake.session.room).emit("message_cb",message,joueur);
    });
    socket.on('finish',(party)=>{
        socket.handshake.session.p.joueurs = party.joueurs;
        socket.handshake.session.p.winner().then(result=>{
            workspace.to(socket.handshake.session.room).emit('result_party',Array.from(result));
        });
        socket.handshake.session.finish = true;
    });
    socket.on('reset',()=>{
        if(socket.handshake.session.finish) {
            socket.handshake.session.finish = false;
            socket.handshake.session.p.resetPoint();
            d.words().then(result => {
                socket.handshake.session.p.setWords(result);
                workspace.to(socket.handshake.session.room).emit('word', socket.handshake.session.p);
            });
        }
    });
    socket.on('disconnect',()=>{
        if(socket.handshake.session.player !== undefined) {
            console.log(`Client disconnect details : Player => name : ${socket.handshake.session.player.name} score : ${socket.handshake.session.player.score} word : ${socket.handshake.session.player.word}`);
            socket.handshake.session.p.removePlayer(socket.handshake.session.player);
            workspace.to(socket.handshake.session.room).emit('client_disconnect', socket.handshake.session.player);
        }
    });
});

//Configuration de l'écoute du serveur sur le port 3000
http.listen(port,()=>{

    console.log("server running on 3000");

});
