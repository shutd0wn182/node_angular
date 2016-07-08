angular.module('watchHelper').controller('mainCtrl', ['filmFactory', 'toolsFactory', '$ionicPopup', '$scope', function (filmFactory, toolsFactory, $ionicPopup, $scope) {
    // var dbUrl = 'http://localhost:5000/getfilms/token=myapp';
    var dbUrl = 'https://evening-oasis-38864.herokuapp.com/getfilms/token=myapp';
    /*create PopUP*/

    this.showPopup = function () {
        var myPopup = $ionicPopup.show({
            template: '<input type="email" ng-model="mC.email">',
            title: 'Enter your email',
            subTitle: 'Please type valid email',
            cssClass : 'user-email',
            scope: $scope,
            buttons: [
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!this.email) {
                            e.preventDefault();

                            $ionicPopup.alert({
                                title : 'Validation Error',
                                template : 'Email not valid'
                            });
                        } else {
                            this.showList = toolsFactory.setCookie('userEmail', this.email, 60*60*24*14*1000);
                            filmFactory.mailNewUser(this.email);
                            this.userEmail = this.email;
                            this.getFilmData();
                        }
                    }.bind(this)
                }
            ]
        });
    };

    this.getFilmData = function () {
        filmFactory.getFilmData(dbUrl, this.userEmail).then(function (value) {
            this.filmData = value;
        }.bind(this));
    };

    this.addFilm = function () {
        filmFactory.addFilm(this.url, this.email).then(function () {
            this.getFilmData();
            this.url = '';
        }.bind(this));
    };

    /*run popup*/

    this.userEmail = toolsFactory.getCookie('userEmail');

    if(!this.userEmail){
        this.showPopup();
    }
    else{
        this.getFilmData();
        this.showList = true;
    }
}]);