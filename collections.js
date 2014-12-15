/*

	Collections

*/

Messages 	= new Meteor.Collection('messages');
Groups 		= new Meteor.Collection('groups');

/* Search Index */
EasySearch.createSearchIndex('users', {
    'field' : ['username',
    			'profile.name',
                'profile.primaryemail',
    			'services.google.name',
    			'services.google.email',
    		], 						// required, searchable field(s)
    "use" :"mongo-db", 				// Search Engine
    'collection' : Meteor.users,    // required, Mongo Collection
    'limit' : 10                	// not required, default is 10
});

/* Search Init */
Meteor.users.initEasySearch([
	'username',
	'profile.name',
    'profile.primaryemail',
	'services.google.name',
	'services.google.email',
]);