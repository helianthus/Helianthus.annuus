annuus.addModules({

'0f7cdd14-1e7a-4481-81d4-24709102f887':
{
	title: 'Page Elements API',
	pages: { comp: [view | topics | search | tags | profilepage] },
	tasks: {
		'3adeef77': {
			service: 'utility',
			js: function()
			{
				$.fn.nameLinks = function()
				{
					return this.__nameLinks || (this.__nameLinks = $(document).pageName() === 'view' ? this.find('.repliers_left > div > a') : this.topics().find('a[href^="search"]'));
				};
			}
		},

		'29952b6e': {
			service: 'utility',
			page: topics | search | tags | profilepage,
			js: function()
			{
				$.fn.extend({
					topics: function()
					{
						return this.__topics || (this.__topics = this.topicTable().find('tr').has('td > a'));
					},

					topicTable: function()
					{
						return this.__topicTable || (this.__topicTable = this.find({
							topics: '#HotTopics > div > table',
							search: '#ctl00_ContentPlaceHolder1_topics_form > table + table > tbody > tr > td > table',
							tags: '#ctl00_ContentPlaceHolder1_topics_form > table + table > tbody > tr > td > table',
							profilepage: '#ctl00_ContentPlaceHolder1_UpdatePanelHistory .main_table1 > table > tbody > tr > td > table'
						}[this.pageName()]));
					}
				});
			}
		},

		'2d8c04f8': {
			service: 'utility',
			page: view,
			js: function()
			{
				$.fn.replies = function()
				{
					return this.__replies || (this.__replies = this.find('.repliers'));
				};
			}
		}
	}
}

});
