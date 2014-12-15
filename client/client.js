Meteor.subscribe('messages');
Meteor.subscribe('users');

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

Template.footer.helpers({
	footer_note: function() {
		return "Simple Chat App built in Meteor";
	}
});

Template.appstate.helpers({
	status : function() {
		return Meteor.status().status;
	},
	state : function() {
		if (Meteor.status().connected) {
			return  'connected';
		} else {
			return 'disconnected';
		}
	}
});

Template.contacts.helpers({
	contacts : function() {
		// should be moved to the router, create seperate pub/sub for contacts
		var u = Meteor.user();
		return Meteor.users.find({
			$and : [
				{ _id : {$in : u.contacts} },
				{ _id : {$ne : Meteor.userId()} }
			]
		});
	},
	name : function() {
		var currUser = this;
		if (currUser.profile && currUser.profile.name) {
			var name = currUser.profile.name;
		} else if (currUser.emails) {
			var email = currUser.emails[0].address;
			var name = email.substring(0, email.indexOf('@'));
		} else {
			var name = 'Anonymous';
		}

		return name;
	}
});

Template.contacts.events = {
	"click .userselect p" : function(event) {
		var target = $(event.target);
		if (target.hasClass('active')) {
			target.removeClass('active');
			return;
		}

		target.addClass('active');
	},
	'click .add-contact' : function(event) {
		event.preventDefault();
		// console.log(this._id);
		Meteor.call('addToContacts', this._id, function (error, result) {
			// console.log(error);
			// console.log(result);
			// console.log("contact added!");
			// console.log(Meteor.user());
			return;
		});
	},
	'click .remove-contact' : function(event) {
		event.preventDefault();
		console.log(this._id);
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
		var userId 		 = Meteor.userId();
		var participant  = controller.params._id;

		// set name to something useful
		if (currUser.profile && currUser.profile.name) {
			name 	= currUser.profile.name;
		} else if (currUser.emails) {
			email 	= currUser.emails[0].address;
			name 	= email.substring(0, email.indexOf('@'));
		} else {
			name 	= 'Anonymous';
		}

			Meteor.call('createMessage', name, userId, messageValue, participant);

		// empty the field and variable
		$('#message').val('');
        message.value = '';
	}
};

