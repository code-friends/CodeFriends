'use strict';
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var mongoClient = Promise.promisifyAll(require('mongodb').MongoClient);
var Q = require('q');
var moment = require('moment');
var Hashes = require('jshashes');
var multiparty = require('multiparty');
var backend = require('../liveDbClient');
var fileController = require('../file/fileController');

var downloadController = {

	downloadFile: function (req, res) {
		var parsedUrl = req.params[0].split('/');
		var projectName = parsedUrl[1];
		var fileName = parsedUrl[3];
		console.log('projectName: ', projectName, ' fileName: ', fileName);

		var str = 'p-' + projectName + '-d' + fileName;
		var documentHash = new Hashes.SHA256().hex(str);
		// console.log('documentHash: ', documentHash);
		backend.fetch('documents', documentHash, function (err, snapshot) {
			if (err) {
				console.log('Error: ', err)
			}
			console.log('Snapshot: ', snapshot);
		});
		// 	function (err, version, transformedByOps, snapshot) {
		// 		if (err) {
		// 			console.log('ERROR: ', err);
		// 		}
		// 		console.log('version: ', version);
		// 		console.log('transformedByOps: ', transformedByOps);
		// 		console.log('snapshot: ', snapshot);
		// 		var fileInfo = {
		// 			projectName: projectName,
		// 			fileName: documentName,
		// 			type: 'file', ///need to make flexible to take folders too
		// 			path: '',
		// 			userId: userId
		// 		};
		// 	});

	}
}

module.exports = downloadController;