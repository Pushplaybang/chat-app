/* App Template Helpers and Events */
Template.navigation.helpers({
	menustate : function() {
		var state = (Meteor.userId) ? 'loggedIn' : 'loggedOut';
		return state;
	}
});

Template.footer.helpers({
	footerNote : function() {
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


