Router.configure({
	progressSpinner : false
});

/*
	Home
	- - - -
	Sign in Page or redirect to logged In home

 */
Router.route('/',function() {
	this.render('welcome');
});

// Router.route('/users',function() {
// 	this.render('members');
// });

Router.route('/profile', function() {
	this.render('profile');
});






/* Contacts Routes */
Router.route('/contacts',function() {
	this.render('contacts');
});

Router.route('/contacts/:_id',function() {
	this.render('chat');
});

Router.route('/chat',function() {
	this.render('chat');
});




/* Search */
Router.route('/search',function() {
	this.render('search');
});









/* Group Routes */
Router.route('/groups',function() {
	this.render('groupList');
});

Router.route('/groups/create',function() {
	this.render('groupCreate');
});

Router.route('/groups/:_id',function() {
	this.render('groupPage');
});