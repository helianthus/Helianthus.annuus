annuus.addModules({

'91f24db0-1e4e-4aa3-80cd-ac50dfb41a86':
{
	title: '設定背景',
	pages: { on: [all] },
	options: {
		bgAero: { title: 'Aero Glass背景', description: '暫時僅Opera支援', type: 'checkbox', defaultValue: true },
		bgImageBody: { title: '圖片位置', type: 'text', defaultValue: 'http://i29.tinypic.com/kexdw2.jpg', access: 'public', requires: {
			options: { id: 'bgAero', value: false }
		}},
		autoFit: { title: '自動縮放', description: '可降低效能', type: 'checkbox', defaultValue: false, requires: {
			options: { id: 'bgAero', value: false }
		}}
	},
	tasks: {
		'bb09974e': {
			service: 'theme-bgfix',
			name: 'theme-bg',
			js: function(self, theme)
			{
				var bg = window.opera && self.options('bgAero')
				? '-o-skin("Pagebar Skin")'
				: theme.bgImageBody && $.format('url("{0}")', theme.bgImageBody);

				return bg
				? $.format('\
						body { background: {0} fixed; background-size: {1} auto; } \
						\
						.PageMiddleFunctions, \
						.bg_main > table > tbody > tr:first-child, /* old middle fns */ \
						#MainPageAd2 + br + br + div, \
						.HitSearchText, \
						#ctl00_ContentPlaceHolder1_topics_form td[width="50%"][align="left"], /* search page result count */ \
						#ctl00_ContentPlaceHolder1_view_form > .FloatsClearing + div, #ctl00_ContentPlaceHolder1_view_form div[style="padding: 2px 0px 0px;"], /* view page breadcrumb */ \
						#ctl00_ContentPlaceHolder1_view_form > div[style="width: 100%"] > table[width="99%"], /* view page reply count */ \
						table[width="196"][cellspacing="3"], /* topc list legend */ \
						.txt_11pt_1A3448 /* footer */ \
							{ text-shadow: #{2[bgColorContent]} 1px 1px 1px; } \
					',
					bg, self.options('autoFit') && !self.options('bgAero') ? '100%' : 'auto', theme)
				: '';
			}
		}
	}
}

});
