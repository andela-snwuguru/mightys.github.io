/**
 * Created by iyke on 15/09/2015.
 */

function Invite(){

    this.userObj = null;
    var map = {};

    /*
    creates new invite
     */
    this.create = function(event_id,list_of_users,message){
        if(!this.userObj){
            return response('01','No user object available');
        }

        if(this.userObj.email === undefined){
            return response('02','no user email found');
        }

        if(message === undefined){
            message = this.userObj.name + ' has invited you to an event';
        }

        var list_of_users_with_message = [];

        list_of_users.forEach(function(value){
            value.message = message;
            value.status = 'pending';
            list_of_users_with_message.push(value);
        });

        if(FireBaseUtil.send(list_of_users_with_message,Config.getInviteTableUrl(Config.stripEmail(this.userObj.email)+'/'+event_id))){
            return response('00','New Invites successfully sent');
        }else{
            return response('03','Unable to send invite');
        }

    };

    /*
    retrieves all invites of an event
     */
    this.getAllByID = function(email,event_id,callBack){
        var sub_path = email ? Config.stripEmail(email) : '';
        var url = Config.getInviteTableUrl(sub_path+'/'+event_id);
        FireBaseUtil.fetchAll(url,callBack);
    };

/*
    retrieves all invites of an event
     */
    this.getAll = function(callBack){
        var url = Config.getInviteTableUrl();
        FireBaseUtil.fetchAll(url,callBack);
    };

    /*
    retrieves single invite data
     */
    this.get = function(email,event_id,invite_id,position,callBack){
        var url = Config.getInviteTableUrl(Config.stripEmail(email)+'/'+event_id+'/'+invite_id+'/'+position);
        FireBaseUtil.fetch(url,callBack);
    };

    /*
    delete invite
    publicly accessible
     */
    this.delete = function(email,event_id,invite_id,position){
        var url = Config.getInviteTableUrl(Config.stripEmail(email)+'/'+event_id+'/'+invite_id+'/'+position);
        FireBaseUtil.remove(url);
        return true;
    };

    /*
    removes invite
    private only
     */
    var remove = function(email,event_id,invite_id,position){
        var url = Config.getInviteTableUrl(Config.stripEmail(email)+'/'+event_id+'/'+invite_id+'/'+position);
        FireBaseUtil.remove(url);
        return true;
    };

    /*
    approves invite
     */
    this.approve = function (email,event_id,invite_id,position) {
        map = {email:email,event_id:event_id,invite_id:invite_id,position:position};
        this.get(email,event_id,invite_id,position,processApproval);
    };

    /*
     processes the approve action
     sends notification to the user
     and deletes the invite sent
     */
    var processApproval = function(data){
        var attendee = new Attendee();
        var value = data.val();
        var result = attendee.create(map,value);
        if(result.code == '00'){
            var notice = new Notification();
            notice.create(map,value.name+' has accepted to attend your event');
            log(result);
           remove(map.email,map.event_id,map.invite_id,map.position);
        }
    }

    /*
     declines an invite
     */
    this.decline = function (email,event_id,invite_id,position) {
        map = {email:email,event_id:event_id,invite_id:invite_id,position:position};
        this.get(email,event_id,invite_id,position,processDecline);
    };

/*
processes the decline action
sends notification to the user
and deletes the invite sent
 */
    var processDecline = function(data){
        var notice = new Notification();
        var value = data.val();
        var result = notice.create(map,value.name+' has declined your event');
        log(result);
        if(result.code == '00'){
            remove(map.email,map.event_id,map.invite_id,map.position);
        }
    }

    /*
     set the logged in user object
     */
    this.setUser = function(obj){
        this.userObj = obj;
    };

    /*
     function to set response;
     */
    var response = function(code,message,object){
        return {code:code,message:message,response:object};
    };

}
