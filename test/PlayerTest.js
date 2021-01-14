"use strict";
const assert = require('assert');
const Player = require('../models/Joueur');

let p1 = new Player.Joueur("Yannick","Voiture");

describe('Player', ()=>{
    describe('#get__name()',()=>{
        it('should return the right name (Yannick)',()=>{
            assert.deepStrictEqual(p1.name,"Yannick");
        })
    });
    describe('#get__word()',()=>{
        it('should return the right word (Voiture)', ()=>{
            assert.deepStrictEqual(p1.word,"Voiture");
        });
    });
});