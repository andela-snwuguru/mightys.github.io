/**
 * Created by lenovo on 9/16/2015.
 */
var app = angular.module('app', ['ngRoute', 'ngAnimate']);

app.config(function($routeProvider, $locationProvider){

    $routeProvider
        .when('/dashboard',{
            templateUrl: "template/dashboard.html",
            animation: 'first',
            controller:'DashboardCtrl'
        })
        .when('/pending-invite',{
            templateUrl: "template/pending-invite.html",
            animation: 'second',
            controller:'PendingInviteCtrl'
        }).when('/sent-invite',{
            templateUrl: "template/sent-invite.html",
            animation: 'second',
            controller:'SentInviteCtrl'
        }).when('/pending-request',{
            templateUrl: "template/pending-request.html",
            animation: 'second',
            controller:'RequestCtrl'
        }).when('/personal',{
            templateUrl: "template/personal-info.html",
            animation: 'second',
            controller:'PersonalCtrl'
        }).when('/manage-event',{
            templateUrl: "template/manage-event.html",
            animation: 'first'
        }).when('/calendar',{
            templateUrl: "template/calendar.html",
            animation: 'first'
        })
        .when('/change-password',{
            templateUrl: "template/change-password.html",
            animation: 'first',
            controller:'ChangePasswordCtrl'
        }).when('/remove-account',{
            templateUrl: "template/remove-account.html",
            animation: 'second'
        }).when('/profile',{
            templateUrl: "template/profile.html",
            animation: 'first'
        }).when('/send-invite',{
            templateUrl: "template/send-invite.html",
            animation: 'first',
            controller:'SendInviteCtrl'
        })
        .otherwise({
            templateUrl: "template/dashboard.html",
            animation: 'welcome',
            controller:'DashboardCtrl'
        });
});


app.controller('ctrl', function($scope, $rootScope){
    $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
        $rootScope.animation = currRoute.animation;
    });

    var user = Config.getLocal('userObject');
    if(!user){
        document.location.href = 'index.html';
    }

    $scope.logout = function(){
        Config.removeLocal('userObject');
        document.location.href = 'index.html';
    };

    $scope.userData = JSON.parse(user);


    $scope.img = $scope.userData.img ?  $scope.userData.img : 'bc12-kalendar/../images/avatar.png';
    $scope.setActive = function(index){
        for(i in $scope.active){
            if(i != index)
                $scope.active[i] = '';

            $scope.active[index] = 'active-menu';
        }
    };

    $scope.deleteAccount = function () {
        alert('THIS IS A TERRIBLE THING TO DO; WE WILL SOON ACTIVATE IT')
    }

    $scope.pendingInvites = [];
    $scope.totalPendingInvites = 0;
    var invite = new Invite();

    invite.getAll(function(data){
        var result = data.val();
        var emailKey = Config.stripEmail($scope.userData.email);

        for(k in result){
            var userInvite = result[k];
            var link = '';
            if(k != emailKey){

                link = k;
                for(jk in userInvite){
                    link += '/'+jk;
                    for(ik in userInvite[jk]){
                        link += '/'+ik;

                        for(last_index in userInvite[jk][ik]){
                            var lastObject = userInvite[jk][ik][last_index];
                            link += '/'+last_index;
                            lastObject.link = link;
                            $scope.pendingInvites.push(lastObject);
                            $scope.totalPendingInvites += 1;
                            $scope.$apply();
                            /* console.log(link);
                             console.log(lastObject);*/
                        }

                    }
                }


            }
        }

    });



    $scope.sentInvites = [];
    $scope.totalSentInvites = 0;
    var invite = new Invite();

    invite.getAll(function(data){
        var result = data.val();
        var emailKey = Config.stripEmail($scope.userData.email);

        for(k in result){
            var userInvite = result[k];
            var link = '';
            if(k == emailKey){

                link = k;
                for(jk in userInvite){
                    link += '/'+jk;
                    for(ik in userInvite[jk]){
                        link += '/'+ik;

                        for(last_index in userInvite[jk][ik]){
                            var lastObject = userInvite[jk][ik][last_index];
                            link += '/'+last_index;
                            lastObject.link = link;
                            $scope.sentInvites.push(lastObject);
                            $scope.totalSentInvites += 1;
                            $scope.$apply();
                            /* console.log(link);
                             console.log(lastObject);*/
                        }

                    }
                }


            }
        }

    });


});

