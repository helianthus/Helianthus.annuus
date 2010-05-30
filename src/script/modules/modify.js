annuus.addModules({

'dbc157c1-0ddd-47a6-9e05-af5b06d5953b':
{
	title: '優化圖片縮放',
	pages: { on: [view | profilepage | sendpm] },
	tasks: {
		'475b4b70': {
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
},

'7e43a229-aa4a-456c-becc-65e69a8873b9':
{
	title: '移除引用半透明',
	pages: { on: [view] },
	requires: [
		{ type: 'truthy', params: document.createElement('div').style.opacity !== undefined }
	],
	tasks: {
		'475b4b70': {
			run_at: 'document_start',
			css: 'blockquote { opacity: 1; }'
		}
	}
}

});
