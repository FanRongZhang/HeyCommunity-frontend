HeyCommunity

.service('ActivityService', function($http) {
    this.index = function() {
        return $http.get(getApiUrl('/activity'));
    }
})
