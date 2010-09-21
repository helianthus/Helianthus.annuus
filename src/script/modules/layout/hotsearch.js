annuus.add({
	id: '5df7826a-42d3-400d-ba75-adce23c2c898',
	title: '優化熱門關鍵字位置',
	pages: { on: [all] },
	tasks: {
		'deabdbbe-12e8-49be-9028-3f572f3012f6': {
			run_at: 'document_start',
			css: '#st + div { padding-right: 0 !important; }'
		},

		'c9b1c7b9-6335-460a-bb48-204080558446': {
			condition: {
				page: search | tags
			},
			run_at: 'document_start',
			css: '.HitSearchText { float: right; }'
		}
	}
});
