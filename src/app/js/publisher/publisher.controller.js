angular.module("publisher.controller", ["ngAnimate", "ngSanitize", "ui.bootstrap", "toastr"])
.filter('startFrom', function() {
	return function(input, start) {
		if (input === undefined) {
			return input;
      	} else {
        	return input.slice(start);
    	}
  	};
}).controller("PublisherController", function($rootScope, $scope, $uibModal, PublisherService, publishers, toastr){
	$scope.publishers = publishers;
	$scope.totalItems = $scope.publishers.length;
  $scope.currentPage = 1;
  $scope.itemsPerPage = 10;
  $scope.maxSize = 5;
  $scope.$watch("publishers", function(newValue, oldValue, scope){
    $scope.totalItems = newValue.length;
  });
  $scope.searchPublishers = function(){
    PublisherService.getAllPublishers.query({searchString: $scope.searchString}).$promise.then(function(response){
      $scope.publishers = response;
    });
  }

  $scope.openAddPublisherModal = function(){
    var searchString = $scope.searchString;
    var modalInstance = $uibModal.open({
      templateUrl: "views/publisher/addPublisherModal.html",
      size: "lg",
      controller: function($scope, $uibModalInstance, publisher){
        $scope.publisher = publisher;
        $scope.close = function(){
          $uibModalInstance.dismiss("close");
        };
        $scope.ok = function(){
          $uibModalInstance.close(PublisherService.addPublisher.save({searchString : searchString}, $scope.publisher).$promise);
        }
      },
      resolve: {
        publisher : function(){
          return PublisherService.addPublisher.get().$promise;
        }
      }
    });

    modalInstance.result.then(function(publishers){
      $scope.publishers = publishers;
      toastr["success"]("Good");
    }, function(error){
      if(error.status && error.status === 400) toastr["error"]("Bad Request");
      console.log(error);
    });
  }

  $scope.openViewPublisherModal = function(publisher){
    $uibModal.open({
      templateUrl: "views/publisher/viewPublisherModal.html",
      size: "lg",
      controller: function($scope, $uibModalInstance, publisher){
        $scope.publisher = publisher;
        $scope.close = function(){
          $uibModalInstance.dismiss("close");
        };
      },
      resolve: {
        publisher : function(){
          return PublisherService.getPublisher.get({publisherId: publisher.publisherId}).$promise;
        }
      }
    });
  }
  
  $scope.openEditPublisherModal = function(publisher){
    var searchString = $scope.searchString;
    var modalInstance = $uibModal.open({
      templateUrl: "views/publisher/editPublisherModal.html",
      size: "lg",
      controller: function($scope, $uibModalInstance, publisher){
        $scope.publisher = publisher;
        $scope.close = function(){
          $uibModalInstance.dismiss("close");
        };        
        $scope.ok = function(){
          $uibModalInstance.close(PublisherService.getPublisher.update({publisherId : publisher.publisherId, searchString : searchString}, $scope.publisher).$promise);
        }
      },
      resolve: {
        publisher : function(){
          return PublisherService.getPublisher.get({publisherId: publisher.publisherId}).$promise;
        }
      }
    });

    modalInstance.result.then(function(publishers){
      $scope.publishers = publishers;
      toastr["success"]("Good");
    }, function(error){
      if(error.status && error.status === 400) toastr["error"]("Bad Request");
      console.log(error);
    });
  }

  $scope.openDeletePublisherModal = function(publisher){
    var searchString = $scope.searchString;
    var modalInstance = $uibModal.open({
      templateUrl: "views/publisher/deletePublisherModal.html",
      size: "lg",
      controller: function($scope, $uibModalInstance){
        $scope.publisher = publisher;
        $scope.close = function(){
          $uibModalInstance.dismiss("close");
        };
        $scope.ok = function(){
          $uibModalInstance.close(PublisherService.getPublisher.remove({publisherId : publisher.publisherId, searchString : searchString}).$promise);
        }
      }
    });

    modalInstance.result.then(function(publishers){
      $scope.publishers = publishers;
      toastr["success"]("Good");
    }, function(error){
      if(error.status && error.status === 400) toastr["error"]("Bad Request");
      console.log(error);
    });
  }
})