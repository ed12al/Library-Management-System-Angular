angular.module("book.service", ["common.constants"])
.factory("BookService", function($resource, CommonConstants){
	return {
		getAllBooks: $resource(CommonConstants.URL_GET_BOOKS),
		getBook: $resource(CommonConstants.URL_GET_BOOK, {bookId:"@id"}, {
			remove : {method : "DELETE", isArray : true},
			update : {method : "PUT", isArray : true}
		}),
		addBook: $resource(CommonConstants.URL_ADD_BOOK, {}, {
			save : {method : "POST", isArray : true}
		}),
		editBook: $resource(CommonConstants.URL_EDIT_BOOK, {bookId:"@id"}),
		addGenre: $resource(CommonConstants.URL_ADD_GENRE, {}, {
			save : {method : "POST", isArray : true}
		})
	}
})