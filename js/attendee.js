/**
 * Created by sundayguru on 15/09/2015.
 */
function Attendee(){

    var map = null;

    /*
    adds attendee records to firebase
     */
    this.create = function(map,inviteObject){
        if(!map){
            return response('01','No Map');
        }

        if(map.email === undefined){
            return response('02','no email found');
        }

        if(map.event_id === undefined){
            return response('02','no Event ID found');
        }

        var attendeeObject = {email:inviteObject.email,fullName:inviteObject.fullName};

        if(FireBaseUtil.send(attendeeObject,Config.getAttendeeTableUrl(Config.stripEmail(map.email)+'/'+map.event_id))){
            return response('00','New Attendee successfully added');
        }else{
            return response('03','Unable to add attendee');
        }


    };

    /*
     retrieves single invite data
     */
    this.get = function(email,event_id,attendee_id,callBack){
        var url = Config.getAttendeeTableUrl(Config.stripEmail(email)+'/'+event_id+'/'+attendee_id);
        this.fireBase = new Firebase(url);
        this.fireBase.once('value',callBack);
    };

    /*
     deletes an attendee record
     */
    this.delete = function(email,event_id,attendee_id){
        map = {email:email,event_id:event_id,attendee_id:attendee_id};
        this.get(email,event_id,attendee_id,processDelete);

    };

/*
processes the deletion of attendant
 */
    var processDelete = function(data){
        var value = data.val();
        var url = Config.getAttendeeTableUrl(Config.stripEmail(map.email)+'/'+map.event_id+'/'+map.attendee_id);
        FireBaseUtil.remove(url);
        var notice = new Notification();
        var result = notice.create({email:value.email},'Dear '+value.fullName+', You have been removed from attending an event');
        console.log(result);
        return true;
    };

    /*
     private function to set response;
     */
    var response = function(code,message,object){
        return {code:code,message:message,response:object};
    };
}
