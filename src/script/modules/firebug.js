annuus.addModules({

'730294d8-b68c-4e68-a9b6-ee006813d3f1':
{
	title: 'Firebug Lite',
	pages: { debug: [0] }, // not helping
	requires: [!$.browser.mozilla],
	tasks: {
		'e6d2ea58': {
			run_at: 'document_start',
			js: function()
			{

				// firebug has a serious looping bug with safari :(
				!$.browser.webkit && $.getScript('https://getfirebug.com/firebug-lite-beta.js');
			}
		}
	}
}

});
