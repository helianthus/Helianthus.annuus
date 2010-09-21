annuus.add({
	id: '29aeaf94-db3a-4b88-8c5a-cbd2113beba6',
	title: '加入最頂/最底按扭',
	pages: { on: [all] },
	tasks: {
		'b7d38976-a39c-4c59-9ef2-a81794e1090e': {
			service: 'button',
			title: '最頂／最底',
			widget: function()
			{
				return $('<div/>')
				.append($('<a/>', { text: '最頂' }).button())
				.append($('<a/>', { text: '最底' }).button())
				.delegate('.ui-button', 'click', function()
				{
					document.documentElement.scrollIntoView($(this).index() === 0);
				});
			}
		}
	}
});
