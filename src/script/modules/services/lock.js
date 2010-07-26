bolanderi.addModules({

'32c8606b-a331-43ff-bfea-1f6190b7e8a2':
{
	title: 'Auto Service (with layout locking)',
	pages: { on: [all] },
	tasks: {
		'192c5c4a-6d3d-4ece-9541-54289c7d4f3e': {
			type: 'service',
			name: 'lock',
			run_at: 'document_start',
			api: {
				add: { description: 'add an auto job, after ensuring the layout is locked.', params: ['job'] }
			},
			init: function(self, jobs)
			{
				$.each(jobs, function(i, job)
				{
					self.add(self, job);
				});
			},

			isLocked: false,

			lock: function(self)
			{
				$.rules('\
					.repliers > tbody > tr > td + td > table, \
					.ListPMText > table, .ListPMText > table > tbody > tr > td > table \
						{ table-layout: fixed; } \
					.repliers_right td { overflow: hidden; overflow-x: auto; } \
					body { word-wrap: break-word; } \
				');

				if($(document).pageName() === 'view') {
					window.opera && $.rules('#ctl00_ContentPlaceHolder1_view_form > div > table, .repliers { table-layout: fixed; }');

					// fix vote page
					$.service.auto.add({
						frequency: 'always',
						js: function()
						{
							self.context().find('.repliers > tbody > tr > td[colspan="100%"]').attr('colspan', '2');
						}
					});
				}

				$.log('log', 'Layout is now locked.');
				self.isLocked = true;
			},

			add: function(self, job)
			{
				if(!self.isLocked) {
					self.lock(self);
				}

				$.service.auto.add(job);
			}
		}
	}
}

});
