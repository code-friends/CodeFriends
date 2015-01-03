'use strict';
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var mongoClient = Promise.promisifyAll(require('mongodb').MongoClient);
var Q = require('q');
var moment = require('moment');
var Hashes = require('../../node_modules/jshashes/hashes');
var multiparty = require('multiparty');
var backend = require('../liveDbClient');

var uploadController = {
	uploadNewFile: function (req, res) {
		var size = '';
		var projectName;
		var documentName;
		var fileContent;
		var destination_path = '';
		var form = new multiparty.Form();

		form.on('error', function (err) {
			console.log('Error parsing form: ' + err.stack);
		});

		form.on('part', function (part) {
			if (!part.filename) {
				return;
			}
			size = part.byteCount;
			var file_name = part.filename;
		});

		form.on('file', function (name, file) {
			var temportal_path = file.path;
			fs.readFile(temportal_path, function (err, data) {
				if (err) throw err;
				fileContent = data.toString();
				console.log('fileContent: ', fileContent);
			});
			// 1. create a file
			// 2. send the contents (data.toString()) as a keystroke to be saved on the db
			// var extension = file.path.substring(file.path.lastIndexOf('.'));
			// var imageName = uuid.v4() + extension;
			// destination_path = path.join(__dirname, '/archives/', imageName);
			// var input_stream = fs.createReadStream(temportal_path);
			// var output_stream = fs.createWriteStream(destination_path);
			// input_stream.pipe(output_stream);
			// input_stream.on('end', function () {
			// 	fs.unlinkSync(temportal_path);
			// 	console.log('Uploaded: ', file_name, size);
			// 	res.send(imageName);
			// });
		});

		form.on('close', function () {
			console.log('Uploaded!!');
		});

		form.parse(req, function (err, fields, file) {
			if (err) {
				console.log('err: ', err);
			}
			projectName = fields.project_name[0];
			console.log('projectName: ', projectName);
			documentName = fields.file_name[0];
			console.log('documentName: ', documentName);
		});

		// var str = 'p-' + projectName + '-d' + documentName;
		// var documentHash = new Hashes.SHA256().hex(str);
		// var doc = sjs.get('documents', documentHash);
		// doc.subscribe();
		// doc.whenReady(function () {
		// 	if (!doc.type) {
		// 		doc.create('text');
		// 	}
		// 	if (doc.type && doc.type.name === 'text') {
		// 		doc.attachCodeMirror(cm);
		// 	}
		// });

	}
};

module.exports = uploadController;