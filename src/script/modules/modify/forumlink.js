annuus.add({
	id: '5158a57a-b062-4c53-9cdf-9b8e0c3c8cdf',
	title: '轉換論壇連結的伺服器位置',
	pages: { on: [all] },
	tasks: {
		'fb154257-f3b1-4c95-a4d0-9de2946f1165': {
			run_at: 'document_start',
			js: function(self)
			{
				var rForum = /^forum\d+\.hkgolden\.com$/i;
				var subdomain = $.urlSet().subdomain;
				$(document).delegate('a', 'mousedown', function(event)
				{
					var urlSet = $.urlSet(this.href);
					if(rForum.test(urlSet.host) && urlSet.subdomain !== subdomain) {
						this.href = $.url(this.href, { subdomain: subdomain });
					}
				});
			}
		}
	}
});
