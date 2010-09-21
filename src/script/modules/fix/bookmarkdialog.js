annuus.add({
	id: '6086de99-4947-45c3-8332-5070931087e7',
	title: '修正新增bookmark對話框',
	pages: { on: [all] },
	tasks: {
		'1cb69761-bf3f-427b-a7dd-7d5b4548dd92': {
			run_at: 'document_start',
			css: '\
				#NewBookMark_Text { box-sizing: border-box; width: 90% !important; } \
				#NewBookMark_Text + input { width: 9% !important; } \
			'
		}
	}
});
