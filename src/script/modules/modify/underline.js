annuus.add({
	id: '68680179-e9f2-4472-9326-b0a25d0a5b2e',
	title: '移除連結底線',
	pages: { on: [all] },
	tasks: {
		'719587be-bf54-4fa6-b665-63e8163701d0': {
			run_at: 'document_start',
			css: '\
				a, \
				div[style*="padding: 10px 0px 5px 0px; font-weight: bold;"] a, \
				a[href].addthis_button_compact, \
				a[target][target="_new"] /* vote links */ \
					{ text-decoration: none; } \
				a[href^="http:"] { text-decoration: underline; } \
				#ctl00_ContentPlaceHolder1_lb_bloglink > a > span { text-decoration: none !important; } \
			'
		}
	}
});
