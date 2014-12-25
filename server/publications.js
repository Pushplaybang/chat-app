Meteor.publish('messages', function () {
	return Messages.find({});
});

Meteor.publish('groups', function () {
	return Groups.find({});
});

Meteor.publish('invites', function () {
	return Invites.find({ to : this.userId });
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