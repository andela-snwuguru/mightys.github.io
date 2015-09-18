'use strict';

angular
  .module('calendarApp', ['mwl.calendar', 'ui.bootstrap', 'ngTouch', 'ngAnimate'])



  .controller('MainCtrl', function ($modal, $scope, moment) {

    var vm = this;

        $scope.userData = JSON.parse(Config.getLocal('userObject'));
        if(!$scope.userData){
            document.location.href = 'index.html';
        }

        $scope.img = $scope.userData.img ?  $scope.userData.img : 'bc12-kalendar/../images/avatar.png';
    //These variables MUST be set as a minimum for the calendar to work
    vm.calendarView = 'month';
    vm.calendarDay = new Date();
        vm.events = [

	/*Service to return all events, that belongs to the logged in user

		and also the event that the person as accepted to invite */

      {
        title: 'Kandela test event',
		description:'type a descritpion here',
        address: 'address',
        type: 'warning',
        startsAt: moment().subtract(0, 'day').toDate().toDateString(),
        endsAt: moment().subtract(0, 'day').toDate().toDateString(),
        draggable: true,
        resizable: true
      }
    ];




        function showModal(action, event) {
      $modal.open({
        templateUrl: 'template/modalContent.html',
        controller: function() {
          var vm = this;
          vm.action = action;
          vm.event = event;
        },
        controllerAs: 'vm'
      });
    }


    vm.eventClicked = function(event) {
        Config.storeLocal('activeEventId',event.$id);
        Config.storeLocal('activeEventTitle',event.title);
      showModal('Clicked', event);

    };

    vm.eventEdited = function(event) {
        Config.storeLocal('activeEventId',event.$id);
        Config.storeLocal('activeEventTitle',event.title);
      showModal('Edited', event);
    };

    vm.eventDeleted = function(event) {
      showModal('Deleted', event);
    };


    vm.eventTimesChanged = function(event) {

        alert('hello world');
      showModal('Dropped or resized', event);
    };

    vm.toggle = function($event, field, event) {
      $event.preventDefault();
      $event.stopPropagation();
      event[field] = !event[field];
    };

    $scope.saveEventsData = function(index){

        var userEvents = vm.events;
        var item = userEvents[index];
        if(item === undefined)
            return;
        var userObject = {email:'sunday@bincom.net',fullName:'sunday goodman'};
        var event = new Event();
        event.setUser($scope.userData);
        item.startsAt = item.startsAt !== undefined ? item.startsAt.toString() : moment().subtract(0, 'day').toDate().toDateString();
        item.endsAt = item.endsAt !== undefined ? item.endsAt.toString() : moment().add(1, 'day').toDate().toDateString();
        var obj = {

            title: item.title,
            description:item.description,
            address: item.address,
            type: item.type,
            startsAt:item.startsAt,
            endsAt: item.endsAt

        };
       //event.update(index,obj);
       event.overWrite(userEvents);
        //console.log(obj);
    };

     $scope.getEvents = function(){
         var event = new Event();
         event.getAll($scope.userData.email,function(data){
             var events = data.val();
             if(events !== null){
                 vm.events = events;
                 $scope.$apply();
             }

             console.log(events);
         });
     };

    $scope.deleteEventsData = function(index){
        var event = new Event();
        event.setUser($scope.userData);
        event.delete(index);
        //event.overWrite(vm.events);
        //console.log(vm.events);
    };
        $scope.getEvents();

  });


