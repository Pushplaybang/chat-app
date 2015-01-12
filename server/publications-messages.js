/*
	Publish Messages
*/
Meteor.publish('messages', function (id, isGroup) {
	if (!this.userId) {
		throw new Meteor.Error('denied', 'not-authorized');
	}

	// Return messages for group chat
	if (isGroup) {
		return Messages.find({
			groupId : id
		});
	}

	// get direct messages
	var usersArr = [
		this.userId,
		id,
	];

	return Messages.find({
		$and: [
				{ userId: {$in : usersArr} },
				{ participant: {$in : usersArr} }
			],
	});

});


Meteor.publish('unreads', function() {
	if (!this.userId) {
		throw new Meteor.Error('denied', 'not-authorized');
	}

	// setup some vars
	var messageQuery,
		messages,
		userGroupQuery,
		userGroups,
		uniqeMsgIds;
	var self 		= this;
	var user 		= Meteor.users.findOne(self.userId);
	var userIdArr 	= [self.userId]; // for use where queries require an array
	var contacts 	= user.contacts;

	// get groups
	userGroupQuery  = Groups.find({
		$or : [
			{ owner : self.userId },
			{ members : self.userId }
		]
	}, { // Projection to only return the _id field
			fields : { _id:1 }
		}
	);

	// create an array of group id's that belong to the user.
	userGroups = _.pluck(userGroupQuery.fetch(), '_id');

	messages = Messages.find({
		$or : [
			{  // unread direct messages
				$and : [
					{ participant : self.userId },
					{ userId : { $in : contacts } },
					{ readBy : { $nin : userIdArr } }
				]
			},
			{  // unread group messages
				$and : [
					{ groupId : { $in : userGroups } },
					{ readBy : { $nin : userIdArr } }
				]
			},
		]
	}, { sort : { // put newest messages first
			time : -1
		}
	});

	 // returns an array of unique documents based on userId or groupId
	uniqueMessages = _.uniq(messages.fetch(), function(msg) {
		if (msg.groupId) {
			return msg.groupId;
		}
		return msg.userId;
	});

	/*	Get the id's of all the latest unread messages
	(one per user or group) */
	uniqeMsgIds = _.pluck(uniqueMessages, '_id');

	/*	finally publish a reactive cursor containing
	one unread message(latest) for each user/group */
	return Messages.find({
		_id : { $in : uniqeMsgIds }
	});

});

