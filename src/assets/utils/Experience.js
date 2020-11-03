const { createConnection } = require('mysql');
const util = require('util')
const db = createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "rpg"
});
const query = util.promisify(db.query).bind(db);
module.exports = class Experience {
    constructor() {}

    async addExperience(id){
    } 
}