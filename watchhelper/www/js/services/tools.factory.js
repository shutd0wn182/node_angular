angular.module('watchHelper').factory('toolsFactory', ['$http', function($http){
    var sessionUrl = 'http://localhost:5000/authentication/token=myapp';

    return {
        setSession : function(_email) {
            return $http.post(sessionUrl, {
                userEmail : _email
            }).then(
                function (response) {
                    return response.data;
                },
                function (error) {
                    console.error('ERROR in setting session', error);
                }
            );
        },

        getSession : function(){
            return $http.post(sessionUrl).then(
                function (response) {
                    return response.data;
                },
                function (error) {
                    console.error('error in getting session', error);
                }
            )
        }
    }
}]);