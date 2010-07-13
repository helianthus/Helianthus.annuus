annuus.addModules({

'34c76972-813a-4145-b3d3-bf83d89723d7':
{
	title: 'Button UI',
	pages: { comp: [all] },
	database: {
		buttonOrder: { defaultValue: [] }
	},
	tasks: {
		'4ea1dd56': {
			type: 'service',
			name: 'button',
			run_at: 'document_start',
			params: {
				uuid: { paramType: 'required', dataType: 'string', description: 'universally unique id for the button' },
				title: { paramType: 'required', dataType: 'string' },
				run_at: { paramType: 'optional', dataType: 'string', values: annuus.get('RUN_AT_TYPES').slice(1), defaultValue: 'document_start' },
				href: { paramType: 'optional', dataType: 'string' },
				css: { paramType: 'optional', dataType: 'string', description: 'injected when button is clicked.', params: ['self'] },
				widget: { paramType: 'optional', dataType: 'function', description: 'return a widget which is shown when the button is clicked.', params: ['self'] },
				click: { paramType: 'optional', dataType: 'function', description: 'click handler', params: ['self', 'event'] }
			},
			api: {
				add: { description: 'add a new button.', params: ['job'] },
				panelSelect: { description: 'for internal use only.'},
				panelUnselect: { description: 'for internal use only.'}
			},
			init: function(self, jobs)
			{
				$.each(jobs || {}, function(i, job)
				{
					bolanderi.ready(self.run_at, function()
					{
						self.add(self, job);
					});
				});
			},

			create: function(self)
			{
				$.rules('\
					#an-button { display: table; position: fixed; z-index: 50; height: 100%; } \
					#an-button-positioner { display: table-cell; height: 100%; min-width: 10px; vertical-align: middle; } \
					#an-button-ui { display: none; min-width: 100px; border-width: 0.5em 0; padding: 0.2em 0; } \
					#an-button-container { overflow: hidden; font-size: 75%; } \
					#an-button-container > * { display: none; } \
					#an-button-container .ui-button { display: block; margin: 3px 0 0 0; border-left: 0; border-top-left-radius: 0; border-bottom-left-radius: 0; } \
					#an-button-container .ui-button:first-child { margin: 0; } \
					#an-button-container .ui-button > span { padding: 0.1em 1em; white-space: nowrap; } \
					#an-button-container .ui-sortable { min-height: 1.4em; } \
				');

				self.root = $('\
					<div id="an-button"> \
						<div id="an-button-positioner"> \
							<div id="an-button-ui" class="an-header-bgborder ui-corner-right"> \
								<div id="an-button-container"> \
									<div/> \
								</div> \
							</div> \
						</div> \
					</div> \
				')
				.hover(function(event)
				{
					if(self.frozen) {
						return;
					}
					if(self.opened !== (event.type === 'mouseenter')) {
						self.opened = !self.opened;

						if(!self.ui.queue().length) {
							self.toggle(self);
						}
					}
				})
				.delegate('.ui-button', 'click', function()
				{
					if(self.frozen) {
						return;
					}
					self.opened = false;
					self.toggle(self, false);
				})
				.mousewheel(function(event, delta)
				{
					event.preventDefault();
					self.container.stop(true).animate({ scrollTop: $.format('{0}={1}', delta < 0 ? '+' : '-', Math.abs(delta) * 100) }, 'fast', 'linear');
				})
				.appendTo('#an');

				self.ui = $('#an-button-ui');
				self.container = self.ui.children();
				self.mainList = self.container.children();
				self.opened = false;

				$(window).resize(function()
				{
					self.container.css('max-height', $(window).height() * 0.6);
				}).resize();
			},

			toggle: function(self, force)
			{
				if(!self.ui) {
					self.create(self);
				}
				if(typeof force === 'boolean') {
					self.opened = force;
					force = true;
				}
				$.timeout('button-service-toggle', force || self.opened ? null : 500, function()
				{
					if(force || self.opened !== self.ui.is(':visible')) {
						if(self.opened) {
							self.more(self);
							self.container.children().hide().find('.ui-state-focus').removeClass('ui-state-focus');
							self.active = self.mainList.show();
						}
						self.ui.stop(true).toggle('fold', { size: 5 }, 300, function()
						{
							self.toggle(self);
						});
					}
				});
			},

			make: function(self, options)
			{
				var button = $('<a/>', {
					id: options.uuid,
					text: options.title,
					href: options.href || annuus.get('DUMMY_HREF')
				})
				.click(function(event)
				{
					if(self.frozen) {
						event.preventDefault();
						event.stopImmediatePropagation();
					}
				})
				.button();

				if(options.css) {
					button.one('click', function()
					{
						$.rules(options.css, options);
					});
				}

				if(options.widget) {
					button.click(function(event)
					{
						event.stopPropagation();

						var old = self.active;
						self.active = (options.__widget || (options.__widget = options.widget(options))).appendTo(self.container);
						old.slideUp(200, function()
						{
							self.active.slideDown(200);
						});
					});
				}

				if(options.click) {
					button.click(function(event)
					{
						options.click.call(button[0], options, event);
					});
				}

				return button;
			},

			moreButton: $(),

			more: function(self)
			{
				if(!self.frozen && self.hiddenButtons.length) {
					if(!self.moreButton.length) {
						self.moreButton = self.make(self, {
							uuid: null,
							title: '更多...',
							click: function(s)
							{
								s.__widget.append(self.hiddenButtons);
							},
							widget: function()
							{
								return $('<div/>').click(function(event)
								{
									event.stopPropagation();
								});
							}
						});
					}

					self.moreButton.appendTo(self.mainList);
				}
				else {
					self.moreButton.detach();
				}
			},

			currentIds: [],
			hiddenButtons: [],

			add: function(self, options)
			{
				if(!self.ui) {
					self.create(self);
				}
				if(!self.indexMap) {
					self.indexMap = {};
					$.each(self.database('buttonOrder'), function(index, uuid)
					{
						self.indexMap[uuid] = index;
					});
				}

				self.run(options, function()
				{
					var button = self.make(self, options);

					if(options.uuid in self.indexMap) {
						self.currentIds.push(options.uuid);
						self.currentIds.sort(function(a, b)
						{
							return self.indexMap[a] - self.indexMap[b];
						});
						var index = $.inArray(options.uuid, self.currentIds);
						index === 0 ? button.prependTo(self.mainList) : button.insertAfter(self.mainList.children().eq(index - 1));
					}
					else {
						self.hiddenButtons.push(button[0]);
					}
				});
			},

			panelSelect: function(self, page)
			{
				if(!self.root) {
					self.create(self);
				}

				self.frozen = true;
				page.panel.append(self.hiddenButtons);
				self.root.css('z-index', 150);
				self.toggle(self, true);

				self.mainList.add(page.panel).sortable({
					appendTo: '#an',
					connectWith: self.mainList.add(page.panel),
					helper: 'clone',
					items: '.ui-button',
					opacity: .5,
					scroll: false,
					zIndex: 200,
					start: function(event, ui)
					{
						ui.placeholder
						.addClass('ui-state-highlight')
						.append(ui.item.children().clone().css('visibility', 'hidden'))
						.add(ui.helper).css({ width: '', height: '', visibility: '' });
					},
					stop: function(event, ui)
					{
						ui.item.css('display', '');
					}
				});
			},

			panelUnselect: function(self, page)
			{
				self.currentIds = self.mainList.sortable('toArray');
				self.hiddenButtons = page.panel.children('.ui-button');

				var buttonOrder = self.currentIds.slice();
				$.each(self.database('buttonOrder'), function(i, uuid)
				{
					if($.inArray(uuid, buttonOrder) === -1) {
						buttonOrder.splice(i, 0, uuid);
					}
				});
				self.database('buttonOrder', buttonOrder);
				self.indexMap = null;

				self.mainList.sortable('destroy');

				self.frozen = false;
				self.root.css('z-index', '');
				self.toggle(self, false);
			}
		},

		'38443e34': {
			service: 'master',
			title: '按扭設定',
			panel: function(self)
			{
				$.rules('\
					#an-master-button { box-sizing: border-box; height: 100%; padding: 10px; } \
					#an-master-button > .ui-button, #an > .ui-button { margin: 2px; font-size: 82.5%; } \
				');

				return $('<div id="an-master-button"><p>拖曳喜歡的按扭至左邊的按扭列，或從按扭列拖曳回此處</p></div>');
			},
			select: function(self, page)
			{
				$.service.button.panelSelect(page);
			},
			unselect: function(self, page)
			{
				$.service.button.panelUnselect(page);
			}
		},

		'98d53583': {
			js: function(self)
			{
				$.each($.range(1,30), function(i,n)
				{
					$.service.button.add({
						uuid: 'acb540b1-d6e0-4c65-b953-d7ffabf26c65_' + n,
						title: '測試按扭' + n
					});
				});
			}
		}
	}
}

});
