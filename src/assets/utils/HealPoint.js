const {
    createConnection
} = require('mysql');
const util = require('util')
const db = createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "rpg"
});
const query = util.promisify(db.query).bind(db);
module.exports = class HealPoint {
    constructor(){}

    async checkLife(id) {
        await query(`SELECT * FROM hp WHERE ID = ${id}`)
    }

    async resetLife(id) {
        let req = await query(`SELECT * FROM user WHERE ${id}`)
        if (req[0].class == "Combattant") {
            setTimeout(async () => {
                await query(`UPDATE hp SET HP = "150" WHERE ${id}`)
            }, 1440000)
        } else {
            setTimeout(async () => {
                await query(`UPDATE hp SET HP = "100" WHERE ${id}`)
            }, 1440000)
        }
    }

    async combattantLife(id) {
        let req = await query(`SELECT * FROM user WHERE ${id}`)
        if (req[0].class === "Combattant") {
            await db.query(`UPDATE hp SET HP = "150" WHERE ${id}`)
        } else {
            return;
        }
    }
}