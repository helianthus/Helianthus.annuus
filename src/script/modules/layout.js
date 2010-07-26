annuus.addModules({

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
		},

		'cbe665ce': {
			page: search | tags,
			run_at: 'document_start',
			css: '.HitSearchText { float: right; }'
		}
	}
}

});
