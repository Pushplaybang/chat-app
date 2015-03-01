var ERRORS_KEY = 'forgotsErrors';

Template.forgot.created = function() {
  Session.set(ERRORS_KEY, {});
};

Template.forgot.helpers({
	resetPassword : function(t) {
		if (Accounts._resetPasswordToken) {
			Session.set('resetPassword', Accounts._resetPasswordToken);
		}
		return Session.get('resetPassword');
	},
	errorMessages: function() {
	  return _.values(Session.get(ERRORS_KEY));
	},
	errorClass: function(key) {
	  return Session.get(ERRORS_KEY)[key] && 'error';
	}
});

Template.forgot.events({

	'submit #recovery-form' : function(event, target) {
		event.preventDefault()
		var email = $.trim(target.find('#recovery-email').value) || '';

		if ( email.length && email.indexOf('@') ) {
			errors.email = 'Email Address Required';
		}

		Session.set(ERRORS_KEY, errors);
		if (_.keys(errors).length) {
			return;
		}

		// TODO : super cheap - do this better.
		Accounts.forgotPassword({email: email}, function(err) {
			if (err) {
				return Session.set(ERRORS_KEY, {'none': error.reason});
			}
			// TODO : add notification
			Router.go('home');
		});
	},

	'submit #new-password' : function(e, t) {
		e.preventDefault();
		var pw = t.find('#new-password-password').value;

		if (pw.length < 1) {
			errors.password = 'New Password required';
		}

		Session.set(ERRORS_KEY, errors);
		if (_.keys(errors).length) {
			return;
		}

		// TODO : Super Cheap, validate this properly
		if (pw) {
			Accounts.resetPassword(Session.get('resetPassword'), pw, function(err) {
				if (err) {
					return Session.set(ERRORS_KEY, {'none': error.reason});
				} else {
					Session.set('resetPassword', null);
				}
				Router.go('home'); // TODO : add notification
			});
		}
	}
  });