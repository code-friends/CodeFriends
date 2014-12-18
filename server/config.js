
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var morgan = require('morgan');
var marked = require('marked');
var session = require('express-session');


function appMiddleware (app){
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(morgan('dev'));
  app.use(session({
    secret: 'zfnzkwjehgweghw',
    resave: false,
    saveUninitialized: true
  }));
  app.use(express.static(__dirname + '/../client'));
}

exports.express = appMiddleware;

