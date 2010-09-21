annuus.add({
	id: '5ee24108-d17e-441d-b1c3-745fcf9fa422',
	title: '修正站務台告示',
	pages: { on: [topics] },
	tasks: {
		'6d12d57e-92e0-41e8-9413-27f7e76d7fcf': {
			frequency: 'always',
			js: function(self, context)
			{
				if($.urlSet().querySet.type === 'MB') {
					context.find('td[colspan="5"]').attr('colspan', '6');
				}
			}
		}
	}
});
