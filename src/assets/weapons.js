const { createConnection } = require('mysql');
const util = require('util')
const db = createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "rpg"
});
const query = util.promisify(db.query).bind(db);
module.exports = class weaponsData {
    constructor() {}
    async ShieldDB(){
        // class Combattant
        await query(`INSERT items (items, lvl, damage) VALUES ('shield', '1', 'NULL')`)
    }
    async SwordDB(){
        // class Combattant
        await query(`INSERT items (items, lvl, damage) VALUES ('sword', '1', '10')`)
    }
    async RodDB(){
        // class Sorcier
        await query(`INSERT items (items, lvl, damage) VALUES ('armor', '1', '10')`)
    }

    async weaponsload(){
        this.SwordDB()
        this.ShieldDB()
        this.RodDB()
    } 
}