/* When Creating a New User */
Accounts.onCreateUser(function(options, user) {

	/* We still want the default hook's 'profile' behavior. */
	user.profile = options.profile || {};

	/*
		add our additional values to the profile if logging in with google
		TODO : swop this to check for the 'emails' array on signup and then handle each social auth provider
	 */
	if ( typeof user.services.google !== 'undefined' ) {
		user.profile.primaryemail = user.services.google.email;

		// set std email
		// user.emails = [];
		// user.emails.push({
		// 	address  : user.services.google.email,
		// 	// verified : false
		// });

		/* create random password & Encrypt it */
		user.services.password = {
			bcrypt : Random.secret(62)
		};

		user.profile.usedsocial  = true;
		user.profile.hasloggedin = false;

	} else {
		user.profile.usedsocial   = false;
		user.profile.primaryemail = options.email;
		user.profile.name         = options.email.substring(0, options.email.indexOf('@'));
	}

	return user;
});

/* When Logging In */
Accounts.onLogin(function(obj) {
	// console.log(obj);
	// var u = obj.user;

	// /* On First Login */
	// if (u.profile.hasloggedin < 1 && u.profile.usedsocial) {
	// 	Accounts.sendResetPasswordEmail( u._id );
	// 	u.profile.hasloggedin++;
	// }

});

