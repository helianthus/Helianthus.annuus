annuus.add({
	id: '730294d8-b68c-4e68-a9b6-ee006813d3f1',
	title: 'Firebug Lite',
	pages: { debug: [all] },
	condition: {
		test: !$.browser.mozilla && false // not helping
	},
	tasks: {
		'a944a86c-31dc-41d5-be0c-c24af10acfb9': {
			run_at: 'document_start',
			js: function()
			{
				// firebug has a serious looping bug with safari :(
				!$.browser.webkit && $.getScript('https://getfirebug.com/firebug-lite-beta.js');
			}
		}
	}
});
