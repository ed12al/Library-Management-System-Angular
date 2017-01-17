angular.module("publisher.service", ["common.constants"])
.factory("PublisherService", function($resource, CommonConstants){
	return {
		getAllPublishers: $resource(CommonConstants.URL_GET_PUBLISHERS),
		getPublisher: $resource(CommonConstants.URL_GET_PUBLISHER, {publisherId:"@id"}, {
			remove : {method : "DELETE", isArray : true},
			update : {method : "PUT", isArray : true}
		}),
		addPublisher: $resource(CommonConstants.URL_ADD_PUBLISHER, {}, {
			save : {method : "POST", isArray : true}
		})
	}
})