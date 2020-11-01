const EventBase = require('../base/BaseEvent');
const { MessageEmbed } = require('discord.js');
module.exports = class ReadyEvent extends EventBase {
    constructor() {
        super('ready');
    }
    async run(client) {
        console.log(`[CONNECTED] ${client.user.tag}`);
    }
};