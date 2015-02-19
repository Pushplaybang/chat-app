/*
	User Publish Functions
	- - - - - - - - - - - -
*/

Meteor.publish('appusers', function() {
	if (!this.userId) {
		throw new Meteor.Error('denied', 'not-authorized');
	}

	return Meteor.users.find({},{
	 								fields: {
							 			_id:1,
							 			profile:1,
							 			contacts:1,
							 			emails:1,
							 			'services.google.picture':1
							 		},
							 	}
						 	);
});

Meteor.publish('contacts', function() {
	if (!this.userId) {
		throw new Meteor.Error('denied', 'not-authorized');
	}

	var user 		= Meteor.users.findOne(this.userId);
	var contacts 	= user.contacts || [];

	return Meteor.users.find({
								_id : { $in : contacts }
							},{
	 								fields: {
							 			_id:1,
							 			profile:1,
							 			contacts:1,
							 			emails:1,
							 			'services.google.picture':1
							 		},
							 	}
						 	);
});

Meteor.publish('groupusers', function(id) {
	if (!this.userId) {
		throw new Meteor.Error('denied', 'not-authorised');
	}

	var groupUsers = Groups.findOne(id) || [];

	return Meteor.users.find({
								_id : { $in : groupUsers.members }
							},{
								fields: {
						 			_id:1,
						 			profile:1,
						 			contacts:1,
						 			emails:1,
						 			'services.google.picture':1
						 		},
						 	});
});

// not convinced this is neccessary
Meteor.publish('thisUser', function() {
	if (!this.userId) {
		throw new Meteor.Error('denied', 'not-authorized');
	}

	return Meteor.users.find({
									_id : this.userId
								},{
		 								fields: {
								 			_id:1,
								 			profile:1,
								 			contacts:1,
								 			emails:1,
								 			'services.google.picture':1
								 		},
								 	}
								);
});

Meteor.publish('singleUser', function(id) {
	if (!this.userId) {
		throw new Meteor.Error('denied', 'not-authorized');
	}

	return Meteor.users.find({
								_id : { $in : [id, this.userId] }
							},{
	 								fields: {
							 			_id:1,
							 			profile:1,
							 			contacts:1,
							 			emails:1,
							 			'services.google.picture':1
							 		},
							 	}
						 	);
});


