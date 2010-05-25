annuus.addModules({

'dbc157c1-0ddd-47a6-9e05-af5b06d5953b':
{
	title: '優化圖片縮放',
	pages: { on: [view] },
	tasks: {
		'475b4b70': {
			run_at: 'document_start',
			css: '.repliers_right img { width: auto; height: auto; max-width: 100%; }'
		},

		'0cf2c5fc': {
			js: function()
			{
				window.DrawImage = $.noop;
			}
		}
	}
}

});
