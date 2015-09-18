/**
 * Created by lenovo on 9/16/2015.
 */
app = angular.module('app', ['ngRoute', 'ngAnimate']);
app.config(function($routeProvider, $locationProvider){

    $routeProvider
        .when('/login',{
            templateUrl: "template/login.html",
            animation: 'first',
            controller:'LoginCtrl'
        })
        .when('/register',{
            templateUrl: "template/register.html",
            animation: 'second',
            controller:'RegisterCtrl'
        })
        .when('/recover',{
            templateUrl: "template/recover.html",
            animation: 'first',
            controller:'RecoverCtrl'
        }) .when('/about',{
            templateUrl: "template/about.html",
            animation: 'first'
        }) .when('/terms',{
            templateUrl: "template/terms.html",
            animation: 'first'
        })  .when('/policy',{
            templateUrl: "template/policy.html",
            animation: 'first'
        })  .when('/docs',{
            templateUrl: "template/docs.html",
            animation: 'first'
        }) .when('/feedback',{
            templateUrl: "template/feedback.html",
            animation: 'first'
        })
        .otherwise({
            templateUrl: "template/login.html",
            animation: 'welcome',
            controller:'LoginCtrl'
        });
});


app.controller('ctrl', function($scope, $rootScope,$location){
    $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
        $rootScope.animation = currRoute.animation;
    });

    var user = Config.getLocal('userObject');
    if(user){
        document.location.href = 'dashboard.html';
    }
    $scope.processLogin = function(email,password){

        FireBaseUtil.login(email,password, function(error, authData) {
            if (error) {
                Config.showMessage("Login Failed!"+error);
            } else {
                FireBaseUtil.searchUser(email,function(data){
                    var userObj = data.val();
                    userObj.key = data.key()
                    Config.storeLocal('userObject',JSON.stringify(userObj));
                    document.location.href = 'dashboard.html';

                });

                ///console.log("Authenticated successfully with payload:", authData);
            }
        });
    };

    $scope.sendFeedBack = function(){
      Config.showMessage('Thanks for your feedback','#smsg');
    };



});


app.controller('DashboardCtrl', function($scope, $rootScope){
    $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
        $rootScope.animation = currRoute.animation;
    });
});

app.controller('LoginCtrl', function($scope, $rootScope){

    $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
        $rootScope.animation = currRoute.animation;
    });


//LOGIN 
    $scope.login = function(){
        var email = $('#email').val();
        var password = $('#password').val();
        if(email.length < 4){
           Config.showMessage('Your email length must be greater than 4');
            return;
        }

        if(password.length < 7){
           Config.showMessage('Your Password length must be greater than 6');
            return;
        }

        if(!Config.validateEmail(email)){
            Config.showMessage('You have entered an invalid email format');
            return;
        }

        $scope.processLogin(email,password);

    };


});

app.controller('RegisterCtrl', function($scope, $rootScope){
    $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
        $rootScope.animation = currRoute.animation;
    });

//REGISTER
    $scope.register = function(){
        var name = $('#name').val();
        var email = $('#email').val();
        var password = $('#password').val();
        var rePassword = $('#re-password').val();

        if(name.length == 0){
        Config.showMessage('Name field cannot be empty');
        return;
    }

     if(email.length < 4){
             Config.showMessage('Your email length must be greater than 4');
             return;
         }

         if(password.length < 7){
            Config.showMessage('Your Password length must be greater than 6');
            return;
         }

        if(password !== rePassword){
            Config.showMessage('Confirm password not the same as confirm password');
            return;
        }

        if(!Config.validateEmail(email)){
            Config.showMessage('You have entered an invalid email format');
            return;
        }

        var userObject = {name:name, email:email,invite:true};

        FireBaseUtil.createUser(email,password, function(error, userData) {
            if (error) {
                switch(error.code){
                 case "EMAIL_TAKEN":
                    Config.showMessage("The new user account cannot be created because the email is already in use.");
                    break;

                 case "INVALID_EMAIL":
                    Config.showMessage("The specified email is not a valid email.");
                    break;

                    default:
                    Config.showMessage("Error creating user: UNKNOWN"); 
                    break;
                }
                
            } else {

                FireBaseUtil.send(userObject,Config.getUserTableUrl());
                $scope.processLogin(email,password);
            

        }
    });

    }

});

app.controller('RecoverCtrl', function($scope, $rootScope){
    $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
        $rootScope.animation = currRoute.animation;
    });

    $scope.recover = function(){
        var email = $('#email').val();

        if(email.length < 4){
             Config.showMessage('Your email length must be greater than 4');
             return;
         }

         if(!Config.validateEmail(email)){
            Config.showMessage('You have entered an invalid email format');
            return;
        }

        FireBaseUtil.resetPassword(email, function(error) {
            if (error) {
                Config.showMessage("User Registration Failed!" + error);
            } else {
                Config.showMessage("Your new password has been sent to your email",'#smsg');
                $('#email').val('');
            }
        });

    }
});