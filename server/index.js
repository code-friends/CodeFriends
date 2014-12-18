//dependencies
var bodyParser = require('body-parser');
var path = require('path');
var morgan = require('morgan');
var marked = require('marked');
var session = require('express-session');
var express = require('express');

//set routes
var apiRouter = require('./api');
var db = require('./db');

var port = process.env.PORT || 8000;

//init app
var app = express();

//middlewares
app
  .use(bodyParser.urlencoded({extended: true}))
  .use(bodyParser.json())
  .use(morgan('dev'))
  .use(session({
    secret: 'zfnzkwjehgweghw',
    resave: false,
    saveUninitialized: true
  }));

//set routes
app
  .use(express.static(__dirname + '/../client'))
  .use('/api', apiRouter);
  .listen(port);

console.log('listening on port: ' + port);

//expose app
module.exports = app;






