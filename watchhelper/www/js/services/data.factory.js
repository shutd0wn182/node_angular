angular.module('watchHelper').factory('filmFactory', ['$http', 'toolsFactory', function ($http, toolsFactory) {
    var addFilmUrl = 'https://evening-oasis-38864.herokuapp.com/addfilm/token=myapp';
    // var addFilmUrl = 'http://localhost:5000/addfilm/token=myapp';

    return {
        getFilmData : function (_url, _email) {
            return $http.post(_url,
                {
                    userEmail : _email
                }).then(
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
                    userEmail : (_email) ? _email : toolsFactory.getCookie('userEmail')
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