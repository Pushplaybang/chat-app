/*
	Define Methods so we can move insecure operations
	out of the client side code
*/
Meteor.methods({
	// Message Methods
	createMessage: function (name, userid, msg, participant) {
		if (!Meteor.userId() ) {
			throw new Meteor.Error("not-authorized");
		}

		Messages.insert({
			name 		: name,
			message 	: msg,
			userId 		: userid,
			participant : participant,
			time 		: Date.now(),
		});
	},

	removeMessage: function(id) {
		var msg = Messages.findOne(id);

		if (msg.userId !== Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}

		Messages.remove(id);
	},

	addToContacts: function(id) {
		// var userId = Meteor.users.findOne( metero.userId() );
		var u = Meteor.user();
		if ( _.contains(u.contacts,id) ) {
			throw new Meteor.Error('already a contact');
		}

		Meteor.users.update( Meteor.userId(), {
			$push: { contacts: id }
		});
	}
});