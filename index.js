const path = require('path');
const prompt = require('prompt-sync')();

const config = require(path.resolve('./config.json'));

const SteamClient = require('./src/steamclient');

//      Steam
////////////////////////
var client = new SteamClient({
	username: config.username,
	password: config.password,
	games: config.games,
	silent: config.showasoffline,
});

client.on('steamguard', () => {
	client.authCode = prompt('code: ');
	console.log('authenticating, please wait..');
});

client.on('message', (message) => {
	const t = new Date();
	console.log(t.toLocaleString(), ':', message);
});

client.login();
