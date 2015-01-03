'use strict';
var Promise = require('bluebird');
var mongoClient = Promise.promisifyAll(require('mongodb').MongoClient);
var Q = require('q');
var moment = require('moment');
var multiparty = require('multiparty');
// var ProjectCollection = require('../models').collections.ProjectCollection;
// var Project = require('../models').models.Project;

var uploadController = {
	uploadNewFile: function (req, res) {
		var size = '';
		var file_name = '';
		var destination_path = '';
		var form = new multiparty.Form();

		form.on('error', function (err) {
			console.log('Error parsing form: ' + err.stack);
		});

		form.on('part', function (part) {
			console.log('part: !!!!!', part);
			if (!part.filename) {
				return;
			}
			size = part.byteCount;
			file_name = part.filename;
		});

		form.on('file', function (name, file) {
			console.log('name: ', name);
			console.log('file: ', file);
			// var temportal_path = file.path;
			// var extension = file.path.substring(file.path.lastIndexOf('.'));
			// var imageName = uuid.v4() + extension;
			// destination_path = path.join(__dirname, '/archives/', imageName);
			// var input_stream = fs.createReadStream(temportal_path);
			// var output_stream = fs.createWriteStream(destination_path);
			// input_stream.pipe(output_stream);
			// input_stream.on('end', function () {
			//   fs.unlinkSync(temportal_path);
			//   console.log('Uploaded: ', file_name, size);
			//   res.send(imageName);
			// });
		});

		form.on('close', function () {
			console.log('Uploaded!!');
		});

		form.parse(req);
	}
};

module.exports = uploadController;