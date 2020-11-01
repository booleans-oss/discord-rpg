const BaseCommand = require('../base/BaseCommand');
const { MessageEmbed } = require("discord.js");
const HealPoint = require('../assets/utils/HealPoint');
module.exports = class TestCommand extends BaseCommand {
  constructor() {
    super('test', 'divers', []);
  }
  async run(client, message, args) {

      let heal = new HealPoint()
      console.log(heal.checkLife(message.author.id))
    }
}