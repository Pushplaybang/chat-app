/*
	Define Methods so we can move insecure operations
	out of the client side code, they're defined commonly
	but only 'stubs' run on the client for latencty
	compensation.
*/
Meteor.methods({
	// Message Methods
	createMessage: function (name, time, msg, participant) {
		if (!this.userId ) {
			throw new Meteor.Error("not-authorized");
		}

		Messages.insert({
			name 		: name,
			message 	: msg,
			userId 		: this.userid,
			participant : participant,
			time 		: time,
		});
	},

	removeMessage: function(id) {
		var msg = Messages.findOne(id);

		if (msg.userId !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		Messages.remove(id);
	},

	addToContacts: function(id) {
		var u = Meteor.user();
		if (!this.userId ) {
			throw new Meteor.Error("not-authorized");
		}

		if ( _.contains(u.contacts,id) ) {
			throw new Meteor.Error('already a contact');
		}

		Meteor.users.update( this.userId, {
			$push : { contacts: id }
		});
	},

	// remove from contacts
	removeFromContacts : function(id) {
		if (!this.userId ) {
			throw new Meteor.Error("not-authorized");
		}

		Meteor.users.update( this.userId, {
			$pull : { contacts: id }
		});
	},

	// Create a group
	createGroup : function(name, desc) {
		if (!this.userId ) {
			throw new Meteor.Error("not-authorized");
		}

		Groups.insert({
			owner : this.userId,
			name : name,
			description : desc,
			time : Date.now(),
		});

	},

	// Update a group
	updateGroup : function(id, name, desc) {
		if (!this.userId ) {
			throw new Meteor.Error("not-authorized");
		}

	},

	// delete a group
	removeGroup : function(id) {
		if (!this.userId ) {
			throw new Meteor.Error("not-authorized");
		}

	},

	// remove yourself from a group
	removeMeFromGroup : function(id) {
		if (!this.userId ) {
			throw new Meteor.Error("not-authorized");
		}

	}

});