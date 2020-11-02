const BaseCommand = require('../base/BaseCommand');
const {
    MessageEmbed
} = require("discord.js");
const mysql = require('mysql');
const fs = require('fs');
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "rpg"
});
const weapons = require('../assets/utils/Weapons');
const esthetics = require('../assets/utils/Clothes');
const util = require('util')
const query = util.promisify(db.query).bind(db);

module.exports = class TestCommand extends BaseCommand {
    constructor() {
        super('admins', 'divers', []);
    }
    async run(client, message, args) {
        
        message.delete()
        // if(message.author.id !== "668301282838183946")return;
        if (message.author.id !== "390212129392820224") return;

        if(args[0] === "items" && args[1] === "reset") {
            await query(`DELETE FROM items`)
            new weapons().weaponsload()
            new esthetics().estheticsload()
        }
        else if(args[0] === "table" && args[1] === "reset") {
            await query(`DELETE FROM hp`)
            await query(`DELETE FROM inventory`)
            await query(`DELETE FROM items`)
            await query(`DELETE FROM sorcier`)
            await query(`DELETE FROM user`)
            message.channel.send("All delete")
        }
        else if(args[0] === "house" && args[1] === "add") {
            let [,,name, price, chest, id] = args;
            await query(`INSERT INTO house (houseName, housePrice, houseChest, houseID) VALUES ('${name}', '${price}', '${chest}', '${id}')`)
        }
        else if(args[0] === "items" && args[1] === "add"){
            let [,,name, lvl, damage, weight] = args;
            await query(`INSERT INTO items (items, lvl, damage, weight) VALUES ('${name}', '${lvl}', '${damage}', '${weight}')`)
        }
        else if(args[0] === "sorts" && args[1] === "add") {
            let [,,name, utilities, type] = args;
            await query(`INSERT INTO sorts (type, name, utilities) VALUES ('${type}', '${name}', '${utilities}')`)
            // sorts add protego 100 defense
        }
        else if(args[0] === "sorts" && args[1] === "del") {
            await query(`DELETE FROM sorts`)
        }
        else if(args[0] === "attack") {
            let sortilege = client.sortilegesAttaque.get(args[1]);
            console.log(sortilege, args[1], client.sortilegesAttaque)
            if(!args[1]) return console.log("0-0");
            sortilege.Used(message.author.id, message.mentions.members.first().id)
        }
        else if(args[0] === "defense") {
                let sortilege = client.sortilegesDefense.get(args[1]);
                if(!args[1]) return console.log("0-0");
                sortilege.lancement(message.author.id)
        }
        else if(args[0] === "sorts" && args[1] === "del") {
            await query(`DELETE FROM sorts`)
        }
    }
}