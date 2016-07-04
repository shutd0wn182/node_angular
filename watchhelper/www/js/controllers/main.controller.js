angular.module('watchHelper').controller('mainCtrl', ['filmFactory', 'toolsFactory', '$ionicPopup', '$scope', function (filmFactory, toolsFactory, $ionicPopup, $scope) {
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

                            toolsFactory.setSession($scope.mC.email).then(function (value) {
                                console.log('value', value);
                                $scope.mC.authStatus = value;
                                $scope.mC.showList = true;
                            });
                        }
                    }
                }
            ]
        });
    };

    toolsFactory.getSession().then(function(value){
        this.authStatus = value;
    }.bind(this));

    /*run popup*/
    if(!this.authStatus){
        this.showPopup();
    }

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