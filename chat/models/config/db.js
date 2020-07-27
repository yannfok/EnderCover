const sql = require('mysql');
let pool = sql.createPool({
    connectionLimit:10,
    host:"81.16.28.1",
    user:"u240633766_yannfokkkk",
    password:"Jacquiemichel159",
    database:"u240633766_EnderCover"
});

module.exports = pool;
