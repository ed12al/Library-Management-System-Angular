angular.module("loan.controller", ["ngAnimate", "ngSanitize", "ui.bootstrap", "toastr"])
.filter('startFrom', function() {
	return function(input, start) {
		if (input === undefined) {
			return input;
      	} else {
        	return input.slice(start);
    	}
  	};
}).controller("LoanController", function($rootScope, $scope, $uibModal, LoanService, loans, toastr){
	$scope.loans = loans;
	$scope.totalItems = $scope.loans.length;
  $scope.currentPage = 1;
  $scope.itemsPerPage = 10;
  $scope.maxSize = 5;
  $scope.seeAll = false;
  $scope.$watch("loans", function(newValue, oldValue, scope){
    $scope.totalItems = newValue.length;
  });
  $scope.dateOptions = {
    dateDisabled: disabled
  };
  function disabled(data) {
    var today = new Date();
    var yesterday = today.setDate(today.getDate() - 1);
    return (data.date < yesterday);
  }
  $scope.format = "yyyy-MM-dd";
  $scope.open = function(loan) {
    loan.opened = true;
  };

  $scope.searchLoans = function(){
    LoanService.getAllLoans.query({searchString: $scope.searchString, seeAll: $scope.seeAll}).$promise.then(function(response){
      return response.map(function(loan){
        loan["dueDate"] = new Date(loan["dueDate"]+" 00:00:00");
        return loan;
      });
    }).then(function(response){
        $scope.loans = response;
    });
  };

  $scope.updateDueDate = function(loan){ 
    LoanService.getLoan.update({loanId : loan.loanId, searchString : $scope.searchString, seeAll: $scope.seeAll}, loan).$promise.then(function(response){
      return response.map(function(loan){
        loan["dueDate"] = new Date(loan["dueDate"]+" 00:00:00");
        return loan;
      });
    }).then(function(response){
      $scope.loans = response;
    });
  };

  $scope.openDeleteLoanModal = function(loan){
    var searchString = $scope.searchString;
    var seeAll = $scope.seeAll;
    var modalInstance = $uibModal.open({
      templateUrl: "views/loan/deleteLoanModal.html",
      size: "lg",
      controller: function($scope, $uibModalInstance){
        $scope.loan = loan;
        $scope.close = function(){
          $uibModalInstance.dismiss("close");
        };
        $scope.ok = function(){
          $uibModalInstance.close(LoanService.getLoan.remove({loanId : loan.loanId, searchString : searchString, seeAll : seeAll}).$promise);
        }
      }
    });

    modalInstance.result.then(function(loans){
      return loans.map(function(loan){
        loan["dueDate"] = new Date(loan["dueDate"]+" 00:00:00");
        return loan;
      });
    }, function(error){
      if(error.status && error.status === 400) toastr["error"]("Bad Request");
    }).then(function(loans){
      $scope.loans = loans;
      toastr["success"]("Good");
    });
  }
})