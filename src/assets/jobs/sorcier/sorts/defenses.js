const Sortileges = require('../sorts')
const { createConnection } = require('mysql');
const util = require('util')
const db = createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "rpg"
});
const query = util.promisify(db.query).bind(db);
module.exports = class Defense extends Sortileges{
    constructor(name, defaut){
        super(name);
        this.name = name;
        this.protection = defaut;
    }
    /**
     * @class
     * Sortilèges de défense
     */

    /**
     * @function lancement
     * @id - ID de l'utilisateur utilisant le sortilège
     */  
    async lancement(id) {
        let idHealth = (await query(`SELECT HP FROM hp WHERE ID = ${id}`))[0].HP;
        await query (`UPDATE hp SET HP = '${parseInt(idHealth) + parseInt(this.protection)}' WHERE ID = '${id}'`)
    }
}