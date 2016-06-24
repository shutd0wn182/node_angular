angular.module('watchHelper').factory('filmFactory', ['$http', function ($http) {
    // var addFilmUrl = 'http://evening-oasis-38864.herokuapp.com/addfilm/token=myapp';
    var addFilmUrl = 'http://localhost:5000/addfilm/token=myapp';

    return {
        getFilmData : function (_url) {
            return $http.post(_url).then(
                function (response) {
                    return response.data;
                },
                function (error) {
                    console.error('ERROR! Problem with connection to server ', error);
                }
            );
        },

        addFilm : function (_url, _email) {
            return $http.post(addFilmUrl,
                {
                    filmUrl : _url,
                    userEmail : _email
                }).then(
                function (response) {
                    return response.data;
                },
                function (error) {
                    console.error('ERROR! ', error);
                }
            );
        }
    }
}]);