annuus.addModules({

'736b0a78-4b70-45a2-a6c8-a3cdbe5f11fa': {
	title: '字體設定',
	pages: { on: [all] },
	options: {
		ffDefault: { title: '字體名稱', type: 'text', defaultValue: 'sans-serif', access: 'public' }
	},
	tasks: {
		'e6d2ea58': {
			run_at: 'document_start',
			css: '\
				body, td, p, textarea, .ui-widget, #aspnetForm [class] { font-family: {0.options(ffDefault)}; } \
				td[style*="font-family:"] { font-family: {0.options(ffDefault)} !important; } \
			'
		}
	}
}

});
