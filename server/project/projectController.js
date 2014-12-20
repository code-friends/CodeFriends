// var projectModel = require('./projectModel.js');


var projectController = {};

projectController.post = function (req, res) {
  res.status(200).end();
};

projectController.get = function (req, res) {
  //dummy data, currently an array of projects as objects
  res.json([{
    name: 'doc1',
    createdAt: 'Fri, 19 Dec 2014 00:58:17 GMT'
  }, {
    name: 'doc2',
    createdAt: 'Tue, 16 Dec 2014 00:58:17 GMT'
  }, {
    name: 'doc3',
    createdAt: 'Tue, 16 Dec 2014 00:58:17 GMT'
  }, {
    name: 'doc4',
    createdAt: 'Tue, 16 Dec 2014 00:58:17 GMT'
  }]);
};

projectController.getProject = function (req, res) {
  //dummy data
  res.json({
    indexhtml: 'htmlcodehtmlcode'
  });
};

projectController.put = function (req, res) {
  res.status(200).end();
};

projectController.delete = function (req, res) {
  res.status(200).end();
};

module.exports = projectController;