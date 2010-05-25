annuus.addModules({

'0a48fd35-9637-498a-96c6-de631780540d':
{
	title: '主題轉換選單',
	pages: { comp: [all] },
	tasks: {
		'1697d048': {
			ui: ['button'],
			css: '\
				#an-themeswitcher-button { position: absolute; top: 10px; left: 10px; } \
				.an-themeswitcher { font-size: 62.5%; } \
			',
			js: function(job, event)
			{
				var select = '<select id="an-themeswitcher" class="an-themeswitcher">';
				select += '<option>select theme...</option>';
				$.each(job.resources('themes'), function(name)
				{
					select += $.format('<option>{0}</option>', name);
				});
				select += '</select>';

				select = $(select).appendTo('#an').selectmenu({ style: 'dropdown' }).change(function()
				{
					var name = $(this).val();
					if(name !== 'select theme...') {
						job.options(job.resources('themes', name));
						$(annuus).trigger('theme', job.options());
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
