annuus.addModules({

'9e98386a-66ce-4298-af6e-a7d1648d18b4': {
	title: '修正頁面闊度',
	pages: { on: [giftpage] },
	tasks: {
		'475b4b70': {
			run_at: 'document_start',
			css: 'table[width="800"] { width: 100%; }'
		}
	}
},

'5ee24108-d17e-441d-b1c3-745fcf9fa422': {
	title: '修正站務台告示',
	pages: { on: [topics] },
	tasks: {
		'd661e32f': {
			frequency: 'always',
			js: function(self)
			{
				if($.urlSet().querySet.type === 'MB') {
					self.context().find('td[colspan="5"]').attr('colspan', '6');
				}
			}
		}
	}
},

'6086de99-4947-45c3-8332-5070931087e7': {
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
},

'74cd7f38-b0ad-4fca-ab39-673b0e2ee4c7': {
	title: '修正跳頁控件位置',
	pages: { on: [view] },
	tasks: {
		'd661e32f': {
			run_at: 'document_start',
			css: 'div[style*="padding: 18px 5px"] > div[style="text-align: center;"] { margin: 0 100px; }'
		}
	}
},

'06e59d06-5a10-4c3d-ab85-0c66a729208c': {
	title: '修正搜尋按扭位置',
	pages: { on: [index] },
	tasks: {
		'd661e32f': {
			run_at: 'document_start',
			css: '#searchstring { width: 50%; }'
		}
	}
}

});
