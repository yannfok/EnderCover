//A UTILISER PLUS TARD SI BESOIN D'ENREGISTRER DONNEES DANS BD

const sql = require('mysql');

//Création d'un pool vers la bd mysql
let pool = sql.createPool({
    connectionLimit:10,
    host:"81.16.28.1",
    user:"u240633766_yannfokkkk",
    password:"Jacquiemichel159",
    database:"u240633766_EnderCover"
});

//exportation du pool de la bd
module.exports = pool;
