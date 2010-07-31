annuus.addModules({

'9f5fe25b-ae3e-452c-848e-cddcb0143a1e':
{
	title: 'Ajax Service',
	pages: { on: [topics | view] },
	tasks: {
		'5f4e3d26-0e46-42d0-b1a5-ae3742b6751d': {
			type: 'service',
			name: 'ajax',
			run_at: 'document_start',
			params: {
			},
			api: {
				topics: {}
			},
			init: function(self, jobs)
			{
				if(jobs.length) {
					$.log('warn', 'Ajax service cannot be used directly, please use the API provided instead.');
				}
			},

			CACHE_TIME: 5000,
			MAX_CONNECTIONS: 3,

			count: 0,

			ajax: function(self, options)
			{
				bolanderi.ready('document_end', function()
				{
					self.log('log', 'queuing request to [{0}].', options.url);

					var queue = $.queue(document, 'ajax', function(next)
					{
						++self.count;

						self.log('log', 'requesting [{0}]...', options.url);

						$.ajax($.extend({}, options, {
							success: function(html, status)
							{
								self.log('log', 'success on retrieving [{0}] - status: {1}.', options.url, status);
								options.success && options.success.apply(options, arguments);
							},
							error: function(xhr, status, e)
							{
								self.log('error', 'fail on retrieving [{0}] - status: {1}, error: {2}.', options.url, status, e);
								options.error && options.error.apply(options, arguments);
							},
							complete: function()
							{
								--self.count;
								options.complete && options.complete.apply(options, arguments);
							}
						}));

						if(self.count < self.MAX_CONNECTIONS) {
							next();
						}
						else {
							self.log('log', 'max connections ({0}) reached.', self.MAX_CONNECTIONS);
						}
					});

					if(queue.length === 1) {
						$.dequeue(document, 'ajax');
					}
				});
			},

			pages: {},

			get: function(self, options)
			{
				options.page = options.page || 1;
				var page = $.make(self.pages, options.page, {});

				if(options.name in self.pages && (options.cache || $.now() - (page.lastReq || 0) < self.CACHE_TIME)) {
					return self.pages[options.name];
				}

				if(options.mapSrc) {
					self[options.mapSrc](self, $.extend({}, options, {
						mapSrc: null,
						success: function(data)
						{
							options.success(self.pages[options.name] = options.map(data));
						}
					}));
				}
				else {
					self.ajax(self, {
						cache: false,
						dataType: 'text',
						url: $.uri({ querySet: { page: options.page } }),
						success: function(html)
						{
							page.lastReq = $.now();
							options.success(self.pages[options.name] = options.map(html));
						}
					});
				}
			},

			topicTable: function(self, options)
			{
				self.get(self, $.extend(options, {
					name: 'topicTable',
					map: function(html)
					{
						return $(html).find('#HotTopics > div > table');
					}
				}));
			},

			topics: function(self, options)
			{
				self.get(self, $.extend(options, {
					name: 'topics',
					mapSrc: 'topicTable',
					map: function(table)
					{
						return table.find('tr[userid]');
					},
				}));
			}
		},

		'a1cf1fae-73e0-4f4e-94c3-e1b614ea6a9f': {
			service: 'button',
			uuid: '86f552ce-d545-4ddf-a440-52950d12c17f',
			title: 'ajax',
			click: function()
			{
				$.service.ajax.topics({
					success: function(topics)
					{
						$.debug(topics);
					}
				});
			}
		}
	}
}

});
