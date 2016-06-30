class commonService {
    constructor($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }

    getControllerDetails(fileObj) {
        var defferred = this.$q.defer();
        //Get the angular dependency services
        this.$http.post("/getDependencies", {
            fileObj: fileObj
        }).then(
            function(response) {
                defferred.resolve(response.data);

            },
            function(response) {
                defferred.reject(response);

            });
        return defferred.promise;
    }
}

commonService.$inject=['$http','$q'];
export default commonService;