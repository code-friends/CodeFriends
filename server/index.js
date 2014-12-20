//dependencies
var bodyParser = require('body-parser'),
  path = require('path'),
  morgan = require('morgan'),
  marked = require('marked'),
  session = require('express-session'),
  express = require('express');

var liveDB = require('livedb-mongo');

// shareJS and codemirror dependencies
var connect = require('connect'),
  http = require('http'),
  argv = require('optimist').argv,
  // serveStatic = require( 'serve-static' ), not sure if we need this.
  shareCodeMirror = require('share-codemirror'),
  Duplex = require('stream').Duplex,
  livedb = require('livedb'),
  sharejs = require('share'),
  shareJSPort = argv.p || 8007,
  shareJSapp = connect(),
  server = http.createServer(shareJSapp),
  // No credentials passed on to MongoDB (might need to change)
  db = liveDB('mongodb://localhost:27017/codeFriends?auto_reconnect', {
    safe: true
  }),
  // For memory-stored livedb, use livedb.memory()
  backend = livedb.client(db),
  share = sharejs.server.createClient({
    backend: backend
  }),
  WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({
    server: server
  });

server.listen(shareJSPort);
console.log('Sockets listening on http://localhost:' + shareJSPort + '/');

// Set routes
var auth = require('./auth');
var db = require('./db');

var port = process.env.PORT || 8000;
var auth = require('./auth');
var authRouter = require('./auth/authRouter');
var apiRouter = require('./api');

// Init app
var app = express();

// Middlewares
app
// .use(cookieParser)
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .use(bodyParser.json())
  // .use(morgan('dev'))
  // .use(expressMethodOverride)
  .use(session({
    secret: 'zfnzkwjehgweghw',
    resave: false,
    saveUninitialized: true
  }))
  .use(auth.initialize())
  .use(auth.session());

//set routes
var port = process.env.PORT || 8000;
app
  .use(express.static(__dirname + '/../client'))
  .use('/auth', authRouter)
  .use('/api', apiRouter)
  .listen(port, function () {
    console.log('Server listening on port: ', port);
  });

module.exports = app;