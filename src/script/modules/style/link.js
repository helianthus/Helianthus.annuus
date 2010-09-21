annuus.add({
	id: 'edd5174c-b7a4-48f1-8612-3f03c9adf05a',
	title: '連結樣式設定',
	pages: { on: [all] },
	options: {
		fcAnchorLink: { title: '連結: 未訪問文字顏色', type: 'text', defaultValue: '0000ee', access: 'public' },
		fcAnchorVisited: { title: '連結: 已訪問文字顏色', type: 'text', defaultValue: '551a8b', access: 'public' },
		fcAnchorHover: { title: '連結: 懸浮文字顏色', type: 'text', defaultValue: '0000ee', access: 'public' },
		styleHoverState: { title: '顯示懸浮文字顏色', type: 'checkbox', defaultValue: false }
	},
	tasks: {
		'3e809eed-85f4-4895-b53e-84a8ac7722ab': {
			service: 'theme',
			name: 'theme-links',
			position: 'pre',
			js: function(self, theme)
			{
				var css = '\
					a { color: #{0[fcAnchorLink]}; } \
					a:visited { color: #{0[fcAnchorVisited]}; } \
					\
					a[href^="default.aspx"], a[href^="topics.aspx"], a[href^="search.aspx"], a[href^="ProfilePage.aspx"], \
					a[href^="/tags.aspx"], /* default page */ \
					.addthis_button_compact:visited, \
					#ctl00_ContentPlaceHolder1_MiddleAdSpace1 > div > div > a, /* link to vote page */ \
					#ctl00_ContentPlaceHolder1_lb_bloglink > a, \
					div[style="padding: 10px 0px 5px 0px; font-weight: bold;"] a \
						{ color: #{0[fcAnchorLink]}; } \
				';

				if(self.options('styleHoverState')) {
					css += '\
						a:hover { color: #{0[fcAnchorLink]}; } \
					';
				}

				return css;
			}
		}
	}
});
