Template.messages.helpers({
	messages: function() {
		// should be refactored, by moving this to the router, we can adjust the pub/sub functions
		var controller   = Iron.controller();
		var u1  = controller.params._id;
		var u2 	= Meteor.userId();
		return Messages.find({
			$and: [
				{ userId: {$in : [u1, u2]} },
				{ participant: {$in : [u1, u2]} }
			],
		}, { sort : {time: -1} } );
	}
});

Template.message.helpers({
	isOwner: function() {
		return this.userId === Meteor.userId();
	},
	userId: function() {
		return this.userId;
	},
	time: function() {
		return moment(this.time).format('MMMM Do YYYY, h:mm:ss a');
	}

});

Template.messages.events = {
	"click .remove-msg" : function(event) {
		event.preventDefault();
		Meteor.call('removeMessage', this._id);
	}
};

Template.chatform.events = {
	"keyup #message" : _.throttle(function(event) {
		if (event.keyCode === 13) {
			$(event.target).parents('form').submit();
		}
	}, 300),
	"submit .chatform" : function(event) {
		event.preventDefault();

		// if the user hits enter
		if (!Meteor.user()) {
			throw new Meteor.Error("not-authorized");
		}

		var message 	 = $('#message');
		var messageValue = $(message).val();

		// if the message is empty exit early
		if ( !messageValue.trim() ) {
			throw new Meteor.Error("no msg!");
		}

		var name, email;
		var controller   = Iron.controller();
		var currUser 	 = Meteor.user();
		var time 		 = Date.now();
		var participant  = controller.params._id;
		var name 		 = currUser.profile.name;

		Meteor.call('createMessage', name, time, messageValue, participant, function(error,result) {
			if (error) {
				console.log(error);
				return error;
			}

			return result;
		});

		// empty the field and variable
		$('#message').val('');
        message.value = '';
	}
};