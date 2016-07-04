angular.module('watchHelper').controller('mainCtrl', ['filmFactory', '$ionicPopup', '$scope', function (filmFactory, $ionicPopup, $scope) {
    // var dbUrl = 'http://evening-oasis-38864.herokuapp.com/getfilms/token=myapp';
    var dbUrl = 'http://localhost:5000/getfilms/token=myapp';
    /*create PopUP*/

    this.showPopup = function () {
        var myPopup = $ionicPopup.show({
            template: '<input type="email" ng-model="mC.email">',
            title: 'Enter your email',
            subTitle: 'Please type valid email',
            scope: $scope,
            buttons: [
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.mC.email) {
                            e.preventDefault();
                            $ionicPopup.alert({
                                title : 'Validation Error',
                                template : 'Email not valid'
                            });
                        } else {
                            $scope.mC.showList = true;
                        }
                    }
                }
            ]
        });
    };

    /*run popup*/
    this.showPopup();

    this.getFilmData = function () {
        filmFactory.getFilmData(dbUrl).then(function (value) {
            this.filmData = value;
        }.bind(this));
    };

    this.getFilmData();

    this.addFilm = function () {
        filmFactory.addFilm(this.url, this.email).then(function (value) {
            this.getFilmData();
            this.url = '';
        }.bind(this));
    };
}]);