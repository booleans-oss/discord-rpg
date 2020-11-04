const BaseCommand = require('../base/BaseCommand');
const {
    MessageEmbed, Message
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
let activity = ["fishing", "hunting", "miniboss"]
module.exports = class StartCommand extends BaseCommand {
    constructor() {
        super('start', 'divers', []);
    }
    async run(client, message, args) {  
        message.delete()

        let activityList = new MessageEmbed().setColor("FD0303").setDescription(`Voici les activités disponibles: \n\`\`\`\n${activity.join(`\n`)}\`\`\``)
        if(!activity.includes(args[0])) return message.channel.send(activityList); 
        let embedActivityInProgress = new MessageEmbed().setColor("FD0303").setDescription(`Vous faîtes déjà une activité.`) 
        if(message.author[args[0]]) return message.channel.send(embedActivityInProgress)

        /**
         * @timeActivity
         */
        let activityTime = {
            "fishing": {time: 60000,embed: "1min"},
            "hunting": {time: 180000, embed: "3min"},
            "miniboss": {time: 300000, embed: "5min"}
        }

        let embedStartingActivity = new MessageEmbed().setColor("10FE01").setDescription(`Vous venez de commencer l'activité **${args[0]}**\n\nCela va durer ${activityTime[args[0]].embed}.`)
        let msg = await message.channel.send(embedStartingActivity)
        let data = await message.author.activity({activity: args[0], time: activityTime[args[0]].time})


        if(args[0] === "fishing"){
            /**
             * @argument
             * @function check
             */
            let fishingCheck = new MessageEmbed().setColor("10FE01").setDescription(`${data === 0 ? `Aïe, la pêche n'as pas été folle. Vous avez récupérez aucun poisson` : `Bravo, la pêche a été réussi pour aujourd'hui. Vous avez récupérer ${data === 1 ? `${data} poisson` : `${data} poissons`}.`}`)
            msg.edit(fishingCheck)
        }
        else if(args[0] === "hunting"){
            /**
             * @argument
             * @function check
             */
            let huntingCheck = new MessageEmbed().setColor("FD0303").setDescription(`${data === 0 ? `Aïe, la chasse n'as pas été concluente. Vous avez récupérez aucun gibier` : `Incroyable, la chasse à été concluente. Vous avez récupérer ${data === 1 ? `${data} gibier` : `${data} gibiers`}.`}`)
            msg.edit(huntingCheck)
        }
        else if(args[0] === "miniboss"){
            /**
             * @argument
             * @function check
             */
            let req = await query(`SELECT * FROM user WHERE userID = '${message.author.id}'`)
            let embedLowLevel = new MessageEmbed().setColor("FD0303").setDescription(`Vous n'avez pas le niveau requis pour faire cette activité.\n\n Vous êtes niveau ${req[0].lvl} et il faut être niveau 5.`)
            if(data === "Low Level") return msg.edit(embedLowLevel)
        }
    }
}