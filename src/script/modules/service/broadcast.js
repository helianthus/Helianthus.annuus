annuus.add({
	id: 'b6f5cee5-87cd-45ef-a28b-8ebdcade717a',
	title: 'Broadcast Service',
	pages: { on: [all] },
	tasks: {
		'666312f9-a79b-41d7-a935-98483862c27b': {
			type: 'service',
			name: 'broadcast',
			run_at: 'document_start',
			api: {
				send: {}
			},

			send: function(self, fn)
			{
				var tabs = annuus.api('tabs') || window.parent.annuus && window.parent.annuus.api('tabs');
				tabs ? tabs.broadcast(fn) : fn(window);
			}
		}
	}
});
