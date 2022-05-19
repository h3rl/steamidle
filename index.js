const path = require("path")
const prompt = require('prompt-sync')()

const config = require(path.resolve('./config.json'))

const SteamClient = require("./src/steamclient")

//      Steam
////////////////////////
var client = new SteamClient({
    username: config.username,
    password:config.password,
    games: config.games
})

client.on("steamguard",(needed)=>{
    client.authCode = prompt("code: ")
})

client.on("message",(message)=>{
    const t = new Date();
    console.log(t.toLocaleString(),":",message)
})

client.login()