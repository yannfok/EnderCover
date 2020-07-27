const fs = require('fs');

module.exports.Dictionnary = class Dictionnary{

    constructor(url) {

        this.fileToRead = url;

    }

    async readJSON()
    {
        return new Promise((resolve, reject) => {
           fs.readFile(this.fileToRead,(err, data) => {
               if(err)throw err;
               resolve(data);
           });
        });
    }

    static getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    async testWord(data)
    {

        return new Promise((resolve, reject) => {
           resolve(JSON.parse(data));
        });

    }

    async words()
    {

        let data = await this.readJSON();
        data = JSON.parse(data).dictionnaire;
        let r1 = Dictionnary.getRndInteger(0,data.length-1);
        let category = await data[r1];
        let r2 = Dictionnary.getRndInteger(0,category.length-1);
        let r3 = Dictionnary.getRndInteger(0,category.length-1);
        while(r2===r3)r3 = Dictionnary.getRndInteger(0,category.length-1);
        return [category[r2], category[r3]];
    }

};