app.controller('DashboardCtrl', function($scope, $rootScope){
    $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
        $rootScope.animation = currRoute.animation;
    });


    $scope.totalEvents = 0;
    $scope.events = [];
    $scope.invites = [];

    var event = new Event();
    var invite = new Invite();


    event.getAll($scope.userData.email,function(data){
        $scope.events = data.val();

        console.log($scope.events);
        if($scope.events !== null)
            $scope.totalEvents  = $scope.events.length;
        $scope.$apply();
    });



});

app.controller('RequestCtrl', function($scope, $rootScope){
    $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
        $rootScope.animation = currRoute.animation;
    });

    $scope.requests = [];
    var join = new Join();

    join.getAll('sunday@bincom.net','0',function(data){
        var result = data.val();
        for(key in result){
            $scope.requests.push(result[key]);
            $scope.$apply();
        }
    });
});

app.controller('ChangePasswordCtrl', function($scope, $rootScope){
    $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
        $rootScope.animation = currRoute.animation;
    });

    $scope.changePassword = function(){
        var oldPass = $('#current-password').val();
        var newPass = $('#new-password').val();
        var reNewPass = $('#re-password').val();


        if(newPass.length < 7){
            Config.showMessage('Your Password length must be greater than 6');
            return;
        }

        if(newPass !== reNewPass){
            Config.showMessage('Confirm New password not the same as Confirm password');
            return;
        }

        FireBaseUtil.changePassword($scope.userData.email,oldPass,newPass,function(error) {
            if (error) {
                switch (error.code) {
                    case "INVALID_PASSWORD":
                        Config.showMessage("The specified user account password is incorrect.");
                        break;
                    case "INVALID_USER":
                        Config.showMessage("The specified user account does not exist.");
                        break;
                    default:
                        Config.showMessage("Error changing password");
                }
            } else {
                Config.showMessage("User password changed successfully!",'#smsg');
            }
        });

    };
});

app.controller('PendingInviteCtrl', function($scope, $rootScope){
    $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
        $rootScope.animation = currRoute.animation;
    });

    $scope.approve = function(){
        var link = $('.approve').attr('link');

        alert('COMING SOON!');
    };

    $scope.decline = function(){
       // var link = $('.decline').attr('link');
        alert('COMING SOON!');
    };
});

app.controller('SentInviteCtrl', function($scope, $rootScope){
    $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
        $rootScope.animation = currRoute.animation;
    });

    $scope.cancel = function(){
       // var link = $('.decline').attr('link');
        alert('COMING SOON!');
    };
});

app.controller('PersonalCtrl', function($scope, $rootScope){
    $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
        $rootScope.animation = currRoute.animation;
    });


    ImageConverter.onFileUpload();

    $scope.invite = $scope.userData.invite ? $scope.userData.invite : true;

    $scope.saveInfo = function(){
        var name = $('#name').val();
        var email = $scope.userData.email;
        var userObj = {name:name,email:email,invite:$scope.invite,img:Config.getLocal('img')};
        var url = Config.getUserTableUrl($scope.userData.key);
        //console.log(url);
        FireBaseUtil.update(userObj,url);
        userObj.key = $scope.userData.key;
        Config.storeLocal('userObject',JSON.stringify(userObj));
        Config.showMessage('Personal Details Updated Successfully','#smsg');
    }

});

app.controller('SendInviteCtrl', function($scope, $rootScope){
    $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
        $rootScope.animation = currRoute.animation;
    });

    $scope.users = [];
    $scope.selection = [];
    FireBaseUtil.fetchAll(Config.getUserTableUrl(),function(data){
        var result = data.val();
        for(key in result){
            if(result[key].email != $scope.userData.email && result[key].invite === true){
                $scope.users.push(result[key]);
                $scope.$apply();
            }

        }
    });

    $scope.selected = function(value){
        var index = $scope.selection.indexOf(value);
        if(index > -1){
            $scope.selection.splice(value,1);
        }else{
            $scope.selection.push(value);
        }

    }

    $scope.inviteUsers = function(){
        if($scope.selection.length === 0)
            alert('No User Selected');

        $scope.activeEventId = Config.getLocal('activeEventId');
        $scope.activeEventTitle = Config.getLocal('activeEventTitle');
        var listUsers = [];
        $scope.selection.forEach(function(index){
            var user = $scope.users[index];
            delete user.$$hashKey;
            user.event_title = $scope.activeEventTitle;
            listUsers.push($scope.users[index]);
        });

        var invite = new Invite();
        invite.setUser($scope.userData);
        var message = invite.create($scope.activeEventId,listUsers);
        if(message.code== '00'){
            Config.showMessage('You have sent invite to '+$scope.selection.length+' user(s)','#smsg');
            $scope.selection = [];
        }
    };
});

$('#main-menu').metisMenu();