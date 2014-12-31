Template.invites.helpers({});

Template.invites.events = {
	'click .accept' : function(event) {
		event.preventDefault();

		var iId = this._id;

		Meteor.call('acceptInvite', iId, function (error, result) {
			if (error) {
				console.log(error);
				return error;
			}

			console.log(result);
			return result;
		});
	}
};