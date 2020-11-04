const {
    Structures, MessageEmbed
} = require('discord.js')
const mysql = require('mysql');
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "rpg"
});
const util = require('util')
const query = util.promisify(db.query).bind(db);
Structures.extend('User', (User) => {
    class UserActivity extends User {
        constructor(client, data) {
            super(client, data)
            this.hunting = false
            this.fishing = false
            this.miniboss = false
            this.exp = 0;
        }
        async activity({activity,time}) {
            return new Promise(async (resolve, reject) => {

                if(activity === "miniboss"){
                    let req = await query(`SELECT * FROM user WHERE userID = '${this.id}'`)
                    if(req.length < 1) return;
                    if(req[0].lvl < 5) return resolve(`Low Level`)
                }
                this[activity] = true;


                let gain = 0;
                let interval = setInterval(() => {
                    let number = Math.floor(Math.random() * 3)
                    gain += number
                    console.log(number)
                }, 30000)

                setTimeout(() => {
                    this[activity] = false;
                    clearInterval(interval);
                    resolve(gain)
                    this.exp += gain;
                }, time)
            })

        }
    }
    return UserActivity;
})