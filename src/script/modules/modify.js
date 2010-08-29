annuus.add({

'dbc157c1-0ddd-47a6-9e05-af5b06d5953b': {
	title: '優化圖片縮放',
	pages: { on: [view | profilepage | sendpm] },
	tasks: {
		'475b4b70': {
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
},

'7e43a229-aa4a-456c-becc-65e69a8873b9': {
	title: '移除引用半透明',
	pages: { on: [view] },
	condition: {
		is: document.createElement('div').style.opacity != null
	},
	tasks: {
		'475b4b70': {
			run_at: 'document_start',
			css: 'blockquote { opacity: 1; }'
		}
	}
},

'51ac61dd-9f7a-493e-804a-99acf6b741e4': {
	title: '強制顯示空白會員名稱',
	pages: { on: [view | topics | search | tags | profilepage] },
	tasks: {
		'475b4b70': {
			run_at: 'document_end',
			css: '.an-blankname:before { content: "空白名稱"; font-style: italic; }',
			js: function(self)
			{
				annuus.context().nameLinks().filter(function()
				{
					return this.offsetWidth === 0 && /userid=|st=A|ToggleUserDetail/.test($(this).attr('href'));
				})
				.addClass('an-blankname');
			}
		}
	}
}

});
