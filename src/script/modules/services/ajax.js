annuus.add({

'9f5fe25b-ae3e-452c-848e-cddcb0143a1e': {
	title: 'Ajax Service',
	pages: { on: [all] },
	tasks: {
		'5f4e3d26-0e46-42d0-b1a5-ae3742b6751d': {
			title: 'Ajax Service (base)',
			type: 'service',
			name: 'ajax',
			run_at: 'document_start',
			params: {
			},
			api: {
				get: {}
			},
			init: function(self, jobs)
			{
				if(jobs.length) {
					bolanderi.log('warn', 'Ajax service cannot be used directly, please use the API provided instead.');
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
				options = $.extend({
					cache: true,
					condition: {
						page: 1
					}
				}, options);

				var page = $.make(self.pages, options.page, {});

				if(options.name in page && (options.cache || $.now() - (page.lastReq || 0) < self.CACHE_TIME)) {
					return page[options.name];
				}

				if(options.mapSrc) {
					self[options.mapSrc](self, $.extend({}, options, {
						mapSrc: null,
						success: function(data)
						{
							success(data);
						}
					}));
				}
				else if(options.cache && ($.urlSet().querySet.page || 1) == options.page) {
					success($(document));
				}
				else {
					self.ajax({
						cache: false,
						dataType: 'text',
						url: $.url({ querySet: { page: options.page } }),
						success: function(html)
						{
							page.lastReq = $.now();
							success($(html));
						}
					});
				}

				function success(context)
				{
					options.success(page[options.name] = options.map(context));
				}
			}
		},

		'6ee2c385-8c58-49a2-b60f-6f1417e62a65': {
			title: 'Ajax Service (topics)',
			type: 'extend',
			name: 'ajax',
			condition: {
				page: topics
			},
			api: {
				topicTable: {},
				topics: {}
			},

			topicTable: function(self, options)
			{
				self.get($.extend(options, {
					name: 'topicTable',
					map: function(context)
					{
						return context.find('#HotTopics > div > table');
					}
				}));
			},

			topics: function(self, options)
			{
				self.get($.extend(options, {
					name: 'topics',
					mapSrc: 'topicTable',
					map: function(context)
					{
						return context.find('tr[userid]');
					}
				}));
			}
		},

		'f27d4532-9f81-453d-a8b1-cce957fcce42': {
			title: 'Ajax Service (view)',
			type: 'extend',
			name: 'ajax',
			condition: {
				page: view
			},
			api: {
				replies: {}
			},

			replies: function(self, options)
			{
				self.get($.extend(options, {
					name: 'topics',
					mapSrc: 'topicTable',
					map: function(context)
					{
						return context.find('.repliers');
					}
				}));
			}
		},

		'a1cf1fae-73e0-4f4e-94c3-e1b614ea6a9f': {
			service: 'button',
			uuid: '86f552ce-d545-4ddf-a440-52950d12c17f',
			title: 'ajax',
			click: function()
			{
				annuus.ajax.topics({
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
