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
				ajax: {
					description: 'wrapper around jQuery.ajax, with automatic connection control',
					params: [
						{
							name: 'options',
							description: 'refer to jQuery.ajax',
							required: true,
							type: 'object'
						}
					]
				},
				get: {
					description: 'page manager, with automatic cache control',
					params: [
						{
							name: 'options',
							required: true,
							type: 'object',
							values: {
								complete: {
									description: 'refer to jQuery.ajax',
									required: false,
									dataType: 'function'
								},
								cache: {
									description: 'refer to jQuery.ajax',
									required: false,
									dataType: 'boolean'
								},
								error: {
									description: 'refer to jQuery.ajax',
									required: false,
									dataType: 'function'
								},
								map: {
									description: 'the actual mapper function',
									required: true,
									dataType: 'function',
									args: [
										{ name: 'mapSrc', description: 'map source', dataType: 'jQuery' }
									],
									returnValue: { description: 'mapped data', dataType: 'jQuery' }
								},
								mapSrc: {
									description: 'name of the source for map function, defaults to page root if omitted',
									required: false,
									dataType: 'string'
								},
								name: {
									description: 'name of mapped data',
									required: true,
									dataType: 'string'
								},
								page: {
									description: 'page number, defaults to 1 if omitted',
									required: false,
									dataType: 'number'
								},
								success: {
									description: 'called if mapping succeeds',
									required: false,
									dataType: 'function',
									args: [
										{ name: 'mappedData', description: 'mapped data returned by options.map', dataType: 'jQuery' }
									]
								}
							}
						}
					]
				}
			},
			init: function(self, jobs)
			{
				self.pages[$.urlSet().querySet.page || 1] = {
					lastReq: $.now(),
					root: $(document)
				};

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
					self.log('log', 'queuing request to <{0}>.', options.url);

					var queue = $.queue(document, 'ajax', function(next)
					{
						++self.count;

						self.log('log', 'requesting <{0}>...', options.url);

						$.ajax($.extend({}, options, {
							success: function(html, status)
							{
								self.log('log', 'success on retrieving <{0}> - status: {1}.', options.url, status);
								options.success && options.success.apply(options, arguments);
							},
							error: function(xhr, status, e)
							{
								self.log('error', 'fail on retrieving <{0}> - status: {1}, error: {2}.', options.url, status, e);
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

			get: function(self)
			{
				var options = $.extend.apply($, [{
					cache: true,
					page: 1,
					success: $.noop
				}].concat([].slice.call(arguments, 1)));

				var page = $.make(self.pages, options.page, { lastReq: 0 });

				$.condition(options.fetched || options.cache && $.now() - page.lastReq < self.CACHE_TIME || function(callback)
				{
					self.ajax({
						cache: false,
						dataType: 'text', // prevent auto script injection
						url: $.url({ querySet: { page: options.page } }),
						success: function(html)
						{
							page = self.pages[options.page] = {
								lastReq: $.now(),
								root: $(html)
							};

							callback();
						},
						error: options.error || $.noop,
						complete: options.complete || $.noop
					});
				},
				function()
				{
					if(options.name in page) {
						options.success(page[options.name]);
					}
					else if(options.mapSrc) {
						self[options.mapSrc]($.extend({}, options, {
							fetched: true,
							mapSrc: null,
							success: function(context)
							{
								options.success(page[options.name] = options.map(context));
							}
						}));
					}
					else {
						options.success(page[options.name] = options.map(page.root));
					}
				});
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
				topicTable: {
					description: 'get the table containing the topic list',
					params: [
						{
							name: 'options',
							description: 'refer to ajax.get',
							required: true,
							type: 'object'
						}
					]
				},
				topics: {
					description: 'get the topic rows',
					params: [
						{
							name: 'options',
							description: 'refer to ajax.get',
							required: true,
							type: 'object'
						}
					]
				},
			},

			topicTable: function(self, options)
			{
				self.get(options, {
					name: 'topicTable',
					map: function(context)
					{
						return context.find('#HotTopics > div > table');
					}
				});
			},

			topics: function(self, options)
			{
				self.get(options, {
					name: 'topics',
					mapSrc: 'topicTable',
					map: function(context)
					{
						return context.find('tr[userid]');
					}
				});
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
				replies: {
					description: 'get replie tables',
					params: [
						{
							name: 'options',
							description: 'refer to ajax.get',
							required: true,
							type: 'object'
						}
					]
				}
			},

			replies: function(self, options)
			{
				self.get($.extend(options, {
					name: 'replies',
					map: function(context)
					{
						return context.find('.repliers');
					}
				}));
			}
		}
	}
}

});
