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

module.exports = class TestCommand extends BaseCommand {
    constructor() {
        super('house', 'divers', []);
    }
    async run(client, message, args) {
        let req = await query(`SELECT * FROM user WHERE userID = '${message.author.id}'`)
        if (req.length < 1) return message.channel.send("Vous n'avez pas de profil")
        if (args[0] === "list") {
            let house = await query(`SELECT * FROM house`)
            let arr = [];
            for (let i = 0; i < house.length; i++) {
                arr.push(`${house[i].houseName}:  ${house[i].housePrice}$`)
            }
            let embedHouselist = new MessageEmbed().setColor("10FE01").setDescription(`Voici toutes les maisons disponibles\n\`\`\`\n${arr.join("\n")}\`\`\``)
            message.channel.send(embedHouselist)
        } else if (args[0] === "mylist") {
            let req = await query(`SELECT * FROM property WHERE userID = '${message.author.id}'`)
            let house;
            let arr = [];
            if (req.length < 1) {
                house = "Vous n'avez pas de propriété."
            } else {
                for (let i = 0; i < req.length; i++) {
                    arr.push(req[i].houseName)
                }
                house = arr.join("\n")
            }
            let embedMyList = new MessageEmbed().setColor("10FE01").setDescription(`Voici votre liste de propriété\n\`\`\`\n${house}\`\`\``)
            message.channel.send(embedMyList)
        } else if (args[0] === "enter") {
            let [, name] = args;
            if (!name) {
                let embedSucess = new MessageEmbed().setColor("10FE01").setDescription(`Faites .house mylist pour afficher votre propriété`)
                message.channel.send(embedSucess)
            }
            let property = await query(`SELECT * FROM property WHERE userID = '${message.author.id}'`);
            // [1, 4, 2, 2, 4]
            // indexOf(4) -> 1

            // [{name: 1}, {name: 12}]
            // findIndex(element => element.name === 1) => 0


            /*
            userID;
            houseName;
            houseChest
            items: [{pain: 2}, {viande: 10}]

            let arr = []
            for(let i = 0; i < arr[0].items.length; i++) {
               arr[0].items[i]
            }
            */
           if(!["Lasu", "Schindler"].includes(name)) return;
            let index = property.findIndex(property => property.houseName === name);
            let embedNotAlreadyHouse = new MessageEmbed().setColor("FD0303").setDescription(`Vous n'avez pas la propriété ${name}`)
            if(property[index].houseName !== name) return message.channel.send(embedNotAlreadyHouse)
            let houseData = await query(`SELECT * FROM house WHERE houseName = '${name}'`)
            let stockage;
            for (let i = 0; i < property.length; i++) {
                let stockageData = await query(`SELECT * FROM stockagehouse WHERE userID = '${message.author.id}'`)
                if (stockageData.length < 1) {
                    return message.channel.send("Vous n'avez pas de propriété.")
                }
                if (stockageData[i].houseName === name) {
                    stockage = stockageData[i].houseStockage
                }
            }
            let embedHouseData = new MessageEmbed().setColor("10FE01").setDescription(`Bienvenu(e) dans votre maison ${name}\n\n Stockage utilisé ${stockage}/${houseData[0].houseChest}kg.`)
            let msg = await message.channel.send(embedHouseData)
            await Promise.all(["📦"].map(r => msg.react(r)));
            let filter = ((reaction, user) => user.id === message.author.id && !user.bot)
            let reaction = (await msg.awaitReactions(filter, {max: 1, time: 120000})).first()
            if(reaction.emoji.name === "📦"){
                reaction.remove()
                let inv;
                let req = await query(`SELECT * FROM stockagehouse WHERE userID = '${message.author.id}'`)
                for(let i = 0; i < req.length; i++) {
                    if (req[i].houseName === name) {
                        inv = req[i].houseItems
                    }
                }
                console.log(inv)
                let embedMenuInventory = new MessageEmbed().setColor("10FE01").setDescription(`Maison/Votre coffre\n\nDans votre coffre vous avez actuellement: \`\`\`\n${inv === "[]" ? "Aucun objet":inv.slice(1, -1)}\`\`\`\n\n- Pour ajoutez un item faîtes 📥\n- Pour retirer un item faîtes 📤`)
                msg.edit(embedMenuInventory)
                await Promise.all(["📥", "📤"].map(r => msg.react(r)));
                let reaction2 = (await msg.awaitReactions(filter, {max: 1, time: 120000})).first()
                if(reaction2.emoji.name === "📥"){
                    // Ajoutez un item dans l'inventaire
                    
                }
                else {
                    // Retirez un item de l'inventaire
                    if(inv !== "[]") return;

                    
                }
            }

        } else if (args[0] === "buy") {
            let [, name] = args;
            if (!name) return;
            let housenuy = await query(`SELECT * FROM house WHERE houseName = '${name}'`)
            if (housenuy.length < 1) {
                let embedHouseNoFound = new MessageEmbed().setColor("FD0303").setDescription(`La maison ${name} n'existe pas.\n Faîtes .house list pour afficher toutes les maisons disponibles`)
                message.channel.send(embedHouseNoFound)
            }
            let money = await query(`SELECT * FROM money WHERE userID = '${message.author.id}'`)
            let moneyAfterBuy = parseInt(money[0].money) - parseInt(housenuy[0].housePrice)
            if (moneyAfterBuy < 0) {
                let embedNoMoney = new MessageEmbed().setColor("FD0303").setDescription("Vous n'avez pas assez d'argent")
                return message.channel.send(embedNoMoney)
            }
            let property = await query(`SELECT * FROM property WHERE userID = '${message.author.id}'`)
            if (property.length < 1) {
                let embedSure = new MessageEmbed().setColor("10FE01").setDescription(`Êtes-vous sur de vouloir acheter la maison ${name} pour une valeur de ${housenuy[0].housePrice}.\nIl vous restera ${moneyAfterBuy}$\n\nRépondez oui ou non`)
                message.channel.send(embedSure)
                let filter = (msg => msg.author.id === message.author.id && !msg.author.bot)
                let question = (await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 120000
                })).first().content;
                if (question === "oui") {
                    await query(`INSERT INTO property (userID, houseName) VALUES ('${message.author.id}', '${name}')`)
                    await query(`INSERT INTO stockagehouse (userID, houseName, houseStockage, houseItems) VALUES ('${message.author.id}', '${name}', '0', '[]')`)
                    let embedSucess = new MessageEmbed().setColor("10FE01").setDescription(`Bravo, vous avez une nouvelle propriété. \n\nFaîtes .house enter <name>\nSi vous oubliez le nom de vos maison, faites .house mylist`)
                    return message.channel.send(embedSucess)
                }
            }
            let embedAlreadyHouse = new MessageEmbed().setColor("FD0303").setDescription(`Vous avez déjà la propriété ${name}`)
            if (property[0].houseName === name) return message.channel.send(embedAlreadyHouse)

            let embedSure = new MessageEmbed().setColor("10FE01").setDescription(`Êtes-vous sur de vouloir acheter la maison ${name} pour une valeur de ${housenuy[0].housePrice}.\nIl vous restera ${moneyAfterBuy}$\n\nRépondez oui ou non`)
            message.channel.send(embedSure)
            let filter = (msg => msg.author.id === message.author.id && !msg.author.bot)
            let question = (await message.channel.awaitMessages(filter, {
                max: 1,
                time: 120000
            })).first().content;
            if (question === "oui") {
                await query(`INSERT INTO property (userID, houseName) VALUES ('${message.author.id}', '${name}')`)
                await query(`INSERT INTO stockagehouse (userID, houseName, houseStockage, houseItems) VALUES ('${message.author.id}', '${name}', '0', '[]')`)
                let embedSucess = new MessageEmbed().setColor("10FE01").setDescription(`Bravo, vous avez une nouvelle propriété. \n\nFaîtes .house enter <name>\nSi vous oubliez le nom de vos maison, faites .house mylist`)
                message.channel.send(embedSucess)
            } else {
                let embedNo = new MessageEmbed().setColor("FD0303").setDescription(`Vous avez annuler l'achat de la maison ${name}`)
                return message.channel.send(embedNo);
            }
        }
    }
}