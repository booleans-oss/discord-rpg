const { createConnection } = require('mysql');
const util = require('util')
const db = createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "rpg"
});
const query = util.promisify(db.query).bind(db);
module.exports = class estheticsData {
    constructor() {}
    async Tunic(){
        // class Sorcier
        await query(`INSERT items (items, lvl, damage) VALUES ('tunic', '1', 'NULL')`)
    }

    async SorcererHat(){
        // class Sorcier
        await query(`INSERT items (items, lvl, damage) VALUES ('sorcererhat', '1', 'NULL')`)
    }
    
    async ArmorDB(){
        // class Combattant
        await query(`INSERT items (items, lvl, damage) VALUES ('armor', '1', 'NULL')`)
    }

    async estheticsload(){
        this.Tunic()
        this.SorcererHat()
        this.ArmorDB()
    } 
}