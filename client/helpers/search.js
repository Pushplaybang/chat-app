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


