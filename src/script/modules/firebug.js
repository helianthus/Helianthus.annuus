annuus.addModules({

'730294d8-b68c-4e68-a9b6-ee006813d3f1':
{
	title: 'Firebug Lite',
	pages: { debug: [all] },
	requires: [!$.browser.mozilla],
	tasks: {
		'e6d2ea58': {
			run_at: 'document_start',
			js: function()
			{
				$.getScript('https://getfirebug.com/firebug-lite-beta.js');
			}
		}
	}
}

});
