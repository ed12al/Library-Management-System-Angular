angular.module("loan.service", ["common.constants"])
.factory("LoanService", function($resource, CommonConstants){
	return {
		getAllLoans: $resource(CommonConstants.URL_GET_LOANS),
		getLoan: $resource(CommonConstants.URL_GET_LOAN, {loanId:"@id"}, {
			remove : {method : "DELETE", isArray : true},
			update : {method : "PUT", isArray : true}
		})
	}
})