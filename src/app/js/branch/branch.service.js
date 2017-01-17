angular.module("branch.service", ["common.constants"])
.factory("BranchService", function($resource, CommonConstants){
	return {
		getAllBranches: $resource(CommonConstants.URL_GET_BRANCHES),
		getBranch: $resource(CommonConstants.URL_GET_BRANCH, {branchId:"@id"}, {
			remove : {method : "DELETE", isArray : true},
			update : {method : "PUT", isArray : true}
		}),
		addBranch: $resource(CommonConstants.URL_ADD_BRANCH, {}, {
			save : {method : "POST", isArray : true}
		})
	}
})