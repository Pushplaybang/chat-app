Template.invites.helpers({
	invites : function() {
		var user = Meteor.user();
		return Invites.find({
			$and : [
				{
					$or : [
						{ to : Meteor.userId },
						{ to : user.profile.primaryemail }
					]
				},
				{ status : 'pending' }
			]
		}, { sort : {time: -1} } );
	}
});

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
