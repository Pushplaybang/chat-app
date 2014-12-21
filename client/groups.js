Template.groupForm.helpers({
	// This and this section part of template violates DRY.
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

Template.groupForm.events = {
	'submit .group-create' : function(event) {
		event.preventDefault();

		// Get the form values
		var name = $('#group-name').val();
		var desc = $('#group-desc').val();
		// call the create group method
		Meteor.call('createGroup', name, desc, function (error, result) {
			if (error) {
				console.log(error);
				return error;
			}

			return result;
		});

	}
};