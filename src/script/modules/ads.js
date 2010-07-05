annuus.addModules({

'63d2407a-d8db-44cb-8666-64e5b76378a2':
{
	title: '隱藏廣告',
	pages: { on: [all] },
	tasks: {
		'07890003': {
			run_at: 'document_start',
			css: '\
				#HKGTopAd \
					{ display: none; } \
			'
		},
		'62597db3': {
			page: index | topics | search | tags | view,
			run_at: 'document_start',
			css: '\
				#MainPageAd2 + br + br + div { padding-bottom: 10px !important; } \
				\
				#MainPageAd2, #MainPageAd2 ~ br, /* text ads */ \
				#ctl00_ContentPlaceHolder1_lb_NewPM + br \
					{ display: none; } \
			'
		},
		'e295c5e0': {
			page: topics | search | tags | view,
			run_at: 'document_start',
			css: '\
				#ctl00_ContentPlaceHolder1_MiddleAdSpace1 > div > div[style="float: right;"] /* text ad */ \
					{ display: none; } \
			'
		},
		'f760e485': {
			page: topics | search | tags,
			run_at: 'document_start',
			css: '\
				td[colspan][height="52"] \
					{ display: none; } \
			'
		},
		'776549b6': {
			page: topics,
			run_at: 'document_start',
			css: '\
				.ContentPanel > table { width: 100%; } \
				.ContentPanel > table > tbody > tr > td:first-child { width: auto !important; } \
				\
				.ContentPanel > table > tbody > tr > td:first-child + td \
					{ display: none; } \
				\
				#aspnetForm:not([action*="type=MB"]) #HotTopics > div > table > tbody > tr:first-child ~ tr:not([username]), \
				#aspnetForm[action*="type=MB"] #HotTopics > div > table > tbody > tr:first-child + tr ~ tr:not([username]) \
					{ display: none; } \
			'
		},
		'defe6bdf': {
			page: topics,
			requires: [$.browser.msie && $.browser.version <= 8],
			frequency: 'always',
			js: function(self)
			{
				self.context().find('td[colspan][height=52]').up('tr').hide();
			}
		},
		'10053965': {
			page: search | tags | view,
			run_at: 'document_start',
			css: '\
				.ContentPanel > div[id^="ctl00_ContentPlaceHolder1"] > script:first-child + div { width: 100% !important; } \
				\
				.ContentPanel > div[id^="ctl00_ContentPlaceHolder1"] > script:first-child + div + div \
					{ display: none; } \
			'
		},
		'18f3515f': {
			page: search | tags,
			frequency: 'always',
			js: function(self)
			{
				self.context().find('td[colspan][height=52]').up('tr').hide();
			}
		},
		'9b8cfb9a': {
			page: view,
			run_at: 'document_start',
			css: '\
				#ctl00_ContentPlaceHolder1_view_form div > div[style*="padding: 18px 5px 18px 5px"] { border-bottom-width: 0 !important; } \
				\
				#ctl00_ContentPlaceHolder1_view_form div > div[style*="height: 58px"], /* top & bottom ads */ \
				#ctl00_ContentPlaceHolder1_view_form > div > table[width="100%"] > tbody > tr + tr /* inline ads */ \
					{ display: none; } \
			'
		},
		'2c9dd57a': {
			page: index,
			run_at: 'document_start',
			css: '\
				#ctl00_ContentPlaceHolder1_MiddleAdSpace1, /* text ad */ \
				.ContentPanel > div > div:first-child /* flash ad */ \
					{ display: none; } \
			'
		},
		'86d09787': {
			page: profilepage,
			run_at: 'document_start',
			/*
			#ctl00_ContentPlaceHolder1_PMPersonalTable .main_table1 > table > tbody > tr > td > table > tbody > tr:first-child ~ tr:not([style]),
			#ctl00_ContentPlaceHolder1_UpdatePanelHistory .main_table1 > table > tbody > tr > td > table > tbody > tr:first-child ~ tr:not([style])
				{ display: none; }
			*/
			css: '\
				.main_table1 tr { display: none; } \
				.main_table1 tr[style], .main_table1 tr:first-child, #ctl00_ContentPlaceHolder1_ProfileForm > table > tbody > tr > td > table:first-child .main_table1 tr { display: table-row; } \
			'
		}
	}
}

});
