/**
 * Created by sundayguru on 15/09/2015.
 */
function Event(){
    var required_field = [
        'event_title','start_date','address'
    ];

    this.userObj = null;

    /*
    create new event with the given object
     */
    this.create = function(obj){
        if(!this.userObj){
            return response('01','No user object available');
        }

        if(this.userObj.email === undefined){
            return response('02','no user email found');
        }

        if(FireBaseUtil.send(obj,Config.getEventTableUrl(Config.stripEmail(this.userObj.email)))){
            return response('00','New event successfully created');
        }else{
            return response('03','Unable to create event');
        }
        return response('0Z','You have successfully confused Javascript');
    };

    /*
    get all events from a given user email address
    if user email is null is will return all the events created in the system
    the response is received from the callback with parameter in the function
    e.g callback(data)

     */

    this.getAll = function(email,callBack){
        var sub_path = email ? Config.stripEmail(email) : '';
        var url = Config.getEventTableUrl(sub_path);
        FireBaseUtil.fetchAll(url,callBack);
    }
/*
    this.get = function(event_id,callBack){
        var url = Config.getEventTableUrl();
        this.fireBase = new Firebase(url);

        this.fireBase.orderByChild('event_title').startAt('benga wedding').endAt('benga wedding').once('value', function (snapshot) {
            var data = JSON.stringify(snapshot.val(),null,2);
            log(data);
            // The callback function will get called twice, once for "fred" and once for "barney"
        });
    };

    this.query = function(){
        this.fireBase = new Firebase(Config.getUserTableUrl());

        this.fireBase.orderByChild("email").startAt('sunday@bincom.net').endAt('sunday@bincom.net').once('value', function (snapshot) {
            var data = JSON.stringify(snapshot.val(),null,2);
            log(data);
            // The callback function will get called twice, once for "fred" and once for "barney"
        });
    };*/

    /*
    delete a given event
     */
    this.delete = function(event_id){
        if(!this.userObj){
            return response('01','No user object available');
        }

        if(this.userObj.email === undefined){
            return response('02','no user email found');
        }

        var url = Config.getEventTableUrl(Config.stripEmail(this.userObj.email)+'/'+event_id);
        FireBaseUtil.remove(url);
        return true;
    };

    /*
    update a given event
     */
    this.update = function(event_id,obj){
        if(!this.userObj){
            return response('01','No user object available');
        }

        if(this.userObj.email === undefined){
            return response('02','no user email found');
        }

        var url = Config.getEventTableUrl(Config.stripEmail(this.userObj.email)+'/'+event_id);
        FireBaseUtil.update(obj,url);
    };

    this.overWrite = function(arrayObject){
        if(!this.userObj){
            return response('01','No user object available');
        }

        if(this.userObj.email === undefined){
            return response('02','no user email found');
        }

        var url = Config.getEventTableUrl(Config.stripEmail(this.userObj.email));
        FireBaseUtil.update(arrayObject,url);
    };





    /*
     update a given event
     */
    this.overWrite = function(arrayObject){
        if(!this.userObj){
            return response('01','No user object available');
        }

        if(this.userObj.email === undefined){
            return response('02','no user email found');
        }

        var url = Config.getEventTableUrl(Config.stripEmail(this.userObj.email));
        FireBaseUtil.update(arrayObject,url);
    };

    /*
    sets the logged in user object
     */
    this.setUser = function(obj){
        this.userObj = obj;
    };

    /*
    private function to validate required field
     */
    var missingRequireField = function(obj){
        var missing = false;
        required_field.forEach(function (value) {
            if(obj[value] === undefined){
                missing = true;
                return;
            }
        });
        return missing;
    };

    /*
    private function to set response;
     */
    var response = function(code,message,object){
        return {code:code,message:message,response:object};
    };

}
