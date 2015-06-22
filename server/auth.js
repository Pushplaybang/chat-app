(function () {
    "use strict";

    Accounts.urls.resetPassword = function (token) {
        return Meteor.absoluteUrl('forgot/' + token);
    };

    Accounts.urls.verifyEmail = function (token) {
        return Meteor.absoluteUrl('verify/' + token);
    };

    Accounts.urls.enrollAccount = function (token) {
        return Meteor.absoluteUrl('enroll/' + token);
    };

})();

