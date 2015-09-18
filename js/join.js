/**
 * Created by sundayguru on 16/09/2015.
 */
function Join(){
    this.userObj = null;
    var data = null;
    /*
     creates new Join request
     */

    this.create = function(email,event_id){
        if(!this.userObj){
            return response('01','No user object available');
        }

        if(this.userObj.email === undefined){
            return response('02','no user email found');
        }

        var  message = this.userObj.fullName + ' has requested to join your event';

        if(FireBaseUtil.send({name:this.userObj.fullName,message:message,email:this.userObj.email},Config.getJoinTableUrl(Config.stripEmail(email)+'/'+event_id))){
            return response('00','New join request successfully sent');
        }else{
            return response('03','Unable to send join request');
        }
    };


    /*
     retrieves all invites of an event
     */
    this.getAll = function(email,event_id,callBack){
        var sub_path = email ? Config.stripEmail(email) : '';
        var url = Config.getJoinTableUrl(sub_path+'/'+event_id);
        FireBaseUtil.fetchAll(url,callBack);
    };



    /*
     retrieves single invite data
     */
    this.get = function(email,event_id,join_id,callBack){
        var url = Config.getInviteTableUrl(Config.stripEmail(email)+'/'+event_id+'/'+join_id);
        FireBaseUtil.fetch(url,callBack);
    };

    /*
     delete invite
     publicly accessible
     */
    this.delete = function(email,event_id,join_id){
        var url = Config.getInviteTableUrl(Config.stripEmail(email)+'/'+event_id+'/'+join_id);
        FireBaseUtil.remove(url);
        return true;
    };

    /*
     removes invite
     private only
     */
    var remove = function(email,event_id,join_id){
        var url = Config.getInviteTableUrl(Config.stripEmail(email)+'/'+event_id+'/'+join_id);
        FireBaseUtil.remove(url);
        return true;
    };

    /*
     approves invite
     */
    this.approve = function (email,event_id,join_id) {
        data = {email:email,event_id:event_id,join_id:join_id};
        this.get(email,event_id,join_id,processApproval);
    };

    /*
     processes the approve action
     sends notification to the user
     removes the join request sent
     */
    var processApproval = function(resultObject){
        var attendee = new Attendee();
        var value = resultObject.val();
        var result = attendee.create(data,value);
        if(result.code == '00'){
            var notice = new Notification();
            notice.create(data,value.fullName+' has accepted your join request');
            log(result);
            remove(data.email,data.event_id,data.join_id);
        }
    }

    /*
     declines an invite
     */
    this.decline = function (email,event_id,join_id) {
        data = {email:email,event_id:event_id,join_id:join_id};
        this.get(email,event_id,join_id,processDecline);
    };

    /*
     processes the decline action
     sends notification to the user
     and deletes the invite sent
     */
    var processDecline = function(resultObject){

        var notice = new Notification();
        var value = resultObject.val();
        console.log(resultObject);return;
        var result = notice.create(value,value.fullName+' has declined your join request');
        log(result);
        if(result.code == '00'){
            remove(data.email,data.event_id,data.join_id);
        }
    }

    /*
     set the logged in user object
     */
    this.setUser = function(obj){
        this.userObj = obj;
    };

    /*
     private function to set response;
     */
    var response = function(code,message,object){
        return {code:code,message:message,response:object};
    };

}
