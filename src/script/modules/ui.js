AN.mod['User Interface'] = { ver: 'N/A', author: '向日', fn: {

'6464e397-dfea-477f-9706-025ec439e810':
{
	desc: '設定UI樣式',
	page: { 65535: 'comp' },
	type: 2,
	options:
	{
		sMenuFontSize: { desc: 'UI主要字體大小(px)', defaultValue: '16', type: 'text' },
		sSmallFontSize: { desc: 'UI細字體大小(px)', defaultValue: '10', type: 'text' }
	},
	once: function()
	{
		AN.util.stackStyle($.sprintf(' \
		.an-box { display: none; position: fixed; left: 50%; top: 50%; z-index: 10; border-width: 1px; } \
		.an-box-header { line-height: 1.8em; margin: 0; padding: 0 0 0 0.2em; } \
		.an-box-content { overflow: auto; position: relative; } \
		\
		.an-menu { font-size: %(sMenuFontSize)spx; } \
		.an-menu a { display: block; } \
		.an-menu a:hover { color: %(sUIHoverColor)s; } \
		\
		.an-small { font-size: %(sSmallFontSize)spx; } \
		\
		#an-ui ul { margin: 0; padding: 0; list-style: none; } \
		#an-ui a:focus { outline: 0; } \
		\
		.an-mod { position: fixed; color: %(sUIFontColor)s; } \
		.an-mod, .an-mod * { border: 0 solid %(sUIFontColor)s; } \
		.an-mod a { text-decoration: none; color: %(sUIFontColor)s; } \
		\
		#an-backlayer { display: none; opacity: 0; -ms-filter: "alpha(opacity=0)"; z-index: 5; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background: gray; } \
		\
		#an-mainmenu { top: 15%; right: 0; } \
		#an-mainmenu a { padding: 0.3em 0.35em 0 0; border-bottom-width: 1px; } \
		',
		AN.util.getOptions()
		));
	}
},

'1db9ccc8-ad28-48b6-8744-22f892ca0a44':
{
	desc: '加入基本元件',
	page: { 65535: 'comp' },
	type: 1,
	once: function()
	{
		$('#an').append(' \
		<div id="an-ui"> \
			<div id="an-backlayer"></div> \
			<ul id="an-mainmenu" class="an-mod an-menu"></ul> \
		</div> \
		').click(function(event){ event.stopPropagation(); });

		AN.shared.gray = function(bClickToQuit, uExtra)
		{
			var jGray = $('#an-backlayer');
			if(jGray.is(':hidden'))
			{
				//$('html').css('overflow', 'hidden');

				if(bClickToQuit)
				{
					jGray.one('click', function()
					{
						AN.shared.gray();
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

		AN.shared.addMain = function(sName, fHandler)
		{
			$('<li><a href="javascript:">' + sName + '</a></li>').click(fHandler).appendTo('#an-mainmenu');
		};

		AN.shared.box = function(sId, sHeader, uWidth, uHeight)
		{
			return $($.sprintf('<div class="an-box an-forum"><h4 class="an-forum-header an-box-header">%s</h4><div id="%s" class="an-box-content"></div></div>', sHeader, sId)).appendTo('#an-ui').children('.an-box-content').data('an-oWH', { w: uWidth || 'auto', h: uHeight || 'auto' });
		};
	}
},


'72907d8e-4735-4f66-b3c9-20e26197663d':
{
	desc: '加入共用元件',
	page: { 65535: 'comp' },
	type: 1,
	once: function()
	{
		(function()
		{
			AN.shared.serverTable = function()
			{
				if(!$('#an-server').length)
				{
					AN.util.addStyle('\
					#an-server div { padding: 0.5em; } \
					#an-server caption { padding-top: 0.5em; text-align: center; caption-side: bottom; } \
					#an-server caption a { display: inline-block; border-width: 1px; padding: 0.2em; } \
					#an-server table { text-align: center; } \
					#an-server td { font-size: 80%; } \
					');

					AN.shared.box('an-server', '伺服器狀態', 300).append('<div><table><caption><a href="javascript:">進行測試</a></caption><thead><tr><td>伺服器</td><td>回應時間</td></tr></thead><tbody></tbody></table></div>');

					var sURL = location.search.indexOf('error') !== -1
						? $.sprintf('http://%s/topics.aspx?type=BW', location.hostname)
						: location.href.replace(/topics_(bw)(?:_[^.]+)?\.htm(\??)/i, function($0, $1, $2){ return 'topics.aspx?type=' + $1.toUpperCase() + ($2 ? '&' : ''); });
					var tableHTML = '', imgHTML = '';

					var subs = [['forum101', 'Forum 101'], ['m', 'Mobile']];
					for(var i=11; i--;) {
						subs.unshift(['forum' + (i + 1), 'Forum ' + (i + 1)]);
					}
					for(var i=0; i<subs.length; i++) {
						tableHTML += $.sprintf('<tr><td><a href="%s">%s</a></td><td class="an-server-response"></td></tr>', sURL.replace(/demoforum|groupon|forum\d+/i, subs[i][0]), subs[i][1]);
						imgHTML += '<img />';
					}
						
					var jTestImages = $('<div>' + imgHTML + '</div>').children().bind('load error', function(event)
					{
						var jImg = $(event.target);
						$('#an-server .an-server-response').eq(jImg.index()).html(event.type == 'load' ? $.sprintf('~%s ms', $.time() - jImg.data('nTime')) : '發生錯誤');
					});

					$('#an-server')
					.find('caption').click(function()
					{
						$('#an-server .an-server-response').html('等待回應中...');

						jTestImages.each(function(i)
						{
							var nTime = $.time();
							$(this).data('nTime', nTime).attr('src', $.sprintf('http://%s.hkgolden.com/images/spacer.gif?tId=%s', subs[i][0], nTime));
						});
					})
					.end().find('tbody').html(tableHTML);
				}

				AN.shared.gray(true, 'an-server');
				$('#an-server caption').trigger('click');
			};
		})();

		(function()
		{
			var jHoverObjects, objectSets = [], recordOffset = function()
			{
				var data = $(this).data('hoverize');
				data.fixScroll_difference = data.jTarget[data.fixScroll]() - $d.scrollTop();
			};

			$.fn.hoverize = function(selector, option)
			{
				if(!jHoverObjects) {
					AN.util.addStyle('\
					#an-hoverobjects > * { display: none; position: absolute; } \
					#an-hoverobjects > img, #an-hoverobjects > span { cursor: pointer; } \
					');

					jHoverObjects = $('<div id="an-hoverobjects"></div>').appendTo('#an').bind({
						click: function(event)
						{
							event.stopPropagation();

							var jObject = $(event.target).closest('#an-hoverobjects > *'),
							data = jObject.data('hoverize');

							if(!data) return;

							var jTarget = data.jTarget;

							if(data.fixScroll) $d.scrollTop(jTarget[data.fixScroll]() - data.fixScroll_difference);

							if(!data.autoToggle) return;

							data.jTarget = null;
							jObject.hide();
							jTarget.mouseover();
							jObject.mouseover();
						},
						'mouseover mouseout entertarget leavetarget': function(event)
						{
							event.stopPropagation();
						}
					});

					$d.mouseover(function(event)
					{
						var jEnterTree = $(event.target).parentsUntil('#aspnetForm').andSelf();

						$.each(objectSets, function(i, objectSet)
						{
							var jNewTarget = jEnterTree.filter(objectSet.selector).eq(-1),
							jObject = objectSet.jObject,
							data = jObject.data('hoverize');

							if(data.filter) jNewTarget = jNewTarget.filter(data.filter);

							if(data.jTarget) {
								if(jNewTarget[0] && jNewTarget[0] === data.jTarget[0]) {
									return;
								}
								else {
									jObject.trigger('leavetarget');
									data.jTarget = null;

									if(data.autoToggle) jObject.hide();
								}
							}

							if(jNewTarget.length) {
								data.jTarget = jNewTarget;
								jObject.trigger('entertarget');

								if(data.autoPosition) jObject.css(jNewTarget.offset());
								if(data.autoToggle) jObject.show();
							}
						});
					});
				}

				var jObject = this;

				if(selector === null) {
					$.each(objectSets, function(i)
					{
						if(this.jObject[0] === jObject[0]) {
							objectSets.splice(i, 1);
							return false;
						}
					});
				}
				else {
					objectSets.push({ selector: selector, jObject: jObject });
					this.data('hoverize', $.extend({ fixScroll: false, fixScroll_autoRecord: true, autoToggle: true, autoPosition: true, filter: null }, option)).appendTo(jHoverObjects);

					if(this.data('hoverize').fixScroll && this.data('hoverize').fixScroll_autoRecord) this.click(recordOffset);
				}

				return this;
			};
		})();

		(function()
		{
			var jUserButtons, recordOffset = function()
			{
				var data = jUserButtons.data('hoverize');
				data.fixScroll_difference = data.jTarget.top() - $d.scrollTop();
			};

			$.userButton = function(src)
			{
				if(!jUserButtons) {
					AN.util.addStyle('\
					#an-userbuttons > img:first-child { padding-top: 7px; } \
					#an-userbuttons > img { display: block; padding: 3.5px 7px; cursor: pointer; } \
					');

					jUserButtons = $('<div id="an-userbuttons"></div>').hoverize('.repliers_left', { fixScroll: 'top', fixScroll_autoRecord: false }).bind({
						entertarget: function()
						{
							jUserButtons.children().data('userButton', { jTarget: jUserButtons.data('hoverize').jTarget.parent() }).trigger('buttonshow');
						},
						buttonshow: function(event)
						{
							event.stopPropagation();
						}
					});
				}

				return $('<img />', { src: src, click: recordOffset }).appendTo(jUserButtons);
			};
		})();
	}
},

'95e203b9-8d9a-46ad-be53-f4297bad7285':
{
	desc: '加入選項元件',
	page: { 65534: 'comp' },
	type: 1,
	once: function()
	{
		var tabClick, getInfo, saveOptions, fillOptions, fillBoolean, importSettings, exportSettings, bFillAll, jFieldsets, jTabLinks, jSwitches, jOptions;

		AN.shared.addMain('選項', function()
		{
			if(!$('#an-settings').length)
			{
				AN.shared.box('an-settings', '選項', 900, 'max').append('<div id="an-settings-tabs"><ul id="an-settings-tabs-main"></ul><ul id="an-settings-tabs-extend"></ul></div><div id="an-settings-main"><div id="an-settings-main-panelswrapper"><div id="an-settings-main-panels"></div></div><div id="an-settings-main-controls"><ul id="an-settings-main-control-1"></ul><ul id="an-settings-main-control-2"></ul></div></div>');

				AN.util.addStyle(' \
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

				var oTypeMap = AN.box.oTypeMap;
				var oPageMap = AN.box.oPageMap;

				var oStructure = {};
				$.each(oTypeMap, function(sType)
				{
					oStructure[sType] = {};
					$.each(oPageMap, function(sPage)
					{
						oStructure[sType][sPage] = {};
					});
				});

				var sSep = '_-_';
				$.each(AN.mod, function(sMod)
				{
					if(!this.fn) return;

					$.each(this.fn, function(sId, oFn)
					{
						$.each(oFn.page, function(sPage, uDefault)
						{
							if(!oStructure[oFn.type][sPage]) oStructure[oFn.type][sPage] = {};

							oStructure[oFn.type][sPage][sMod + sSep + sId] =
							{
								desc: oFn.desc,
								options: oFn.options,
								comp: (uDefault == 'comp'),
								disabled: (uDefault == 'disabled')
							};
						});
					});
				});

				var sHTML = '';
				$.each(oStructure, function(sType)
				{
					var jContainer = (isNaN(sType) || sType > 6) ? $('#an-settings-tabs-extend') : $('#an-settings-tabs-main');
					jContainer.append($.sprintf('<li><a href="javascript:" data-panel="an-settings-panel-%s">%s</a></li>', sType, oTypeMap[sType]));

					sHTML += $.sprintf('<fieldset id="an-settings-panel-%s"><legend>%s</legend>', sType, oTypeMap[sType]);
					$.each(this, function(sPage)
					{
						if($.isEmpty(this)) return;

						var aGroup = [];
						if(sPage in oPageMap) aGroup.push(oPageMap[sPage].desc);
						else $.each(oPageMap, function(s)
						{
							if(s < 65534 && s & sPage) aGroup.push(this.desc);
						});
						sHTML += $.sprintf('<h4><span>%s</span><hr /></h4>', aGroup.join('、'));

						$.each(this, function(sMixed)
						{
							sHTML += '<dl><dt>';

							var bDisabled = this.disabled;
							var sSwitchId = $.sprintf('an-settings-switch-%s%s%s', sPage, sSep, sMixed);
							var sChecked = this.comp ? 'checked="checked"' : '';
							var sSavable = (this.comp || bDisabled) ? 'disabled="disabled"' : 'class="an-settings-switch"';
							sHTML += $.sprintf('<input type="checkbox" id="%s" %s %s />', sSwitchId, sChecked, sSavable);
							sHTML += $.sprintf('<label for="%s">%s</label></dt>', sSwitchId, this.desc);

							if(this.options)
							{
								$.each(this.options, function(sName)
								{
									sHTML += '<dd>';

									var sOptionId = $.sprintf('an-settings-option-%s%s%s', sPage, sSep, sName);
									var sSavable = bDisabled ? 'disabled="disabled"' : 'class="an-settings-option"';

									if(this.type == 'checkbox')
									{
										sHTML += $.sprintf('<input type="checkbox" id="%s" %s /><label for="%s">%s</label>', sOptionId, sSavable, sOptionId, this.desc);
									}
									else if(this.type == 'text')
									{
										sHTML += $.sprintf('<label for="%s">%s: </label><input type="text" id="%s" %s />', sOptionId, this.desc, sOptionId, sSavable);
									}
									else if(this.type == 'select')
									{
										sHTML += $.sprintf('%s: <select id="%s" %s>', this.desc, sOptionId, sSavable);
										$.each(this.choices, function()
										{
											sHTML += $.sprintf('<option value="%s">%s</option>', this, this);
										});
										sHTML += '</select>';
									}

									sHTML += '</dd>';
								});
							}
							sHTML += '</dl>';
						});
					});
					sHTML += '</fieldset>';
				});

				$('#an-settings-main-panels').append(sHTML);
				sHTML = null;
				
				/* special settings start */
				
				$('#an-settings-tabs-extend').append('<li><a id="an-settings-tab-sepcial" href="javascript:" data-panel="an-settings-panel-special">特殊設定</a></li>');

				$('\
				<fieldset id="an-settings-panel-special"> \
					<legend>特殊設定</legend> \
					<h4><span>設定資料</span><hr /></h4> \
					<div><textarea readonly id="an-settings-special-config" style="width: 95%; height: 200px; font-size: 80%"></textarea></div> \
					<div><a id="an-settings-special-tofile" href="javascript:" target="_blank" download="Helianthus.annuus.txt" style="font-size: 80%; text-decoration: underline">儲存以上資料至檔案(另存下載)</a></div> \
				</fieldset> \
				')
				.on('click', '#an-settings-special-config', function(event)
				{
					event.target.select();
				})
				.on('mousedown', '#an-settings-special-tofile', function(event)
				{
					var URL = window.URL || window.webkitURL;
					var bb = window.BlobBuilder || window.WebKitBlobBuilder;
					var data = $('#an-settings-special-config').val();
					
					if(URL && bb) {
						bb = new bb();
						bb.append(data);
						event.target.href = URL.createObjectURL(bb.getBlob('text/plain'));
					}
					else {
						event.target.href = 'data:text/plain;base64,' + window.btoa(unescape(encodeURIComponent(data)));
					}
				})
				.appendTo('#an-settings-main-panels')
				.trigger('an-settings-special');
				
				/* special settings end */
				

				jFieldsets = $('#an-settings-main-panels fieldset'); // jQuery bug? $('#an-settings-main-panels > fieldset') got nth
				jTabLinks = $('#an-settings-tabs a');
				jSwitches = $('.an-settings-switch');
				jOptions = $('.an-settings-option');

				// remove empty tab
				jFieldsets.each(function()
				{
					var jThis = $(this);
					if(!jThis.find('h4').length)
					{
						$($.sprintf('[data-panel=%s]', jThis.attr('id'))).parent().add(jThis).remove();
					}
				});

				// add tab click
				tabClick = function()
				{
					jTabLinks.css('text-decoration', '');
					$(this).css('text-decoration', 'underline');
					jFieldsets.hide();
					$('#' + $(this).attr('data-panel')).show().parent().parent().scrollTop(0);
				};
				jTabLinks.click(tabClick);

				// add switch click
				jSwitches.click(function()
				{
					var jThis = $(this);
					jThis.parent().parent().find('.an-settings-option').attr('disabled', !jThis.is(':checked'));
				});

				getInfo = function(jTarget)
				{
					var oInfo = jTarget.data('info');

					if(!oInfo)
					{
						var aInfo;
						if(jTarget.hasClass('an-settings-switch'))
						{
							aInfo = jTarget.attr('id').replace(/an-settings-switch-/, '').split(sSep);
							oInfo = { page: aInfo[0] * 1, mod: aInfo[1], id: aInfo[2] };
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
						$.make('a', $.make('o', oSwitches, oInfo.mod), oInfo.id);

						if(jThis.is(':checked')) oSwitches[oInfo.mod][oInfo.id].push(oInfo.page);
					});
					AN.util.storage('an_switches', oSwitches);

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
					AN.util.storage('an_options', oOptions);

					return true;
				};

				fillOptions = AN.shared.fillOptions = function(bFillAll, bUseDefault)
				{
					var jScope = (bFillAll) ? $('#an-settings-main-panels') : jFieldsets.filter(':visible');
					var oDB = AN.modFn.getDB(bUseDefault);

					jScope.find('.an-settings-switch').each(function()
					{
						var jThis = $(this);
						var oInfo = getInfo(jThis);
						var bOn = ($.inArray(oInfo.page, oDB.oSwitches[oInfo.mod][oInfo.id]) != -1);
						jThis.attr('checked', bOn).parent().parent().find('.an-settings-option').attr('disabled', !bOn);
					});

					jScope.find('.an-settings-option').each(function()
					{
						var jThis = $(this);
						var oInfo = getInfo(jThis);
						var uValue = oDB.oOptions[oInfo.name][oInfo.page];
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
					try {
						var oSettings = prompt('請輸入設定資料', '');
						
						if(!oSettings) {
							return;
						}
						
						oSettings = JSON.parse(oSettings);
					}
					catch(e) {
						return alert('設定資料剖析錯誤!');
					}

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

					$('#an-settings-special-config').val(JSON.stringify(oExport) || '');
					$('#an-settings-tab-sepcial').click();
					alert('滙出成功! 請複製設定資料');
				};

				$.each(
				{
					'確定': function()
					{
						if(saveOptions()) location.reload();
					},
					'取消': AN.shared.gray,
					'套用': function()
					{
						saveOptions();

						AN.box.oSwitches = null;
						AN.box.oOptions = null;
						AN.modFn.getDB();
					}
				}, function(sDesc, fControl)
				{
					$($.sprintf('<li><a href="javascript:">%s</a></li>', sDesc)).click(fControl).appendTo('#an-settings-main-control-1');
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
					$($.sprintf('<li><a href="javascript:">%s</a></li>', sDesc)).click(fControl).appendTo('#an-settings-main-control-2');
				});

				$('<li id="an-settings-main-control-last"><label for="an-settings-main-control-currentonly">僅套用到本頁選項</label></li>')
				.prepend($('<input type="checkbox" id="an-settings-main-control-currentonly" checked="checked" />').click(function()
				{
					bFillAll = !$(this).is(':checked');
				}))
				.appendTo('#an-settings-main-control-2');
			}

			fillOptions(true, false);
			//$('#an-settings-tabs a:first').click(); // FF3 throws error
			tabClick.call($('#an-settings-tabs a:first')[0]);
			AN.shared.gray(false, 'an-settings');
		});
	}
},

'71c9bd88-dc3b-4a97-b04c-20052dcfcdcb':
{
	desc: '加入評測元件',
	page: { 65534: true },
	type: 1,
	once: function()
	{
		AN.shared.addMain('評測', function()
		{
			if(!$('#an-benchmark').length)
			{
				AN.util.addStyle(' \
				#an-benchmark div { padding: 0.5em; } \
				');

				AN.shared.box('an-benchmark', '評測', 550, 500).append('<div><table><thead><tr><td>#</td><td>功能</td><td>執行時間</td></tr></thead><tbody></tbody></table></div>');
			}

			var uCount, sName, sTime;
			var nCount, nSum, nTotal;
			nCount = nSum = nTotal = 0;
			var aBg = [AN.util.getOptions('sMainBgColor'), AN.util.getOptions('sSecBgColor')];

			var sHTML = '';
			$.each(AN.box.aBenchmark, function(i)
			{
				switch(this.type)
				{
					case 'start':
					uCount = 'N/A';
					sName = $.sprintf('--- %s 開始 ---', this.name);
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
					sName = $.sprintf('--- %s 結束 ---', this.name);
					sTime = nSum + ' ms';
					break;

					case 'final':
					sHTML += $.sprintf('<tr><td>N/A</td><td>+++ 總和 +++</td><td>%s ms</td></tr>', nTotal);
					nTotal = 0;

					uCount = 'N/A';
					sName = '~~~ 回合結束 ~~~';
					sTime = this.time + ' ms';
					break;
				}

				sHTML += $.sprintf('<tr style="background-color: %s;"><td>%s</td><td>%s</td><td>%s</td></tr>', aBg[i % 2], uCount, sName, sTime);

				if(this.type == 'end') nSum = 0;
			});
			$('#an-benchmark tbody').append(sHTML);

			AN.box.aBenchmark = [];

			AN.shared.gray(true, 'an-benchmark');
		});
	}
},

'0868eb64-9631-42dd-8b5c-02f11a8c9a48':
{
	desc: '加入記錄元件 [右下]',
	page: { 65534: true },
	type: 1,
	options:
	{
		bAddLogButton: { desc: '加入記錄元件開關按扭', defaultValue: false, type: 'checkbox' },
		bAutoShowLog: { desc: '自動顯示記錄視窗', defaultValue: true, type: 'checkbox' },
		bShowDetailLog: { desc: '顯示詳盡記錄', defaultValue: false, type: 'checkbox' },
		sLogWidth: { desc: '元件闊度 [可設定為20em, 15%, 200px等]', defaultValue: '200px', type: 'text' }
	},
	once: function()
	{
		var getMod = function()
		{
			var jMod = $('#an-log');
			if(jMod.length) return jMod;

			AN.util.addStyle($.sprintf('\
			#an-log { display: none; height: 30%; width: %s; bottom: 0; right: 0; } \
			#an-log-header { font-weight: bold; border-bottom-width: 1px; padding-bottom: 0.2em; } \
			#an-log-content li { display: none; border-bottom: 1px dotted; padding: 0.3em 0; } \
			',
			AN.util.getOptions('sLogWidth')
			));

			return $('<div id="an-log" class="an-mod an-small"><div id="an-log-header">Log</div><ul id="an-log-content"></ul></div>').appendTo('#an-ui');
		};

		if(AN.util.getOptions('bAddLogButton'))
		{
			AN.shared.addMain('記錄', function()
			{
				getMod().fadeToggle();
			});
		}

		AN.shared.log = function(sLog)
		{
			var jLog = getMod();

			if($.isRubbish(sLog)) return;

			if(AN.util.getOptions('bAutoShowLog')) jLog.fadeIn('fast');

			var dDate = new Date();
			var hour = dDate.getHours();
			if(hour < 10) hour = '0' + hour;
			var min = dDate.getMinutes();
			if(min < 10) min = '0' + min;

			var jLogContainer = $('#an-log-content');

			$($.sprintf('<li>%s:%s %s</li>', hour, min, sLog)).prependTo(jLogContainer).slideDown('slow');

			jLogContainer.children(':gt(50)').remove();
		};

		if(AN.util.getOptions('bShowDetailLog')) AN.shared.log2 = AN.shared.log;
		if(AN.box.debugMode) AN.shared.debug = AN.shared.log;

		$.ajaxSetup(
		{
			error: function(xhr, sStatus, err)
			{
				AN.shared.log($.sprintf('讀取目標時發生錯誤: %s %s', xhr.status, xhr.statusText));
			}
		});
	}
},

'e9051bb8-2613-4f10-82ec-69290831c6a5':
{
	desc: '加入按扭元件 [左上]',
	page: { 65534: true },
	type: 1,
	options:
	{
		bAddButtonsButton: { desc: '加入按扭元件開關按扭', defaultValue: false, type: 'checkbox' },
		bAutoShowButtons: { desc: '自動顯示按扭元件', defaultValue: true, type: 'checkbox' }
	 },
	once: function()
	{
		var getMod = function()
		{
			var jMod = $('#an-buttons');
			if(jMod.length) return jMod;

			AN.util.addStyle($.sprintf(' \
			#an-buttons { %s left: 5px; top: 30px; border-left: 5px solid; padding-left: 0.3em; } \
			#an-buttons a { padding: 0.15em 0; } \
			', AN.util.getOptions('bAutoShowButtons') ? '' : 'display: none;'));

			return $('<div id="an-buttons" class="an-mod"><ul class="an-menu"></ul></div>').appendTo('#an-ui');
		};

		if(AN.util.getOptions('bAddButtonsButton'))
		{
			AN.shared.addMain('按扭', function()
			{
				getMod().fadeToggle();
			});
		}

		AN.shared.addButton = function(sDesc, fHandler)
		{
			var jButtons = getMod();
			if(!sDesc) return;
			jButtons.find('ul').append($('<li><a href="javascript:">' + sDesc + '</a></li>').click(fHandler));
		};
	}
},

'437dc7da-fdfa-429a-aec5-329c80222327':
{
	desc: '加入連結元件 [左中]',
	page: { 65534: true },
	type: 1,
	options:
	{
		bAddLinksButton: { desc: '加入連結元件開關按扭', defaultValue: false, type: 'checkbox' },
		bAutoShowLinks: { desc: '自動顯示連結元件', defaultValue: true, type: 'checkbox' }
	 },
	once: function(jDoc)
	{
		var getMod = function()
		{
			var jMod = $('#an-links');
			if(jMod.length) return jMod;

			AN.util.addStyle($.sprintf(' \
			#an-links { %s top: 50%; left: 0; text-align: right; } \
			#an-links a { padding: 0.3em 0.1em 0.2em 1.5em; } \
			#an-links-top li { border-bottom-width: 1px; } \
			#an-links-middle li { border-width: 1px 0; } \
			#an-links-bottom li { border-top-width: 1px; } \
			', AN.util.getOptions('bAutoShowLinks') ? '' : 'display: none;'));

			jMod = $('<div id="an-links" class="an-mod"><ul id="an-links-top" class="an-menu"></ul><ul id="an-links-middle" class="an-menu"></ul><ul id="an-links-bottom" class="an-menu"></ul></div>').appendTo('#an-ui');

			jDoc.defer(1, '調整連結元件位置', function() // after all links are added
			{
				jMod.css('margin-top', - jMod.height() / 2);
			});

			return jMod;
		};

		if(AN.util.getOptions('bAddLinksButton'))
		{
			AN.shared.addMain('連結', function()
			{
				getMod().fadeToggle();
			});
		}

		AN.shared.addLink = function(sDec, uExtra, nPos)
		{
			if(nPos === undefined) nPos = 1;

			var jLinks = getMod();

			if(!sDec) return;

			jLinks.children().eq(nPos)[nPos == 2 ? 'append' : 'prepend'](
				(typeof uExtra == 'string') ?
				$.sprintf('<li><a href="%s">%s</a></li>', uExtra, sDec) :
				$('<li><a href="javascript:">' + sDec + '</a></li>').click(uExtra)
			);
		};
	}
},

'1c6e8869-8148-4e58-b440-31e1bee4aef1':
{
	desc: '加入資訊元件 [左下]',
	page: { 65534: true },
	type: 1,
	options:
	{
		bAddInfoButton: { desc: '加入資訊元件開關按扭', defaultValue: false, type: 'checkbox' },
		bAutoShowInfo: { desc: '自動顯示資訊視窗', defaultValue: true, type: 'checkbox' }
	},
	once: function(jDoc)
	{
		var getMod = function()
		{
			var jMod = $('#an-info');
			if(jMod.length) return jMod;

			AN.util.addStyle($.sprintf(' \
			#an-info { %s; left: 10px; bottom: 10px; border-width: 0 0 1px 1px; } \
			#an-info-content { padding: 1em 1em 0 0.5em !important; } \
			#an-info-footer { text-align: right; font-weight: bold; } \
			#an-info li { display: none; padding-bottom: 0.5em; } \
			#an-info li a { display: inline; } \
			',
			AN.util.getOptions('bAutoShowInfo') ? '' : 'display: none'
			));

			return $('<div id="an-info" class="an-mod"><ul id="an-info-content" class="an-menu an-small"></ul><div class="an-small" id="an-info-footer">Info</div></div>').appendTo('#an-ui');
		};

		(function()
		{
			function check(){ return $('#hkg_bottombar').length && AN.util.addStyle('#an-info { bottom: 30px !important; }') && true; }

			// jQuery onload event sometimes does not fire on chrome?
			!check() && window.addEventListener ? window.addEventListener('load', check, false) : window.attachEvent('onload', check);
		})();

		if(AN.util.getOptions('bAddInfoButton'))
		{
			AN.shared.addMain('資訊', function()
			{
				getMod().fadeToggle();
			});
		}

		AN.shared.addInfo = function(sInfo)
		{
			getMod();
			if(sInfo) return $('<li>' + sInfo + '</li>').appendTo('#an-info-content').fadeIn('slow');
		};
	}
},

'56ecac51-0257-4d34-897d-6331247b017d':
{
	desc: '加入關於元件',
	page: { 65534: 'comp' },
	type: 1,
	once: function()
	{
		AN.shared.addMain('關於', function()
		{
			if(!$('#an-about').length)
			{
				AN.util.addStyle('\
				#an-about > div { margin: 0.5em; } \
				#an-about h1 { margin: 0.5em; font-size: 2em; text-align: center; } \
				#an-about hr { border-width: 1px; margin: 1em 0.5em; } \
				#an-about div div { overflow-y: auto; overflow-x: hidden; width: 80%; height: 200px; margin: 0 auto; border-width: 1px; } \
				#an-about dl { margin: 0; padding: 0 0.5em 0.5em; font-size: 0.8em; } \
				#an-about dt { margin-top: 1em; } \
				#an-about dd { margin: 0; line-height: 1.3; } \
				#an-about p { margin: 1em 0; font-size: 0.75em; text-align: center; } \
				');

				var jAbout = AN.shared.box('an-about', '關於', 500, 'auto').append('<div><h1>Helianthus.annuus</h1><hr /><div><dl></dl></div><p>&copy; 2009 向日 Licenced under <a href="http://www.gnu.org/licenses/gpl.html" target="_blank">GNU General Public License v3</a></p></div>');
				var sHTML = '';

				sHTML += '<dt>[程式]</dt>';
				$.each({
					'名稱': 'Helianthus.annuus',
					'作者': '<a target="_blank" href="ProfilePage.aspx?userid=148720">向日</a>',
					'主頁': '<a target="_blank" href="http://code.google.com/p/helianthus-annuus/">http://code.google.com/p/helianthus-annuus/</a>',
					'版本': AN.version,
					'儲存方式': $.sprintf('<select id="an-about-storage"><option>Flash</option></select>'),
					'除錯模式': AN.box.debugMode ? '啟用' : '停用'
				}, function(sName, sValue)
				{
					sHTML += $.sprintf('<dd>%s: %s</dd>', sName, sValue);
				});

				sHTML += '<dt>[Credits]</dt>';
				$.each([
				{
					name: 'jQuery',
					author: 'John Resig',
					url: 'http://jquery.com',
					license: 'Dual licensed under the MIT or GPL Version 2 licenses',
					licenseUrl: 'http://docs.jquery.com/License'
				},
				{
					name: 'json2.js',
					author: 'Douglas Crockford',
					url: 'http://www.json.org/js.html',
					license: 'Public Domain',
					licenseUrl: '#'
				},
				{
					name: 'jquery.sprintf',
					author: 'Sabin Iacob',
					url: 'http://plugins.jquery.com/project/printf',
					license: 'GPL Version 3',
					licenseUrl: 'http://www.gnu.org/licenses/gpl.html'
				},
				{
					name: 'jQuery doTimeout',
					author: 'Ben Alman',
					url: 'http://benalman.com/projects/jquery-dotimeout-plugin/',
					license: 'Dual licensed under the MIT and GPL licenses',
					licenseUrl: 'http://benalman.com/about/license/'
				},
				{
					name: 'Red Flower Icon [<a href="http://www.fasticon.com">Icons by: FastIcon.com</a>]',
					author: 'Fast Icon',
					url: 'http://www.iconarchive.com/show/nature-icons-by-fasticon/Red-Flower-icon.html',
					license: 'Fast Icon Commercial License',
					licenseUrl: 'http://www.fasticon.com/commercial_license.html'
				},
				{
					name: 'Fugue Icons',
					author: 'Yusuke Kamiyamane',
					url: 'http://www.pinvoke.com/',
					license: 'Creative Commons Attribution 3.0 license',
					licenseUrl: 'http://creativecommons.org/licenses/by/3.0/'
				},
				{
					name: 'Still Life',
					author: 'Julian Turner ',
					url: 'http://art.gnome.org/themes/icon/1111',
					license: 'Creative Commons (Attribution-Share Alike 2.0 Generic)',
					licenseUrl: 'http://creativecommons.org/licenses/by-sa/2.0/'
				}], function()
				{
					sHTML += $.sprintf('<dt>%(name)s</dt><dd>by %(author)s</dd><dd><a href="%(url)s">%(url)s</a></dd><dd>License: <a href="%(licenseUrl)s">%(license)s</a></dd>', this);
				});

				jAbout.find('dl').append(sHTML);

				if($.support.localStorage) $('#an-about-storage').append('<option>DOM</option>');
				$('#an-about-storage').val(AN.box.storageMode).change(function()
				{
					AN.util.cookie('an-storagemode', $(this).val());
					location.reload();
				});
			}

			AN.shared.gray(true, 'an-about');
		});
	}
},

'629944a0-a4f2-493c-8c8d-e1261a9264f9':
{
	desc: '鼠標遠離UI元件時半透明 [buggy on IE8]',
	page: { 65534: false },
	type: 1,
	options: { nUIOpacity: { desc: '透明度 (10 = 移除半透明)', type: 'select', defaultValue: 3, choices: [10,9,8,7,6,5,4,3,2,1,0] } },
	once: function()
	{
		AN.util.stackStyle($.sprintf('\
		.an-mod { opacity: %s; -ms-filter: alpha(opacity=%s); } \
		.an-mod:hover { opacity: 1; -ms-filter: alpha(opacity=100); } \
		',
		AN.util.getOptions('nUIOpacity') / 10, AN.util.getOptions('nUIOpacity') * 10
		));
	}
},

'0b587724-a3a7-41be-95d8-96c726d38343':
{
	desc: '除錯模式(續)',
	page: { 65535: 'comp' },
	type: 1,
	once: function()
	{
		if(!AN.box.debugMode) return;

		AN.shared('log');
		//AN.shared('addInfo');
		AN.shared('addLink');

		AN.shared('addButton', '移除儲存資料', function()
		{
			if(confirm('確定移除儲存資料?'))
			{
				AN.util.storage(null);
				location.reload();
			}
		});

		AN.shared('addButton', '顯示儲存資料', function()
		{
				if(!$('#an-savedsettings').length)
				{
					AN.shared('box', 'an-savedsettings', '儲存資料', null, 'max');
					AN.util.addStyle('#an-savedsettings { padding: 0 2em; } #an-savedsettings code { display: block; white-space: pre; margin: 1em 0; font-family: Consolas; }');
					$('#an-savedsettings').append('<code></code>');
				}
				$('#an-savedsettings code').text(AN.util.storage().replace(/{[^{]*},?/g, function(sMatch){ return sMatch.replace(/,/g, ',\n'); }));
				AN.shared('gray', true, 'an-savedsettings');
		});

		AN.shared('addButton', '顯示功能列表', function()
		{
				if(!$('#an-functionlist').length)
				{
					AN.shared('box', 'an-functionlist', '功能列表', 600, 400);
					AN.util.addStyle('#an-functionlist textarea { margin: 10px; width: 570px; height: 370px; font-family: Consolas; }');
					$('#an-functionlist').append('<textarea readonly="readonly"></textarea>');

					var sList = '';
					$.each(AN.mod, function(sMod)
					{
						if(!this.fn) return;

						sList += '\r' + sMod + ':\r\r';

						$.each(this.fn, function()
						{
							sList += ' * ' + this.desc + '\r';
						});
					});

					$('#an-functionlist textarea').text(sList);
				}
				AN.shared('gray', true, 'an-functionlist');
		});
	}
}

}};