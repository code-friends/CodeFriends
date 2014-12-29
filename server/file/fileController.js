var Promise = require('bluebird');
var mongoClient =  Promise.promisifyAll(require('mongodb').MongoClient);
var Q = require('q');

var ProjectCollection = require('../models').collections.ProjectCollection;
var Project = require('../models').models.Project;

var fileController = {
  createNewFile: function (req, res) {
    console.log('CREATE NEW FILE');
    var userId = req.user.get('id');
    var projectName = req.body.project_name || req.param('project_name')
    var fileName = req.body.file_name || req.param('file_name');
    var projectId = req.body.project_id || req.param('project_id') || null;
    // path: req.body.path || req.param('path') || ''
    console.log(userId, projectName, projectId, fileName);

    // Check if name is valid
      // Only A-z0-9_- (no spaces, no whitespace)

    fileController.getFileStructure(projectId, projectName)
      .then(function (fileStructure) {
        console.log('File Structure');
        console.log(fileStructure);

        // If path is not empty
          // Check if path exists
        if (fileStructure === null) {
          return mongoClient.connectAsync('mongodb://localhost:27017/codeFriends?auto_reconnect')
            .then(function (db) {
              var projectCollection = Promise.promisifyAll(db.collection('project_file_structre'));
              projectCollection.insertAsync({project_id: project.get('id'), files: [fileName]});
            });
        }
        // Create Object with author, timeCreated
        // Update file structure for whole project in mongo
      })
      .catch(function (error) {
        console.log('Error:', error)
        res.status(400).end();
      });
  },
  getFileStructure: function (projectId, projectName) {
    return Q().then(function () {
      if (projectId !== null && projectId !== undefined) { // If project ID
        // Check if project ID exists
        return ProjectCollection
          .query('where', 'id', '=', projectId)
          .fetchOne();
      }
      // If project name
      if (projectName !== null && projectName !== undefined) {
        // Get project ID
        return ProjectCollection
          .query('where', 'project_name', '=', projectName)
          .fetchOne();
      }
      throw new Error('No Project ID or name specified')
    })
    .then(function (project) {
      // Get project structure form mongo
      return mongoClient.connectAsync('mongodb://localhost:27017/codeFriends?auto_reconnect')
        .then(function (db) {
          var projectCollection = Promise.promisifyAll(db.collection('project_file_structre'));
          return projectCollection.findOneAsync({project_id: project.get('id')})
            .then(function (projectFileStructure) {
              console.log('projectFileStructure:', projectFileStructure);
              db.close();
              return projectFileStructure;
            });
        })
        .catch(function (error) {
          console.log('Error Connecting to MongoDB', error);
        });
    });
  }
};

module.exports = fileController;