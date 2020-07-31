module.exports.RoomAssociation = class RoomAssociation{

    constructor() {
        this.association = [];
    }

    push(k,v)
    {

        if(!this.existsKey(k))
            this.association.push([k,v]);

    }

    getLastValue()
    {

        return this.association[this.association.length-1][1];

    }

    existsKey(key)
    {

        for(let obj of this.association)
            if(obj[0] === key) return true;
        return false

    }

    getIndexByKey(key)
    {

        let i = 0;
        for(let j of this.association) {
            if (j[0] === key) break;
            i++;
        }
        return i;

    }

    modify(array)
    {

        this.association[this.getIndexByKey(array[0])] = [array[0],array[1]];

    }

    getKeyPartyJoinable()
    {

        for(let obj of this.association)
            if(obj[1].numberPlayers()<4)
                return obj;
        return null;
    }

    getLastKey()
    {

        return this.association[this.association.length-1][0];

    }

};