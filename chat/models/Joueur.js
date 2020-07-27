let pool = require('./config/db');
const Partie = require('./Partie');

module.exports.Joueur = class Joueur {

    constructor(name, word) {

        this.score = 0;
        this.name = name;
        this.word = word;
        this.solo = false;

    }
/*
    insert()
    {

        pool.getConnection((err,connection)=>{
            connection.query('INSERT INTO Joueur(name,score,word) VALUES(?,?,?)',[this.name,this.score,this.word],(err,result)=>{
                connection.release();
                if(err) throw err;

            });
        });

    }

    joinOrCreate()
    {
        pool.getConnection((err,connection)=>{
            connection.query('SELECT * FROM Partie WHERE num_players!=4',(err,result)=>{
                connection.release();
                if(err) throw err;
                if(result.length===0) this.create();
                else this.join();
            });
        });
    }

    join()
    {

        this.getIdParty((result)=>{
            pool.getConnection((err,connection)=>{
                connection.query('UPDATE Partie SET num_players=num_players+1 WHERE id=?',[result[0].id],(err,res)=>{
                    if(err) throw err;
                });
            });
            pool.getConnection((err,connection)=>{
                connection.query('INSERT INTO Partie_Joueur(id_partie,joueur) VALUES(?,?)',[result[0].id,this.name],(err,res)=>{
                    if(err)throw err;
                });
            });
        });

    }

    create()
    {

        pool.getConnection((err,connection)=>{
            connection.query('INSERT INTO Partie VALUES()',(err,result)=>{
               if(err) throw err;
            });
        });
        this.join();

    }

    getIdParty(cb)
    {

        pool.getConnection((err,connection)=>{
            connection.query('SELECT id FROM Partie WHERE num_players!=4',(err,result)=>{
                if(err) throw err;
                cb(result);
            });
        });

    }
    */

};

