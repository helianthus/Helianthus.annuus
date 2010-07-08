annuus.addModules({

'4a263d1b-4c3d-48a0-afc9-a63f13381aa3':
{
	title: '快速連結',
	pages: { on: [all] },
	tasks: {
		'e6d2ea58': {
			service: 'button',
			widget: function(self)
			{
				var widget = $('<div/>');

				$.each({
					'主論壇頁': '/',
					'吹水台': '/topics.aspx?type=BW'
				}, function(text, href)
				{
					$('<a/>', {
						text: text,
						href: href
					}).button().appendTo(widget);
				});

				return widget;
			}
		}
	}
}

});
