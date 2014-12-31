Meteor.subscribe('messages');
Meteor.subscribe('users');
Meteor.subscribe('groups');
Meteor.subscribe('invites');


Template.footer.helpers({
	footerNote: function() {
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



