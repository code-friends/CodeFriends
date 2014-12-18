//dependencies
//mongoose
//bookshelf
var express = require('express');

var config = require('./config');
var router = require('./api');
var db = require('./db');

//connect to mongoDB

//connect to MySQL

//init app
var app = express();

//middlewares
router(app);

var port = 8000;

app.listen(port);
console.log('listening on port: ' + port);

//expose app
module.exports = app;

