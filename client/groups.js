Template.groupList.helpers({
	groups : function() {
		return Groups.find({
			$or : [
				{ owner : Meteor.userId() },
				{ members : {$in : [ Meteor.userId() ]} }
			]
		});
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

Template.addGroupMembers.helpers({
	// This and this section part of template violates DRY.
	contacts : function() {
		// should be moved to the router, create seperate pub/sub for contacts
		var u = Meteor.user();
		console.log(u);
		return Meteor.users.find({
			$and : [
				{ _id : {$in : u.contacts} },
				{ _id : {$ne : Meteor.userId()} }
			]
		});
	}
});

Template.addGroupMembers.events = {
	'click .add' : function(event) {
		event.preventDefault();
		var controller = Iron.controller();
		var groupId  = controller.params._id;
		var userId = this._id;
		Meteor.call('addMemberToGroup', groupId, userId, function (error, result) {
			if (error) {
				console.log(error);
				return error;
			}
		});
	}
};