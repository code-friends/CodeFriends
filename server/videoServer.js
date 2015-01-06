var fs = require('fs'),
	express = require('express'),
	http = require('http');

var app = express();

app.get('/', function (req, res) {
	res.send('Hello World!');
});

http.createServer(app).listen(8001);

console.log('running on https://localhost:8001');