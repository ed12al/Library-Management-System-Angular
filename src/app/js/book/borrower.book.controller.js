angular.module("borrower.book.controller", ["ngAnimate", "ngSanitize", "ui.bootstrap", "toastr"])
.filter('startFrom', function() {
	return function(input, start) {
		if (input === undefined) {
			return input;
      	} else {
        	return input.slice(start);
    	}
  	};
}).controller("BorrowerBookController", function($rootScope, $scope, $uibModal, BorrowerBookService, books, toastr){
  $scope.books = books;
  $scope.totalItems = $scope.books.length;
  $scope.currentPage = 1;
  $scope.itemsPerPage = 10;
  $scope.maxSize = 5;
  $scope.$watch("books", function(newValue, oldValue, scope){
    $scope.totalItems = newValue.length;
  });
  $scope.getBorrower = function(){
  	var cardNo = $scope.cardNo ? $scope.cardNo : 0;
  	BorrowerBookService.getBorrower.get({cardNo: cardNo}).$promise.then(function(response){
      $scope.borrower = response;
    }, function(error){
      $scope.borrower = undefined;
    });
  };

  $scope.searchBooks = function(){
    BorrowerBookService.getAllBooks.query({searchString: $scope.searchString}).$promise.then(function(response){
      $scope.books = response;
    });
  };

  $scope.openViewBookModal = function(book){
    $uibModal.open({
      templateUrl: "views/book/viewBookModal.html",
      size: "lg",
      controller: function($scope, $uibModalInstance, book){
        $scope.book = book;
        $scope.close = function(){
          $uibModalInstance.dismiss("close");
        };
      },
      resolve: {
        book : function(){
          return BorrowerBookService.getBook.get({bookId: book.bookId}).$promise;
        }
      }
    });
  };

  $scope.openBorrowBookModal = function(book){
  	var borrower = $scope.borrower;
    var searchString = $scope.searchString;
    if(borrower === undefined){
      toastr["error"]("Please enter an valid card number first!");
      return;
    }
    var modalInstance = $uibModal.open({
      templateUrl: "views/book/borrowBookModal.html",
      size: "lg",
      controller: function($scope, $uibModalInstance, bookCopy){
        $scope.bookCopy = bookCopy;
        $scope.book = book;
        $scope.close = function(){
          $uibModalInstance.dismiss("close");
        };
        $scope.ok = function(bc){
          $uibModalInstance.close(BorrowerBookService.borrowBook.post({cardNo : borrower.cardNo, searchString : searchString}, bc).$promise);
        };
      },
      resolve: {
        bookCopy : function(){
          return BorrowerBookService.getBookCopy.query({bookId: book.bookId}).$promise;
        }
      }
    });
    modalInstance.result.then(function(books){
      $scope.books = books;
      toastr["success"]("Good");
    }, function(error){
      if(error.status && error.status === 400) toastr["error"]("Bad Request");
      console.log(error);
    });
  };

  $scope.openReturnBookModal = function(){
    var borrower = $scope.borrower;
    var searchString = $scope.searchString;
    if(borrower === undefined){
      toastr["error"]("Please enter an valid card number first!");
      return;
    }
    var modalInstance = $uibModal.open({
      templateUrl: "views/book/returnBookModal.html",
      size: "lg",
      controller: function($scope, $uibModalInstance, borrower){
        $scope.borrower = borrower;
        $scope.close = function(){
          $uibModalInstance.dismiss("close");
        };
        $scope.ok = function(loan){
          $uibModalInstance.close(BorrowerBookService.returnBook.update({searchString : searchString}, loan).$promise);
        };
      },
      resolve: {
        borrower : function(){
          return BorrowerBookService.getBorrowerDetail.get({cardNo: borrower.cardNo}).$promise;
        }
      }
    });
    modalInstance.result.then(function(books){
      $scope.books = books;
      toastr["success"]("Good");
    }, function(error){
      if(error.status && error.status === 400) toastr["error"]("Bad Request");
      console.log(error);
    });
  };
})