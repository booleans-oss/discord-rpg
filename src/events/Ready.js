const EventBase = require('../base/BaseEvent');
const { MessageEmbed } = require('discord.js');
module.exports = class ReadyEvent extends EventBase {
    constructor() {
        super('ready');
    }
    async run(client) {
        client.user.setActivity('vos maisons', {type: "WATCHING"})
        console.log(`[CONNECTED] ${client.user.tag}`);
    //     client.channels.cache.get('767319475358924810').bulkDelete(100)
    //     let OpenTicket = new MessageEmbed()
    //     .setTitle("Development Community - Ouverture de ticket")
    //     .setDescription("Si vous voulez ouvrir un ticket, veuillez cliquer sur la réaction ci-dessous.")
    //     .setImage("https://cdn.discordapp.com/attachments/702572752212590695/730598744227053659/ticket.png")
    //     .setFooter("Development Community")

    // client.channels.cache.get('767319475358924810').send(OpenTicket)
    //     .then(msg => {
    //         msg.react("📩")
    //     })
    }
};