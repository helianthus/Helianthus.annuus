annuus.add({
	id: '1f270f48-95f7-4ee9-804e-73f377c5d024',
	title: 'Notice Service',
	pages: { on: [all] },
	requires: ['broadcast'],
	tasks: {
		'ea3957ff-f942-41a4-892b-7b23a7492633': {
			type: 'service',
			name: 'notice',
			run_at: 'document_start',
			api: {
				add: {},
				remove: {}
			},

			create: $.once(function(self, jobs)
			{
				$.rules('\
					#an-notice { position: fixed; z-index: 50; top: 10px; right: 27px; width: 300px; max-width: 15%; word-break: break-all; } \
					#an-notice > div { display: none; margin-bottom: 0.7em; font-size: 80%; opacity: 0.8; } \
					#an-notice > div > div { margin: 0.5em; } \
					#an-notice > div > div:first-child > .an-notice-icon { float: left; } \
					#an-notice > div > div:first-child > .an-notice-close { float: right; cursor: pointer; } \
					#an-notice > div > div:first-child > .an-notice-header { font-weight: bold; } \
					#an-notice > div > .an-notice-content { clear: both; font-size: 90%; } \
					#an-notice > div > .an-notice-controls { clear: both; text-align: center; font-size: 90%; } \
					#an-notice a { text-decoration: underline; margin: 0 0.2em; cursor: pointer; } \
					.ui-icon-throbber[class] { background-image: url({0}); background-position: center center; } \
				',
				self.data('images').throbber);

				self.container = $('<div>', { id: 'an-notice' })
				.delegate('.an-notice-close', 'click', function()
				{
					self.remove($(this).parent().parent().data('an-notice-id'));
				})
				.appendTo('#annuus');
			}),

			notices: {},
			guid: 0,

			add: function(self, options)
			{
				self.create();

				var noticeId = ++self.guid;

				options = $.extend({
					type: 'info',
					duration: 400
				}, options);

				options.icon = options.icon || {
					error: 'alert'
				}[options.type] || 'notice';

				annuus.api('broadcast').send(function(window)
				{
					var log = $.dig(window, 'annuus', 'log');
					log && log('info', '{0.header|} - {0.content|}', options);
				});

				return self.notices[noticeId] = $($.format('\
					<div class="ui-state-{0} ui-corner-all"> \
						<div> \
							<span class="an-notice-icon ui-icon ui-icon-{1.icon}" /> \
							<span class="an-notice-close ui-icon ui-icon-circle-close" /> \
							<span class="an-notice-header">{1.header|}</span> \
						</div> \
						<div class="an-notice-content">{1.content|}</div> \
						<div class="an-notice-controls">{1.controls|}</div> \
					</div> \
				',
				'default', options))
				.set('id', noticeId)
				.data('an-notice-id', noticeId)
				.appendTo(self.container)
				.fadeIn(options.duration);
			},

			getNotice: function(self, param)
			{
				return self.notices[typeof param === 'object' ? $.data(param[0] || param, 'an-notice-id') : param];
			},

			remove: function(self, notice)
			{
				if(notice = self.getNotice(notice)) {
					notice.animate({ height: 0, margin: 0, opacity: 0 }, { duration: 1000, complete: function(){ $(this).remove(); } });
					delete self.notices[notice.id];
				}
			}
		}
	}
});
