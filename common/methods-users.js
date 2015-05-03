/*
	Define Methods so we can move insecure operations
	out of the client side code, they're defined commonly
	but only 'stubs' run on the client for latencty
	compensation.
*/

Meteor.methods({

	/* Contacts */
	addToContacts: function(invitedUser) {
		if ( !this.userId ) {
			throw new Meteor.Error("denied", "not-authorized");
		}

		// Check Arg vals
		check(invitedUser, String);

		var u = Meteor.user();

		if ( _.contains(u.contacts,invitedUser) ) {
			throw new Meteor.Error("denied", "already a contact");
		}

		// Get current user ID
		var uId = this.userId;

		// Get the current User Record
		var user = Meteor.users.findOne(uId);

		// check if this invite exists
		var invited = Invites.findOne({
			$and : [
				{ $or : [ { 'from.id' : uId }, { 'from.id' : invitedUser } ] },
				{ $or : [ { to : uId }, { to : invitedUser } ] },
			]
		});

		if (invited) {
			throw new Meteor.Error("denied", "already invited");
		}

		Meteor.users.update( uId, {
			$addToSet : { contacts: invitedUser }
		}, function(error,count) {
			if (error) {
				return error;
			}

			Invites.insert({
				from : {
					id 		: uId,
					name 	: user.profile.name,
					email 	: user.profile.primaryemail
				},
				to 		: invitedUser, // could be an email or id ??
				status 	: 'pending'
			});

			// TODO : send email
		});
	},

	acceptInvite : function(id) {
		if ( !this.userId ) {
			throw new Meteor.Error('denied', "not-authorized");
		}

		// Check Arg vals
		check(id, String);

		var uId 		= this.userId;
		var inviteId 	= id;
		var invite 		= Invites.findOne(inviteId);

		Meteor.users.update( uId, {
			$addToSet : { contacts: invite.from.id }
		}, function(error, count) {
			if (error) {
				return error;
			}

			Invites.update(inviteId, {
				$set : {
					status 	: 'accepted'
				}
			});
		});

	},

	blockInvite : function(id) {
		if ( !this.userId ) {
			throw new Meteor.Error('denied', "not-authorized");
		}

		// Check Arg vals
		check(id, String);

		var uId 		= this.userId;
		var inviteId 	= id;
		var invite 		= Invites.findOne(inviteId);

		Invites.update(inviteId, {
			$set : {
				status 	: 'blocked'
			}
		});

	},

	removeFromContacts : function(id) {
		if (!this.userId ) {
			throw new Meteor.Error("denied", "not-authorized");
		}

		// Check Arg vals
		check(id, String);

		Meteor.users.update( this.userId, {
			$pull : { contacts: id }
		}, function(error, count) {
			if (error) {
				return error;
			}
			Invites.remove({to : id});
		});
	},

});