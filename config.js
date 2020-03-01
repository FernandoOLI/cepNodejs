let arquivos = require('./file.json');
let HOST = arquivos.host;
let USER = arquivos.user;
let PASSWORD = arquivos.password;
let DATABASE = arquivos.database;
let PORT = arquivos.port;
let HOSTSERVER = arquivos.hostServer;
let PORTSERVER = arquivos.portServer;

var config = {
	database: {
		host: HOST,
		user: USER,
		password: PASSWORD,
		port: PORT,
		db: DATABASE
	},
	server: {
		host: HOSTSERVER,
		port: PORTSERVER
	}
}

module.exports = config
