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

Template.search.helpers({
	thisUser : function() {
		// not optimal hack until I figure out why the search query isn't being altered
		if (Meteor.user().profile.primaryemail === this.profile.primaryemail) {
			return true;
		}

		return false;
	},
	inContacts : function() {
		// not optimal hack until I figure out why the search query isn't being altered
		if ( _.contains(Meteor.user().contacts, this._id) ) {
			return true;
		}

		return false;
	}
});

Template.search.events = {
	'click .add-contact' : function(event) {
		event.preventDefault();
		Meteor.call('addToContacts', this._id, function(error, result) {
			if (error) {
				console.log(error);
				return error;
			}

			return result;
		});
	},

};

