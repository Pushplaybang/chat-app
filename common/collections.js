/*

	Collections
	- - - - - -
	1 * by defining these without the var keyword - they are global, as
	opposed to scoped to the file
	2 * by defining then 'commonly' they exist on the client and server,
	collections that should only exist on the client OR server, should be
	defined specifically in those locations.

*/

// Users - NB : Meteor.users already exists as a collection
Messages 	= new Meteor.Collection('messages');
Groups 		= new Meteor.Collection('groups');
Invites 	= new Meteor.Collection('invites');


/* Search Index */
EasySearch.createSearchIndex('users', {
	'field' : [ 'profile.name',
				'profile.primaryemail',
			], 						// required, searchable field(s)
	"use" :"mongo-db", 				// Search Engine
	'collection' : Meteor.users,    // required, Mongo Collection
	'limit' : 10,                 	// not required, default is 10,
	'query' : function (searchString) { // none of this works right now :(
		// var currentUser   = Meteor.users.findOne(CurrentUserId); // CurrentUserId
		var currentUser   = Meteor.user();
		var userContacts  = CurrentUser.contacts;

		// Default query that will be used for searching
		var query = EasySearch.getSearcher('mongo-db').defaultQuery(this, searchString);

		query['profile.primaryemail'] = { $ne : currentUser.profile.primaryemail };
		query['profile.name'] = { $ne : currentUser.profile.name };
		// query['_id'] = { $nin : userContacts };

		return query;
	}
});

/* Search Init */
Meteor.users.initEasySearch([
	'profile.name',
	'profile.primaryemail',
]);