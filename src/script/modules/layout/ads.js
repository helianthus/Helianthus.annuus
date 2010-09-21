annuus.add({
	id: '63d2407a-d8db-44cb-8666-64e5b76378a2',
	title: '隱藏廣告',
	pages: { on: [all] },
	tasks: {
		'f8323979-f0a0-4b55-b5e1-e36d6b363488': {
			run_at: 'document_start',
			css: '\
				#HKGTopAd \
					{ display: none; } \
			'
		},
		'1ea3aed8-d234-4784-85d1-e02de12de215': {
			condition: {
				page: index | topics | search | tags | view
			},
			run_at: 'document_start',
			css: '\
				#MainPageAd2 + br + br + div { padding-bottom: 10px !important; } \
				\
				#MainPageAd2, #MainPageAd2 ~ br, /* text ads */ \
				#ctl00_ContentPlaceHolder1_lb_NewPM + br \
					{ display: none; } \
			'
		},
		'1e6fdb31-764d-45a7-ae88-4461438a97d2': {
			condition: {
				page: topics | search | tags | view
			},
			run_at: 'document_start',
			css: '\
				#ctl00_ContentPlaceHolder1_MiddleAdSpace1 > div > div[style="float: right;"] /* text ad */ \
					{ display: none; } \
			'
		},
		'e4b44a1c-8389-4eba-a5f9-32f337be5e23': {
			condition: {
				page: topics | search | tags
			},
			run_at: 'document_start',
			css: '\
				td[colspan][height="52"] \
					{ display: none; } \
			'
		},
		'64b84d5c-aabc-49b9-94e7-1e6e0dd296a4': {
			condition: {
				page: topics
			},
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
		'808f491d-abbb-436b-a9fa-571cef76df00': {
			condition: {
				page: topics
			},
			condition: {
				is: $.browser.msie && $.browser.version <= 8
			},
			frequency: 'always',
			js: function(self, context)
			{
				context.find('td[colspan][height=52]').up('tr').hide();
			}
		},
		'a9ed7beb-e600-4089-9917-c11637e4f227': {
			condition: {
				page: search | tags | view
			},
			run_at: 'document_start',
			css: '\
				.ContentPanel > div[id^="ctl00_ContentPlaceHolder1"] > script:first-child + div { width: 100% !important; } \
				\
				.ContentPanel > div[id^="ctl00_ContentPlaceHolder1"] > script:first-child + div + div \
					{ display: none; } \
			'
		},
		'2e3963f6-a91a-4aff-85dd-ddd990f2696f': {
			condition: {
				page: search | tags
			},
			frequency: 'always',
			js: function(self, context)
			{
				context.find('td[colspan][height=52]').up('tr').hide();
			}
		},
		'255923d1-c9d8-44dc-bacc-aba98c8717d7': {
			condition: {
				page: view
			},
			run_at: 'document_start',
			css: '\
				#ctl00_ContentPlaceHolder1_view_form div > div[style*="padding: 18px 5px 18px 5px"] { border-bottom-width: 0 !important; } \
				\
				#ctl00_ContentPlaceHolder1_view_form div > div[style*="height: 58px"], /* top & bottom ads */ \
				#ctl00_ContentPlaceHolder1_view_form > div > table[width="100%"] > tbody > tr + tr /* inline ads */ \
					{ display: none; } \
			'
		},
		'38f96446-8655-4e33-bc63-e13413f17b55': {
			condition: {
				page: index
			},
			run_at: 'document_start',
			css: '\
				#ctl00_ContentPlaceHolder1_MiddleAdSpace1, /* text ad */ \
				.ContentPanel > div > div:first-child /* flash ad */ \
					{ display: none; } \
			'
		},
		'29af6c66-db5a-4a35-b669-4f13bbf5d656': {
			condition: {
				page: profilepage
			},
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
});
