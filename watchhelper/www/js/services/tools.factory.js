angular.module('watchHelper').factory('toolsFactory', ['$cookies', function($cookies){
    var sessionUrl = 'http://192.168.0.129:5000/authentication/token=myapp';

    return {
        setCookie : function (_name, _value, _expires) {
            var date = new Date();
            var expiresDate = new Date(date.getTime() + _expires);
            $cookies.put(_name, _value, {expires : expiresDate});

            return true;
        },

        getCookie : function(_name){
            return $cookies.get(_name);
        }
    }
}]);