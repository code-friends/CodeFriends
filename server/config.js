
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var morgan = require('morgan');
var marked = require('marked');
var session = require('express-session');


function appMiddleware (app){
  //insert middlewares
}

exports.express = appMiddleware;

