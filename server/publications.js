Meteor.publish('messages', function () {
	return Messages.find({});
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