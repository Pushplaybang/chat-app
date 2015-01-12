if (Accounts._resetPasswordToken) {
	Session.set('resetPassword', Accounts._resetPasswordToken);
}

Template.forgot.helpers({
	resetPassword : function(t) {
		return Session.get('resetPassword');
	}
});

Template.forgot.events({

	'submit #recovery-form' : function(event, target) {
		event.preventDefault()
		var email = $.trim(target.find('#recovery-email').value) || '';

		// TODO : super cheap - do this better.
		if ( email.length && email.indexOf('@') ) {

			Accounts.forgotPassword({email: email}, function(err) {
				if (err)
					Session.set('displayMessage', 'Password Reset Error &amp; Doh')
				else {
					Session.set('displayMessage', 'Email Sent &amp; Please check your email.')
				}

				Session.set('loading', false);
			});
		}

		return false;
	},

	'submit #new-password' : function(e, t) {
		e.preventDefault();
		var pw = t.find('#new-password-password').value;

		// TODO : Super Cheap, validate this properly
		if (pw) {
			Session.set('loading', true);
			Accounts.resetPassword(Session.get('resetPassword'), pw, function(err) {
				if (err)
					Session.set('displayMessage', 'Password Reset Error &amp; Sorry');
				else {
					Session.set('resetPassword', null);
				}
				Session.set('loading', false);
			});
		}
		return false;
	}
  });