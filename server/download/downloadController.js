'use strict';
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var mongoClient = Promise.promisifyAll(require('mongodb').MongoClient);
var Q = require('q');
var Hashes = require('jshashes');
var backend = require('../liveDbClient');
var fileController = require('../file/fileController');

var path = require('path');
var moment = require('moment');
var multiparty = require('multiparty');

var downloadController = {

	downloadFile: function (req, res) {
		var parsedUrl = req.params[0].split('/');
		var projectName = parsedUrl[1];
		var fileName = parsedUrl[3];
		console.log('projectName: ', projectName, ' fileName: ', fileName);

		var str = 'p-' + projectName + '-d' + fileName;
		var documentHash = new Hashes.SHA256().hex(str);
		return Q()
			.then(function () {
				return backend.fetchAsync('documents', documentHash)
					.then(function (file) {
						console.log('data: ', file);
						return file.data;
					})
					.catch(function (err) {
						console.log('Error with promsie', err);
					});
			})
			.then(function (fileContents) {
				res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
				res.send(fileContents);
			})
			.catch(function (err) {
				console.log('Error downloading file: ', err);
			});

	}
};

module.exports = downloadController;