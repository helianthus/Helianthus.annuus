annuus.add({
	id: 'dbc157c1-0ddd-47a6-9e05-af5b06d5953b',
	title: '優化圖片縮放',
	pages: { on: [view | profilepage | sendpm] },
	tasks: {
		'9debc824-c7ef-435e-88b9-e53f8b1e3440': {
			service: 'lock',
			run_at: 'document_start',
			css: '\
				img[onload] { width: auto; height: auto; max-width: 100%; } \
				#previewArea img[onload] { max-width: 300px; } \
			'
		},

		'0cf2c5fc': {
			js: function()
			{
				window.DrawImage = $.noop;
			}
		}
	}
});
