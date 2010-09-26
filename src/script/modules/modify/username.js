annuus.add({
	id: '51ac61dd-9f7a-493e-804a-99acf6b741e4',
	title: '強制顯示空白會員名稱',
	pages: { on: [view | topics | search | tags | profilepage] },
	tasks: {
		'e7e146d9-efcc-445c-8040-522fc66ecdf8': {
			condition: {
				is: false
			},
			run_at: 'document_end',
			css: '.an-blankname:before { content: "空白名稱"; font-style: italic; }',
			js: function(self, context)
			{
				context.nameLinks().filter(function()
				{
					return this.offsetWidth === 0 && /userid=|st=A|ToggleUserDetail/.test($(this).attr('href'));
				})
				.addClass('an-blankname');
			}
		}
	}
});
