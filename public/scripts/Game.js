//Fichier contenant les differentes constantes et variables du code
//et aux appels de methodes pour la communication en temps réel
const socket = io(window.location.href);
let j;
let p = new Partie();
let v = new Vote();
let sh = new SocketHandler();
sh.join();
sh.onWord();
sh.onVote();
sh.onVoteCB();
sh.onFinish();
sh.onQuit();
sh.onMessage();