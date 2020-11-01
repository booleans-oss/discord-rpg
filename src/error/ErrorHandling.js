const fs = require('fs');
const { execSync } = require('child_process')
const color = require('chalk')
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
    console.log(color.red(`${name} n'a pas été installé.`))
    console.log(color.green(`Installation de ${name} en cours`))
    execSync(`npm i ${name}`, {
        cwd: `./`
      });
}

module.exports = verif();