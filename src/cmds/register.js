const BaseCommand = require('../base/BaseCommand');
const {
    MessageEmbed
} = require("discord.js");
const mysql = require('mysql');
const HealPoint = require('../assets/utils/HealPoint');
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "rpg"
});

module.exports = class RegisterCommand extends BaseCommand {
    constructor() {
        super('register', 'divers', []);
    }
    async run(client, message, args) {

        let rows = db.query(`SELECT * FROM user WHERE userID = ${message.author.id}`)
        if(rows.length < 1) return message.channel.send("Vous avez déjà un profil")
        if(message.channel.type !== "dm") return message.channel.send("MP le bot en lui disant `.register`")
        let returnLogin = new MessageEmbed().setColor("10FE01").setDescription(`Vous avez déjà un profil enregistrée. Fait .restart pour changer de classe`)
        let timeout = new MessageEmbed().setColor("FD0303").setDescription(`Vous avez pris trop de temps à répondre à la question`)
        let questionEmbed = new MessageEmbed().setColor("10FE01").setDescription(`Choississez une classes entre\n \`\`\`\n- Combattant\n- Sorcier\n- Villageois\`\`\``)
        let sousclasses = new MessageEmbed().setColor("10FE01").setDescription(`Choississez une sous-classes entre\n\`\`\`\n- Forgerons\n- Voyante\n- Agriculteur\n- Vendeur\`\`\``)
        let noclass = new MessageEmbed().setColor("FD0303").setDescription(`Vous avez pas donner une classe, ou alors vous l'avez mal écrit. Recommencez !`)
        let req = await db.query(`SELECT * FROM user WHERE userID = ${message.author.id}`)
        if (req.length < 1) {
            return message.author.send(returnLogin)
        }
        
        let filter = (user => !user.bot && user.author.id === message.author.id)
        try {
            await message.author.send(questionEmbed)
            let questionClass = (await message.channel.awaitMessages(filter, {
                max: 1,
                time: 120000
            })).first().content;
            if (!["Combattant", "Sorcier", "Villageois"].includes(questionClass)) return message.author.send(noclass)
            
            let Chooseclass = new MessageEmbed().setColor("10FE01").setDescription(`Très bon choix, vous avez pris ${questionClass} !`)
            // Classe villageois
            // inventaire sorcier (baguette magique lvl 0, chapeau de sorcier, tuniques)
            // sort lvl 0 ()
            let textResult;
            if (questionClass === "Villageois") {
                await message.author.send(sousclasses)
                let questionSousClass = (await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 120000
                })).first().content;
                let sousclassembed = new MessageEmbed().setColor("10FE01").setDescription(`Vous avez choisi ${questionSousClass} comme sous classe`)
                // Sous-classe forgerons
                if(questionSousClass === "Forgerons"){
                    message.author.send(sousclassembed)
                    await db.query(`INSERT user (userID, class, sousClass, lvl, xp) VALUES ('${message.author.id}', '${questionClass}', '${questionSousClass}', '0', '0')`)
                    textResult = "Pas encore fait"
                }
                // Sous-classe voyante
                else if(questionSousClass === "Voyante"){
                    message.author.send(sousclassembed)
                    await db.query(`INSERT user (userID, class, sousClass, lvl, xp) VALUES ('${message.author.id}', '${questionClass}', '${questionSousClass}', '0', '0')`)
                    textResult = "Pas encore fait"
                }
                // Sous-classe agriculture
                else if(questionSousClass === "Agriculture"){
                    message.author.send(sousclassembed)
                    await db.query(`INSERT user (userID, class, sousClass, lvl, xp) VALUES ('${message.author.id}', '${questionClass}', '${questionSousClass}', '0', '0')`)
                    textResult = "Pas encore fait"
                }
                // Sous-classe Vendeur
                else if(questionSousClass === "Vendeur"){
                    message.author.send(sousclassembed)
                    await db.query(`INSERT user (userID, class, sousClass, lvl, xp) VALUES ('${message.author.id}', '${questionClass}', '${questionSousClass}', '0', '0')`)
                    textResult = "Pas encore fait"
                }
                // Classe non définit
                else {
                    return message.author.send(noclass)
                }
            }
            
            // Classe Combattant
            else if(questionClass === "Combattant") {
                // bouclier, épée, armure
                await db.query(`INSERT user (userID, class, sousClass, lvl, xp) VALUES ('${message.author.id}', '${questionClass}', 'NULL', '0', '0')`)
                let object = ["sword", "shield", "armor"]
                await db.query(`INSERT inventory (ID, items) VALUES ('${message.author.id}', '${object}')`)
                await db.query(`INSERT money (userID, money) VALUES ('${message.author.id}', '100')`)
                new HealPoint().combattantLife(message.author.id);
                message.author.send(Chooseclass)
                textResult = `Vous avez choisi de devenir la classe ${questionClass}. Vous avez reçu **un bouclier**, **une épée** et une **magnifique armure**`
            }
            
            // Classe Sorcier
            else if(questionClass === "Sorcier") {
                await db.query(`INSERT user (userID, class, sousClass, lvl, xp) VALUES ('${message.author.id}', '${questionClass}', 'NULL', '0', '0')`)
                
                let embedChooseHouse = new MessageEmbed().setColor("10FE01").setDescription(`Choississez parmis les réactions votre maison. \n\`\`\`\n1 - Omega\n2 - Gamma\n3 - Alpha\n4 - Charlie\n5 - Delta\`\`\``).setImage("https://i.skyrock.net/8275/34438275/pics/3267122442_1_3_oMmgz4Wk.gif")
                let msg = await message.author.send(embedChooseHouse)
                await Promise.all(["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"].map(r => msg.react(r)));
                
                let reactionFilter = ((reaction, user) => user.id === message.author.id && !user.bot)
                let reaction = (await msg.awaitReactions(reactionFilter, {max: 1})).first()
                let maison, colortunique, sort, sortDB;
                if(reaction.emoji.name === "1️⃣") {
                    console.log("Omega")
                    maison = "Omega"
                    colortunique = "vert"
                    sortDB = "PROTEGO"
                    sort = "Vous avez comme sort PROTEGO. Esquive l'attaque envoyer et rattaque directement après (2 fois par combat)"
                }
                else if(reaction.emoji.name === "2️⃣") {
                    console.log("Gamma")
                    maison = "Gamma"
                    colortunique = "bleu"
                    sortDB = "EXPERLLIARMUS"
                    sort = "Vous avez comme sort EXPELLIARMUS. Désarme l'armement de votre adversaire (limité à 2 fois par jour)"
                }
                else if(reaction.emoji.name === "3️⃣") {
                    console.log("Alpha")
                    maison = "Alpha"
                    colortunique = "rouge"
                    sortDB = "PETRIFICUS TOTALUS"
                    sort = "Vous avez comme sort PETRIFICUS TOTALUS. Fige ton adversaire durant un combat(1fois par semaine)"
                }
                else if(reaction.emoji.name === "4️⃣") {
                    console.log("Charlie")
                    maison = "Charlie"
                    colortunique = "jaune"
                    sortDB = "REPULSIO"
                    sort = "Vous avez comme sort REPULSIO. Renvoie le sort ou l'attaque envoyer par votre adversaire"
                }
                else if(reaction.emoji.name === "5️⃣") {
                    console.log("Delta")
                    maison = "Delta"
                    colortunique = "rose"
                    sortDB = "INCENDIO"
                    sort = "Vous avez comme sort INCENDIO. Met en feu votre adversaire pendant 10s."
                }
                let object = ["rod", "tunic", "sorcerer hat"]
                let textSorcier = `Le choixpeau à choisi la maison: **${maison}**.\n Vous avez obtenu une **baguette magique** de niveau 0, un **chapeau de sorcier** et la **sublime tunique ${colortunique}**\n**${sort}**`
                await db.query(`INSERT sorcier (userID, maison, sorts) VALUES ('${message.author.id}', '${maison}', '${sortDB}')`)
                await db.query(`INSERT inventory (ID, items) VALUES ('${message.author.id}', '${object}')`)
                textResult = textSorcier
            }
            db.query(`INSERT hp (ID, HP) VALUES ('${message.author.id}', '100')`)
            let result = new MessageEmbed().setColor("10FE01").setDescription(`${textResult}`)
            message.author.send(result)
        } catch (e) {
            console.log(e);
            message.author.send(timeout);
        }
    }
}