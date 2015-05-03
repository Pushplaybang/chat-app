Template.unread.helpers({
	messages : function() {
		return Messages.find({},{ sort : { time: -1} });
	}
});

Template.unreadMessage.helpers({
	time : function() {
		// return moment(this.time).format('MMMM Do YYYY, h:mm:ss a');
		var m = moment(this.time);
		return moment(m).fromNow();
	}
});