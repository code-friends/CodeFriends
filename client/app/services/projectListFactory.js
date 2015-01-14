/*global angular:true, moment:true, _:true */
(function () {
  'use strict';

  angular.module('codeFriends.services', [])
    .factory('ProjectListFactory', ProjectListFactory);

  ProjectListFactory.$inject = ['$http', '$upload'];

  function ProjectListFactory($http, $upload) {

    var factory = {
      userProjects: null,
      filename: null,
      updateName: updateName,
      getProjectId: getProjectId,
      createProject: createProject,
      getProjects: getProjects,
      addUser: addUser
    };
    return factory;


    function updateName(name) {
      factory.filename = name;
    }

    function getProjectId(projectName) {
      for (var i in projects) {
        if (projects.hasOwnProperty(i)) {
          if (projects[i].projectName === projectName) {
            return projects[i].id;
          }
        }
      }
      return null;
    }

    function createProject(projectName, files) {
      if (files !== undefined && Array.isArray(files) && files.length > 0) {
        return $upload.upload({
            method: 'POST',
            url: '/api/project/',
            data: {
              projectName: projectName,
            },
            file: files[0]
          })
          .catch(function (error) {
            console.log('Error Uploading File: ', error);
          });
      }
      return $http.post('/api/project', {
          projectName: projectName
        })
        .then(function (res) {
          return res.data;
        });
    }

    function getProjects() {
      return $http.get('api/project/')
        .then(function (res) {
          var projects = res.data;
          // Add all avatars
          projects.forEach(function (project) {
            project.avatars = [];
            project.user.forEach(function (user) {
              project.avatars.push(user.githubAvatarUrl);
            });
          });
          // Add Create String
          angular.forEach(projects, function (theProject) {
            theProject.createString = moment(theProject.createdAt).format('MMM Do YY');
            theProject.updateString = moment(theProject.updatedAt).format('MMM Do YY');
            theProject.timeAgoString = moment(theProject.updatedAt).fromNow();
          });
          return projects;
        })
        .then(function (_projects) {
          factory.userProjects = _projects;
          return _projects;

        });
    }

    function addUser(userName, projectName) {
      return $http.put('api/project/addUser', {
          newUserName: userName,
          projectName: projectName
        })
        .catch(function (error) {
          console.log('Error Adding User', error);
        });
    }

  }

})();