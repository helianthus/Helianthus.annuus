annuus.addModules({

'9e98386a-66ce-4298-af6e-a7d1648d18b4':
{
	title: '修正頁面闊度',
	pages: { on: [giftpage] },
	tasks: {
		'475b4b70': {
			run_at: 'document_start',
			css: 'table[width="800"] { width: 100%; }'
		}
	}
},

'5ee24108-d17e-441d-b1c3-745fcf9fa422':
{
	title: '修正站務台告示',
	pages: { on: [topics] },
	tasks: {
		'd661e32f': {
			frequency: 'always',
			js: function(job)
			{
				if($.uriSet().querySet.type === 'MB') {
					job.context().find('td[colspan="5"]').attr('colspan', '100%');
				}
			}
		}
	}
},

'6086de99-4947-45c3-8332-5070931087e7':
{
	title: '修正新增bookmark對話框',
	pages: { on: [all] },
	tasks: {
		'd661e32f': {
			run_at: 'document_start',
			css: '\
				#NewBookMark_Text { box-sizing: border-box; width: 90% !important; } \
				#NewBookMark_Text + input { width: 9% !important; } \
			'
		}
	}
}

});
