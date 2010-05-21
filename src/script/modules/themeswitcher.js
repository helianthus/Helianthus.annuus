annuus.addModules(function(){ return {

'0a48fd35-9637-498a-96c6-de631780540d':
{
	title: '主題轉換器',
	pages: { comp: [all] },
	tasks: {
		'1697d048': {
			ui: ['auto', 'button'],
			title: 'Theme Switcher',
			css: '\
				#an-themeswitcher-button { position: absolute; top: 10px; left: 10px; } \
				.an-themeswitcher { font-size: 62.5%; } \
			',
			js: function(job, event)
			{
				var select = '<select id="an-themeswitcher" class="an-themeswitcher">';
				$.each($.resources('themes'), function(name, props)
				{
					select += $.format('<option>{0}</option>', name);
				});
				select += '</select>';

				select = $(select).appendTo('#an').selectmenu({ style: 'dropdown' }).change(function()
				{
					$(annuus).trigger('theme', [$.resources('themes', $(this).val())]);
				});

				if(event) {
					$(window).scrollTop(0);
					$(this).fadeOut();
				}
			}
		}
	}
}

}; });
