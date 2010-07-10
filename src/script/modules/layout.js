annuus.addModules({

'86bf4af6-0be0-44e5-a02e-6373776b6982':
{
	title: '鎖定表格闊度',
	pages: { comp: [all] },
	tasks: {
		'475b4b70': {
			run_at: 'document_start',
			css: '\
				.repliers > tbody > tr > td + td > table, \
				.ListPMText > table, .ListPMText > table > tbody > tr > td > table \
					{ table-layout: fixed; } \
				.repliers_right td { overflow: hidden; } \
				body { word-wrap: break-word; } \
			'
		},

		'844954b0-d8f3-435d-990b-b6df6460f01e': {
			run_at: 'document_start',
			page: view,
			requires: [!!window.opera],
			css: '#ctl00_ContentPlaceHolder1_view_form > div > table, .repliers { table-layout: fixed; }'
		},

		// fix vote page
		'd594b10a': {
			page: view,
			frequency: 'always',
			js: function(self)
			{
				self.context().find('.repliers > tbody > tr > td[colspan="100%"]').attr('colspan', '2');
			}
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
		},

		'cbe665ce': {
			page: search | tags,
			run_at: 'document_start',
			css: '.HitSearchText { float: right; }'
		}
	}
}

});
