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
const util = require('util');
const query = util.promisify(db.query).bind(db);

module.exports = class InventoryCommand extends BaseCommand {
    constructor() {
        super('inventory', 'divers', []);
    }
    async run(client, message, args) {
        let requireUser = await query(`SELECT * FROM user WHERE userID = '${message.author.id}'`)
        if(requireUser.length < 1) return;
        
        let inventoryTable = await query(`SELECT * FROM inventory WHERE ID = '${message.author.id}'`)
        if(inventoryTable.length < 1) return;

        let inventoryEmbed = new MessageEmbed()
        .setColor("10FE01")
        .setDescription(`Voici votre inventaire\n\`\`\`\n${inventoryTable[0].items === "" ? "Aucun objet": inventoryTable[0].items.split(",").join("\n")}\`\`\``)
        message.channel.send(inventoryEmbed)
    }
}