require('./src/error/ErrorHandling')
const Server = require("./src/BaseBot");
const bot = new Server({ partials: ['MESSAGE', 'REACTION']});

/**
 * @async 
 * @event
 * @commands
 */
( async () => {
    bot._start()
})()