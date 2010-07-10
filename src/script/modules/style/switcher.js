annuus.addModules({

'0a48fd35-9637-498a-96c6-de631780540d':
{
	title: '主題轉換選單',
	pages: { comp: [all] },
	tasks: {
		'1697d048': {
			service: 'button',
			uuid: 'adbe91b5-163f-4bf4-9a02-178a665297a4',
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

					self.options(theme);

					$.rules(function()
					{
						$.service.theme.refresh(theme);
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
