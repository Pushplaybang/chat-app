/*

	Collections

*/

Messages 	= new Meteor.Collection('messages');
Groups 		= new Meteor.Collection('groups');
Invites 	= new Meteor.Collection('invites');

/* Search Index */
EasySearch.createSearchIndex('users', {
	'field' : [ 'username',
				'profile.name',
				'profile.primaryemail',
				'services.google.name',
				'services.google.email',
			], 						// required, searchable field(s)
	"use" :"mongo-db", 				// Search Engine
	'collection' : Meteor.users,    // required, Mongo Collection
	'limit' : 10,                 	// not required, default is 10,
	'query' : function (searchString) {
		// Default query that will be used for searching
		var query = EasySearch.getSearcher('mongo-db').defaultQuery(this, searchString);
		var user = Meteor.users.findOne(this.publishScope.userId);

		//  custom logic, using natural key : email
		query['profile.primaryemail'] = {$ne: user.profile.primaryemail};
		return query;
	}
});

/* Search Init */
Meteor.users.initEasySearch([
	'username',
	'profile.name',
	'profile.primaryemail',
	'services.google.name',
	'services.google.email',
]);