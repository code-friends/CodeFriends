//mongoDB
// //folder architecture for a project
// var projectSchema = new mongoose.Schema({
//   projectName: String,
//   projectFileTree: String // obj_json_str
// });

//mongoDB
  //insert the straight up mongo

//MySQL
var knex = require('knex')({
  
  client: 'mysql',
  connection: {
    host: '',
    user: '',
    password: '',
    database: '',
    charset: ''
  
  }

});

var bookshelf = require('bookshelf')(knex);

var User = bookshelf.Model.extend({
  tableName: 'users'
  hasTimestamps: true
});

var Project = bookshelf.Model.extend({
  tableName: 'projects',
  hasTimestamps: true
});


module.exports = mongoose.model('fileMDB', fileSchema);
module.exports = mongoose.model('projectMDB', projectSchema);
