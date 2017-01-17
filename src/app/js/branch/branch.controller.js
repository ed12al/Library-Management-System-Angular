angular.module("branch.controller", ["ngAnimate", "ngSanitize", "ui.bootstrap", "toastr"])
.filter('startFrom', function() {
	return function(input, start) {
		if (input === undefined) {
			return input;
      	} else {
        	return input.slice(start);
    	}
  	};
}).controller("BranchController", function($rootScope, $scope, $uibModal, BranchService, branches, toastr){
	$scope.branches = branches;
	$scope.totalItems = $scope.branches.length;
  $scope.currentPage = 1;
  $scope.itemsPerPage = 10;
  $scope.maxSize = 5;
  $scope.$watch("branches", function(newValue, oldValue, scope){
    $scope.totalItems = newValue.length;
  });
  $scope.searchBranches = function(){
    BranchService.getAllBranches.query({searchString: $scope.searchString}).$promise.then(function(response){
      $scope.branches = response;
    });
  }

  $scope.openAddBranchModal = function(){
    var searchString = $scope.searchString;
    var modalInstance = $uibModal.open({
      templateUrl: "views/branch/addBranchModal.html",
      size: "lg",
      controller: function($scope, $uibModalInstance, branch){
        $scope.branch = branch;
        $scope.close = function(){
          $uibModalInstance.dismiss("close");
        };
        $scope.ok = function(){
          $uibModalInstance.close(BranchService.addBranch.save({searchString : searchString}, $scope.branch).$promise);
        }
      },
      resolve: {
        branch : function(){
          return BranchService.addBranch.get().$promise;
        }
      }
    });

    modalInstance.result.then(function(branches){
      $scope.branches = branches;
      toastr["success"]("Good");
    }, function(error){
      if(error.status && error.status === 400) toastr["error"]("Bad Request");
      console.log(error);
    });
  }

  $scope.openViewBranchModal = function(branch){
    $uibModal.open({
      templateUrl: "views/branch/viewBranchModal.html",
      size: "lg",
      controller: function($scope, $uibModalInstance, branch){
        $scope.branch = branch;
        $scope.close = function(){
          $uibModalInstance.dismiss("close");
        };
      },
      resolve: {
        branch : function(){
          return BranchService.getBranch.get({branchId: branch.branchId}).$promise;
        }
      }
    });
  }
  
  $scope.openEditBranchModal = function(branch){
    var searchString = $scope.searchString;
    var modalInstance = $uibModal.open({
      templateUrl: "views/branch/editBranchModal.html",
      size: "lg",
      controller: function($scope, $uibModalInstance, branch){
        $scope.branch = branch;
        $scope.close = function(){
          $uibModalInstance.dismiss("close");
        };        
        $scope.ok = function(){
          $uibModalInstance.close(BranchService.getBranch.update({branchId : branch.branchId, searchString : searchString}, $scope.branch).$promise);
        }
      },
      resolve: {
        branch : function(){
          return BranchService.getBranch.get({branchId: branch.branchId}).$promise;
        }
      }
    });

    modalInstance.result.then(function(branches){
      $scope.branches = branches;
      toastr["success"]("Good");
    }, function(error){
      if(error.status && error.status === 400) toastr["error"]("Bad Request");
      console.log(error);
    });
  }

  $scope.openDeleteBranchModal = function(branch){
    var searchString = $scope.searchString;
    var modalInstance = $uibModal.open({
      templateUrl: "views/branch/deleteBranchModal.html",
      size: "lg",
      controller: function($scope, $uibModalInstance){
        $scope.branch = branch;
        $scope.close = function(){
          $uibModalInstance.dismiss("close");
        };
        $scope.ok = function(){
          $uibModalInstance.close(BranchService.getBranch.remove({branchId : branch.branchId, searchString : searchString}).$promise);
        }
      }
    });

    modalInstance.result.then(function(branches){
      $scope.branches = branches;
      toastr["success"]("Good");
    }, function(error){
      if(error.status && error.status === 400) toastr["error"]("Bad Request");
      console.log(error);
    });
  }
})