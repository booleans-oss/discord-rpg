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
let stockage;
module.exports = class ChestCommand extends BaseCommand {
    constructor() {
        super('chest', 'divers', []);
    }
    async run(client, message, args) {
        let [name] = args;
        let requireUser = await query(`SELECT * FROM user WHERE userID = '${message.author.id}'`)
        if (requireUser.length < 1) return;
        if (!name) {
            let embedSucess = new MessageEmbed().setColor("10FE01").setDescription(`Faites .house mylist pour afficher votre propriété`)
            return message.channel.send(embedSucess)
        }
        let invalidName = new MessageEmbed().setColor("FD0303").setDescription(`La maison ${name} n'existe pas`)
        let houseData = await query(`SELECT * FROM house WHERE houseName = '${name}'`)
        if (houseData.length < 1) {
            return message.channel.send(invalidName);
        }
        let property = await query(`SELECT * FROM property WHERE userID = '${message.author.id}'`);
        if (property.length < 1) return;

        for (let i = 0; i < property.length; i++) {
            let stockageData = await query(`SELECT * FROM stockagehouse WHERE userID = '${message.author.id}'`)
            if (stockageData.length < 1) {
                return message.channel.send("Vous n'avez pas de propriété.")
            }
            if (stockageData[i].houseName === name) {
                stockage = stockageData[i].houseItems
            }
        }
        let chestEmbed = new MessageEmbed()
            .setColor("10FE01")
            .setDescription(`Voici votre coffre de votre maison ${name}\n\n\`\`\`${stockage === "" ? "Vous avez aucun item dans votre coffre" : stockage.split(",").join("\n")}\`\`\`\n\n`)
        let msg = await message.channel.send(chestEmbed)
        await Promise.all(["📥", "📤"].map(r => msg.react(r)));
        let filter = ((reaction, user) => user.id === message.author.id && !user.bot)
        let reaction2 = (await msg.awaitReactions(filter, {
            max: 1,
            time: 120000
        })).first()
        let Messagefilter = (msg => msg.author.id === message.author.id && !msg.author.bot)
        let req = await query(`SELECT * FROM stockagehouse WHERE userID = '${message.author.id}'`)
        let InventoryData = await query(`SELECT * FROM inventory WHERE ID = '${message.author.id}'`)
        if (reaction2.emoji.name === "📥") {

            for (let i = 0; i < req.length; i++) {
                if (req[i].houseName !== name) return
                if (req[i].houseStockage >= houseData[i].houseChest) {
                    let embedMenuLimit = new MessageEmbed().setColor("10FE01").setDescription(`Maison/Votre coffre\n\nDans votre coffre vous avez actuellement: \`\`\`\nVous n'avez plus de place dans votre coffre\`\`\`\n\n- Pour retirer un item faîtes 📤`)
                    msg.edit(embedMenuLimit)
                } else {
                    let AwaitMessagesEmbed = new MessageEmbed().setColor("10FE01").setDescription(`Quel item vous voulez ajoutez à votre coffre ?`);
                    await message.channel.send(AwaitMessagesEmbed)
                    let msg2 = (await message.channel.awaitMessages(Messagefilter, {
                        max: 1
                    })).first().content;
                    let itemsData = await query(`SELECT * FROM items WHERE items = '${msg2}'`)
                    if (itemsData.length < 1) {
                        let embedItemsErrorData = new MessageEmbed().setColor("FD0303").setDescription(`L'item ${msg2} n'existe pas`)
                        return message.channel.send(embedItemsErrorData)
                    }
                    let itemsDataArray = InventoryData[0].items.split(",")
                    let embedItemsError = new MessageEmbed().setColor("FD0303").setDescription(`Vous n'avez pas l'item **${msg2}** dans votre inventaire. \n Voici votre inventaire \n\`\`\`\n${itemsDataArray}\`\`\``)
                    if (!itemsDataArray.includes(msg2)) return message.channel.send(embedItemsError)


                    let embedMaxStockage = new MessageEmbed().setColor("FD0303").setDescription(`L'item **${msg2}** est trop lourd pour être mis dans le coffre`)
                    let restStockage = parseInt(req[i].houseStockage) + parseInt(houseData[i].houseChest)
                    if (itemsData[0].weight > restStockage) return message.channel.send(embedMaxStockage)

                    let oldItemsInventory = req[i].houseItems
                    let newItemsInventory = `${oldItemsInventory},${msg2}`

                    let oldItemsInvUser = InventoryData[i].items.split(",")
                    let newItemsInvUser = oldItemsInvUser

                    newItemsInvUser.splice(newItemsInvUser.indexOf(msg2), 1)

                    let oldItemsInventoryEmbed = req[i].houseItems.replace(",", "")

                    await query(`UPDATE inventory SET items = '${newItemsInvUser}' WHERE ID = '${message.author.id}'`)
                    await query(`UPDATE stockagehouse SET houseItems = '${newItemsInventory}' WHERE userID = '${message.author.id}'`)
                    let embedNewInventory = new MessageEmbed().setColor("10FE01").setDescription(`Maison/Votre coffre\n\nDans votre coffre vous avez actuellement: \`\`\`diff\n+ ${msg2}\n${oldItemsInventoryEmbed}\`\`\``)
                    return message.channel.send(embedNewInventory)
                }
            }
        }
        if (reaction2.emoji.name === "📤") {

            let embedNoItems = new MessageEmbed().setColor("FD0303").setDescription(`Vous n'avez pas d'item à retirer`)
            let embedQuestionDeleteItem = new MessageEmbed().setColor("10FE01").setDescription(`Quel item vous voulez retirer de votre coffre ?`)

            for (let i = 0; i < req.length; i++) {
                if (req[i].houseName !== name) return;
                if (req[i].houseItems === "") {

                    return message.channel.send(embedNoItems)
                } else {
                    message.channel.send(embedQuestionDeleteItem)

                    let responce = (await message.channel.awaitMessages(Messagefilter, {
                        max: 1
                    })).first().content;
                    let itemsDataArray = req[i].houseItems.split(",")
                    if (!itemsDataArray.includes(responce)) return message.channel.send(embedNoItems)

                    let oldItemsInvUser = InventoryData[i].items
                    let newItemsInvUser = `${oldItemsInvUser},${responce}`

                    let oldItemsInventory = req[i].houseItems.split(",")
                    let newItemsInventory = oldItemsInventory
                    newItemsInventory.splice(newItemsInventory.indexOf(responce), 1)

                    let oldItemsInvUserEmbed = InventoryData[i].items.replace(",", "")
                    await query(`UPDATE stockagehouse SET houseItems = '${newItemsInventory}' WHERE userID = '${message.author.id}'`)
                    await query(`UPDATE inventory SET items = '${newItemsInvUser}' WHERE ID = '${message.author.id}'`)
                    let embedSucess = new MessageEmbed().setColor("10FE01").setDescription(`Voici votre inventaire\`\`\`diff\n+ ${responce}\n${oldItemsInvUserEmbed}\`\`\``)
                    return message.channel.send(embedSucess)
                }
            }
        }
    }
}