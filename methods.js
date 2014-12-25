/*
	Define Methods so we can move insecure operations
	out of the client side code, they're defined commonly
	but only 'stubs' run on the client for latencty
	compensation.
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

		Messages.update( id, { $set : {status : 'read'} } );
	},

	removeMessage: function(id) {
		var msg = Messages.findOne(id);

		if (msg.userId !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		Messages.remove(id);
	},



	/* Contacts */

	addToContacts: function(id) {
		var u = Meteor.user();
		if (!this.userId ) {
			throw new Meteor.Error("denied", "not-authorized");
		}

		if ( _.contains(u.contacts,id) ) {
			throw new Meteor.Error("denied","already a contact");
		}

		Meteor.users.update( this.userId, {
			$push : { contacts: id }
		}, function(error,count) {
			Invites.insert({
				from : u._id,
				to : id,
				status : 'pending'
			});
		});
	},

	removeFromContacts : function(id) {
		if (!this.userId ) {
			throw new Meteor.Error("denied", "not-authorized");
		}

		Meteor.users.update( this.userId, {
			$pull : { contacts: id }
		});
	},

	/* Groups */

	createGroup : function(name, desc) {
		if (!this.userId ) {
			throw new Meteor.Error("denied", "not-authorized");
		}

		Groups.insert({
			owner : this.userId,
			name : name,
			description : desc,
			time : Date.now(),
		});
	},

	addMemberToGroup : function(groupId, userId) {
		if (!this.userId) {
			throw new Meteor.Error("denied","not-authorized");
		}

		var g = Groups.findOne(grouId);

		if ( _.contains(g.members, userId) ) {
			throw new Meteor.Error("denied","already a member");
		}

		Groups.update(groupId, {
			$push : { members : userId }
		});
	},

	// Update a group
	updateGroup : function(id, name, desc) {
		if (!this.userId ) {
			throw new Meteor.Error("denied", "not-authorized");
		}
	},

	removeGroup : function(id) {
		if (!this.userId ) {
			throw new Meteor.Error("denied", "not-authorized");
		}
	},

	removeMeFromGroup : function(id) {
		if (!this.userId ) {
			throw new Meteor.Error("denied", "not-authorized");
		}
	}

});