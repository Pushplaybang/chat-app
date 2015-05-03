/*
	Invite Publications
	- - - - - - - - - - -
*/

Meteor.publish('invites', function () {
	if (!this.userId) {
		throw new Meteor.Error('denied', 'not-authorized');
	}

	var user = Meteor.users.findOne(this.userId);

	return Invites.find({
		$and : [
			{
				$or : [
					{ to : this.userId },
					{ to : user.profile.primaryemail }
					// allow invites to non members
				]
			},
			{ status : 'pending' }
		]
	});
});
