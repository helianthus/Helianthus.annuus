$.extend(an.plugins, {

'1db9ccc8-ad28-48b6-8744-22f892ca0a44':
{
	desc: '加入基本元件',
	page: { 65535: 'comp' },
	type: 1,
	queue: [{
		priority: 1,
		fn: function()
		{
			$('#an').append(' \
			<div id="an-ui"> \
				<div id="an-backlayer"></div> \
				<ul id="an-mainmenu" class="an-mod an-menu"></ul> \
			</div> \
			').click(function(event){ event.stopPropagation(); });

			$.gray = function(bClickToQuit, uExtra)
			{
				var jGray = $('#an-backlayer');
				if(jGray.is(':hidden'))
				{
					//$('html').css('overflow', 'hidden');

					if(bClickToQuit)
					{
						jGray.one('click', function()
						{
							$.gray();
						});
					}

					jGray.show().fadeTo('slow', 0.7);

					if(uExtra)
					{
						var jExtra = $('#' + uExtra);
						var oWH = jExtra.data('an-oWH');
						var nMaxHeight = $.winHeight(0.9);
						var nMaxWidth = $.winWidth(0.9);
						jExtra.width((oWH.w == 'max' || oWH.w > nMaxWidth) ? nMaxWidth : oWH.w).height((oWH.h == 'max' || oWH.h > nMaxHeight) ? nMaxHeight : oWH.h);

						var jBox = jExtra.up('.an-box');
						jBox.css({ marginTop: -jBox.height() / 2, marginLeft: -jBox.width() / 2 }).fadeIn('slow');
					}
				}
				else
				{
					jGray.add('.an-box:visible').fadeOut('slow');
					//$('html').css('overflow', '');
				}
			};

			$.addMain = function(sName, fHandler)
			{
				$('<li><a href="javascript:">' + sName + '</a></li>').click(fHandler).appendTo('#an-mainmenu');
			};

			$.box = function(sId, sHeader, uWidth, uHeight)
			{
				return $($.format('<div class="an-box an-forum"><h4 class="an-forum-header an-box-header">{0}</h4><div id="{1}" class="an-box-content"></div></div>', sHeader, sId)).appendTo('#an-ui').children('.an-box-content').data('an-oWH', { w: uWidth || 'auto', h: uHeight || 'auto' });
			};
		}
	}]
},


'72907d8e-4735-4f66-b3c9-20e26197663d':
{
	desc: '加入共用元件',
	page: { 65535: 'comp' },
	type: 1,
	queue: [{
		priority: 1,
		fn: function()
		{
			(function()
			{
				$.serverTable = function()
				{
					if(!$('#an-server').length)
					{
						$.ss('\
						#an-server div { padding: 0.5em; } \
						#an-server caption { padding-top: 0.5em; text-align: center; caption-side: bottom; } \
						#an-server caption a { display: inline-block; border-width: 1px; padding: 0.2em; } \
						#an-server table { text-align: center; } \
						');

						$.box('an-server', '伺服器狀態', 300).append('<div><table><caption><a href="javascript:">進行測試</a></caption><thead><tr><td>伺服器</td><td>回應時間</td></tr></thead><tbody></tbody></table></div>');

						var sURL = (location.href.indexOf('aspxerrorpath=') > 0) ? $.format('http://{0}/topics.aspx?type=BW', location.hostname) : location.href;
						var tableHTML = '', imgHTML = '';
						for(var nServer=1; nServer<=8; nServer++)
						{
							tableHTML += $.format('<tr><td><a href="{0}">Forum {1}</a></td><td class="an-server-response"></td></tr>', sURL.replace(/forum\d/i, 'forum' + nServer), nServer);
							imgHTML += '<img />';
						}

						var jTestImages = $('<div>' + imgHTML + '</div>').children().bind('load error', function(event)
						{
							var jImg = $(event.target);
							$('#an-server .an-server-response').eq(jImg.index()).html(event.type == 'load' ? $.format('~{0} ms', $.time() - jImg.data('nTime')) : '發生錯誤');
						});

						$('#an-server')
						.find('caption').click(function()
						{
							$('#an-server .an-server-response').html('等待回應中...');

							jTestImages.each(function(i)
							{
								var nTime = $.time();
								$(this).data('nTime', nTime).attr('src', $.format('http://forum{0}.hkgolden.com/images/spacer.gif?tId={1}', i+1, nTime));
							});
						})
						.end().find('tbody').html(tableHTML);
					}

					$.gray(true, 'an-server');
					$('#an-server caption').trigger('click');
				};
			})();
		}
	}]
},

'95e203b9-8d9a-46ad-be53-f4297bad7285':
{
	desc: '加入選項元件',
	page: { 65534: 'comp' },
	type: 1,
	queue: [{
		priority: 1,
		fn: function()
		{
			var tabClick, getInfo, saveOptions, fillOptions, fillBoolean, importSettings, exportSettings, bFillAll, jFieldsets, jTabLinks, jSwitches, jOptions;

			$.addMain('選項', function()
			{
				if(!$('#an-settings').length)
				{
					$.box('an-settings', '選項', 900, 'max').append('<div id="an-settings-tabs"><ul id="an-settings-tabs-main"></ul><ul id="an-settings-tabs-extend"></ul></div><div id="an-settings-main"><div id="an-settings-main-panelswrapper"><div id="an-settings-main-panels"></div></div><div id="an-settings-main-controls"><ul id="an-settings-main-control-1"></ul><ul id="an-settings-main-control-2"></ul></div></div>');

					$.ss(' \
					#an-settings-tabs { float: left; height: 100%; border-right-width: 1px; } \
					#an-settings-tabs a { display: block; line-height: 2em; text-align: center; border-bottom-width: 1px; padding: 0 0.5em; } \
					#an-settings-tabs-extend li:first-child { margin-top: 2em; border-top-width: 1px; } \
					\
					#an-settings-main { position: relative; overflow: hidden; height: 100%; } \
					\
					#an-settings-main-panelswrapper { overflow: auto; position: absolute; top: 0; right: 0; bottom: 2em; left: 0; border-bottom-width: 1px; padding: 0; margin: 0; } \
					#an-settings-main-panels { padding: 1em; } \
					#an-settings-main-panels fieldset { display: none; margin: 0; padding: 0 0.5em 1em; border-width: 1px; } \
					#an-settings-main-panels h4 { font-weight: normal; overflow: hidden; margin: 1em 0 0.5em; } \
					#an-settings-main-panels h4 span { float: left; margin-right: 0.2em; } \
					#an-settings-main-panels h4 hr { overflow: hidden; margin: 0.5em 0 0 0; border-top-width: 1px; } \
					#an-settings-main-panels dl { margin: 0.35em 0 0.35em 5px; } \
					#an-settings-main-panels dd { margin: 0.25em 0 0 20px; } \
					\
					#an-settings-main-controls { position: absolute; left: 0; right: 0; bottom: 0; line-height: 2em; } \
					#an-settings-main-control-1 { float: left; } \
					#an-settings-main-control-2 { float: right; } \
					#an-settings-main-controls li { float: left; } \
					#an-settings-main-control-last, #an-settings-main-controls a { padding: 0 1em; } \
					#an-settings-main-control-1 li { border-right-width: 1px; } \
					#an-settings-main-control-last, #an-settings-main-control-2 li { border-left-width: 1px; } \
					');

					var
					structure = {},
					tabs = panels = '',
					sep = '__-__';

					$.each(an.type, function(typeId, typeName)
					{
						structure[typeId] = {};
					});
					$.each(an.plugins, function(pluginId, plugin)
					{
						$.each(plugin.page, function(pageCode)
						{
							$.make(structure[plugin.type], pageCode)[pluginId] = plugin;
						});
					});

					$.each(structure, function(typeId, typeSet)
					{
						tabs += $.format('<li><a href="javascript:" rel="an-settings-panel-{0}">{1}</a></li>', typeId, an.types[typeId]);
						panels += $.format('<fieldset id="an-settings-panel-{0}"><legend>{1}</legend>', typeId, an.types[typeId]);

						$.each(typeSet, function(pageCode, codeSet)
						{
							var groupName = [];
							if(pageCode in an.pages) aGroup.push(an.pages[pageCode].desc);
							else $.each(an.pages, function(page, pageSet)
							{
								if(page < 65534 && page & pageCode) groupName.push(pageSet.desc);
							});
							panels += $.format('<h4><span>{0}</span><hr /></h4>', groupName.join('、'));

							$.each(codeSet, function(pluginId, plugin)
							{
								var disabled = { comp: 1, disabled: 1 }[plugin.page[pageCode]] ? 'disabled="disabled"' : '';

								panels += $.format(
									'<dl><dt><input type="checkbox" id="{0}" {1} /><label for="{0}">{2}</label></dt>',
									$.format('an-settings-switch{0}{1}{0}{2}', sep, pluginId, pageCode),
									disabled,
									plugin.desc
								);

								if(plugin.options) $.each(plugin.options, function(optionId, option)
								{
									html += '<dd>';

									optionId = $.format('an-settings-option{0}{1}{0}{2}{0}{3}', sep, pluginId, pageCode, optionId);

									if(option.type == 'checkbox') {
										html += $.format('<input type="checkbox" id="{0}" {2} /><label for="{0}">{1}</label>', optionId, option.desc, disabled);
									}
									else if(option.type == 'text') {
										html += $.format('<label for="{0}">{1}: </label><input type="text" id="{0}" {2} />', optionId, option.desc, disabled);
									}
									else if(option.type == 'select') {
										html += $.format('{1}: <select id="{0}" {2}>', optionId, option.desc, disabled);
										$.each(option.choices, function(i, choice)
										{
											html += $.format('<option value="{0}">{0}</option>', choice);
										});
										html += '</select>';
									}

									html += '</dd>';
								});

								panels += '</dl>';
							});

							panels += '</fieldset>';
						});
					});
					$('#an-settings-tabs-main').append(tabs);
					$('#an-settings-main-panels').append(panels);
					tabs = panels = null;

					var
					jFieldsets = $('#an-settings-main-panels > fieldset');
					jTabLinks = $('#an-settings-tabs a');

					// tab click
					$.live('a', '#an-settings-tabs', 'click', function()
					{
						jTabLinks.css('text-decoration', '');
						$(this).css('text-decoration', 'underline');
						jFieldsets.hide();
						$('#' + $(this).attr('rel')).show().parent().parent().scrollTop(0);
					});

					// switch click
					$.live('dt > input', '#an-settings-main-panels', 'click', function()
					{
						$(this).parent().parent().find('.an-settings-option').attr('disabled', this.checked);
					});

					// bottom buttons
					$.live('a', '#an-settings-main-control-1', 'click', function()
					{
					});

					$.each(
					{
						'確定': function()
						{
							var
							storage = $.storage(),
							data = {};

							$('#an-settings-main-panels dt > input').each(function(i, input)
							{
								var
								info = input.id.split(sep),
								pluginId = info[1],
								pageCode = info[2];

								if(an.plugins[pluginId].page[pageCode] !== input.checked) {
									$.make(data, 'privateData', pluginId, pageCode).status = input.checked ? 1 : 0;
								}
							});

							$('#an-settings-main-panels dd > :input').each(function(i, input)
							{
								var
								info = input.id.split(sep),
								pluginId = info[1],
								pageCode = info[2],
								optionId = info[3],
								option = an.plugins[pluginId].options[optionId],
								jInput = $(input),
								val = jInput.is(':checkbox') ? input.checked : jInput.val();

								if(option.defaultValue != val) {
									(option.global ? $.make(data, 'publicData') : $.make(data, 'privateData', pluginId, pageCode, 'options'))[optionId] = val;
								}
							});
						},
						'取消': $.gray,
						'套用': function()
						{
						}
					}, function(desc, handler)
					{
						$($.format('<li><a href="javascript:">{0}</a></li>', desc)).click(handler).appendTo('#an-settings-main-control-1');
					});

					/*
					getInfo = function(jTarget)
					{
						var oInfo = jTarget.data('info');

						if(!oInfo)
						{
							var aInfo;
							if(jTarget.hasClass('an-settings-switch'))
							{
								aInfo = jTarget.attr('id').replace(/an-settings-switch-/, '').split(sSep);
								oInfo = { page: aInfo[0] * 1, id: aInfo[1] };
							}
							else
							{
								aInfo = jTarget.attr('id').replace(/an-settings-option-/, '').split(sSep);
								oInfo = { page: aInfo[0] * 1, name: aInfo[1], type: jTarget[0].nodeName == 'SELECT' ? 'select' : jTarget.attr('type') };
							}
							jTarget.data('info', oInfo);
						}

						return oInfo;
					};

					saveOptions = function()
					{
						var oSwitches = {};
						jSwitches.each(function()
						{
							var jThis = $(this);
							var oInfo = getInfo(jThis);
							$.make('a', $.make(oSwitches, oInfo.mod), oInfo.id);

							if(jThis.is(':checked')) oSwitches[oInfo.mod][oInfo.id].push(oInfo.page);
						});
						$.storage('an_switches', oSwitches);

						var oOptions = {};
						var bHasQuote = false;
						jOptions.each(function()
						{
							var jThis = $(this);
							var oInfo = getInfo(jThis);
							$.make('o', oOptions, oInfo.name);

							if(oInfo.type == 'checkbox')
							{
								oOptions[oInfo.name][oInfo.page] = jThis.is(':checked');
							}
							else if(oInfo.type == 'text' || oInfo.type == 'select')
							{
								if(!bHasQuote && oInfo.type == 'text' && jThis.val().match(/\'|\"/)) bHasQuote = true;
								oOptions[oInfo.name][oInfo.page] = $.correct(jThis.val());
							}
						});
						if(bHasQuote && !confirm('發現文字設定中含有引號!\n若該設定屬於CSS相關項目(如顏色設定), 則有可能導致版面錯誤!\n\n確定進行儲存?')) return false;
						$.storage('an_options', oOptions);

						return true;
					};

					fillOptions = function(bFillAll, bUseDefault)
					{
						var
						jScope = (bFillAll) ? $('#an-settings-main-panels') : jFieldsets.filter(':visible'),
						storage = $.storage(!bUseDefault),
						data = storage.profiles[storage.curPorfile];

						jScope.find('.an-settings-switch').each(function()
						{
							var jThis = $(this);
							var oInfo = getInfo(jThis);
							var bOn = !!data.privateData[oInfo.id][oInfo.page].status;
							jThis.attr('checked', bOn).parent().parent().find('.an-settings-option').attr('disabled', !bOn);
						});

						jScope.find('.an-settings-option').each(function()
						{
							var jThis = $(this);
							var oInfo = getInfo(jThis);
							var uValue = an.plugins[oInfo.oDB.oOptions[oInfo.name][oInfo.page];
							if(oInfo.type == 'checkbox')
							{
								jThis.attr('checked', uValue);
							}
							else if(oInfo.type == 'text' || oInfo.type == 'select')
							{
								jThis.val(uValue);
							}
						});
					};

					fillBoolean = function(bSwitchOn)
					{
						var jScope = (bFillAll) ? $('#an-settings-main-panels') : jFieldsets.filter(':visible');
						jScope.find('.an-settings-switch').attr('checked', bSwitchOn);
						jScope.find('.an-settings-option').attr('disabled', !bSwitchOn);
					};

					importSettings = function()
					{
						var oSettings = JSON.parse(prompt('輸入滙入設定資料', ''));
						if(!oSettings) return alert('資料剖析錯誤!');

						var jScope = (bFillAll) ? $('#an-settings-main-panels') : jFieldsets.filter(':visible');

						if(oSettings.oSwitches)
						{
							jScope.find('.an-settings-switch').each(function()
							{
								var jThis = $(this);
								var oInfo = getInfo(jThis);

								if(oSettings.oSwitches[oInfo.mod] && oSettings.oSwitches[oInfo.mod][oInfo.id])
								{
									var bOn = ($.inArray(oInfo.page, oSettings.oSwitches[oInfo.mod][oInfo.id]) != -1);
									jThis.attr('checked', bOn).parent().parent().find('.an-settings-option').attr('disabled', !bOn);
								}
							});
						}

						if(oSettings.oOptions)
						{
							jScope.find('.an-settings-option').each(function()
							{
								var jThis = $(this);
								var oInfo = getInfo(jThis);

								if(oSettings.oOptions[oInfo.name] && oInfo.page in oSettings.oOptions[oInfo.name])
								{
									var uValue = oSettings.oOptions[oInfo.name][oInfo.page];

									if(oInfo.type == 'checkbox')
									{
										jThis.attr('checked', uValue);
									}
									else if(oInfo.type == 'text' || oInfo.type == 'select')
									{
										jThis.val(uValue);
									}
								}
							});
						}

						alert('滙入成功!');
					};

					exportSettings = function()
					{
						var jScope = (bFillAll) ? $('#an-settings-main-panels') : jFieldsets.filter(':visible');
						var oExport = { oSwitches: {}, oOptions: {} };

						jScope.find('.an-settings-switch').each(function()
						{
							var jThis = $(this);
							var oInfo = getInfo(jThis);
							var oFn = $.make('a', $.make('o', oExport.oSwitches, oInfo.mod), oInfo.id);
							if(jThis.is(':checked')) oFn.push(oInfo.page);
						});

						jScope.find('.an-settings-option').each(function()
						{
							var jThis = $(this);
							var oInfo = getInfo(jThis);
							var oFn = $.make('o', oExport.oOptions, oInfo.name);

							if(oInfo.type == 'checkbox')
							{
								oFn[oInfo.page] = jThis.is(':checked');
							}
							else if(oInfo.type == 'text' || oInfo.type == 'select')
							{
								oFn[oInfo.page] = $.correct(jThis.val());
							}
						});

						prompt('滙出成功!\n請複製以下代碼', JSON.stringify(oExport));
					};

					$.each(
					{
						'確定': function()
						{
							if(saveOptions()) location.reload();
						},
						'取消': $.gray,
						'套用': function()
						{
							saveOptions();

							an.box.oSwitches = null;
							an.box.oOptions = null;
							an.modFn.getDB();
						}
					}, function(sDesc, fControl)
					{
						$($.format('<li><a href="javascript:">{0}</a></li>', sDesc)).click(fControl).appendTo('#an-settings-main-control-1');
					});

					$.each(
					{
						'復原': function()
						{
							fillOptions(bFillAll, false);
						},
						'全選': function()
						{
							fillBoolean(true);
						},
						'全否': function()
						{
							fillBoolean(false);
						},
						'重設': function()
						{
							fillOptions(bFillAll, true);
						},
						'滙入': function()
						{
							importSettings();
						},
						'滙出': function()
						{
							exportSettings();
						}
					}, function(sDesc, fControl)
					{
						$($.format('<li><a href="javascript:">{0}</a></li>', sDesc)).click(fControl).appendTo('#an-settings-main-control-2');
					});

					$('<li id="an-settings-main-control-last"><label for="an-settings-main-control-currentonly">僅套用到本頁選項</label></li>')
					.prepend($('<input type="checkbox" id="an-settings-main-control-currentonly" checked="checked" />').click(function()
					{
						bFillAll = !$(this).is(':checked');
					}))
					.appendTo('#an-settings-main-control-2');
				*/
				}

				//fillOptions(true, false);

				$('#an-settings-tabs a:first').click(); // FF3 throws error
				//tabClick.call($('#an-settings-tabs a:first')[0]);
				$.gray(false, 'an-settings');
			});
		}
	}]
},

'71c9bd88-dc3b-4a97-b04c-20052dcfcdcb':
{
	desc: '加入評測元件',
	page: { 65534: on },
	type: 1,
	queue: [{
		priority: 1,
		fn: function()
		{
			return;
			$.addMain('評測', function()
			{
				if(!$('#an-benchmark').length)
				{
					$.ss(' \
					#an-benchmark div { padding: 0.5em; } \
					');

					$.box('an-benchmark', '評測', 550, 500).append('<div><table><thead><tr><td>#</td><td>功能</td><td>執行時間</td></tr></thead><tbody></tbody></table></div>');
				}

				var uCount, sName, sTime;
				var nCount, nSum, nTotal;
				nCount = nSum = nTotal = 0;
				var aBg = [job.options('sMainBgColor'), job.options('sSecBgColor')];

				var sHTML = '';
				$.each($.benchmark(), function(i)
				{
					switch(this.type)
					{
						case 'start':
						uCount = 'N/A';
						sName = $.format('--- {0} 開始 ---', this.name);
						sTime = 'N/A';
						break;

						case 'fn':
						uCount = ++nCount;
						sName = this.name;
						sTime = (this.time || 'ε') + ' ms';

						nSum += this.time;
						nTotal += this.time;
						break;

						case 'end':
						uCount = 'N/A';
						sName = $.format('--- {0} 結束 ---', this.name);
						sTime = nSum + ' ms';
						break;

						case 'final':
						sHTML += $.format('<tr><td>N/A</td><td>+++ 總和 +++</td><td>{0} ms</td></tr>', nTotal);
						nTotal = 0;

						uCount = 'N/A';
						sName = '~~~ 回合結束 ~~~';
						sTime = this.time + ' ms';
						break;
					}

					sHTML += $.format('<tr style="background-color: {0};"><td>{1}</td><td>{2}</td><td>{3}</td></tr>', aBg[i % 2], uCount, sName, sTime);

					if(this.type == 'end') nSum = 0;
				});
				$('#an-benchmark tbody').append(sHTML);

				$.gray(true, 'an-benchmark');
			});
		}
	}]
},

'0868eb64-9631-42dd-8b5c-02f11a8c9a48':
{
	desc: '加入記錄元件 [右下]',
	page: { 65534: on },
	type: 1,
	options:
	{
		bAddLogButton: { desc: '加入記錄元件開關按扭', defaultValue: false, type: 'checkbox' },
		bAutoShowLog: { desc: '自動顯示記錄視窗', defaultValue: true, type: 'checkbox' },
		bShowDetailLog: { desc: '顯示詳盡記錄', defaultValue: false, type: 'checkbox' },
		sLogWidth: { desc: '元件闊度 [可設定為20em, 15%, 200px等]', defaultValue: '200px', type: 'text' }
	},
	queue: [{
		priority: 1,
		fn: function(job)
		{
			var getMod = function()
			{
				var jMod = $('#an-log');
				if(jMod.length) return jMod;

				$.ss('\
				#an-log { display: none; height: 30%; width: {0}; bottom: 0; right: 0; } \
				#an-log-header { font-weight: bold; border-bottom-width: 1px; padding-bottom: 0.2em; } \
				#an-log-content li { display: none; border-bottom: 1px dotted; padding: 0.3em 0; } \
				',
				job.options('sLogWidth')
				);

				return $('<div id="an-log" class="an-mod an-small"><div id="an-log-header">Log</div><ul id="an-log-content"></ul></div>').appendTo('#an-ui');
			};

			if(job.options('bAddLogButton'))
			{
				$.addMain('記錄', function()
				{
					getMod().fadeToggle();
				});
			}

			$.log = function(sLog)
			{
				var jLog = getMod();

				if(job.options('bAutoShowLog')) jLog.fadeIn('fast');

				var dDate = new Date();
				var hour = dDate.getHours();
				if(hour < 10) hour = '0' + hour;
				var min = dDate.getMinutes();
				if(min < 10) min = '0' + min;

				var jLogContainer = $('#an-log-content');

				$($.format('<li>{0}:{1} {2}</li>', hour, min, $.format(sLog, $.slice(arguments, 1)))).prependTo(jLogContainer).slideDown('slow');

				jLogContainer.children(':gt(50)').remove();
			};

			if(job.options('bShowDetailLog')) $.log2 = $.log;
			if(an.debugMode) $.debug = $.log;

			$.ajaxSetup(
			{
				error: function(xhr, sStatus, err)
				{
					$.log($.format('讀取目標時發生錯誤: {0} {1}', xhr.status, xhr.statusText));
				}
			});
		}
	}]
},

'e9051bb8-2613-4f10-82ec-69290831c6a5':
{
	desc: '加入按扭元件 [左上]',
	page: { 65534: on },
	type: 1,
	options:
	{
		bAddButtonsButton: { desc: '加入按扭元件開關按扭', defaultValue: false, type: 'checkbox' },
		bAutoShowButtons: { desc: '自動顯示按扭元件', defaultValue: true, type: 'checkbox' }
	 },
	queue: [{
		priority: 1,
		fn: function(job)
		{
			var getMod = function()
			{
				var jMod = $('#an-buttons');
				if(jMod.length) return jMod;

				$.ss('\
				#an-buttons { {0} left: 5px; top: 30px; border-left: 5px solid; padding-left: 0.3em; } \
				#an-buttons a { padding: 0.15em 0; } \
				',
				job.options('bAutoShowButtons') ? '' : 'display: none;');

				return $('<div id="an-buttons" class="an-mod"><ul class="an-menu"></ul></div>').appendTo('#an-ui');
			};

			if(job.options('bAddButtonsButton'))
			{
				$.addMain('按扭', function()
				{
					getMod().fadeToggle();
				});
			}

			$.addButton = function(sDesc, fHandler)
			{
				var jButtons = getMod();
				if(!sDesc) return;
				jButtons.find('ul').append($('<li><a href="javascript:">' + sDesc + '</a></li>').click(fHandler));
			};
		}
	}]
},

'437dc7da-fdfa-429a-aec5-329c80222327':
{
	desc: '加入連結元件 [左中]',
	page: { 65534: on },
	type: 1,
	options:
	{
		bAddLinksButton: { desc: '加入連結元件開關按扭', defaultValue: false, type: 'checkbox' },
		bAutoShowLinks: { desc: '自動顯示連結元件', defaultValue: true, type: 'checkbox' }
	 },
	queue: [{
		priority: 1,
		fn: function(job)
		{
			var getMod = function()
			{
				var jMod = $('#an-links');
				if(jMod.length) return jMod;

				$.ss('\
				#an-links { {0} top: 50%; left: 0; text-align: right; } \
				#an-links a { padding: 0.3em 0.1em 0.2em 1.5em; } \
				#an-links-top li { border-bottom-width: 1px; } \
				#an-links-middle li { border-width: 1px 0; } \
				#an-links-bottom li { border-top-width: 1px; } \
				', job.options('bAutoShowLinks') ? '' : 'display: none;');

				jMod = $('<div id="an-links" class="an-mod"><ul id="an-links-top" class="an-menu"></ul><ul id="an-links-middle" class="an-menu"></ul><ul id="an-links-bottom" class="an-menu"></ul></div>').appendTo('#an-ui');

				return jMod;
			};

			if(job.options('bAddLinksButton'))
			{
				$.addMain('連結', function()
				{
					getMod().fadeToggle();
				});
			}

			$.addLink = function(sDec, uExtra, nPos)
			{
				if(nPos === undefined) nPos = 1;

				var jLinks = getMod();

				if(!sDec) return;

				jLinks.children().eq(nPos)[nPos == 2 ? 'append' : 'prepend'](
					(typeof uExtra == 'string') ?
					$.format('<li><a href="{0}">{1}</a></li>', uExtra, sDec) :
					$('<li><a href="javascript:">' + sDec + '</a></li>').click(uExtra)
				);

				jLinks.css('margin-top', - jLinks.height() / 2);
			};
		}
	}]
},

'1c6e8869-8148-4e58-b440-31e1bee4aef1':
{
	desc: '加入資訊元件 [左下]',
	page: { 65534: on },
	type: 1,
	options:
	{
		bAddInfoButton: { desc: '加入資訊元件開關按扭', defaultValue: false, type: 'checkbox' },
		bAutoShowInfo: { desc: '自動顯示資訊視窗', defaultValue: true, type: 'checkbox' }
	},
	queue: [{
		priority: 1,
		fn: function(job)
		{
			var getMod = function()
			{
				var jMod = $('#an-info');
				if(jMod.length) return jMod;

				$.ss('\
				#an-info { {0}; left: 10px; bottom: 10px; border-width: 0 0 1px 1px; } \
				#an-info-content { padding: 1em 1em 0 0.5em !important; } \
				#an-info-footer { text-align: right; font-weight: bold; } \
				#an-info li { padding-bottom: 0.5em; } \
				#an-info li a { display: inline; } \
				',
				job.options('bAutoShowInfo') ? '' : 'display: none'
				);

				return $('<div id="an-info" class="an-mod"><ul id="an-info-content" class="an-menu an-small"></ul><div class="an-small" id="an-info-footer">Info</div></div>').appendTo('#an-ui');
			};

			(function()
			{
				function check(){ return $('#hkg_bottombar').length && $.ss('#an-info { bottom: 30px !important; }') && true; }

				// jQuery onload event sometimes does not fire on chrome?
				!check() && window.addEventListener ? window.addEventListener('load', check, false) : window.attachEvent('onload', check);
			})();

			if(job.options('bAddInfoButton'))
			{
				$.addMain('資訊', function()
				{
					getMod().fadeToggle();
				});
			}

			$.addInfo = function(sInfo)
			{
				getMod();
				if(sInfo) return $('<li>' + sInfo + '</li>').hide().appendTo('#an-info-content').fadeIn('slow');
			};
		}
	}]
},

'56ecac51-0257-4d34-897d-6331247b017d':
{
	desc: '加入關於元件',
	page: { 65534: 'comp' },
	type: 1,
	queue: [{
		priority: 1,
		fn: function(job)
		{
			$.addMain('關於', function()
			{
				if(!$('#an-about').length)
				{
					$.ss('\
					#an-about > div { margin: 0.5em; } \
					#an-about h1 { margin: 0.5em; font-size: 2em; text-align: center; } \
					#an-about hr { border-width: 1px; margin: 1em 0.5em; } \
					#an-about div div { overflow-y: auto; overflow-x: hidden; width: 80%; height: 200px; margin: 0 auto; border-width: 1px; } \
					#an-about dl { margin: 0; padding: 0 0.5em 0.5em; font-size: 0.8em; } \
					#an-about dt { margin-top: 1em; } \
					#an-about dd { margin: 0; line-height: 1.3; } \
					#an-about p { margin: 1em 0; font-size: 0.75em; text-align: center; } \
					');

					var jAbout = $.box('an-about', '關於', 500, 'auto').append('<div><h1>Helianthus.annuus</h1><hr /><div><dl></dl></div><p>&copy; 2009 向日 Licenced under <a href="http://www.gnu.org/licenses/gpl.html" target="_blank">GNU General Public License v3</a></p></div>');
					var sHTML = '';

					sHTML += '<dt>[程式]</dt>';
					$.each({
						'名稱': 'Helianthus.annuus',
						'作者': '<a target="_blank" href="ProfilePage.aspx?userid=148720">向日</a>',
						'主頁': '<a target="_blank" href="http://code.google.com/p/helianthus-annuus/">http://code.google.com/p/helianthus-annuus/</a>',
						'版本': an.version,
						'儲存方式': '<select id="an-about-storage"><option>Flash</option></select>',
						'除錯模式': an.debugMode ? '啟用' : '停用'
					}, function(sName, sValue)
					{
						sHTML += $.format('<dd>{0}: {1}</dd>', sName, sValue);
					});

					sHTML += '<dt>[Credits]</dt>';
					$.each(an.credits, function()
					{
						sHTML += $.format('<dt><a href="{0.url}">{0.name}</a> by <a href="{0.authorUrl!|#}">{0.author}</a></dt><dd><a href="{0.licenseUrl!|#}">{0.license}</a></dd>', this);
					});

					jAbout.find('dl').append(sHTML);

					if(window.localStorage) $('#an-about-storage').append('<option>DOM</option>');
					$('#an-about-storage').val(an.storageMode).change(function()
					{
						$.cookie('an-storagemode', $(this).val());
						location.reload();
					});
				}

				$.gray(true, 'an-about');
			});
		}
	}]
},

'629944a0-a4f2-493c-8c8d-e1261a9264f9':
{
	desc: '鼠標遠離UI元件時半透明',
	page: { 65534: off },
	type: 1,
	options: { nUIOpacity: { desc: '透明度 (10 = 移除半透明)', type: 'select', defaultValue: 3, choices: [10,9,8,7,6,5,4,3,2,1,0] } },
	queue: [{
		priority: 1,
		fn: function()
		{
			$.ss('\
			.an-mod { {0}; } \
			.an-mod:hover { {1} } \
			',
			$.cssText('opacity', job.options('nUIOpacity') / 10),
			$.cssText('opacity', 1)
			);
		}
	}]
}

});