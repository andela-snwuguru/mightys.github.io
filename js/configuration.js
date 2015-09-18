/**
 * Created by sundayguru on 15/09/2015.
 */
var Config = {
    dbUrl:'https://kandelar.firebaseio.com/',
    userTable:'users',
    eventTable:'events',
    inviteTable:'invites',
    joinTable:'join',
    attendeeTable:'attendees',
    notificationTable:'notification',
    getUserTableUrl:function(sub_path){
        if(sub_path === undefined)
            sub_path = '';

        return this.dbUrl+this.userTable+'/'+sub_path;
    },

    getEventTableUrl:function(sub_path){
        if(sub_path === undefined)
            sub_path = '';

        return this.dbUrl+this.eventTable+'/'+sub_path;
    },

    getInviteTableUrl:function(sub_path){
        if(sub_path === undefined)
            sub_path = '';

        return this.dbUrl+this.inviteTable+'/'+sub_path;
    },

    getJoinTableUrl:function(sub_path){
        if(sub_path === undefined)
            sub_path = '';

        return this.dbUrl+this.joinTable+'/'+sub_path;
    },

    getAttendeeTableUrl:function(sub_path){
        if(sub_path === undefined)
            sub_path = '';

        return this.dbUrl+this.attendeeTable+'/'+sub_path;
    },

    getNotificationTableUrl:function(sub_path){
        if(sub_path === undefined)
            sub_path = '';

        return this.dbUrl+this.notificationTable+'/'+sub_path;
    },

    stripEmail:function(email){
        return email.replace(/[@.]/g,'_');
    },
    validateEmail:function (email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    },
    showMessage:function(msg,key){
        if(key === undefined)
        key = '#msg';

        $(key).text(msg);
        $(key).fadeIn('slow',function(){
            var t = setInterval(function(){
                $(key).fadeOut('slow',function(){
                    $(key).text('');
                });
                clearInterval(t);
            },2000);
        });
    },
    storeLocal: function (key,data) {
       return localStorage.setItem(key,data);
    },
    getLocal: function (key) {
        return localStorage.getItem(key);
    },removeLocal: function (key) {
        localStorage.removeItem(key);
    }
};