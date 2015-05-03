/*
	Group Publications
	- - - - - - - - - - -
*/

Meteor.publish('groups', function () {
	if (!this.userId) {
		throw new Meteor.Error('denied', 'not-authorized');
	}

	return Groups.find({
		$or : [
			{owner : this.userId},
			{members : {$in : [this.userId]}}
		]
	});
});

Meteor.publish('singlegroup', function(id) {
	return Groups.find({
		_id : id
	});
})

