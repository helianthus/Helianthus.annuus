annuus.add({
	id: 'c64c9511-cc47-4d0a-8b69-e9aaa5f8a4a6',
	title: '加入轉換伺服器按扭',
	pages: { on: [all] },
	tasks: {
		'c6cd6ff4-4b53-4eb4-9998-f6f965aa79de': {
			service: 'button',
			title: '轉換伺服器',
			widget: function(self)
			{
				var widget = $('<div/>');

				for(var i=1; i<=8; ++i) {
					$('<a/>', {
						text: 'Forum ' + i,
						href: $.url({ subdomain: 'forum' + i })
					}).button().appendTo(widget);
				}

				return widget;
			}
		}
	}
});
