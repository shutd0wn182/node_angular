angular.module('watchHelper').controller('mainCtrl', ['filmFactory', function (filmFactory) {
    // var dbUrl = 'http://evening-oasis-38864.herokuapp.com/getfilms/token=myapp';
    var dbUrl = 'http://localhost:5000/getfilms/token=myapp';

    this.getFilmData = function () {
        filmFactory.getFilmData(dbUrl).then(function (value) {
            this.filmData = value;

            /*temporarily*/
            angular.forEach(this.filmData, function (val,key) {
                if(key % 2){
                    val.status = key;
                }
            });
        }.bind(this));
    };

    this.getFilmData();

    this.addFilm = function () {
        filmFactory.addFilm(this.url).then(function (value) {
            this.getFilmData();
        }.bind(this));
    };

}]);