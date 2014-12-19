//dependencies
var bodyParser = require('body-parser');
var path = require('path');
var morgan = require('morgan');
var marked = require('marked');
var session = require('express-session');
var express = require('express');

// Set routes
var apiRouter = require('./api');
var db = require('./db');

var port = process.env.PORT || 8000;
var apiRouter = require('./api');
var auth = require('./auth');

// Init app
var app = express();

// Middlewares
app
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .use(bodyParser.json())
  .use(morgan('dev'))
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
  .use('/api', apiRouter)
  .listen(port, function(){
    console.log('listening on port: ', port);
  });

module.exports = app;