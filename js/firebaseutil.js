/**
 * Created by sundayguru on 15/09/2015.
 */
var FireBaseUtil = {
    fireBase:null,
    returnData:null,

    send:function(obj,url){
        if(url === undefined)
            return false;

        this.fireBase = new Firebase(url);
        return this.fireBase.push(obj);
    },

    update:function(obj,url){
        if(url === undefined)
            return false;

        this.fireBase = new Firebase(url);
        this.fireBase.set(obj);
    },

    remove:function(url){
        if(url === undefined)
            return false;

        this.fireBase = new Firebase(url);
        this.fireBase.remove();
    },
    fetch:function(url,callBack){
        if(url === undefined)
            return false;

        this.fireBase = new Firebase(url);
        this.fireBase.once('value',callBack);
        this.fireBase.off('value',function(){});
    },
    searchUser:function(email,callBack){
        var url = Config.getUserTableUrl();
        this.fireBase = new Firebase(url);
        this.fireBase.orderByChild("email").startAt(email).endAt(email).on("child_added",callBack);
        this.fireBase.off('child_added',function(){});
    },
    fetchAll:function(url,callBack){
        if(url === undefined)
            return false;

        this.fireBase = new Firebase(url);
        this.fireBase.on('value',callBack);
        this.fireBase.off('value',function(){});
    },
    createUser:function(email,password,callBack){
        if(email === undefined || password === undefined)
            return false;

        this.fireBase = new Firebase(Config.dbUrl);
        this.fireBase.createUser({
            email: email,
            password: password
        },callBack);
    },
    changePassword:function(email,oldPassword,newPassword,callBack){
        if(email === undefined || oldPassword === undefined || newPassword === undefined)
            return false;

        this.fireBase = new Firebase(Config.dbUrl);
        this.fireBase.changePassword({
            email: email,
            oldPassword: oldPassword,
            newPassword: newPassword
        },callBack);
    },
    removeUser:function(email,password,callBack){
        if(email === undefined || password === undefined)
            return false;

        this.fireBase = new Firebase(Config.dbUrl);
        this.fireBase.removeUser({
            email: email,
            password: password
        },callBack);
    },
    resetPassword:function(email,callBack){
        if(email === undefined)
            return false;

        this.fireBase = new Firebase(Config.dbUrl);
        this.fireBase.resetPassword({
            email:email
        },callBack);

    },
    login:function(email,password,callBack){
        if(email === undefined || password === undefined)
            return false;

        this.fireBase = new Firebase(Config.dbUrl);
        this.fireBase.authWithPassword({
            "email": email,
            "password":password
        },callBack);
    }

}