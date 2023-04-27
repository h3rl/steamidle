const SteamUser = require('steam-user');
const EventEmitter = require('events');
const { EPersonaState, EResult } = SteamUser;

class SteamClient extends EventEmitter {
	constructor({
		username,
		password,
		games,
		silent = true,
		rememberPassword = true,
	}) {
		super();
		this.client = new SteamUser({ autoRelogin: true });

		this.logged_in = false;
		this.active = true;
		this.authCode = '';

		//  required
		this.username = username;
		this.password = password;
		this.games = games;

		//  optional
		this.rememberPassword = rememberPassword;
		this.silent = silent;

		this.interval_steamguard = 1000 * 10;

		this._setupEmitters();
	}

	_log(message) {
		this.emit('message', message);
	}

	_setupEmitters() {
		// eventemitter

		//  default on message
		// this.on("message",(message)=>{
		//     console.log(message);
		// })

		// steam client
		this.client.on('loggedOn', (details, parental) => {
			this.logged_in = true;
			
			this.client.getPersonas([this.client.steamID], (err, steamid) => {
				if (err) this.emit('message', err);
				else {
					this.emit(
						'message',
						'Logged in as ' +
							steamid[this.client.steamID].player_name
					);
				}
			});
		});

		this.client.on(
			'steamGuard',
			(domain, AuthCodeCallback, lastCodeWrong) => {
				this.authCode = null;

				this.emit('message', 'Steam Guard code needed');
				this.emit('steamguard', { needed: true });

				var _interval = setInterval(() => {
					if (this.authCode !== null) {
						AuthCodeCallback(this.authCode);
						clearInterval(_interval);
					}
				}, this.interval_steamguard);
			}
		);

		this.client.on('playingState', (blocked, playing) => {
			if (blocked) {
				this.emit(
					'message',
					'User started ' + playing + ', idling suspended'
				);
			}

			if (playing == 0) {
				this.startidle();
			}
		});

		// this.client.on("user",(sid,user)=>{
		//     this.emit("message",sid)
		//     this.emit("message",user)
		// });

		this.client.on('appLaunched', async (appid) => {
			this.emit('message', 'Game launch ' + appid);
		});

		this.client.on('disconnected', async (eresult, msg) => {
			const message = msg ? '\n' + msg : '';
			const result = EResult[eresult];

			this.emit('message', 'Disconnected ' + result + ' ' + message);
		});

		this._onError = this._onError.bind(this);

		this.client.on('error', this._onError);
	}

	setAuthCode(code) {
		if (this.authCode !== null) {
			this.emit('message', 'Auth not needed');
			return;
		}

		this.emit('message', 'Auth code set');
		this.authCode = code;
	}

	setGames(games) {
		this.games = games;
	}

	login() {
		if (!this.active) {
			return;
		}

		if (!this.username || !this.password) {
			return;
		}

		if (this.logged_in) {
			return;
		}

		this.emit('message', 'Logging in');

		this.client.logOn({
			accountName: this.username,
			password: this.password,
			rememberPassword: this.rememberPassword,
			machineName: this.username + 'idler',
		});
	}
	logout() {
		this.logged_in = false;
		this.client.logOff();
	}

	startidle() {
		if (!this.logged_in || !this.active || !this.games) {
			return;
		}

		this.emit('message', 'Starting idle');

		this.client.requestFreeLicense(
			this.games,
			(err, grantedApps, grantedPackages) => {
				if (err) _onError(err);
			}
		);
		const forcegames = false;
		this.client.gamesPlayed(this.games, forcegames);

		var personaState;
		if (this.silent) {
			personaState = EPersonaState.Invisible;
		} else {
			personaState = EPersonaState.Online;
		}
		this.client.setPersona(personaState);
	}

	_onError({ eresult, message }) {
		// custom messages
		if (eresult == EResult.PasswordUnset) {
			this.emit('message', 'Invalid credentials');
			this.logout();
			process.exit(1);
		}

		// default messages
		this.emit('message', message);
		switch (eresult) {
			case EResult.LoggedInElsewhere:
				//this.emit("message","Someone overtook session");
				this.logged_in = false;
				this.login();
				return;
			case EResult.InvalidLoginAuthCode:
				return;
			default:
				break;
		}
		this.logout();
		process.exit(1);
	}
}

module.exports = SteamClient;
