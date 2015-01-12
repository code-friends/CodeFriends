/*global angular:true, moment:true, _:true */
'use strict';

// factory for Projects, Auth, Toolbar
angular.module('code.services', [])
  // change this to projectsListingFactory later
  .factory('Projects', function ($http, $upload) {
    // gets projects from server, caches projects in factory and allows cb in controller to access projects
    var projects = {};
    projects.userProjects = null;
    projects.filename = null;

    projects.updateName = function (name) {
      this.filename = name;
    };

    projects.getProjectId = function (projectName) {
      for (var i in projects) {
        if (projects.hasOwnProperty(i)) {
          if (projects[i].projectName === projectName) {
            return projects[i].id;
          }
        }
      }
      return null;
    };

    projects.createProject = function (projectName, files) {
      console.log('projectName', projectName);
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
    };

    projects.getProjects = function () {
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
          projects.userProjects = _projects;
          return _projects;

        });
    };

    projects.addUser = function (userName, projectName) {
      return $http.put('api/project/addUser', {
          newUserName: userName,
          projectName: projectName
        })
        .catch(function (error) {
          console.log('Error Adding User', error);
        });
    };

    return projects;
  })
  .factory('SocketFactory', function (Auth, ngSocket, $stateParams) {
    var socketConnection = {};
    var locationName = window.location.hostname;
    var chatPort = window.config.ports.chat;
    var ws = ngSocket('ws://' + locationName + ':' + chatPort);
    var username = Auth.userName;
    var avatar = Auth.githubAvatarUrl;

    // Send joinedRoom message to the server
    ws.onOpen(function () {
      var connectionObj = {
        type: 'joinRoom',
        roomID: $stateParams.projectName,
        username: username,
        githubAvatar: avatar
      };
      ws.send(connectionObj);
    });

    ws.onMessage(function (msg) {
      msg = JSON.parse(msg.data);

      if (msg.roomID === $stateParams.projectName) {
        if (msg.type === 'attendence check') {
          ws.send({
            type: 'user present',
            roomID: $stateParams.projectName,
            username: username,
            githubAvatar: avatar
          });
        }
      }
    });

    socketConnection.usersOnline = function (callback, roomID) {
      ws.onMessage(function (msg) {
        msg = JSON.parse(msg.data);
        if (msg.roomID === roomID) {
          if (msg.type === 'refresh users') {
            callback(msg);
          }
        }
      });
    };

    socketConnection.onRefreshProject = function (callback) {
      ws.onMessage(function (msg) {
        var parsedMsg = JSON.parse(msg.data);
        if (parsedMsg.type === 'refresh project') {
          callback();
        }
      });
    };

    socketConnection.send = function (msg) {
      ws.send(msg);
    };

    socketConnection.onMessageHistory = function (messagecallback, roomID, usercallback) {
      ws.onMessage(function (msg) {
        msg = JSON.parse(msg.data);
        if (msg.roomID === roomID) {
          if (msg.type === 'msgHistory') {
            for (var i = 0; i < msg.messages.length; i++) {
              msg.messages[i].timeAgo = moment(msg.messages[i].createdAt).fromNow();
              messagecallback(msg.messages[i]);
            }
          }
        }
      });
    };

    socketConnection.onChat = function (callback, roomID) {
      ws.onMessage(function (msg) {
        var parsedMsg = JSON.parse(msg.data);
        if (parsedMsg.hasOwnProperty('message')) {
          if (parsedMsg.message.roomID === roomID) {
            var theDate = moment(parsedMsg.message.createdAt).fromNow();
            callback(parsedMsg.message);
          }
        }
      });
    };

    socketConnection.sendChat = function (chatParams) {
      ws.send(chatParams);
    };

    return socketConnection;
  })
  .factory('Auth', function ($http, $state, $q) {
    var Auth = {
      isLoggedIn: function (redirectToLogin) {
        return $http.get('/auth/user')
          .then(function (res) {
            Auth.userId = res.data.userId;
            Auth.userName = res.data.userName;
            Auth.githubAvatarUrl = res.data.githubAvatarUrl;
            if (res.data.userId === null) {
              if (redirectToLogin !== false) {
                return $state.go('login');
              }
              return false;
            }
            return {
              'userName': Auth.userName,
              'userId': Auth.userId,
              'githubAvatarUrl': Auth.githubAvatarUrl,
            };
          });
      },
      getUserName: function () {
        if (Auth.userName === undefined) {
          return Auth.isLoggedIn();
        } else {
          return $q.when({
            'userName': Auth.userName,
            'userId': Auth.userId,
            'githubAvatarUrl': Auth.githubAvatarUrl
          });
        }
      },
      userId: null
    };
    return Auth;
  })
  .factory('ToolbarDocument', function ($rootScope) {
    var ToolbarDocument = {
      changeTheme: function (theme) {
        ToolbarDocument.theme = theme;
        $rootScope.$broadcast('theme:changed', theme);
        $rootScope.$emit('theme:changed', theme);
      },
      theme: 'default'
    };
    return ToolbarDocument;
  })
  .factory('VideoFactory', function () {

    var webrtc = new SimpleWebRTC({
      // the id/element dom element that will hold "our" video
      localVideoEl: 'localVideo',
      // the id/element dom element that will hold remote videos
      remoteVideosEl: '',
      // immediately ask for camera access
      autoRequestMedia: false,
      debug: false,
      detectSpeakingEvents: true,
      adjustPeerVolume: true,
      autoAdjustMic: true
    });

    webrtc.startVideo = function () {
      webrtc.startLocalVideo();
    };

    return webrtc;
  })
  .factory('Files', function ($http) {
    var files = {};

    files.getAllFiles = function (projectName) {
      return $http.get('/api/project/' + projectName)
        .then(function (res) {
          files.files = res.data.files;
          return res.data.files;
        });
    };

    files._addNew = function (type) {
      return function (newFileName, projectName, path) {
        var filePath = newFileName;
        if (path) {
          filePath = path + '/' + newFileName;
        }
        return $http.post('/api/file', {
            filePath: filePath,
            projectName: projectName,
            type: type,
          })
          .then(function () {
            // Get files with added files
            return files.getAllFiles(projectName);
          })
          .catch(function (err) {
            console.log('Error POSTing new file', err);
          });
      };
    };
    files.addNewFile = files._addNew('file');
    files.addNewFolder = files._addNew('folder');
    return files;
  })
  .factory('ToolbarDocument', function ($rootScope) {
    var ToolbarDocument = {
      changeTheme: function (theme) {
        ToolbarDocument.theme = theme;
        $rootScope.$broadcast('theme:changed', theme);
        $rootScope.$emit('theme:changed', theme);
      },
      theme: 'default'
    };
    return ToolbarDocument;
  })
  // factory to get data for a single project
  .factory('ProjectFactory', function ($http) {
    var project = {};

    // returns all project data & caches files, id and name
    // calls folderPaths
    project.getProject = function (projectName) {
      return $http.get('/api/project/' + projectName)
        .then(function (res) {
          project.files = res.files;
          project.projectId = res.id;
          project.projectName = res.projectName;
          // project.getFolderPaths(res.files);
          return res.data;
        });
    };

    project.getFolderPaths = function (projectObj) {
      var paths = [];
      var recursive = function (project) {
        for (var file in project) {
          if (project[file].type === 'folder') {
            paths.push(project[file].path);
          }
          if (typeof project[file].files === 'object' && !Array.isArray(project[file].files)) {
            if (Object.keys(project[file].files).length !== 0) {
              recursive(project[file].files);
            }
          }
        }
      };
      recursive(projectObj);
      project.folderPaths = paths;
      return paths;
    };

    return project;
  });