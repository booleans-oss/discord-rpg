const EventBase = require('../base/BaseEvent');
const {
    MessageEmbed
} = require('discord.js')
const mysql = require('mysql');
const HealPoint = require('../assets/utils/HealPoint');
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "rpg"
});

module.exports = class MessageEvent extends EventBase {
    constructor() {
        super('message');
    }
    async run(client, message) {
        if (message.author.bot) return;

        
        let req = await db.query(`SELECT * FROM user WHERE userID = ${message.author.id}`)
        if(req.length == 1) {
            console.log("message")
            new HealPoint().resetLife(message.author.id);
        }

            if (message.content.startsWith(process.env.PREFIX_BOT)) {
                const args = message.content.slice(1).trim().split(/ +/g);
                const command = args.shift().toLowerCase();
                const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
                if (cmd) cmd.run(client, message, args)
            }
    }
};