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
			throw new Meteor.Error('not-authorized');
		}

		Messages.update( id, { $addToSet : { readBy : this.userId } } );
	},

	removeMessage: function(id) {
		var msg = Messages.findOne(id);

		if (msg.userId !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		Messages.remove(id);
	},

	createGroupMessage : function(name, time, msg, groupId) {
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