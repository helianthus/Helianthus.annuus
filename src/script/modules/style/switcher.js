annuus.add({

'0a48fd35-9637-498a-96c6-de631780540d': {
	title: '主題轉換選單',
	pages: { comp: [all] },
	tasks: {
		'8bc3a1cf-fce3-451d-bb31-ce5873e27660': {
			service: 'button',
			title: '轉換主題',
			widget: function(self)
			{
				var widget = $('<div/>').delegate('.ui-button', 'click', function(event)
				{
					event.stopPropagation();

					var theme = $.extend({
						uriHKGLogo: '',
						bgImageBody: ''
					}, self.data('themes')[$(this).text()]);

					annuus.button.lockScroll(function()
					{
						self.options(theme);
						annuus.theme.load(theme);
					});
				});

				$.each(self.data('themes'), function(name)
				{
					$('<a/>', {
						text: name,
						href: annuus.get('DUMMY_HREF')
					})
					.button().appendTo(widget);
				});

				return widget;
			}
		}
	}
}

});
