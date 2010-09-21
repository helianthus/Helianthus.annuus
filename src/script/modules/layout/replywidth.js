annuus.add({
	id: '0f9ddba8-1b0e-4dcd-9352-89b853d41f90',
	title: '設定回覆最小闊度',
	pages: { on: [view] },
	tasks: {
		'd7d69a41-539a-4545-897a-6d6c3511fefc': {
			service: 'lock',
			run_at: 'document_start',
			css: '.repliers_right blockquote { min-width: 200px; }'
		}
	}
});
