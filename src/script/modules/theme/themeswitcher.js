annuus.addModules({

'0a48fd35-9637-498a-96c6-de631780540d':
{
	title: '主題轉換選單',
	pages: { comp: [all] },
	tasks: {
		'1697d048': {
			service: 'button',
			css: '\
				#an-themeswitcher-button { position: absolute; top: 10px; right: 10px; } \
				.an-themeswitcher { font-size: 62.5%; } \
			',
			js: function(job, event)
			{
				var select = '<select id="an-themeswitcher" class="an-themeswitcher">';
				select += '<option>select theme...</option>';
				$.each(job.data('themes'), function(name)
				{
					select += $.format('<option>{0}</option>', name);
				});
				select += '</select>';

				select = $(select).appendTo('#an').selectmenu({ style: 'dropdown' }).change(function()
				{
					if(this.selectedIndex !== 0) {
						var theme = $.extend({
							uriHKGLogo: '',
							bgImageBody: ''
						},
						job.data('themes')[$(this).val()]
						);

						job.options(theme);

						$.rules(function()
						{
							$.theme(theme);
						});
					}
				});

				if(event) {
					$(window).scrollTop(0);
					$(this).fadeOut();
				}
			}
		}
	}
}

});
