$.extend(an.plugins, {

'63d2407a-d8db-44cb-8666-64e5b76378a2':
{
	desc: '隱藏廣告',
	pages: { on: [all] },
	type: 3,
	options: { 'bRetroHideAds': { desc: '相容性模式', defaultValue: false, type: 'checkbox' } },
	queue: [{
		priority: 1,
		fn: function()
		{
			$.each({
				65535: '\
				#HKGTopAd { display: none; } \
				',
				// default
				2: '\
				#ctl00_ContentPlaceHolder1_MiddleAdSpace1, /* text ad */\
				.ContentPanel > div > div:first-child, /* flash ad */\
				#ctl00_ContentPlaceHolder1_lb_NewPM + br /* blank line */\
					{ display: none; } \
				',
				// topics
				4: '\
				.ContentPanel > table { width: 100%; } \
				.ContentPanel > table > tbody > tr > td:first-child { width: auto !important; } \
				.ContentPanel > table > tbody > tr > td:first-child + td \
					{ display: none; } \
				',
				// search, tags
				24: '\
				#ctl00_ContentPlaceHolder1_topics_form > script:first-child + div { width: 100% !important; } \
				#ctl00_ContentPlaceHolder1_topics_form > script:first-child + div + div { display: none; } \
					{ display: none; } \
				',
				// topics, search, tags
				28: '\
				td[height="52"] { display: none; } \
				',
				// view
				32: $.format('\
				#ctl00_ContentPlaceHolder1_view_form > script:first-child + div { width: 100% !important; } \
				#ctl00_ContentPlaceHolder1_view_form > script:first-child + div + div { display: none; } \
				div[style*="58px"], /* top & bottom ads */\
				#ctl00_ContentPlaceHolder1_view_form > div > table[width="100%"] > tbody > tr + tr /* inline ads */\
					{ display: none; } \
				div[style*="{0}"] { border-bottom-width: 0 !important; } \
				',
				$.browser.msie ? 'PADDING-BOTTOM: 18px' : 'padding: 18px'
				)
				,
				// topics, search, tags, view
				60: '\
				#ctl00_ContentPlaceHolder1_MiddleAdSpace1 div[style*="right"] { display: none; } /* text ad */\
				',
				// default, topics, search, tags, view
				62: '\
				#MainPageAd2 + br + br + div { padding-bottom: 10px !important; } \
				#MainPageAd2, #MainPageAd2 ~ br, /* text ads */\
				#ctl00_ContentPlaceHolder1_lb_NewPM + br \
					{ display: none; } \
				',
				// profilepage
				64: '\
				/* inline ads */\
				.main_table1 tr { display: none; } \
				.main_table1 tr[style], .main_table1 tr:first-child, #ctl00_ContentPlaceHolder1_ProfileForm > table > tbody > tr > td > table:first-child .main_table1 tr { display: table-row; } \
				'
			},
			function(nPageCode){ $.pageCode() & nPageCode && $.ss(this); });

			if($.pageCode() & 28 && !this.options('bRetroHideAds')) {
				var
				isMB = $.uriSet().querySet.type === 'MB',
				trSelector = ($.pageName() === 'topics' ? '#HotTopics > div > table' : '#ctl00_ContentPlaceHolder1_topics_form > div + table + table > tbody > tr > td > table').concat(' > tbody > tr');

				$.ss('{0}:nth-child(11n+{1}) {2} { display: none; }',
					trSelector,
					isMB ? 3 : 2,
					$.pageName() === 'topics' ? '' : $.format(', {0}:last-child', trSelector)
				);

				/* IE :o)
				$.format('{0}{2}, {0}{1}{2}, {0}{1!*2}{2}, {0}{1!*3}{2} { display: none; }',
					trSelector + ':first-child + tr',
					$.format('{0!*11}', '+tr'),
					isMB ? '+tr' : ''
				)
				*/
			}
		}
	},
	{
		fn: function()
		{
			if($.browser.msie || this.options('bRetroHideAds')) {
				$('td[height="52"]').parent().hide();
			}
		}
	}]
}

});