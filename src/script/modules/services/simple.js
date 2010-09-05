annuus.add({

'0b721576-57a8-46b0-b0e5-6fec32e4aafa': {
	title: 'Simple API Service',
	pages: { comp: [all] },
	tasks: {
		'c5f21133-2122-4eae-80f2-7693de7061df': {
			type: 'service',
			name: 'simple',
			run_at: 'window_start',
			api: {
				isLoggedIn: {},
				isReplyContent: {},
				isVotePage: {}
			},
			init: function(self, jobs)
			{
				if(jobs.length) {
					bolanderi.log('warn', 'Simple API service cannot be used directly, please use the API provided instead.');
				}
			},

			isLoggedIn: function()
			{
				return !!$.cookie('username');
			},

			isReplyContent: function(self, context)
			{
				return !!$(context).closest('.repliers_right > tbody > tr:first-child > td').length;
			},

			isVotePage: function(self, context)
			{
				return !!$(context).find('.repliers:first > tbody > style').length;
			}
		}
	}
}

});
