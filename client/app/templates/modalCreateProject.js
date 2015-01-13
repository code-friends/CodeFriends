(function () {
  angular.module('codeFriends.createProjectModalController', [])
    .controller('createProjectModalController', ['$scope', '$modalInstance', '$upload', 'ProjectsFactory', function ($scope, $modalInstance, $upload, ProjectsFactory) {
      $scope.files = null;
      $scope.onFileSelect = function (files) {
        $scope.files = files;
      };

      $scope.closeModal = function () {
        console.log('closeModal');
        console.log($scope.files);
        if ($scope.newProjectName !== undefined) {
          ProjectsFactory.createProject($scope.newProjectName, $scope.files)
            .then(function () {
              $modalInstance.close();
            });
        }
      };

    }]);
  //   .controller('createProjectModalController', createProjectModalController);

  // createProjectModalController.$inject = ['$modalInstance', '$upload', 'ProjectsFactory'];
  // console.log('Done Injecting');

  // function createProjectModalController($modalInstance, $upload, ProjectsFactory) {

  //   console.log('0. $modalInstance', $modalInstance);

  //   var vm = this;
  //   vm.files = null;
  //   vm.onFileSelect = onFileSelect;
  //   vm.closeModal = closeModal;

  //   function onFileSelect(files) {
  //     vm.files = files;
  //   }

  //   function closeModal($modalInstance) {
  //     console.log('1. $modalInstance', $modalInstance);
  //     if (vm.newProjectName !== undefined) {
  //       console.log('2. $modalInstance', $modalInstance);
  //       ProjectsFactory.createProject(vm.newProjectName, vm.files)
  //         .then(function () {
  //           console.log('3. $modalInstance', $modalInstance);
  //           $modalInstance.close();
  //         });
  //     }
  //   }
  //   console.log('End createProjectModalController');
  // }
})();

// .controller('createProjectModalController', function ($scope, $modalInstance, $upload, ProjectsFactory) {
//   $scope.files = null;
//   $scope.onFileSelect = function (files) {
//     $scope.files = files;
//   };

//   $scope.closeModal = function () {
//     console.log('closeModal');
//     console.log($scope.files);
//     if ($scope.newProjectName !== undefined) {
//       ProjectsFactory.createProject($scope.newProjectName, $scope.files)
//         .then(function () {
//           $modalInstance.close();
//         });
//     }
//   };
// });