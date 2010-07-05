annuus.addModules({

'a5028650-a065-425e-9903-7e2aff643f17':
{
	title: '自動重設存檔',
	pages: { comp: [all] },
	tasks: {
		'1697d048': {
			type: 'utility',
			js: function(self)
			{
				var HASH = '074d0ef7-b75b-4c06-aba4-6799c3b9cf02';
				if(self.database('release_hash') !== HASH)
				{
					annuus.__storage.clear();
					self.database('release_hash', HASH);
				}
			}
		}
	}
}

});
