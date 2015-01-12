Template.groupList.helpers({
	groups : function() {
		return Groups.find({});
	},
	hasGroups : function() {
		var groups = groups.find({}).fetch() || [];
		if (groups.length > 0)
			return true;

		return false;
	}
});


Template.groupIndex.helpers({
	groupname : function() {
		return this.name;
	},
	description : function() {
		return this.description;
	}
});

Template.groupPage.helpers({
	groupId : function() {
		return this._id;
	}
});

Template.groupFormEdit.helpers({
	groupName : function() {
		return this.name;
	},
	groupDesc : function() {
		return this.description;
	}
});


Template.groupForm.events = {
	'submit .group-create' : function(event) {
		event.preventDefault();

		// Get the form values
		var name = $('#group-name').val();
		var desc = $('#group-desc').val();

		if ( !name.trim() ) {
			throw new Meteor.Error('incomplete');
		}

		// call the create group method
		Meteor.call('createGroup', name, desc, function (error, result) {
			if (error) {
				console.log(error);
				return error;
			}

			// Clear Form & var values
			name = '';
			desc = '';
			$('#group-name').val('');
			$('#group-desc').val('');

			// Redirect to the groups page
			Router.go('/groups');

			return result;
		});

	}
};

Template.groupFormEdit.events = {
	'submit .group-edit' : function(event) {
		event.preventDefault();

		// Get the form values
		var id = this._id;
		var name = $('#group-name').val();
		var desc = $('#group-desc').val();

		if ( !name.trim() ) {
			throw new Meteor.Error('incomplete');
		}

		// call the create group method
		Meteor.call('updateGroup', id, name, desc, function (error, result) {
			if (error) {
				console.log(error);
				return error;
			}

			// Clear Form & var values
			name = '';
			desc = '';
			$('#group-name').val('');
			$('#group-desc').val('');

			// Redirect to the groups page
			Router.go('/groups/'+id);

			return result;
		});

	}
};

Template.addGroupMembers.helpers({
	// This and this section part of template violates DRY.
	contacts : function() {
		// should be moved to the router, create seperate pub/sub for contacts
		var u = Meteor.user();
		console.log(u.contacts);
		return Meteor.users.find({
			$and : [
				{ _id : u.contacts },
				{ _id : {$ne : Meteor.userId()} }
			]
		});
	},
	members : function() {
		var controller 	 = Iron.controller();
		var groupId 	 = controller.params._id;
		var currentGroup = Groups.findOne(groupId);
		console.log(currentGroup.members);
		return Meteor.users.find({
			$and : [
				{ _id : {$in : currentGroup.members} },
				{ _id : {$ne : Meteor.userId()} }
			]
		});
	},
	inGroup : function() {
		var controller 	 = Iron.controller();
		var groupId 	 = controller.params._id;
		var currentGroup = Groups.findOne(groupId);

		if ( _.contains(currentGroup.members, this._id) ) {
			return true;
		}

		return false;
	}
});

Template.addGroupMembers.events = {
	'click .add' : function(event) {
		event.preventDefault();

		var controller  = Iron.controller();
		var groupId  	= controller.params._id;
		var userId 		= this._id;

		Meteor.call('addMemberToGroup', groupId, userId, function(error, result) {
			if (error) {
				console.log(error);
				return error;
			}
		});

		console.log(result);
		return result;
	},
	'click .remove' : function(event) {
		event.preventDefault();

		var controller  = Iron.controller();
		var groupId 	= controller.params._id;
		var userId 		= this._id;

		Meteor.call('removeMemberFromGroup', groupId, userId, function(error, result) {
			if (error) {
				console.log(error);
				return error;
			}

			console.log(result);
			return result;
		});
	},
	'click .leavegroup' : function(event) {
		event.preventDefault();

		var controller  = Iron.controler();
		var groupId 	= controller.params._id;

		Meteor.call('removeMeFromGroup', groupId, function(error,resuly) {
			if (error) {
				console.log(error);
				return error;
			}
			console.log(result);
			return result;
		});
	}
};
