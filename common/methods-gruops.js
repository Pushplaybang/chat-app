/*
	Define Methods so we can move insecure operations
	out of the client side code, they're defined commonly
	but only 'stubs' run on the client for latencty
	compensation.
*/

Meteor.methods({

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

		var g = Groups.findOne(groupId);

		if ( _.contains(g.members, userId) || (g.owner === userId) ) {
			throw new Meteor.Error("denied","already a member");
		}

		Groups.update(groupId, {
			$addToSet : { members : userId }
		});
	},

	removeMemberFromGroup : function(groupId, userId) {
		if (!this.userId) {
			throw new Meteor.Error("denied","not-authorized");
		}

		Groups.update(groupId, {
			$pull : { members : userId }
		});
	},

	// Update a group
	updateGroup : function(id, name, desc) {
		if (!this.userId ) {
			throw new Meteor.Error("denied", "not-authorized");
		}

		Groups.update(id, {
			$set : {
				name : name,
				desc : desc
			}
		});
	},

	removeGroup : function(id) {
		if (!this.userId ) {
			throw new Meteor.Error("denied", "not-authorized");
		}
		var group = Groups.findOne(id);

		if (group.owner !== this.userId) {
			throw new Meteor.Error("denied", "not-authorized");
		}

		Groups.remove(id);
	},

	removeMeFromGroup : function(id) {
		if (!this.userId ) {
			throw new Meteor.Error("denied", "not-authorized");
		}

		var group = Groups.findOne(id);

		if (group.owner === this.userId) {
			Groups.update(id, {
				$set : { owner : null }
			})

		} else {
			Groups.update(id, {
				$pull : { members : this.userId }
			});
		}

	}

});