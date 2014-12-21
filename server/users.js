Accounts.onCreateUser(function(options, user) {

	/* We still want the default hook's 'profile' behavior. */
	user.profile = options.profile || {};

	/* add our additional values to the profile */
	if ( typeof user.services.google !== 'undefined' ) {
		user.profile.primaryemail = user.services.google.email;
	} else {
		user.profile.primaryemail = options.email;
		user.profile.name = options.email.substring(0, options.email.indexOf('@'));
	}

	return user;
});