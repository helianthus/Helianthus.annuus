annuus.add({

'0b721576-57a8-46b0-b0e5-6fec32e4aafa': {
	title: 'Simple API Service',
	pages: { comp: [all] },
	tasks: {
		'4ea1dd56': {
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
