const fs = require('fs');
const { execSync } = require('child_process')
const verif = async function () {
    let mandatory_modules = ["discord.js", "dotenv", "mysql"];
    await Promise.all(mandatory_modules.map(module => { isModuleInstalled(module)}))
}

function isModuleInstalled(name) {
    try {
        require.resolve(name);
        return true;
    } catch(e){
        
    }
    console.log(`\x1b[33m%s\x1b[0m`, `${name} n'a pas été installé. --- `, `\n\x1b[0m`, `npm i ${name}`)
    console.log(`Installation de ${name} en cours`)
    execSync(`npm i ${name}`, {
        cwd: `./`
      });
}

module.exports = verif();