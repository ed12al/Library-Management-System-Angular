angular.module("librarian.branch.service", ["common.constants"])
.factory("LibrarianBranchService", function($resource, CommonConstants){
	return {
		getAllBranches: $resource(CommonConstants.URL_GET_LIBRARIAN_BRANCHES),
		getBranch: $resource(CommonConstants.URL_GET_LIBRARIAN_BRANCH, {branchId:"@id"}, {
			update : {method : "PUT", isArray : true}
		}),
		editBranch: $resource(CommonConstants.URL_EDIT_LIBRARIAN_BRANCHES, {branchId:"@id"})
	}
})