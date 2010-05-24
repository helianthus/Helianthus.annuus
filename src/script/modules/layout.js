annuus.addModules(function(){ return {

'86bf4af6-0be0-44e5-a02e-6373776b6982':
{
	title: '鎖定表格闊度',
	pages: { on: [all] },
	tasks: {
		'475b4b70': {
			run_at: 'document_start',
			css: '\
				body { word-wrap: break-word; } \
				.repliers_right { table-layout: fixed; } \
			'
		}
	}
},

'3aad9218-46e4-4512-92b8-07d5f5f3626e':
{
	title: '縮短Bookmark列',
	pages: { on: [all] },
	tasks: {
		'475b4b70': {
			run_at: 'document_start',
			css: '.hkg_bottombar { width: auto; padding-right: 10px; }'
		}
	}
},

'5df7826a-42d3-400d-ba75-adce23c2c898':
{
	title: '優化熱門關鍵字位置',
	pages: { on: [all] },
	tasks: {
		'475b4b70': {
			run_at: 'document_start',
			css: '#st + div { padding-right: 0 !important; }'
		}
	}
}

}; });