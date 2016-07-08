angular.module('watchHelper').factory('filmFactory', ['$http', 'toolsFactory', function ($http, toolsFactory) {
    // var addFilmUrl = 'https://evening-oasis-38864.herokuapp.com/addfilm/token=myapp';
    // var emailUrl = 'https://evening-oasis-38864.herokuapp.com/addnewuser/token=myapp';
    var addFilmUrl = 'http://localhost:5000/addfilm/token=myapp';
    var emailUrl = 'http://localhost:5000/addnewuser/token=myapp';

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
        },

        mailNewUser : function (_email) {
            return $http.post(emailUrl,
                {
                    userEmail : _email
                }
            ).then(
                function(response){
                    console.log('mailing new user response : ', response.data);
                },
                function (error) {
                    console.error('ERROR in mailing new user : ', error);
                }
            )
        }
    }
}]);