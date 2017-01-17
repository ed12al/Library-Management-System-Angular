angular.module("borrower.service", ["common.constants"])
.factory("BorrowerService", function($resource, CommonConstants){
	return {
		getAllBorrowers: $resource(CommonConstants.URL_GET_BORROWERS),
		getBorrower: $resource(CommonConstants.URL_GET_BORROWER, {cardNo:"@id"}, {
			remove : {method : "DELETE", isArray : true},
			update : {method : "PUT", isArray : true}
		}),
		addBorrower: $resource(CommonConstants.URL_ADD_BORROWER, {}, {
			save : {method : "POST", isArray : true}
		})
	}
})