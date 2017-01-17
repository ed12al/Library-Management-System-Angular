angular.module("author.controller", ["ngAnimate", "ngSanitize", "ui.bootstrap", "toastr"])
.filter('startFrom', function() {
	return function(input, start) {
		if (input === undefined) {
			return input;
      	} else {
        	return input.slice(start);
    	}
  	};
}).controller("AuthorController", function($rootScope, $scope, $uibModal, AuthorService, authors, toastr){
	$scope.authors = authors;
	$scope.totalItems = $scope.authors.length;
  $scope.currentPage = 1;
  $scope.itemsPerPage = 10;
  $scope.maxSize = 5;
  $scope.$watch("authors", function(newValue, oldValue, scope){
    $scope.totalItems = newValue.length;
  });
  $scope.searchAuthors = function(){
    AuthorService.getAllAuthors.query({searchString: $scope.searchString}).$promise.then(function(response){
      $scope.authors = response;
    });
  }

  $scope.openAddAuthorModal = function(){
    var searchString = $scope.searchString;
    var modalInstance = $uibModal.open({
      templateUrl: "views/author/addAuthorModal.html",
      size: "lg",
      controller: function($scope, $uibModalInstance, author){
        $scope.author = author;
        $scope.close = function(){
          $uibModalInstance.dismiss("close");
        };
        $scope.ok = function(){
          $uibModalInstance.close(AuthorService.addAuthor.save({searchString : searchString}, $scope.author).$promise);
        }
      },
      resolve: {
        author : function(){
          return AuthorService.addAuthor.get().$promise;
        }
      }
    });

    modalInstance.result.then(function(authors){
      $scope.authors = authors;
     toastr["success"]("Good");
    }, function(error){
      if(error.status && error.status === 400) toastr["error"]("Bad Request"); 
      console.log(error);
    });
  }

  $scope.openViewAuthorModal = function(author){
    $uibModal.open({
      templateUrl: "views/author/viewAuthorModal.html",
      size: "lg",
      controller: function($scope, $uibModalInstance, author){
        $scope.author = author;
        $scope.close = function(){
          $uibModalInstance.dismiss("close");
        };
      },
      resolve: {
        author : function(){
          return AuthorService.getAuthor.get({authorId: author.authorId}).$promise;
        }
      }
    });
  }

  $scope.openEditAuthorModal = function(author){
    var searchString = $scope.searchString;
    var modalInstance = $uibModal.open({
      templateUrl: "views/author/editAuthorModal.html",
      size: "lg",
      controller: function($scope, $uibModalInstance, author){
        $scope.author = author;
        $scope.close = function(){
          $uibModalInstance.dismiss("close");
        };        
        $scope.ok = function(){
          $uibModalInstance.close(AuthorService.getAuthor.update({authorId : author.authorId, searchString : searchString}, $scope.author).$promise);
        }
      },
      resolve: {
        author : function(){
          return AuthorService.getAuthor.get({authorId: author.authorId}).$promise;
        }
      }
    });

    modalInstance.result.then(function(authors){
      $scope.authors = authors;
      toastr["success"]("Good");
    }, function(error){
      if(error.status && error.status === 400) toastr["error"]("Bad Request"); 
      console.log(error);
    });
  }

  $scope.openDeleteAuthorModal = function(author){
    var searchString = $scope.searchString;
    var modalInstance = $uibModal.open({
      templateUrl: "views/author/deleteAuthorModal.html",
      size: "lg",
      controller: function($scope, $uibModalInstance){
        $scope.author = author;
        $scope.close = function(){
          $uibModalInstance.dismiss("close");
        };
        $scope.ok = function(){
          $uibModalInstance.close(AuthorService.getAuthor.remove({authorId : author.authorId, searchString : searchString}).$promise);
        }
      }
    });

    modalInstance.result.then(function(authors){
      $scope.authors = authors;
      toastr["success"]("Good");
    }, function(error){
      if(error.status && error.status === 400) toastr["error"]("Bad Request"); 
      console.log(error);
    });
  }
})