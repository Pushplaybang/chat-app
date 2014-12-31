
Meteor.publish('messages', function () {
	return Messages.find({});
});

Meteor.publish('groups', function () {
	return Groups.find({
		$or : [
			{owner : this.userId},
			{members : {$in : [this.userId]}}
		]
	});
});

Meteor.publish('invites', function () {
	return Invites.find({
		$or : [
			{ to : this.userId },
			{ to : this.profile.primaryemail },
		]
	});
});

Meteor.publish('users', function() {
	return Meteor.users.find({
							},{
	 								fields: {
							 			_id:1,
							 			profile:1,
							 			contacts:1,
							 		},
							 	}
						 	);
});

