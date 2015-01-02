'use strict';

//dependencies
var bodyParser = require('body-parser'),
  session = require('express-session'),
  express = require('express'),
  chatServer = require('./chatServer.js'),
  shareJSServer = require('./sharejs/shareJSServer');

// Set routes
var auth = require('./auth');
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
var shareJSPort = 8007;
var chatPort = 8001;

app
  .use(express.static(__dirname + '/../client'))
  .use('/auth', authRouter)
  .use('/api', apiRouter)
  .listen(port, function () {
    console.log('Server listening on port:', port);
  });

chatServer.listen(chatPort);
shareJSServer.listen(shareJSPort);

console.log('Chat listening on port:', chatPort);
console.log('Editor listening on port:', shareJSPort);

module.exports = app;