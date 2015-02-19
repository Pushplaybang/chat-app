/*
	Routes Index
	- - - -
	/ 						[home]
	/profile 				[profile]
	/search 				[search and invite users]
	/contacts 				[contacts]

	/contacts/:_id 			[Chat with a single contact]
	/unread 				[unread messages]

	/groups 				[groups]
	/groups/create 			[create a new group]
	/groups/:_id 			[single group]
	/groups/:_id/edit 		[edit a single group]
	/groups/:_id/members 	[members for a single group]

	/invites 				[view your invites]
	/emailinvite 			[send an email invite]


	Subscription Index
	- - - -
	Messages Collection
		- messages(id, isgroup)
		- unreads

	Meteor.Users Collection
		 - appusers 			[all users]
		 - thisuser 			[just current user]
		 - contacts				[current users contacts]
		 - groupusers(id) 		[user records for a given group]

	Groups Collection
		- groups
		- singlegroup(id)

	Invites Collection
		- invites
 */



/* Router Options */
Router.configure({
	layoutTemplate : 'AppLayout',
	progressSpinner : false,
});

// Perform Login Check for auth routes
Router.onBeforeAction(function() {
	if ( !(Meteor.userId() || Meteor.loggingIn()) ) {
		// Router.go('home');
		this.stop();
		window.history.back();
		this.next();
	} else {
		this.next();
	}
}, {
	except : ['home','signin', 'signup','forgot','about']
});


Router.route('/', {
	name : 'home',
	action 	: function() {
		this.render('welcome');
	},
});

Router.route('/about', {
	name: 'about',
	action : function() {
		this.render('about');
	}
});

Router.route('/signin', {
	name: 'signin',
	action : function() {
		this.render('signin');
	}
});

Router.route('/signup', {
	name: 'signup',
	action : function() {
		this.render('signup');
	}
});

Router.route('/forgot', {
	name: 'forgot',
	action : function() {
		this.render('forgot');
	}
});

Router.route('/profile', {
	name : 'profile',
	waitOn 	: function() {
		if (!(Meteor.userId() || Meteor.loggingIn()) ) {
			console.log('not authenticated : subscriptions not loaded.');
			return null;
		}

		return Meteor.subscribe('thisUser');
	},
	action 	: function() {
		if (this.ready()) {
			console.log(Meteor.user());
			this.render('profile');
		}
	},
});






/* Contacts Routes */
Router.route('/contacts', {
	name : 'contacts',
	waitOn 	: function() {
		if (!(Meteor.userId() || Meteor.loggingIn()) ) {
			console.log('not authenticated : subscriptions not loaded.');
			return null;
		}

		return [
			Meteor.subscribe('contacts'),
			Meteor.subscribe('thisUser')
		];
	},
	action 	: function() {
		if (this.ready()) {
			this.render('contacts');
		}
	}
});

Router.route('/contacts/:_id', {
	name : 'contact',
	waitOn 	: function() {
		if (!(Meteor.userId() || Meteor.loggingIn()) ) {
			console.log('not authenticated : subscriptions not loaded.');
			return null;
		}

		return [
			Meteor.subscribe('messages', this.params._id, false),
			Meteor.subscribe('singleUser', this.params._id),
		];
	},
	action 	: function() {
		if (this.ready()) {
			this.render('chat');
		}
	},
});

Router.route('/unread', {
	name : 'unread',
	waitOn 	: function() {
		if (!(Meteor.userId() || Meteor.loggingIn()) ) {
			console.log('not authenticated : subscriptions not loaded.');
			return null;
		}

		return [
			Meteor.subscribe('contacts'),
			Meteor.subscribe('groups'),
			Meteor.subscribe('unreads'), // Messages Collection.
			Meteor.subscribe('thisUser')
		];
	},
	action 	: function() {
		if (this.ready()) {
			this.render('unread');
		}
	},
});




/* Search */
Router.route('/search', {
	name : 'search',
	waitOn 	: function() {
		if (!(Meteor.userId() || Meteor.loggingIn()) ) {
			console.log('not authenticated : subscriptions not loaded.');
			return null;
		}

		return Meteor.subscribe('appusers');
	},

	action 	: function() {
		if (this.ready()) {
			this.render('search');
		}
	},

});









/* Group Routes */
Router.route('/groups', {
	name : 'gruops',
	waitOn 	: function() {
		if (!(Meteor.userId() || Meteor.loggingIn()) ) {
			console.log('not authenticated : subscriptions not loaded.');
			return null;
		}

		return [
			Meteor.subscribe('groups'),
			Meteor.subscribe('thisUser')
		];
	},

	action 	: function() {
		if (this.ready()) {
			this.render('groupList');
		}
	},

});

Router.route('/groups/create', {
	name : 'createGroup',
	waitOn 	: function() {
		if (!(Meteor.userId() || Meteor.loggingIn()) ) {
			console.log('not authenticated : subscriptions not loaded.');
			return null;
		}

		return Meteor.subscribe('groups');
	},

	action 	: function() {
		if (this.ready()) {
			this.render('groupCreate');
		}
	},

});

Router.route('/groups/:_id', {
	name : 'group',
	waitOn 	: function() {
		if (!(Meteor.userId() || Meteor.loggingIn()) ) {
			console.log('not authenticated : subscriptions not loaded.');
			return null;
		}

		return [
			Meteor.subscribe('messages', this.params._id, true),
			Meteor.subscribe('groupusers', this.params._id),
			Meteor.subscribe('singlegroup', this.params._id),
			Meteor.subscribe('thisUser'),
		];
	},

	action 	: function() {
		if (this.ready()) {
			this.render('groupPage', {
				data : function() {
					return Groups.findOne({_id : this.params._id});
				}
			});
		}
	},

});

Router.route('/groups/:_id/members', {
	name : 'groupMembers',
	waitOn 	: function() {
		if (!(Meteor.userId() || Meteor.loggingIn()) ) {
			console.log('not authenticated : subscriptions not loaded.');
			return null;
		}

		return [
			Meteor.subscribe('groupusers', this.params._id),
			Meteor.subscribe('contacts'),
			Meteor.subscribe('thisUser'),
			Meteor.subscribe('singlegroup', this.params._id),
		];

	},

	action 	: function() {
		if (this.ready()) {
			this.render('addGroupMembers');
		}
	},

});

Router.route('/groups/:_id/edit', {
	name : 'groupEdit',
	waitOn 	: function() {
		if (!(Meteor.userId() || Meteor.loggingIn()) ) {
			console.log('not authenticated : subscriptions not loaded.');
			return null;
		}

		return [
			Meteor.subscribe('singlegroup', this.params._id),
			Meteor.subscribe('thisUser'),
		];
	},

	action 	: function() {
		if (this.ready()) {
			this.render('groupEdit', {
				data : function() {
					return Groups.findOne({_id : this.params._id});
				}
			});
		}
	},

});

Router.route('/invites', {
	name : 'invites',
	waitOn 	: function() {
		if (!(Meteor.userId() || Meteor.loggingIn()) ) {
			console.log('not authenticated : subscriptions not loaded.');
			return null;
		}

		return [
			Meteor.subscribe('invites'),
			Meteor.subscribe('thisUser')
		];
	},

	action 	: function() {
		if (this.ready()) {
			this.render('invites');
		}
	},

});

Router.route('/emailinvite', {
	name : 'emailinvite',
	action 	: function() {
		this.render('emailinvite');
	},
});