annuus.add({
	id: '9e98386a-66ce-4298-af6e-a7d1648d18b4',
	title: '修正頁面闊度',
	pages: { on: [giftpage] },
	tasks: {
		'0a1f29f0-3d03-48c5-ab06-e701f032ebf2': {
			run_at: 'document_start',
			css: 'table[width="800"] { width: 100%; }'
		}
	}
});
