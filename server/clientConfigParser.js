'use strict';
var config = require('config');

var clientConfigParser = function (req, res) {
  var _config = {
    'ports': config.get('ports'),
    'url': config.get('url')
  };
  var str = 'window.config = ' + JSON.stringify(_config) + ';';
  res.send(str);
};

module.exports = clientConfigParser;