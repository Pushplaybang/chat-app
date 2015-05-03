// Acount settings
Accounts.config({
	sendVerificationEmail 			  : false,
	forbidClientAccountCreation 	: false,
	restrictCreationByEmailDomain : function() {return false;},
	loginExpirationInDays 			  : 14
});

// UI settings
// Accounts.ui.config({
//   requestPermissions: {
//     google: ['profile', 'email']
//   },
//   requestOfflineToken: {
//     google: true
//   },
//   passwordSignupFields: 'EMAIL_ONLY'
// });

// Avatar Settings
// Avatar.options = {};