/*
	Define Methods so we can move insecure operations
	out of the client side code, they're defined commonly
	but only 'stubs' run on the client for latencty
	compensation.

	Methods that should only run on the server, or client,
	should be defined in the appropriate folders.
*/

Meteor.methods({

	/* Messages */
	createMessage: function (name, time, msg, participant) {
		if ( !this.userId ) {
			throw new Meteor.Error("denied", "not-authorized");
		}

		// Check Arg vals
		check(name, String);
		check(time, Number);
		check(msg, String);
		check(participant, String);

		Messages.insert({
			name 		: name,
			message 	: msg,
			userId 		: this.userId,
			participant : participant,
			time 		: time,
			status 		: 'unread'
		});
	},

	updateMessageStatus : function(id) {
		if (!this.userId) {
			throw new Meteor.Error('denied', 'not-authorized');
		}

		// Check Arg vals
		check(id, String);

		Messages.update( id, {
			$addToSet : { readBy : this.userId },
			$set : {status : 'read'}
		});
	},

	removeMessage: function(id) {
		if (!this.userId) {
			throw new Meteor.Error('denied', 'not-authorized');
		}

		// Check Arg vals
		check(id, String);

		var msg = Messages.findOne(id);

		if (msg.userId !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		Messages.remove(id);
	},

	createGroupMessage : function(name, time, msg, groupId) {
		if (!this.userId) {
			throw new Meteor.Error('denied', 'not-authorized');
		}

		// Check Arg vals
		check(name, String);
		check(time, Number);
		check(msg, String);
		check(groupId, String);

		Messages.insert({
			name 		: name,
			message 	: msg,
			userId 		: this.userId,
			groupId 	: groupId,
			time 		: time,
			status 		: 'unread'
		});
	}

});