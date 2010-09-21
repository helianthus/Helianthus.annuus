annuus.add({
	id: 'a5028650-a065-425e-9903-7e2aff643f17',
	title: '自動重設存檔',
	pages: { comp: [all] },
	tasks: {
		'9c97a199-7dac-423b-847b-39422b2d127f': {
			run_at: 'window_start',
			js: function(self)
			{
				var HASH = '074d0ef7-b75b-4c06-aba4-6799c3b9cf02';
				if(self.database('release_hash') !== HASH)
				{
					annuus.storage.clear();
					self.database('release_hash', HASH);
				}
			}
		}
	}
});
