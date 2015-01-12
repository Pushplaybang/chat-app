Template.contacts.helpers({
	contacts : function() {
		var u = Meteor.user();
		var contacts = u.contacts || [];

			return Meteor.users.find({
							$and : [
					{ _id : {$in : contacts} },
					{ _id : {$ne : Meteor.userId()} }
				]
			});

	},
	hasContacts : function() {
		var contacts = Meteor.user().contacts || [];
		if (contacts.length > 0) {
			return true;
		}

		return false;
	}
});

Template.contact.helpers({
	name : function() {
		return this.profile.name;

	},
	email : function() {
		return this.profile.primaryemail;
	}
});

Template.contact.events = {
	"click .userselect p" : function(event) {
		var target = $(event.target);
		if (target.hasClass('active')) {
			target.removeClass('active');
			return;
		}

		target.addClass('active');
	},

	'click .remove-contact' : function(event) {
		event.preventDefault();
		Meteor.call('removeFromContacts', this._id, function(error, result) {
			if (error) {
				console.log(error);
				return error;
			}

			return result;
		});
	}
};


