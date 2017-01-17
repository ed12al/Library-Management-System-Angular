angular.module("book.controller", ["ngAnimate", "ngSanitize", "ui.bootstrap", "toastr"])
.filter('startFrom', function() {
	return function(input, start) {
		if (input === undefined) {
			return input;
      	} else {
        	return input.slice(start);
    	}
  	};
}).controller("BookController", function($rootScope, $scope, $uibModal, BookService, books, toastr, PublisherService, AuthorService){
	$scope.books = books;
	$scope.totalItems = $scope.books.length;
  $scope.currentPage = 1;
  $scope.itemsPerPage = 10;
  $scope.maxSize = 5;
  $scope.$watch("books", function(newValue, oldValue, scope){
    $scope.totalItems = newValue.length;
  });
  $scope.searchBooks = function(){
    BookService.getAllBooks.query({searchString: $scope.searchString}).$promise.then(function(response){
      $scope.books = response;
    });
  }

  $scope.openAddBookModal = function(){
    var searchString = $scope.searchString;
    var modalInstance = $uibModal.open({
      templateUrl: "views/book/addBookModal.html",
      size: "lg",
      controller: function($scope, $uibModalInstance, data){
        $scope.book = data.book;
        $scope.newPublisher = data.newPublisher;
        $scope.newGenre = data.newGenre;
        $scope.newAuthor = data.newAuthor;
        $scope.allPublishers = data.allPublishers;
        $scope.allGenres = data.allGenres;
        $scope.allAuthors = data.allAuthors;

        $scope.addPublisher = function(){
          PublisherService.addPublisher.save({}, $scope.newPublisher).$promise.then(function(response){
            $scope.allPublishers = response;
            $scope.newPublisher.publisherName = null;
            $scope.newPublisher.publisherAddress = null;
            $scope.newPublisher.publisherPhone = null;
            toastr["success"]("Good");
          }, function(error){
            if(error.status && error.status === 400) toastr["error"]("Bad Request");
            console.log(error);
          })
        }

        $scope.addGenre = function(){
          BookService.addGenre.save({}, $scope.newGenre).$promise.then(function(response){
            $scope.allGenres = response;
            $scope.newGenre.genreName = null;
            toastr["success"]("Good");
          }, function(error){
            if(error.status && error.status === 400) toastr["error"]("Bad Request");
            console.log(error);
          })
        }

        $scope.addAuthor = function(){
          AuthorService.addAuthor.save({}, $scope.newAuthor).$promise.then(function(response){
            $scope.allAuthors = response;
            $scope.newAuthor.authorName = null;
            toastr["success"]("Good");
          }, function(error){
            if(error.status && error.status === 400) toastr["error"]("Bad Request");
            console.log(error);
          })
        }

        $scope.close = function(){
          $uibModalInstance.dismiss("close");
        };
        $scope.ok = function(){
          $uibModalInstance.close(BookService.addBook.save({searchString : searchString}, $scope.book).$promise);
        }
      },
      resolve: {
        data : function(){
          return BookService.addBook.get().$promise;
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
  }

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
          return BookService.getBook.get({bookId: book.bookId}).$promise;
        }
      }
    });
  }

  $scope.openEditBookModal = function(book){
    var searchString = $scope.searchString;
    var modalInstance = $uibModal.open({
      templateUrl: "views/book/editBookModal.html",
      size: "lg",
      controller: function($scope, $uibModalInstance, data){
        $scope.book = data.book;
        $scope.newPublisher = data.newPublisher;
        $scope.newGenre = data.newGenre;
        $scope.newAuthor = data.newAuthor;
        $scope.allPublishers = data.allPublishers;
        $scope.allGenres = data.allGenres;
        $scope.allAuthors = data.allAuthors;

        $scope.addPublisher = function(){
          PublisherService.addPublisher.save({}, $scope.newPublisher).$promise.then(function(response){
            $scope.allPublishers = response;
            $scope.newPublisher.publisherName = null;
            $scope.newPublisher.publisherAddress = null;
            $scope.newPublisher.publisherPhone = null;
            toastr["success"]("Good");
          }, function(error){
            if(error.status && error.status === 400) toastr["error"]("Bad Request");
            console.log(error);
          })
        }

        $scope.addGenre = function(){
          BookService.addGenre.save({}, $scope.newGenre).$promise.then(function(response){
            $scope.allGenres = response;
            $scope.newGenre.genreName = null;
            toastr["success"]("Good");
          }, function(error){
            if(error.status && error.status === 400) toastr["error"]("Bad Request");
            console.log(error);
          })
        }

        $scope.addAuthor = function(){
          AuthorService.addAuthor.save({}, $scope.newAuthor).$promise.then(function(response){
            $scope.allAuthors = response;
            $scope.newAuthor.authorName = null;
            toastr["success"]("Good");
          }, function(error){
            if(error.status && error.status === 400) toastr["error"]("Bad Request");
            console.log(error);
          })
        }
        $scope.close = function(){
          $uibModalInstance.dismiss("close");
        };        
        $scope.ok = function(){
          $uibModalInstance.close(BookService.getBook.update({bookId : book.bookId, searchString : searchString}, $scope.book).$promise);
        }
      },
      resolve: {
        data : function(){
          return BookService.editBook.get({bookId: book.bookId}).$promise;
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
  }

  $scope.openDeleteBookModal = function(book){
    var searchString = $scope.searchString;
    var modalInstance = $uibModal.open({
      templateUrl: "views/book/deleteBookModal.html",
      size: "lg",
      controller: function($scope, $uibModalInstance){
        $scope.book = book;
        $scope.close = function(){
          $uibModalInstance.dismiss("close");
        };
        $scope.ok = function(){
          $uibModalInstance.close(BookService.getBook.remove({bookId : book.bookId, searchString : searchString}).$promise);
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
  }
})