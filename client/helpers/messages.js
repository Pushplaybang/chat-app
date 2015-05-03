Template.messages.helpers({
	messages: function() {
		// should be refactored, by moving this to the router, we can adjust the pub/sub functions
		var controller = Iron.controller();
		var userArr = [
			controller.params._id, // participant or group
			Meteor.userId() // currUser
		];

		if (this.isgroup) { // condition set it template 'data context'
			return Messages.find( {groupId: userArr[0] }, { sort : {time: -1} } );
		}

		return Messages.find({
			$and: [
				{ userId: { $in : userArr } },
				{ participant: { $in : userArr } }
			],
		}, { sort : {time: -1} } );
	}
});

Template.message.helpers({
	isOwner: function() {
		return this.userId === Meteor.userId();
	},
	userId: function() { // unneccessary
		return this.userId;
	},
	time: function() {
		return moment(this.time).format('MMMM Do YYYY, h:mm:ss a');
	},
	status : function() { // unneccessary
		return this.status;
	}
});

Template.messages.events = {
	"click .remove-msg" : function(event) {
		event.preventDefault();
		Meteor.call('removeMessage', this._id);
	}
};

Template.chatform.events = {
	"keypress #message" : _.throttle(function(event) {
		if (event.keyCode === 13) {
			$(event.target).parents('form').submit();
		}
	}, 300),
	"submit .chatform" : function(event) {
		event.preventDefault();

		var message 	 = $('#message');
		var messageValue = $(message).val();

		// if the message is empty exit early
		if ( !messageValue.trim() ) {
			throw new Meteor.Error("no msg!");
		}

		// var name, email;
		var controller   = Iron.controller();
		var currUser 	 = Meteor.user();
		var time 		 = Date.now();
		var participant  = controller.params._id;
		var name 		 = currUser.profile.name;

		if (this.isgroup) {
			Meteor.call('createGroupMessage', name, time, messageValue, participant, function (error, result) {
					if (error) {
						console.log(error);
						return error;
					}

					// empty the field and variable
					$('#message').val('');
			        message.value = '';

					return result;
			});
		} else {
			Meteor.call('createMessage', name, time, messageValue, participant, function(error,result) {
				if (error) {
					console.log(error);
					return error;
				}

				// empty the field and variable
				$('#message').val('');
		        message.value = '';

				return result;
			});
		}
	}
};


/* Message Template LifeCycle  - Changing the unread status of new nessages */
var readTimer;

Template.message.rendered = function () {
	var data = this.data;
	var isGroup = false;


	if ( !(_.contains(data.readBy, Meteor.userId() )) ) {
		var msgId = data._id;

		// after a brief pause
		readTimer = Meteor.setTimeout(function() {

			// update the status of the message
			Meteor.call('updateMessageStatus', msgId, function(error, result) {
				if (error) {
					console.log(error);
					return error;
				}
			});

		}, 900);
		console.log(readTimer);
		return readTimer;
	}

};

Template.message.destroyed = function () {
	console.log(readTimer);
	Meteor.clearTimeout(readTimer);
};

