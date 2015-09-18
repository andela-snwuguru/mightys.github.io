/**
 * Created by sundayguru on 15/09/2015.
 */
function Notification(){

    /*
    adds attendee records to firebase
     */
    this.create = function(map,message){
        if(!map){
            return response('01','No Map');
        }

        if(map.email === undefined){
            return response('02','no email found');
        }

        var noteObject = {message:message};

        if(FireBaseUtil.send(noteObject,Config.getNotificationTableUrl(Config.stripEmail(map.email)))){
            return response('00','New Notice Sent');
        }else{
            return response('03','Unable to send notice');
        }

    };

    /*
     private function to set response;
     */
    var response = function(code,message,object){
        return {code:code,message:message,response:object};
    };
}