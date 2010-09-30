annuus.add({
	id: '7e43a229-aa4a-456c-becc-65e69a8873b9',
	title: '移除引用半透明',
	pages: { on: [view] },
	condition: {
		test: Modernizr.opacity
	},
	tasks: {
		'092b4c39-2499-487c-bfe3-9e41c6b10a6b': {
			run_at: 'document_start',
			css: 'blockquote { opacity: 1; }'
		}
	}
});
