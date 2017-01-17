angular.module("borrower.controller", ["ngAnimate", "ngSanitize", "ui.bootstrap", "toastr"])
.filter('startFrom', function() {
	return function(input, start) {
		if (input === undefined) {
			return input;
      	} else {
        	return input.slice(start);
    	}
  	};
}).controller("BorrowerController", function($rootScope, $scope, $uibModal, BorrowerService, borrowers, toastr){
	$scope.borrowers = borrowers;
	$scope.totalItems = $scope.borrowers.length;
  $scope.currentPage = 1;
  $scope.itemsPerPage = 10;
  $scope.maxSize = 5;
  $scope.$watch("borrowers", function(newValue, oldValue, scope){
    $scope.totalItems = newValue.length;
  });
  $scope.searchBorrowers = function(){
    BorrowerService.getAllBorrowers.query({searchString: $scope.searchString}).$promise.then(function(response){
      $scope.borrowers = response;
    });
  }

  $scope.openAddBorrowerModal = function(){
    var searchString = $scope.searchString;
    var modalInstance = $uibModal.open({
      templateUrl: "views/borrower/addBorrowerModal.html",
      size: "lg",
      controller: function($scope, $uibModalInstance, borrower){
        $scope.borrower = borrower;
        $scope.close = function(){
          $uibModalInstance.dismiss("close");
        };
        $scope.ok = function(){
          $uibModalInstance.close(BorrowerService.addBorrower.save({searchString : searchString}, $scope.borrower).$promise);
        }
      },
      resolve: {
        borrower : function(){
          return BorrowerService.addBorrower.get().$promise;
        }
      }
    });

    modalInstance.result.then(function(borrowers){
      $scope.borrowers = borrowers;
      toastr["success"]("Good");
    }, function(error){
      if(error.status && error.status === 400) toastr["error"]("Bad Request");
      console.log(error);
    });
  }

  $scope.openViewBorrowerModal = function(borrower){
    $uibModal.open({
      templateUrl: "views/borrower/viewBorrowerModal.html",
      size: "lg",
      controller: function($scope, $uibModalInstance, borrower){
        $scope.borrower = borrower;
        $scope.close = function(){
          $uibModalInstance.dismiss("close");
        };
      },
      resolve: {
        borrower : function(){
          return BorrowerService.getBorrower.get({cardNo: borrower.cardNo}).$promise;
        }
      }
    });
  }
  
  $scope.openEditBorrowerModal = function(borrower){
    var searchString = $scope.searchString;
    var modalInstance = $uibModal.open({
      templateUrl: "views/borrower/editBorrowerModal.html",
      size: "lg",
      controller: function($scope, $uibModalInstance, borrower){
        $scope.borrower = borrower;
        $scope.close = function(){
          $uibModalInstance.dismiss("close");
        };        
        $scope.ok = function(){
          $uibModalInstance.close(BorrowerService.getBorrower.update({cardNo : borrower.cardNo, searchString : searchString}, $scope.borrower).$promise);
        }
      },
      resolve: {
        borrower : function(){
          return BorrowerService.getBorrower.get({cardNo: borrower.cardNo}).$promise;
        }
      }
    });

    modalInstance.result.then(function(borrowers){
      $scope.borrowers = borrowers;
      toastr["success"]("Good");
    }, function(error){
      if(error.status && error.status === 400) toastr["error"]("Bad Request");
      console.log(error);
    });
  }

  $scope.openDeleteBorrowerModal = function(borrower){
    var searchString = $scope.searchString;
    var modalInstance = $uibModal.open({
      templateUrl: "views/borrower/deleteBorrowerModal.html",
      size: "lg",
      controller: function($scope, $uibModalInstance){
        $scope.borrower = borrower;
        $scope.close = function(){
          $uibModalInstance.dismiss("close");
        };
        $scope.ok = function(){
          $uibModalInstance.close(BorrowerService.getBorrower.remove({cardNo : borrower.cardNo, searchString : searchString}).$promise);
        }
      }
    });

    modalInstance.result.then(function(borrowers){
      $scope.borrowers = borrowers;
      toastr["success"]("Good");
    }, function(error){
      if(error.status && error.status === 400) toastr["error"]("Bad Request");
      console.log(error);
    });
  }
})