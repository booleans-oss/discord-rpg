const Server = require("./src/BaseBot");
const bot = new Server({ partials: ['MESSAGE', 'REACTION']});

( async () => {
    bot._start()
})()