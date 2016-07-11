angular.module('watchHelper').factory('toolsFactory', ['$cookies', function($cookies){
    // var sessionUrl = 'http://localhost:5000/authentication/token=myapp';
    var sessionUrl = 'https://evening-oasis-38864.herokuapp.com/authentication/token=myapp';

    return {
        setCookie : function (_name, _value, _expires) {
            // var date = new Date();
            // var expiresDate = new Date(date.getTime() + _expires);
            // $cookies.put(_name, _value, {expires : expiresDate});
            window.localStorage.setItem(_name, _value);
            return true;
        },

        getCookie : function(_name){
            return window.localStorage.getItem(_name);
            // return $cookies.get(_name);
        }
    }
}]);