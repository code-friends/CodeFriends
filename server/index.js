'use strict';

var config = require('config');

console.log('config:', config);

//dependencies
var bodyParser = require('body-parser'),
  session = require('express-session'),
  express = require('express'),
  chatServer = require('./chatServer.js'),
  shareJSServer = require('./sharejs/shareJSServer');

// Set routes
var clientConfigParser = require('./clientConfigParser');
var auth = require('./auth');
var authRouter = require('./auth/authRouter');
var apiRouter = require('./api');

// Init app
var app = express();

// Middlewares
app
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .use(bodyParser.json())
  .use(session({
    secret: 'zfnzkwjehgweghw',
    resave: false,
    saveUninitialized: true
  }))
  .use(auth.initialize())
  .use(auth.session());

// Set Routes
app
  .use('/config.js', clientConfigParser)
  .use(express.static(__dirname + '/../client'))
  .use('/auth', authRouter)
  .use('/api', apiRouter)
  .listen(config.get('ports').http, function () {
    console.log('Server listening on port:', config.get('ports').http);
  });

chatServer.listen(config.get('ports').chat);
shareJSServer.listen(config.get('ports').editor);
console.log('Chat listening on port:', config.get('ports').chat);
console.log('Editor listening on port:', config.get('ports').editor);

module.exports = app;