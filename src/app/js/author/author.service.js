angular.module("author.service", ["common.constants"])
.factory("AuthorService", function($resource, CommonConstants){
	return {
		getAllAuthors: $resource(CommonConstants.URL_GET_AUTHORS),
		getAuthor: $resource(CommonConstants.URL_GET_AUTHOR, {authorId:"@id"}, {
			remove : {method : "DELETE", isArray : true},
			update : {method : "PUT", isArray : true}
		}),
		addAuthor: $resource(CommonConstants.URL_ADD_AUTHOR, {}, {
			save : {method : "POST", isArray : true}
		})
	}
})