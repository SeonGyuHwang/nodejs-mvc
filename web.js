
/**
 * App Globals Setting
 */

global.users = {};
global.user_redirect = '/';

global.DOMAIN = null;

global.resultArr = {
	'status': 500
	,'msg': '잘못된 접근입니다.'
	,'url': ''
	,'arr': {}
	,'html': ''
	,'close': 'off'
	,'reload': 'off'
	,'openerUrl': ''
	,'openerReload': 'off'
	,'dataReload': 'off'
	,'openerDataReload': 'off'
	,'recordsTotal': 0
	,'recordsFiltered': 0
};

// App Encrypt Start
global.ENCRYPT_KEY = 'nodejs-mvc-encrypt';
global.ENCRYPT_IV = '#@$%^&*()_+=-';

global.SESSION_SECRET = '$hofj#h*@fue!h';
// App Encrypt End

// App Path Start
global.ROOT = __dirname;
global.VIEWS = ROOT+'/views';
global.PUBLIC = ROOT+'/public';
global.RESOURCE = ROOT+'/resource';

global.DAO = RESOURCE+'/dao';
global.ROUTES = RESOURCE+'/routes';
global.SERVICE = RESOURCE+'/service';
// App Path End

// App Modules Start
global.nl2br = require('nl2br');
global.express = require('express');
global.session = require('express-session')({
	secret: SESSION_SECRET
	,resave: true
	,saveUninitialized: true
});
global.router = express.Router();
global.app = module.exports = express();

app.use(session);

global.moment = require('moment');
global.url = require('url');
// App Modules End

// App Function Start
global.crypto = require('crypto');
global.ENC_KEY = crypto.createHash('sha256').update(ENCRYPT_KEY, 'utf8').digest('hex').slice(0, 32);
global.ENC_IV = crypto.createHash('sha256').update(ENCRYPT_IV, 'utf8').digest('hex').slice(0, 16);
global.Func = require(RESOURCE+'/common/func');
// App Function End

// App API Start
global.NAVER_CLIENT_ID = 'NAVER_CLIENT_ID';
global.NAVER_CLIENT_SECRET_ID = 'NAVER_CLIENT_SECRET_ID';

global.GOOGLE_API_KEY = 'GOOGLE_API_KEY';
global.GOOGLE_CLIENT_ID = 'GOOGLE_CLIENT_ID';
global.GOOGLE_CLIENT_SECRET_ID = 'GOOGLE_CLIENT_SECRET_ID';
// App API End

// App DB Start
global.mysql = require('mysql');
global.pool = mysql.createPool({
	host     : process.env.NODE_ENV === 'DEV' ? 'localhost' : '10.0.0.1',
	user     : 'nodejs_mvc',
	password : 'nodejs_mvc',
	database : 'nodejs_mvc',
	connectionLimit : 100,
	waitForConnections : true,
	acquireTimeout: 10000
});
// App DB End

/**
 * Module dependencies.
 * web hook.....
 */

require(ROOT+'/bin/app');
const debug = require('debug')('nodejs-mvc:server');
const http = require('http');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '8080');
app.set('port', port);
app.disable('view cache');

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
const sharedSession = require("express-socket.io-session");
global.io = require('socket.io').listen(server);
io.use(sharedSession(session,{
	autoSave: true
}));

require(RESOURCE+'/event')();

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	var bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	debug('Listening on ' + bind);
}
