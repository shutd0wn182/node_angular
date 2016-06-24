angular.module('watchHelper').factory('filmFactory', ['$http', '$q', function ($http, $q) {
    // var addFilmUrl = 'http://evening-oasis-38864.herokuapp.com/addfilm/token=myapp';
    var addFilmUrl = 'http://localhost:5000/addfilm/token=myapp';

    return {
        getFilmData : function (_url) {
            var deferred = $q.defer();

            $http.post(_url).then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (error) {
                    console.error('ERROR! Problem with connection to server ', error);
                }
            );

            return deferred.promise;
        },
        
        addFilm : function (_url, _email) {
            var deferred = $q.defer();

            $http.post(addFilmUrl,
                {
                    filmUrl : _url,
                    userEmail : _email
                }).then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (error) {
                    console.error('ERROR! ', error);
                }
            );

            return deferred.promise;
        }
    }
}]);