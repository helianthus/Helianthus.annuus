annuus.addModules(function(){ return {

'86bf4af6-0be0-44e5-a02e-6373776b6982':
{
	title: '簡單美化頁面',
	pages: { on: [all] },
	tasks: {
		'475b4b70': {
			run_at: 'document_start',
			css: '\
				body, td, p, .DivResizableBoxContainer { font-family: sans-serif; } \
				body { word-wrap: break-word; } \
				.repliers_right { table-layout: fixed; } \
				a { text-decoration: none; } \
				#ctl00_ContentPlaceHolder1_lb_bloglink > a > span { text-decoration: none !important; } \
			'
		}
	}
}

}; });
