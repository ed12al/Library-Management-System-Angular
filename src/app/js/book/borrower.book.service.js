angular.module("borrower.book.service", ["common.constants"])
.factory("BorrowerBookService", function($resource, CommonConstants){
	return {
		getAllBooks: $resource(CommonConstants.URL_GET_BORROWER_BOOKS),
		getBook: $resource(CommonConstants.URL_GET_BORROWER_BOOK, {bookId:"@id"}),
		getBorrower: $resource(CommonConstants.URL_GET_LOGIN, {cardNo:"@id"}),
		getBookCopy: $resource(CommonConstants.URL_GET_BOOKCOPY, {bookId:"@id"}),
		borrowBook: $resource(CommonConstants.URL_BORROW_BOOK, {cardNo:"@id"}, {
			post : {method : "POST", isArray : true}
		}),
		getBorrowerDetail: $resource(CommonConstants.URL_GET_BORROWER_DETAIL, {cardNo:"@id"}),
		returnBook: $resource(CommonConstants.URL_RETURN_BOOK, {}, {
			update : {method : "PUT", isArray : true}
		})
	}
})