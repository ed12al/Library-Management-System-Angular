angular.module("librarian.branch.controller", ["ngAnimate", "ngSanitize", "ui.bootstrap", "toastr"])
.filter('startFrom', function() {
	return function(input, start) {
		if (input === undefined) {
			return input;
      	} else {
        	return input.slice(start);
    	}
  	};
}).controller("LibrarianBranchController", function($rootScope, $scope, $uibModal, LibrarianBranchService, branches, toastr){
	$scope.branches = branches;
	$scope.totalItems = $scope.branches.length;
  $scope.currentPage = 1;
  $scope.itemsPerPage = 10;
  $scope.maxSize = 5;
  $scope.$watch("branches", function(newValue, oldValue, scope){
    $scope.totalItems = newValue.length;
  });
  $scope.searchBranches = function(){
    LibrarianBranchService.getAllBranches.query({searchString: $scope.searchString}).$promise.then(function(response){
      $scope.branches = response;
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
          return LibrarianBranchService.getBranch.get({branchId: branch.branchId}).$promise;
        }
      }
    });
  }
  
  $scope.openEditBranchModal = function(branch){
    var searchString = $scope.searchString;
    var modalInstance = $uibModal.open({
      templateUrl: "views/branch/editLibrarianBranchModal.html",
      size: "lg",
      controller: function($scope, $uibModalInstance, data){
        $scope.branch = data.branch;
        $scope.allBooks = data.allBooks;
        $scope.totalItems = $scope.allBooks.length;
        $scope.currentPage = 1;
        $scope.itemsPerPage = 5;
        $scope.maxSize = 3;
        $scope.addBookCopy = function(book){
          var bc = $scope.branch.bookCopy.find(function(bc){
            if(bc.book.bookId === book.bookId) return bc;
          });
          if(bc){
            bc.noOfCopies++;
          }else{
            $scope.branch.bookCopy.push({
              book: book,
              noOfCopies : 1
            });
          }
        }
        $scope.close = function(){
          $uibModalInstance.dismiss("close");
        };        
        $scope.ok = function(){
          $uibModalInstance.close(LibrarianBranchService.getBranch.update({branchId : branch.branchId, searchString : searchString}, $scope.branch).$promise);
        }
      },
      resolve: {
        data : function(){
          return LibrarianBranchService.editBranch.get({branchId: branch.branchId}).$promise;
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