var libraryApp = angular.module("libraryApp", ["ngRoute", "ngResource", "author.controller", "author.service", "publisher.controller", "publisher.service",
	"branch.controller", "branch.service", "borrower.controller", "borrower.service", "loan.controller", "loan.service", "book.controller", "book.service",
	"librarian.branch.controller", "librarian.branch.service", "borrower.book.controller", "borrower.book.service"]);

libraryApp.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl : 'views/welcome.html'
	}).when('', {
		redirectTo : '/'
	}).when('/admin/authors', {
		templateUrl : 'views/author/authors.html',
		controller: 'AuthorController',
		resolve: {
			authors: function(AuthorService){
				return AuthorService.getAllAuthors.query().$promise;
			}
		}
	}).when('/admin/publishers', {
		templateUrl : 'views/publisher/publishers.html',
		controller: 'PublisherController',
		resolve: {
			publishers: function(PublisherService){
				return PublisherService.getAllPublishers.query().$promise;
			}
		}
	}).when('/admin/books', {
		templateUrl : 'views/book/books.html',
		controller: 'BookController',
		resolve: {
			books: function(BookService){
				return BookService.getAllBooks.query().$promise;
			}
		}
	}).when('/admin/branches', {
		templateUrl : 'views/branch/branches.html',
		controller: 'BranchController',
		resolve: {
			branches: function(BranchService){
				return BranchService.getAllBranches.query().$promise;
			}
		}
	}).when('/admin/borrowers', {
		templateUrl : 'views/borrower/borrowers.html',
		controller: 'BorrowerController',
		resolve: {
			borrowers: function(BorrowerService){
				return BorrowerService.getAllBorrowers.query().$promise;
			}
		}
	}).when('/admin/loans', {
		templateUrl : 'views/loan/loans.html',
		controller: 'LoanController',
		resolve: {
			loans: function(LoanService){
				return LoanService.getAllLoans.query().$promise.then(function(response){
					return response.map(function(loan){
						loan["dueDate"] = new Date(loan["dueDate"]+" 00:00:00");
						return loan;
					})
				}).then(function(response){
					return response;
				})
			}
		}
	}).when('/admin', {
		redirectTo : '/admin/authors'
	}).when('/librarian', {
		templateUrl : 'views/branch/librarianbranches.html',
		controller: 'LibrarianBranchController',
		resolve: {
			branches: function(LibrarianBranchService){
				return LibrarianBranchService.getAllBranches.query().$promise;
			}
		}
	}).when('/borrower', {
		templateUrl : 'views/book/borrowerbook.html',
		controller: 'BorrowerBookController',
		resolve: {
			books: function(BorrowerBookService){
				return BorrowerBookService.getAllBooks.query().$promise;
			}
		}
	}).otherwise({
		redirectTo : '/'
	});
} ])