/*
    Copyright (C) 2008  向日

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// ==UserScript==
// @name Helianthus.Annuus: Main Script
// @namespace http://code.google.com/p/helianthus-annuus/
// @description version 2.x.x_alpha by 向日
// @include http://forum*.hkgolden.com/*
// ==/UserScript==

/*	Some notes for developers:
 *
 *	jQuery - with plugins: jQuery UI, (v)sprintf
 *	Cross-brower - Theoretically. For now I have only tested it on:
    > Maxthon 2 w/ IE 7
    > FF 3 w/ Greasemonkey
    > IE 7 w/ IE7Pro
    > Opera 9.6+
    > Google Chrome 1.0.154.36+ w/ Greasemetal 0.2+
    Please let me know if there is a way to use scripts on other browsers
 *	No base64 encoded data - Not supported by IE 7 [sosad]
 *	Used unsafeWindow on GM - A lot easier for me to write the script
 *
 */

(function()
{
/////////////////// START OF - [Preperation] ///////////////////

var $window = (typeof unsafeWindow != 'undefined') ? unsafeWindow : window;

if(!$window.AN || !$window.AN.initialized) return setTimeout(arguments.callee, 50);

var $ = $window.$;
var AN = $window.AN;

var nStart = $.time();

/////////////////// END OF - [Preperation] ///////////////////
/////////////////// START OF - [Data Collection] ///////////////////

AN.collectData = function()
{
	AN.data.settings1 = $.convertObj(AN.util.cookie('AN_settings1')) || {};
	AN.data.settings2 = $.convertObj(AN.util.cookie('AN_settings2')) || {};

	$.each(AN.main, function()
	{
		for(var i in this.page)
		{
			if(AN.data.settings1[this.page[i] + this.id] === undefined)
			{
				AN.data.settings1[this.page[i] + this.id] = this.defaultOn;
			}
		}

		if(!this.options) return; // continue

		$.each(this.options, function(strOptionName)
		{
			if(AN.data.settings2[strOptionName] === undefined)
			{
				AN.data.settings2[strOptionName] = this.defaultValue;
			}
		});
	});

	$.each(AN.settings, function()
	{
		if(AN.data.settings1['other' + this.id] === undefined && this.type == 'boolean')
		{
			AN.data.settings1['other' + this.id] = this.defaultOn;
		}

		if(!this.options) return; // continue

		$.each(this.options, function(strOptionName)
		{
			if(AN.data.settings2[strOptionName] === undefined)
			{
				AN.data.settings2[strOptionName] = this.defaultValue;
			}
		});
	});
};

/////////////////// END OF - [Data Collection] ///////////////////
/////////////////// START OF - [Functions Excuation] ///////////////////

AN.execFunc = function(booIsFirstTime, jDoc)
{
	AN.temp = { jDoc: jDoc || $() };
	AN.data.benchmark = [];

	if(booIsFirstTime)
	{
		$.each(AN.comp, function(strFnName)
		{
			if(((this.page[0] == 'all' && AN.data.strCurPage != 'special') || $.inArray(AN.data.strCurPage, this.page) != -1) && !this.disabled)
			{
				var numTime = $.time();
				this.once();
				AN.data.benchmark.push([strFnName, ($.time() - numTime)]);
			}
		});
	}

	$.each(AN.main, function()
	{
		if(((AN.data.settings1['all' + this.id] && AN.data.strCurPage != 'special')  || AN.data.settings1[AN.data.strCurPage + this.id]) && !this.disabled)
		{
			if((booIsFirstTime && this.once) || this.infinite)
			{
				try
				{
					var numTime = $.time();
					if(booIsFirstTime && this.once) this.once();
					if(this.infinite) this.infinite.call(AN.temp.jDoc);
					if(booIsFirstTime && this.once2) this.once2();
					AN.data.benchmark.push([this.disp, ($.time() - numTime)]);
				}
				catch(err)
				{
					if(AN.data.strCurPage != 'special')
					{
						AN.shared.log('Please inform the author about this error.');
						AN.shared.log('Error message: ' + err.message);
						if(err.lineNumber) AN.shared.log('Line number: ' + err.lineNumber);
						AN.shared.log('An error occured: ' + this.disp);
					}
				}
			}
		}
	});
};

/////////////////// END OF - [Functions Excuation] ///////////////////
/////////////////// START OF - [Shared Functions] ///////////////////

AN.shared =
{
	addStyle: function(strStyle)
	{
		$('<style type="text/css">' + strStyle + '</style>').prependTo('head');
	},

	getOption: function(strOptionName)
	{
		var objOptionValue = AN.data.settings2[strOptionName];

		if(objOptionValue == 'true')
		{
			return true;
		}
		else if(objOptionValue == 'false')
		{
			return false;
		}
		else if(!isNaN(objOptionValue))
		{
			return Number(objOptionValue);
		}
		else
		{
			return objOptionValue;
		}
	},

	data: function(sName, uValue)
	{
		var oData = $.convertObj(AN.util.cookie('AN_data'));

		if(uValue === undefined)
		{
			if(oData && oData[sName])
			{
				return oData[sName];
			}
			return null;
		}
		else
		{
			if(!oData) oData = {};

			if(uValue === null || uValue === '')
			{
				delete oData[sName];
			}
			else
			{
				oData[sName] = uValue;
			}

			AN.util.cookie('AN_data', oData);
		}
	},

	dataArray: function(sName, uValue)
	{
		if(uValue === undefined)
		{
			var sData = AN.shared.data(sName);
			return (sData) ? sData.toString().split('&AN&') : [];
		}
		else
		{
			if(uValue !== null) uValue = uValue.join('&AN&');
			AN.shared.data(sName, uValue);
		}
	},

	getReplies: function()
	{
		if(AN.temp.arrReplys) return AN.temp.arrReplys;

		AN.temp.arrReplys = [];

		AN.temp.jDoc.find('.repliers').add(AN.temp.jDoc.filter('.repliers'))
		.each(function()
		{
			var jThis = $(this), jA = jThis.find('a:first');
			if(!jA.length) return;

			AN.temp.arrReplys.push(
			{
				sUserId: jA.attr('href').replace(/^[^=]+=/, ''),
				sUserName: jA.html(),
				jTdContent: jThis.find('table:last td:first'),
				jThis: jThis
			});
		});

		return AN.temp.arrReplys;
	},

	getTopicRows: function(jDoc)
	{
		var aTopics = [];

		if(!jDoc)
		{
			if(AN.temp.aTopicRows) return AN.temp.aTopicRows;

			jDoc = AN.temp.jDoc;
			AN.temp.aTopicRows = aTopics;
		}

		jDoc.find('td').each(function()
		{
			if($(this).html().match(/^\s*最後回應時間$/))
			{
				$.each($(this).parent().nextAll('tr:not(.AN_trSticky)'), function()
				{
					var jThis = $(this), jA = jThis.find('a');

					if(jThis.children().length == 1) return;

					aTopics.push(
					{
						jThis: jThis,
						sTopicId: jA.eq(0).attr('href').match(/\d+$/)[0],
						sUserName: jA.filter(':last').html(),
						sTitle: jA.eq(0).html()
					});
				});

				return false;
			}
		});

		return aTopics;
	},

	getCurPageNo: function()
	{
		return Number($('select[name=page]:first > :selected').val());
	},

	isLoggedIn: function()
	{
		if(AN.data.booIsLoggedIn) return AN.data.booIsLoggedIn;

		return AN.booIsLoggedIn = ($('#ctl00_ContentPlaceHolder1_lb_UserName a:first').attr('href').indexOf('login.aspx') == -1);
	},

	getURL: function(numPageNo)
	{
		return location.href.replace(/&page=\d+/, '') +  '&page=' + numPageNo;
	},

	getOpenerInfo: function(fToExec)
	{
		if(AN.data.openerInfo)
		{
			if(AN.data.openerInfo.sId)
			{
				fToExec(AN.data.openerInfo);
			}
			else
			{
				setTimeout(function(){ AN.shared.getOpenerInfo(fToExec); }, 1000);
			}
		}
		else if(AN.shared.getCurPageNo() == 1)
		{
			var objReply = AN.shared.getReplies()[0];
			AN.data.openerInfo = { sId: objReply.sUserId, sName: objReply.sUserName };
			fToExec(AN.data.openerInfo);
		}
		else
		{
			AN.data.openerInfo = {};

			$.get('/view.aspx?message=' + $window.messageid, function(sHTML)
			{
				var $a = $.doc(sHTML).find('.repliers:first a:first');
				AN.data.openerInfo = { sId: $a.attr('href').replace(/[=]+=/, ''), sName: $a.html() };
				fToExec(AN.data.openerInfo);
			});
		}
	},

	blockScreen: function(sId)
	{
		var jGray = $('#AN_divGrayLayer');
		if(jGray.is(':hidden'))
		{
			if(!$.browser.opera) $('html').css('overflow', 'hidden');
			jGray.show().fadeTo('fast', 0.7);
			if(sId)
			{
				if(sId === true) sId = '#AN_divLoading';
				else
				{
					jGray.one('click', function()
					{
						AN.shared.blockScreen(sId);
					});
				}
				$(sId).fadeIn('slow');
			}
		}
		else
		{
			if(!$.browser.opera) $('html').css('overflow', '');
			jGray.add('#AN_divLoading').add($(sId)).fadeOut('slow');
		}
	},

	checkServer: function()
	{
		var aHTML = ['<table id="AN_tableStatus" style="width:100%; text-align: center;"><tr style="background-color: #336699; font-weight: bold"><td style="width: 50%; color: white">伺服器</td><td style="color: white; border-left-width: 1px;">回應時間</td></tr>'];
		var sURL = (location.href.indexOf('aspxerrorpath=') > 0) ? $.sprintf('http://%s/topics.aspx?type=BW', location.hostname) : location.href;

		for(var i=1;i<=8;i++)
		{
			aHTML.push($.sprintf(
			'<tr><td><a style="color: black; text-decoration: none;" href="%s">Forum %s</a></td><td id="AN_tdServer%s" style="border-left-width: 1px;">querying...</td></tr>',
			sURL.replace(/forum\d/i, 'forum' + i), i, i
			));
		};

		aHTML.push('</table>');

		$('#AN_divMiddleBox')
		.children(':first').html('Server Status')
		.end()
		.children(':last').html(aHTML.join(''));

		AN.shared.blockScreen('#AN_divMiddleBox');

		$('#AN_tableStatus').fn(function()
		{
			this.css('margin-top', (259 - this.outerHeight()) / 2);
		});

		var jImg = $(new Image())
		.load(function()
		{
			var jThis = $(this);
			$('#AN_tdServer' + jThis.data('nServer')).html('~' + ($.time() - jThis.data('nTime')) + ' ms');
			jThis.data('bDone', true);
		})
		.error(function()
		{
			var jThis = $(this);
			$('#AN_tdServer' + jThis.data('nServer')).html('DEAD');
			jThis.data('bDone', true);
		});

		AN.data.aServer = [];
		for(var i=0;i<8;i++)
		{
			AN.data.aServer[i] = jImg.clone(true).data('nServer', i+1).data('nTime', $.time()).attr('src', $.sprintf('http://forum%s.hkgolden.com/images/spacer.gif?tId=%s', i+1, $.time()));
		}

		setTimeout(function()
		{
			$.each(AN.data.aServer, function()
			{
				if(!this.data('bDone')) $('#AN_tdServer' + this.data('nServer')).html('Probably DEAD');
			});
		}, 10000);
	}
};

/////////////////// END OF - [Shared Functions] ///////////////////
/////////////////// START OF - [Compulsory Functions] ///////////////////

AN.comp =
{
	addMainStyle:
	{
		page: ['all', 'special'],
		once: function()
		{
			AN.shared.addStyle(' \
			#AN_menuCollection div div { min-width: 80px; color: gray; cursor: pointer; } \
			#AN_menuCollection div div:hover, #AN_menuCollection a:hover { color: YellowGreen !important; } \
			#AN_menuCollection a { color: gray !important; text-decoration: none; } \
			\
			#AN_divTopLeft { position: fixed; top: 50px; left: 0; padding-left: 5px; } \
			#AN_divTopLeft div { border-left: 5px solid gray; padding: 3px 0 3px 5px; font-style: italic; font-size: 12px; } \
			\
			#AN_divLeft { position: fixed; top: 50%; left: 0; text-align: right; } \
			#AN_divLeft div { border: 0 solid gray; padding: 5px 0; font-size: 12px; } \
			#AN_divLeftMiddle { display: none; border-width: 1px 0 !important; padding: 7px 0 !important; } \
			\
			#AN_divRight { position: fixed; top: 15%; right: 0; text-align: left; } \
			#AN_divRight div { border-bottom: 1px solid gray; padding: 10px 5px 3px 0; font-size: 12px; } \
			\
			.AN_spanBox, .AN_spanClickBox { display: inline-block; color: gray; border: 1px solid gray; padding: 1px 2px; cursor: default; } \
			.AN_spanClickBox { cursor: pointer; } \
			.AN_spanClickBox:hover { color: YellowGreen; } \
			.AN_spanLine { display: inline-block; color: gray; border-bottom: 1px dotted gray; margin-bottom: 3px; font-size: 10px; font-style: italic; cursor: pointer } \
			\
			.AN_divBox { display: none; z-index: 3; position: fixed; background-color: #F3F2F1; border: 1px solid black; } \
			.AN_divBoxHeader { padding-left: 3px; background-color: #336699; border-bottom: 1px solid black; color: white; } \
			\
			#AN_divGrayLayer { display: none; z-index: 2; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: gray; opacity: 0.7; filter: alpha(opacity=70); } \
			\
			#AN_divLoading { top: 50%; left: 50%; width: 300px; height: 40px; margin: -25px 0 0 -150px; } \
			#AN_divLoadingHeader { height: 10px; } \
			#AN_divLoadingContent {  line-height: 30px; text-align: center; font-size: 20px; } \
			\
			#AN_divMiddleBox { top: 50%; left: 50%; width: 486px; height: 290px; margin: -150px 0 0 -243px; padding-bottom: 10px; cursor: default; } \
			#AN_divMiddleBoxHeader { height: 20px; } \
			#AN_divMiddleBoxContent { width: 466px; height: 259px; padding: 10px 10px 0 10px; overflow: auto; } \
			#AN_divMiddleBoxContent table { width: 444px; border: 1px solid black; border-collapse: collapse; } \
			#AN_divMiddleBoxContent td { padding: 3px; border: 0 solid black; border-bottom-width: 1px; font-size: 12px; } \
			\
			#AN_divSettingsFrame { top: 5%; height: 90%; left: 50%; width: 800px; margin-left: -400px; } \
			#AN_divAccordion { overflow: hidden; border-bottom: 1px solid black; } \
			#AN_divAccordion h3 { line-height: 25px; height: 25px; margin: 0; padding: 0 5px; background-color: #336699; border-top: 1px solid black; color: white; cursor: pointer; } \
			#AN_divAccordion div { padding: 10px 20px 0; border-top: 1px solid black; overflow: auto; } \
			#AN_divAccordion ul { list-style: none; } \
			#AN_divAccordion li { margin-bottom: 5px; } \
			#AN_divAccordion fieldset { margin-bottom: 10px; } \
			#AN_divFinishButtons { position: absolute; height: 50px; width: 214px; left: 50%; margin-left: -107px; } \
			#AN_divOkButton, #AN_divCancelButton { position: absolute; width: 100px; height: 25px; bottom: 12.5px; border: 1px solid black; line-height: 25px; text-align: center; cursor: pointer; } \
			#AN_divOkButton { left: 0; } \
			#AN_divCancelButton { right: 0; } \
			\
			#AN_divInfo { display: none; position: fixed; bottom: 10px; left: 10px; border: 0 solid gray; border-width: 0 0 1px 1px; font-size: 10px; color: gray; cursor: default; } \
			#AN_divInfoContent { padding: 20px 10px 0 10px; } \
			#AN_divInfoContent div div { display: none; padding: 0 0 5px 0; } \
			#AN_divInfoContent a { color: gray !important; text-decoration: none; } \
			#AN_divInfoContent a:hover { color: YellowGreen !important; } \
			#AN_divInfoFooter { text-align: right; font-weight: bold; } \
			\
			#AN_divLog { display: none; width: 210px; height: 30%; position: fixed; bottom: 0; right: 0; font-size: 10px; color: gray; overflow: hidden; cursor: default; } \
			#AN_divLogHeader { border-bottom: 1px solid gray; font-weight: bold; padding-bottom: 3px; } \
			#AN_divLogContent div { display: none; border-bottom: 1px dotted gray; padding: 5px 5px 5px 0; } \
			\
			.AN_maskedLink { text-decoration: none; } \
			\
			#AN_divAlertBox { display: none; position: absolute; background-color: white; color: red; border: 1px solid red; padding: 1px 2px; } \
			');
		}
	},

	addSharedDiv:
	{
		page: ['all', 'special'],
		once: function()
		{
			$('body').append(' \
			<div id="AN_menuCollection"> \
				<div id="AN_divTopLeft" /> \
				<div id="AN_divLeft"><div id="AN_divLeftMiddle" /></div> \
				<div id="AN_divRight" /> \
			</div> \
			<div id="AN_divGrayLayer" /> \
			<div id="AN_divLoading" class="AN_divBox"><div id="AN_divLoadingHeader" class="AN_divBoxHeader" /><div id="AN_divLoadingContent">Loading...</div></div> \
			<div id="AN_divMiddleBox" class="AN_divBox"><div id="AN_divMiddleBoxHeader" class="AN_divBoxHeader" /><div id="AN_divMiddleBoxContent" /></div> \
			 ');
		}
	},

	addSettings:
	{
		page: ['all'],
		once: function()
		{
			$('<div>Settings</div>').appendTo('#AN_divRight').click(function()
			{
				$('#AN_divSettingsFrame > div').empty();
				AN.collectData();
				AN.func.addSettings();
				AN.shared.blockScreen('#AN_divSettingsFrame');
			});

			$('body').append('<div id="AN_divSettingsFrame" class="AN_divBox"><div id="AN_divAccordion" /><div id="AN_divFinishButtons" /></div>');

			AN.func.addSettings = function()
			{
				AN.data.settingsStructure = {};

				var objPageMap =
				{
					all: '全局設定',
					topics: '標題頁',
					view: '帖子頁',
					profilepage: '用戶資料頁',
					search: '搜尋頁',
					newmessages: '最新貼文頁',
					'default': '主論壇頁',
					sendpm: '私人訊息發送頁',
					special: '特殊頁',
					other: '其他選項'
				}

				var objTypeMap =
				{
					1: '原創功能',
					2: '優化、修正原有功能',
					3: '加入物件',
					4: '移除物件',
					5: '美化頁面',
					6: 'Helianthus.Annuus'
				}

				$.each(objPageMap, function(strPageName)
				{
					AN.data.settingsStructure[strPageName] = {};
					$.each(objTypeMap, function(strTypeId)
					{
						AN.data.settingsStructure[strPageName][strTypeId] = {};
					});
				});

				$.each(AN.main, function()
				{
					for(var i in this.page)
					{
						AN.data.settingsStructure[this.page[i]][this.type][this.id] =
						{
							disp: this.disp,
							options: this.options,
							disabled: (this.disabled) ? true : false
						}
					}
				});

				$.each(AN.settings, function()
				{
					AN.data.settingsStructure['other'][6][this.id] =
					{
						disp: this.disp,
						options: this.options,
						type: this.type,
						fn: this.fn
					}
				});

				$.each(AN.data.settingsStructure, function(strPageName)
				{
					var arrDivHTML = ['<div id="AN_div_' + strPageName + '">'];
					$.each(this, function(strType)
					{
						var num = 0; for(var i in this) num++; if(num == 0) return; // any better way to do this?

						arrDivHTML.push($.sprintf('<fieldset><legend>%s</legend><ul>', objTypeMap[strType]));
						$.each(this, function(strFnId)
						{
							if(!this.type || this.type == 'boolean')
							{
								var strSwitchId = 'AN_switch_' + strPageName + strFnId;
								var strChecked = (AN.data.settings1[strPageName + strFnId]) ? 'checked="checked"' : '';
								var sDisabled = (this.disabled) ? 'disabled="disabled"' : '';
								arrDivHTML.push($.sprintf('<li><input class="AN_switch" type="checkbox" id="%s" %s %s />', strSwitchId, strChecked, sDisabled));
								arrDivHTML.push($.sprintf('<label for="%s">%s</label>', strSwitchId, this.disp));
							}
							else if(this.type == 'string')
							{
								arrDivHTML.push($.sprintf('<li>%s: <input type="text" value="%s" style="width: 50%" onclick="this.select()" />', this.disp, this.fn()));
							}
							else if(this.type == 'button')
							{
								AN.func['settings' + strFnId] = this.fn;
								arrDivHTML.push($.sprintf('<li><input type="button" value="%s" onclick="AN.func.settings%s()" />', this.disp, strFnId));
							}

							if(this.options)
							{
								arrDivHTML.push('&nbsp;&nbsp;&nbsp;[&nbsp;');

								$.each(this.options, function(strOptionName)
								{
									var strOptionId = 'AN_option_' + strOptionName;
									if(this.type == 'boolean')
									{
										var strOptionValue = (AN.data.settings2[strOptionName].toString() == 'true') ? 'checked="checked"' : '';

										arrDivHTML.push($.sprintf('<input class="AN_option" type="checkbox" id="%s" %s />', strOptionId, strOptionValue));
										arrDivHTML.push($.sprintf('<label for="%s">%s</label>', strOptionId, this.disp));
									}
									else if(this.type == 'string')
									{
										var strOptionValue = AN.data.settings2[strOptionName];
										arrDivHTML.push($.sprintf('%s: <input class="AN_option" type="text" id="%s" value="%s" />', this.disp, strOptionId, strOptionValue));
									}
									else if(this.type  == 'select')
									{
										var strOptionValue = AN.data.settings2[strOptionValue];

										arrDivHTML.push($.sprintf('%s: <select class="AN_option" id="%s">', this.disp, strOptionId));
										$.each(this.choices, function()
										{
											var strSelected = (this == strOptionValue) ? 'selected="selected"' : '';
											arrDivHTML.push($.sprintf('<option %s value="%s">%s</option>', strSelected, this, this));
										});
										arrDivHTML.push('</select>');
									}
									arrDivHTML.push('&nbsp;');
								});

								arrDivHTML.push(']</li>');
							}

						});
						arrDivHTML.push('</ul></fieldset>');
					});
					arrDivHTML.push('</div>');

					$('#AN_divAccordion')
					.append('<h3>' + objPageMap[strPageName] + '</h3>')
					.append(arrDivHTML.join(''))
				});

				$('#AN_divAccordion')
				.fn(function()
				{
					var numFrameH = (window.outerHeight) ? window.innerHeight * 0.9 : $(window).height() * 0.9;

					this.height(numFrameH - 50);
					this.children('div').height(numFrameH - 50 - 10 - (25 + 1) * this.children('h3').length)
					.filter(':gt(0)').hide();

					this.children('h3').click(function()
					{
						$(this).next(':hidden').slideDown('slow').siblings('div:visible').slideUp('slow');
					})
					.filter(':first').css('borderTop', '0');
				});

				$('#AN_divFinishButtons')
				.append('<div id="AN_divOkButton">確定</div><div id="AN_divCancelButton">取消</div>')
				.children(':first-child').click(function()
				{
					var objSettings1 = {};

					$('#AN_divAccordion > div').each(function()
					{
						$.each($(this).find('.AN_switch'), function()
						{
							objSettings1[this.id.replace('AN_switch_', '')] = (this.checked) ? 1 : 0;
						});
					});
					AN.util.cookie('AN_settings1', objSettings1);

					var objSettings2 = {};

					$('#AN_divAccordion .AN_option').each(function()
					{
						var objOptionMap =
						{
							checkbox: this.checked,
							text: this.value,
							select: $(this).find(':selected').val()
						}
						var strObjName = ($(this).is('input')) ? this.type : this.nodeName.toLowerCase();
						objSettings2[this.id.replace('AN_option_', '')] = objOptionMap[strObjName];
					});
					AN.util.cookie('AN_settings2', objSettings2);

					location.reload();
				})
				.next().click(function()
				{
					AN.shared.blockScreen('#AN_divSettingsFrame');
				});
			}
		}
	},

	addBenchmarkResult:
	{
		page: ['all'],
		once: function()
		{
			$('<div>Benchmark</div>').appendTo('#AN_divRight').click(function()
			{
				var aHTML = ['<table><tr style="background-color: #336699; font-weight: bold"><td style="color: white">功能</td><td style="color: white; border-left-width: 1px; text-align: right">執行時間</td></tr>'];
				var aResult = AN.data.benchmark;
				var nLast = aResult.length - 1;
				var nSum = 0;

				$.each(aResult, function(i)
				{
					if(i != nLast) nSum += this[1];
					var sec = (this[1] == 0) ? 'ε' : this[1];
					aHTML.push($.sprintf('<tr><td>%s</td><td style="border-left-width: 1px; text-align: right">%s ms</td></tr>', this[0], sec));
				});
				aHTML.push($.sprintf('<tr><td>Sum</td><td style="border-left-width: 1px; text-align: right">%s ms</td></tr>', nSum));
				aHTML.push($.sprintf('<tr><td>Difference</td><td style="border-left-width: 1px; text-align: right">%s ms</td></tr>', aResult[nLast][1] - nSum));
				aHTML.push('</table>');

				$('#AN_divMiddleBox')
				.children(':first').html('Benchmark Result')
				.end()
				.children(':last').html(aHTML.join(''));

				AN.shared.blockScreen('#AN_divMiddleBox');
			});
		}
	},

	addInfo:
	{
		page: ['all'],
		once: function()
		{
			AN.shared.addInfo = function(strInfo, booPutAtTop)
			{
				if(AN.data.settings1.other1) $('#AN_divInfo:hidden').fadeIn('fast');
				$('<div>' + strInfo + '</div>').fn(function()
				{
					(booPutAtTop) ? this.prependTo('#AN_divInfoContent > :first') : this.appendTo('#AN_divInfoContent > :last');
					this.fadeIn('slow');
				});
			};

			$('<div>Info</div>').appendTo('#AN_divRight').click(function()
			{
				$('#AN_divInfo').fn(function()
				{
					this.is(':hidden') ? this.fadeIn('fast') : this.fadeOut('slow');
				});
			});

			$('body').append('<div id="AN_divInfo"><div id="AN_divInfoContent"><div /><div /></div><div id="AN_divInfoFooter">Info</div></div>');
		}
	},

	addLog:
	{
		page: ['all'],
		once: function()
		{
			AN.shared.log = function(strLog)
			{
				if(AN.data.settings1.other2) $('#AN_divLog:hidden').fadeIn('fast');

				var dDate = new Date();
				var hour = dDate.getHours();
				if(hour < 10) hour = '0' + hour;
				var min = dDate.getMinutes();
				if(min < 10) min = '0' + min;

				$($.sprintf('<div>%s:%s %s</div>', hour, min, strLog)).prependTo('#AN_divLogContent').slideDown('slow');
			};

			AN.shared.log2 = function(strLog)
			{
				if(AN.shared.getOption('bDetailedLog')) AN.shared.log(strLog);
			};

			$.fn.debug = function(strToEval)
			{
				AN.shared.log('debug: ' + eval('(' + strToEval + ')'));
				return this;
			};

			$('<div>Log</div>').appendTo('#AN_divRight').click(function()
			{
				$('#AN_divLog').fn(function()
				{
					this.is(':hidden') ? this.fadeIn('fast') : this.fadeOut('slow');
				});
			});

			$('body').append('<div id="AN_divLog"><div id="AN_divLogHeader">Log</div><div id="AN_divLogContent" /></div>');
		}
	},

	addAbout:
	{
		page: ['all'],
		once: function()
		{
			$('<div>About</div>').appendTo('#AN_divRight').click(function()
			{
				$('#AN_divMiddleBox')
				.children(':first').html('About')
				.end()
				.children(':last').html(' \
				<h1 style="text-align: center">Helianthus.Annuus</h1> \
				<hr style="color: black" /> \
				<h3>Version: 2.x.x_alpha</h3> \
				<h3>Author: 向日</h3> \
				<h3>Code Liscense: <a href="http://www.gnu.org/licenses/gpl.html" target="_blank" style="color: black">GNU General Public License v3</a></h3> \
				<h5 style="position: absolute; bottom: 5px; right: 5px; margin: 0;">Copyright &copy; 2008  向日</h5> \
				');

				AN.shared.blockScreen('#AN_divMiddleBox');
			});
		}
	},

	convertData:
	{
		disabled: true,
		page: ['view'],
		once: function()
		{
			var arrMatch;

			$.each(AN.shared.getReplies(), function(i, objReply)
			{
				if(objReply.sUserId == '148720') // me :P
				{
					objReply.jTdContent.find('a').each(function(i, nodA)
					{
						if(nodA.href.indexOf('http://helianthus-annuus.googlecode.com/svn/data/') >= 0)
						{
							$.getData(nodA.href, function(strHTML)
							{
								$(nodA).replaceWith(strHTML);
							});
						}
					});
				}
			});
		}
	}
};

/////////////////// END OF - [Compulsory Functions] ///////////////////
/////////////////// START OF - [Special Settings] ///////////////////

AN.settings =
{
	autoShowInfo:
	{
		disp: '自動顯示資料視窗 (info)',
		type: 'boolean',
		defaultOn: true,
		id: 1
	},

	autoShowLog:
	{
		disp: '自動顯示記錄視窗 (log)',
		type: 'boolean',
		defaultOn: true,
		id: 2,
		options: { bDetailedLog: { disp: '顯示詳細記錄', defaultValue: true, type: 'boolean' } }
	},

	exportSettings1:
	{
		disp: '現時的功能開關設置',
		type: 'string',
		id: 3,
		fn: function()
		{
			return AN.util.cookie('AN_settings1') || '請先儲存一次設定';
		}
	},

	exportSettings2:
	{
		disp: '現時的功能特殊設置',
		type: 'string',
		id: 4,
		fn: function()
		{
			return AN.util.cookie('AN_settings2') || '請先儲存一次設定';
		}
	},

	importSettings1:
	{
		disp: '匯入功能開關設置',
		type: 'button',
		id: 5,
		fn: function()
		{
			var sCookie = prompt('輸入功能開關設置', '');
			if(sCookie)
			{
				var oCookie = $.convertObj(sCookie.split(','));
				$.each(oCookie, function(sFnId)
				{
					if(AN.data.settings1[sFnId] === undefined) delete oCookie[sFnId];
				});
				AN.util.cookie('AN_settings1', oCookie);
				location.reload();
			}
		}
	},

	importSettings2:
	{
		disp: '匯入功能特殊設置',
		type: 'button',
		id: 6,
		fn: function()
		{
			var sCookie = prompt('輸入功能特殊設置', '');
			if(sCookie)
			{
				var oCookie = $.convertObj(sCookie.split(','));
				$.each(oCookie, function(sName)
				{
					if(AN.data.settings2[sName] === undefined) delete oCookie[sName];
				});
				AN.util.cookie('AN_settings2', oCookie);
				location.reload();
			}
		}
	},

	deleteSettings1:
	{
		disp: '移除功能開關設置並回復到預設值',
		type: 'button',
		id: 7,
		fn: function()
		{
			if(confirm('確定移除?'))
			{
				AN.util.cookie('AN_settings1', null);
				location.reload();
			}
		}
	},

	deleteSettings2:
	{
		disp: '移除功能特殊設置並回復到預設值',
		type: 'button',
		id: 8,
		fn: function()
		{
			if(confirm('確定移除?'))
			{
				AN.util.cookie('AN_settings2', null);
				location.reload();
			}
		}
	}
};

/////////////////// END OF - [Special Settings] ///////////////////
/////////////////// START OF - [Main Functions] ///////////////////

AN.main =
{
	autoRedirect:
	{
		disp: '自動轉向正確頁面',
		type: 1,
		page: ['default'],
		defaultOn: true,
		id: 1,
		once: function()
		{
			if(document.referrer.indexOf('/login.aspx') > 0) location.replace('/topics.aspx?type=BW');
			else if(!location.pathname.match(/^\/(?:default.aspx)?$/i)) location.replace(location.href); // not using location.reload() because an error would occur on IE 7
		}
	},

	tempFunctions:
	{
		disp: '暫存功能',
		type: 1,
		page: ['all'],
		defaultOn: true,
		id: 45,
		options:
		{
			bRemoveTextAd: { disp: '移除文字廣告', defaultValue: true, type: 'boolean' },
			bFixDeadSmileys: { disp: '移除回覆格中的表情圖示死圖', defaultValue: true, type: 'boolean' }
		},
		once: function()
		{
			if(AN.shared.getOption('bRemoveTextAd'))
			{
				$('#ctl00_ContentPlaceHolder1_MiddleAdSpace1').fn(function()
				{
					this.children('table:first').prevAll().remove();
					var nodSpan = this.get(0);
					if(nodSpan.firstChild.nodeType == 3) nodSpan.removeChild(nodSpan.firstChild);
				});
			}
/*
			if(AN.shared.getOption('bFixDeadSmileys'))
			{
				$($window).load(function()
				{
					$('#greenhatxmas').find('img').each(function()
					{
						if((this.fileSize !== undefined) ? (this.fileSize == -1) : (this.complete && !this.width)) $(this).remove();
					});
				});
			}
*/
		}
	},

	removeLeftArticles:
	{
		disp: '移除左側最近刊登的文章',
		type: 4,
		page: ['all'],
		defaultOn: true,
		id: 2,
		once: function()
		{
			$('td').each(function()
			{
				var jThis = $(this);
				if(jThis.css('fontSize') == '8pt')
				{
					jThis.parents('tr:eq(1)').remove();
					return false;
				}
			});
		}
	},

	removeDuplicateImages:
	{
		disp: '移除同一回覆內重複的圖片',
		type: 4,
		page: ['view'],
		defaultOn: false,
		id: 34,
		infinite: function()
		{
			$.each(AN.shared.getReplies(), function()
			{
				var arrSrcs = [];
				this.jTdContent.find('img[onLoad]').each(function()
				{
					if($(this).width() <= 100) return;

					if($.inArray(this.src, arrSrcs) == -1) arrSrcs.push(this.src);
					else $(this).parent().css('text-decoration', 'none').html('<span class="AN_spanLine">重複圖片已被移除</span>');
				});
			});
		}
	},

	removeDeadImages:
	{
		disp: '移除死圖',
		type: 4,
		page: ['view'],
		defaultOn: true,
		id: 37,
		infinite: function()
		{
			var imgTemp = new Image();
			$(imgTemp).error(function()
			{
				$(this).data('nodTarget').parent().css('text-decoration', 'none').html('<span class="AN_spanLine">死圖已被移除</span>');
			});

			AN.temp.testImages = [];
			$.each(AN.shared.getReplies(), function()
			{
				this.jTdContent.find('img[onLoad]').each(function()
				{
					AN.temp.testImages.push($(imgTemp).clone(true).data('nodTarget', $(this)).attr('src', this.src));
				});
			});
		}
	},

	maskUserImages:
	{
		disp: '屏蔽圖片 (點擊顯示)',
		type: 1,
		page: ['view'],
		defaultOn: false,
		id: 35,
		once: function()
		{
			$('<div>Unmask Images</div>').appendTo('#AN_divTopLeft').click(function()
			{
				AN.data.unmasked = true;
				$('.AN_maskedLink > :first-child').show().each(function(){ $window.DrawImage(this, true); }).next().remove();
				AN.shared.log('All images are unmasked.');
				$(this).fadeOut('slow');
			});
		},
		infinite: function()
		{
			if(AN.data.unmasked) return;

			$.each(AN.shared.getReplies(), function()
			{
				this.jTdContent
				.find('img[onLoad]').hide().after('<span class="AN_spanClickBox">點擊顯示圖片</span>')
				.parent().addClass('AN_maskedLink').one('click', function(event)
				{
					event.preventDefault();

					this.blur();
					$(this).removeClass('AN_maskedLink').children(':first').fadeIn('slow').next().remove();
					if(AN.data.settings1.view11) $window.DrawImage(this.firstChild, true);
				});
			});
		}
	},

	optimiseForumLinks:
	{
		disp: '美化論壇連結',
		type: 5,
		page: ['all'],
		defaultOn: true,
		id: 3,
		options: { strLinkColor: { disp: '連結顏色(#RRGGBB)', defaultValue: '#1066d2', type: 'string' } }, // to be improved
		once: function()
		{
			var strLinkColor = AN.shared.getOption('strLinkColor');
			AN.shared.addStyle(' \
			a:link { color: ' + strLinkColor + '} \
			.aForumLink { text-decoration: none; } \
			');

			$('#ctl00_ContentPlaceHolder1_lb_bloglink span').css('text-decoration', 'none');
			$('#ctl00_ContentPlaceHolder1_lb_UserName > a').css('color', strLinkColor);
		},
		infinite: function()
		{
			var strLinkColor = AN.shared.getOption('strLinkColor');

			this.find('a').filter(function()
			{
				return (this.href.match(/javascript:|http:\/\/forum\d+\.hkgolden\.com/i));
			})
			.addClass('aForumLink')
			.filter(function()
			{
				return (this.href.match(/javascript:|(?:blog|default|newmessages|topics)\.aspx/i) && !this.href.match(/redhotpage=|fanti=/i));
			})
			.css('color', strLinkColor);
		}
	},

	removeRedHotRanking:
	{
		disp: '移除紅人榜 (Admin已移除)',
		disabled: true,
		type: 4,
		page: ['topics'],
		defaultOn: false,
		id: 4,
		once: function()
		{
			$('#ctl00_ContentPlaceHolder1_HotPeoples').prev().andSelf().remove();
		}
	},

	useBetterFavicon:
	{
		disp: '採用更好的favicon (may not work)',
		type: 5,
		page: ['all'],
		defaultOn: true,
		id: 5,
		once: function()
		{
			$('head').append('<link rel="shortcut icon" href="http://helianthus-annuus.googlecode.com/svn/other/hkg.ico" />');
		}
	},

	optimisePageLinks:
	{
		disp: '優化上下頁連結地址',
		type: 2,
		page: ['view'],
		defaultOn: true,
		id: 6,
		infinite: function()
		{
			this.find('a[href*=&highlight_id=0]').each(function()
			{
				this.href = $(this).attr('href').replace(/&highlight_id=0/i, '');
			});
		}
	},

	removeRedHotRecord:
	{
		disp: '移除紅人榜記錄',
		type: 4,
		page: ['profilepage'],
		defaultOn: false,
		id: 7,
		once: function()
		{
			$('#ctl00_ContentPlaceHolder1_HotPeoples').next().andSelf().remove();
		}
	},

	searchOnNewPage:
	{
		disp: '搜尋開新頁',
		type: 2,
		page: ['topics', 'search', 'newmessages'],
		defaultOn: true,
		id: 8,
		once: function()
		{
			$window.Search = function()
			{
				var strType = $('#st option:selected').val();
				if(strType !== '')
				{
					window.open('search.aspx?st=' + strType + '&searchstring=' + escape($('#searchstring').val()), '_blank');
					$('#searchstring').val('');
				}
			};
		}
	},

	fixSearchLink:
	{
		disp: '修正會員文章搜尋連結',
		type: 2,
		page: ['topics', 'search', 'newmessages', 'profilepage'],
		defaultOn: true,
		id: 9,
		infinite: function()
		{
			$.each(AN.shared.getTopicRows(), function()
			{
				this.jThis.find('a:last').attr('href', '/search.aspx?st=A&searchstring=' + escape(this.sUserName));
			});
		}
	},

	changeQuoteStyle:
	{
		disp: '改變引用風格',
		type: 1,
		page: ['view'],
		defaultOn: false,
		id: 10,
		options: { booOuterOnly: { disp: '只顯示最外層的引用', defaultValue: true, type: 'boolean' } },
		once: function()
		{
			AN.data.bOuterOnly = AN.shared.getOption('booOuterOnly');

			$('<div id="AN_divToggleAllQuotes">Toggle Outer Quotes</div>').appendTo('#AN_divTopLeft').click(function()
			{
				AN.data.bOuterOnly = !AN.data.bOuterOnly;
				AN.func.toggleQuote({ jTarget: $('.AN_bOutermost'), bOuterOnly: AN.data.bOuterOnly });
			});

			AN.func.toggleQuote = function(oData)
			{
				var bOuterOnly = (oData.bOuterOnly === undefined) ? (oData.jTarget.html() == '-') : oData.bOuterOnly;

				if(bOuterOnly)
				{
					oData.jTarget.each(function()
					{
						$(this)
						.html('+')
						.parents('div:first').css('marginBottom', '5px')
						.end()
						.parents('blockquote:first').children('div:last').children('blockquote').hide();
					});
				}
				else
				{
					oData.jTarget.each(function()
					{
						$(this)
						.html('-')
						.parents('div:first').css('marginBottom', '2px')
						.end()
						.parents('blockquote:first').children('div:last').children('blockquote').show();
					});
				}
			};

			AN.shared.addStyle(' \
			blockquote { margin: 5px 0 5px 0; border: 1px solid black; } \
			blockquote blockquote { margin-top: 0; border-right: 0; } \
			blockquote div { padding: 0 0 5px 2px; } \
			.AN_quoteHeader { padding: 0 3px; color: white; font-size: 12px; background-color: #336699; border-bottom: 1px solid black; margin-bottom: 2px; } \
			.AN_quoteHeader span { display: inline-block; width: 49.9%; } \
			.AN_quoteHeader b { cursor: pointer; } \
			');
		},
		infinite: function()
		{
			this.find('blockquote').each(function()
			{
				$quote = $(this);

				while(true)
				{
					var nodTemp = this.nextSibling;

					if(nodTemp)
					{
						if($(nodTemp).is('br') || (nodTemp.nodeValue && nodTemp.nodeValue.match(/^\s+$/)))
						{
							$(nodTemp).remove();
							continue;
						}
					}
					else
					{
						if($quote.parent('div').length) // is an empty quote && not outermost
						{
							$quote.parent().replaceWith($quote.children());
							return;
						}
					}
					break;
				}

				$quote.prepend('<div class="AN_quoteHeader"><span>引用:</span><span style="text-align:right;"><b onclick="AN.func.toggleQuote({ jTarget: $(this) })">-</b></span>');

				if(!$quote.find('blockquote').length) // innermost or single-layer
				{
					$quote.find('div:first > span:last').remove();
				}
				if(!$quote.parent('div').length) // outermost or single-layer
				{

					$quote.find('div:first').css('margin-bottom', '5px').find('b').addClass('AN_bOutermost');
				}
			});

			if(AN.shared.getOption('booOuterOnly')) AN.func.toggleQuote({ jTarget: this.find('.AN_bOutermost'), bOuterOnly: true });
		}
	},

	optimiseImageResizing:
	{
		disp: '優化圖片縮放',
		type: 2,
		page: ['view'],
		defaultOn: true,
		id: 11,
		options:
		{
			numImageWidth: { disp: '最大闊度', defaultValue: 600, type: 'string' },
			numMaxRatio: { disp: '最大長闊比例(1:X)', defaultValue: 7, type: 'string' }
		},
		once: function()
		{
			$window.DrawImage = function(nodImg, booForceResize, booIgnoreRatio)
			{
				if(!$(nodImg.offsetParent).width() || (AN.data.settings1.view35 && !booForceResize)) return; // for ajaxify & maskedImages

				nodImg.setAttribute('onLoad','');

				var imgTemp = new Image();
				imgTemp.src = nodImg.src;

				var numWidth = imgTemp.width;
				if(!numWidth)
				{
					nodImg.alt = 'DEADIMAGE';
					return; // dead, FF
				}

				var numHeight = imgTemp.height;

				var numMaxWidth = AN.shared.getOption('numImageWidth');
				var numMaxWidthAllowed = $(nodImg.offsetParent).width() - nodImg.offsetLeft - 5;
				if(numMaxWidth > numMaxWidthAllowed) numMaxWidth = numMaxWidthAllowed;

				if(numWidth > 100) nodImg.style.display = 'block';

				if(numHeight / numWidth > AN.shared.getOption('numMaxRatio') && !booIgnoreRatio)
				{
					nodImg.width = 30;
					nodImg.height = 30;
					nodImg.title = ';)';
					$(nodImg).parent().css('text-decoration', 'none').after(
					$($.sprintf('<span class="AN_spanLine">圖片長闊比例 &gt; %s, 金箍棒已被壓成廢鐵!</span>', AN.shared.getOption('numMaxRatio')))
					.click(function()
					{
						$window.DrawImage($(this).prev().children().get(0), true, true);
						$(this).remove();
					})
					);
				}
				else if(numWidth <= numMaxWidth)
				{
					nodImg.width = numWidth;
					nodImg.height = numHeight;
					nodImg.title = '[AN] ori:' + numWidth + 'x' + numHeight + ' now: the same';
				}
				else
				{
					nodImg.width = numMaxWidth;
					nodImg.height = Math.round(numHeight * numMaxWidth / numWidth);
					nodImg.title = '[AN] ori:' + numWidth + 'x' + numHeight + ' now:' + nodImg.width + 'x' + nodImg.height;
				}
			};
		},
		infinite: function()
		{
			if(AN.data.settings1.view35) return;

			$.each(AN.shared.getReplies(), function()
			{
				this.jTdContent.find('img[onLoad]').each(function()
				{
					if(this.complete) $window.DrawImage(this, true);
					else this.alt = 'DEADIMAGE';
				});
			});
		}
	},

	addQuickLinkToTopicsPage:
	{
		disp: '加入前往吹水台的快速連結',
		type: 3,
		page: ['all'],
		defaultOn: true,
		id: 12,
		once: function()
		{
			$('#AN_divLeftMiddle').show().append('<a href="/topics.aspx?type=BW">Topics</a>');
			$('#AN_divLeft').fn(function(){ this.css('margin-top', -(this.outerHeight() / 2)); });
		}
	},

	addGoToLinks:
	{
		disp: '加入前往最頂/底的按扭',
		type: 3,
		page: ['view'],
		defaultOn: true,
		id: 13,
		once: function()
		{
			$('#AN_divLeft')
			.prepend('<div onclick="scrollTo(0,0)">Top</div>')
			.append('<div onclick="scrollTo(0,9999999)">Bottom</div>')
			.fn(function()
			{
				if($('#AN_divLeftMiddle').is(':hidden')) this.children(':first').css('border-bottom-width', '1px');
				this.css('margin-top', -(this.outerHeight() / 2));
			});
		}
	},

	changeQuickReplyStyle:
	{
		disp: '改變快速回覆的風格',
		type: 1,
		page: ['view'],
		defaultOn: false,
		id: 14,
		options: { booToggleOnClick: { disp: '心須點擊才顯示/隱藏', defaultValue: true, type: 'boolean' } },
		once: function()
		{
			if(!AN.shared.isLoggedIn()) return;

			var $divQR = $('#newmessage');

			$divQR
			.prevAll('br:lt(2)').remove()
			.end()
			.find('table:eq(2) tr:lt(2)').hide()
			.end()
			.css(
			{
				position: 'fixed',
				width: '806px',
				filter: 'alpha(opacity=70)',
				opacity: '0.7',
				left: ($('html').outerWidth() - $divQR.outerWidth()) / 2 + 'px',
				bottom: '0'
			})
			.find('tr:eq(2)').attr('id', 'AN_divToToggle').hide()
			.end()
			.find('td:eq(1)')
			.css({ textAlign: 'center', cursor: 'pointer' })
			.fn(function()
			{
				if(AN.shared.getOption('booToggleOnClick'))
				{
					this.text('點擊顯示/隱藏快速回覆');
					this.click(function(){ $('#AN_divToToggle').toggle(); });
				}
				else
				{
					this.text('快速回覆');
					$divQR.hover(
						function()
						{
							$('#AN_divToToggle').show();
						},
						function()
						{
							$('#AN_divToToggle').hide();
						}
					);
				}
			});

			$window.OnQuoteSucceeded = function(result)
			{
				$('#ctl00_ContentPlaceHolder1_messagetext').val(unescape(result) + '\n');
				$('#AN_divToToggle').show();
			};
		}
	},

	convertSmileys:
	{
		disp: '轉換表情碼為圖片',
		type: 1,
		page: ['topics', 'search', 'newmessages', 'profilepage'],
		defaultOn: true,
		id: 15,
		infinite: function()
		{
			var regSmiley = /([#[](hehe|love|ass|sosad|good|hoho|kill|bye|adore|banghead|bouncer|bouncy|censored|flowerface|shocking|photo|fire|yipes|369|bomb|slick|no|kill2|offtopic)[\]#])/g;

			var arrConvertMap =
			[
				{ regex: /(O:-\))/g, result: 'angel' },
				{ regex: /(xx\()/g, result: 'dead' },
				{ regex: /(:\))/g, result: 'smile' },
				{ regex: /(:o\))/g, result: 'clown' },
				{ regex: /(:-\()/g, result: 'frown' },
				{ regex: /(:~\()/g, result: 'cry' },
				{ regex: /(;-\))/g, result: 'wink' },
				{ regex: /(:-\[)/g, result: 'angry' },
				{ regex: /(:-])/g, result: 'devil' },
				{ regex: /(:D)/g, result: 'biggrin' },
				{ regex: /(:O)/g, result: 'oh' },
				{ regex: /(:P)/g, result: 'tongue' },
				{ regex: /(^3^)/g, result: 'kiss' },
				{ regex: /(\?_\?)/g, result: 'wonder' },
				{ regex: /(#yup#)/g, result: 'agree' },
				{ regex: /(#ng#)/g, result: 'donno' },
				{ regex: /(#oh#)/g, result: 'surprise' },
				{ regex: /(#cn#)/g, result: 'chicken' },
				{ regex: /(Z_Z)/g, result: 'z' },
				{ regex: /(@_@)/g, result: '@' },
				{ regex: /(\?\?\?)/g, result: 'wonder2' },
				{ regex: /(fuck)/g, result: 'fuck' }
			];

			$.each(AN.shared.getTopicRows(), function()
			{
				var $a = this.jThis.find('td:eq(1) a:first');
				var strTemp = $a.html();

				strTemp = strTemp.replace(regSmiley, '<img style="border-width:0px;vertical-align:middle" src="/faces/$2.gif" alt="$1" />');

				$.each(arrConvertMap, function()
				{
					strTemp = strTemp.replace(this.regex, '<img style="border-width:0px;vertical-align:middle" src="/faces/' + this.result + '.gif" alt="$1" />');
				});

				$a.html(strTemp);
			});
		}
	},

	removeForumList:
	{
		disp: '移除討論區選單',
		type: 4,
		page: ['topics', 'search', 'newmessages'],
		defaultOn: true,
		id: 16,
		once: function()
		{
			$('#forum_list').parents('table:first').remove();
		}
	},

	optimiseSearchRow:
	{
		disp: '優化搜尋列',
		type: 2,
		page: ['topics', 'search', 'newmessages'],
		defaultOn: true,
		id: 17,
		once: function()
		{
			$('#aspnetForm').css('margin', '0'); // for IE 7

			$('#searchstring').parents('td:first').fn(function()
			{
				this.css('text-align', 'right').find('img').css('vertical-align', 'bottom')

				if(this.find('p').length) this.get(0).innerHTML = this.find('p').html(); // topics & newmessages // we have a problem here on IE 7 becoz of form id=frmSearch
				else this.parent().next().remove(); // search
			});
		}
	},

	optimiseSelectBoxPosition:
	{
		disp: '修正下方選單位置 (IE用戶專用)',
		type: 2,
		page: ['topics', 'search', 'newmessages'],
		defaultOn: false,
		id: 18,
		once: function()
		{
			$('#filter').css({ position: 'relative', top: '9px' });
		}
	},

	addFloorNumber:
	{
		disp: '加入樓層編號',
		type: 3,
		page: ['view'],
		defaultOn: true,
		id: 19,
		infinite: function()
		{
			var nCurPageNo = AN.shared.getCurPageNo();
			if(!AN.data.oFloor || AN.data.oFloor.nPageNo != nCurPageNo)
			{
				AN.data.oFloor =
				{
					nPageNo: nCurPageNo,
					nFloorNo: (nCurPageNo == 1) ? 0 : 50 * (nCurPageNo - 1) + 1
				}
			}

			$.each(AN.shared.getReplies(), function()
			{
				this.jThis.find('span:last').append($.sprintf(' <span class="AN_spanBox">#%s</span>', AN.data.oFloor.nFloorNo++));
			});
		}
	},

	alertOnSuspiciousLinks:
	{
		disp: '提示可疑連結',
		type: 1,
		page: ['view'],
		defaultOn: true,
		id: 20,
		once: function()
		{
			$('body').append('<div id="AN_divAlertBox" />');
		},
		infinite: function()
		{
			$.each(AN.shared.getReplies(), function()
			{
				this.jTdContent.find('a').each(function()
				{
					var aMatch = this.href.match(/[?&](?:r(?:ef(?:er[^=]+)?)?|uid)=|logout|shortlink|(?:tinyurl|urlpire|linkbucks|seriousurls|qvvo|viraldatabase|youfap)\.com/i);
					if(aMatch)
					{
						$(this).data('keyword', aMatch[0]).hover(
							function()
							{
								var jThis = $(this);
								var oOffset = jThis.offset();
								$('#AN_divAlertBox').fn(function()
								{
									this
									.html('發現可疑連結! keyword: <span style="color: black">' + jThis.data('keyword') + '</span>')
									.show()
									.css({ top: (oOffset.top - this.height() - 5), left: oOffset.left });
								});
							},
							function()
							{
								$('#AN_divAlertBox').fadeOut('slow');
							}
						);
					}
				});
			});
		}
	},

	enableWideScreen:
	{
		disp: '拉闊頁面',
		type: 1,
		page: ['all'],
		defaultOn: false,
		id: 21,
		once: function()
		{
			$('table,td').filter(function(){ return this.width.match(/^(?:955|937|806|800|792)$/); }).width('100%');
		}
	},

	removeDeadAvatar:
	{
		disabled: true,
		disp: '移除高級會員頭像死圖 (Admin已修正)',
		type: 4,
		page: ['view'],
		defaultOn: false,
		id: 22,
		infinite: function()
		{
			this.find('img[alt=Logo]')
			.filter(function()
			{
				return (!this.width || !this.complete);
			})
			.each(function()
			{
				$(this).parents('tr:first').remove();
			});
		}
	},

	removeMainBGTopRow:
	{
		disp: '移除繁簡轉換及分享這頁',
		type: 4,
		page: ['all'],
		defaultOn: false,
		id: 23,
		once: function()
		{
			$('#ctl00_TraditionalLink').parents('td:eq(1)').html('&nbsp;');
		}
	},

	forceLineBreak:
	{
		disp: '強制換行',
		type: 1,
		page: ['view'],
		defaultOn: true,
		id: 24,
		infinite: function()
		{
			$.each(AN.shared.getReplies(), function()
			{
				this.jTdContent.css({ wordWrap: 'break-word', overflow: 'hidden' }).parents('table:first').css('table-layout', 'fixed');
			});
		}
	},

	linkifyMatchedCharacters:
	{
		disp: '智能地將文字轉換成連結',
		type: 1,
		page: ['view'],
		defaultOn: true,
		id: 25,
		infinite: function()
		{
/*
			var regLink = /(?:(h\w{2}ps?[:\/]+?)|[\w-]+?@)?((?:(?:\d{1,3}\.){3}\d{1,3}|(?:[\w-]+?\.){0,4}[\w-]{2,}\.(?:biz|cn|cc|co(?=\.)|com|de|eu|gov|hk|info|jp(?!g)|net|org|ru|tk|us)(?:\.[a-z]{2,3})?)(?::\d{1,5})?(?:\/[\w~./%?&=#+:-]*)?)/i;
*/

			var regLink = /(?:ftp|https?):\/\/[\w!#$&'()*+,./:;=?@~-]+/i;

			var funWrap = function(nodToWrap, aMatch)
			{
				nodToWrap.splitText(RegExp.leftContext.length + aMatch[0].length);
				nodToWrap = nodToWrap.splitText(RegExp.leftContext.length);

				var strHref = aMatch[0];//(aMatch[1] || 'http://') + aMatch[2];
				$(nodToWrap)
				.wrap($.sprintf('<a href="%s" />', strHref))
				.parent().before('<span style="cursor: default; color: gray; margin-right: 2px" title="Characters Linkified">[L]</span>');
			};

			var funSearch = function(nodToTest)
			{
				if(nodToTest.nodeType == 3)
				{
					var aMatch = nodToTest.nodeValue.match(regLink);
					if(aMatch) funWrap(nodToTest, aMatch);
				}
				else if(nodToTest.firstChild && !$(nodToTest).is('a,button,script,style'))
				{
					funSearch(nodToTest.firstChild);
				}

				if(nodToTest.nextSibling) funSearch(nodToTest.nextSibling);
			};

			$.each(AN.shared.getReplies(), function()
			{
				funSearch(this.jTdContent.get(0).firstChild);
			});
		}
	},

	convertLinksToCurrentServer:
	{
		disp: '轉換論壇連結的伺服器位置',
		type: 1,
		page: ['view'],
		defaultOn: true,
		id: 26,
		infinite: function()
		{
			$.each(AN.shared.getReplies(), function()
			{
				this.jTdContent.find('a').each(function()
				{
					var aMatch = this.hostname.match(/forum\d*.hkgolden\.com/i);
					if(aMatch && $(this).children().length == 0 && aMatch[0] != location.hostname)
					{
						this.hostname = location.hostname;
						$(this).before('<span style="cursor: default; color: gray; margin-right: 2px" title="Server No. Converted">[C]</span>');
					}
				});
			});
		}
	},

	improveCompanyMode:
	{
		disp: '改進公司模式 (雖然還是沒甚麼用處)',
		type: 2,
		page: ['all'],
		defaultOn: true,
		id: 27,
		once: function()
		{
			if(AN.util.cookie('companymode') == 'Y')
			{
				document.title = 'Google';
			}
		}
	},

	ajaxifyPageLoading:
	{
		disp: 'Ajax化頁面讀取',
		type: 1,
		page: ['view'],
		defaultOn: true,
		id: 28,
		options:
		{
			booShowPageNo: { disp: '顯示資料: 本頁頁數', defaultValue: true, type: 'boolean' },
			bAutoRefreshPage: { disp: '自動重新整理', defaultValue: true, type: 'boolean' },
			bAjaxifyReplying: { disp: 'ajax化回覆', defaultValue: true, type: 'boolean' }
		},
		once: function()
		{
			AN.func.updatePageBox = function(jDoc)
			{
				var jPageBox = jDoc.find('select[name=page]').parents('tr:first');
				$('select[name=page]').each(function()
				{
					$(this).parents('tr:first').replaceWith(jPageBox.clone());
				});
			};

			$window.changePage = function(){};

			AN.func.addEvents = function()
			{
				$('select[name=page]').each(function()
				{
					$(this).parents('tr:first').find('a').click(function(event)
					{
						AN.func.goToPage(event, Number(this.href.match(/page=\d+/)[0].replace(/page=/,'')));
					})
					$(this).change(function(event)
					{
						var numSelected = Number($(this).children(':selected').val());
						AN.func.goToPage(event, numSelected);
					});
				});
			};

			AN.func.goToPage = function(event, nPageNo)
			{
				clearTimeout(AN.data.tGetPage);
				AN.shared.log2($.sprintf('Changing to page %s, please wait...', nPageNo));
				event.preventDefault();

				$.get(AN.shared.getURL(nPageNo), function(sHTML)
				{
					var jDoc = $.doc(sHTML);
					var sNewStrong = jDoc.find('strong:first').text();

					var changeReplies = function()
					{
						var nCurPageNo = AN.shared.getCurPageNo();
						$('.repliers').each(function(i)
						{
							if(i == 0 && nCurPageNo == 1) $(this).remove();
							else $(this).next().andSelf().remove();
						});

						var jCurStrong = $('strong:first');
						var jReplies = AN.data.jReplies[nPageNo];

						if(nPageNo == 1)
						{
							jCurStrong.parents('table:first').before(jReplies.eq(0));
							jReplies.filter(':gt(0)').each(function()
							{
								AN.data.jEndTable.before(this).before('<table><tr><td></td></tr></table>');
							});
						}
						else
						{
							jReplies.each(function()
							{
								AN.data.jEndTable.before(this).before('<table><tr><td></td></tr></table>');
							});
						}

						jCurStrong.text(sNewStrong);

						AN.func.updatePageBox(jDoc);

						$('select[name=page]').each(function()
						{
							$(this).children().eq(nPageNo - 1).attr('selected', true);
						});
					};

					var afterPageChanging = function()
					{
						$('#AN_spanCurPage').attr('href', AN.shared.getURL(nPageNo)).html(nPageNo);
						AN.func.addEvents();
						scrollTo(0,0);
						AN.shared.log2($.sprintf('Successfully changed to page %s.', nPageNo));

						if(Math.ceil(sNewStrong / 50) == nPageNo) AN.func.getPage();
						else if(AN.data.bAutoRefreshPage) AN.data.tGetPage = setTimeout(function(){ AN.func.getPage(); }, 30000);
					};

					if(!AN.data.jReplies[nPageNo])
					{
						AN.data.jReplies[nPageNo] = jDoc.find('.repliers');
						changeReplies();
						AN.execFunc(false, AN.data.jReplies[nPageNo].add(AN.data.aPageBoxes));
					}
					else
					{
						changeReplies();
						AN.execFunc(false, $(AN.data.aPageBoxes));
					}
					afterPageChanging();
				});
			};

			AN.func.getPage = function(bIsManual)
			{
				var nCurPageNo = AN.shared.getCurPageNo();

				if(!$('select[name=page]:first :selected').next().length)
				{
					if(nCurPageNo == 21) return; // 1001

					AN.shared.log('Querying lastest replies...');

					$.get(AN.shared.getURL(nCurPageNo), function(sHTML)
					{
						var
						nRepliesLength = $('.repliers').length,
						bIsRepliesMax = (nCurPageNo == 1) ? (nRepliesLength == 51) : (nRepliesLength == 50),
						sCurStrong = $('strong:first').text(),
						jDoc = $.doc(sHTML),
						sNewStrong = jDoc.find('strong:first').text()

						if(!sNewStrong)
						{
							AN.shared.log('Error on query, maybe reply is unsuccessful.')
						}
						else if(sCurStrong != sNewStrong)
						{
							$('strong:first').text(sNewStrong);

							if(!bIsRepliesMax)
							{
								var jReplies = jDoc.find('.repliers');
								AN.data.jReplies[nCurPageNo] = jReplies;

								var jNewReplies = jReplies.filter(':gt(' + (nRepliesLength - 1) + ')')

								jNewReplies.each(function()
								{
									AN.data.jEndTable.before(this).before('<table><tr><td></td></tr></table>');
								});

								AN.execFunc(false, jNewReplies)
								AN.shared.log('New reply(s) added.');
							}

							if(Math.ceil(sNewStrong / 50) > Math.ceil(sCurStrong / 50))
							{
								AN.func.updatePageBox(jDoc);
								AN.execFunc(false, $(AN.data.aPageBoxes));
								AN.func.addEvents();
								AN.shared.log('Found next page, page boxes updated.');
							}
						}
						else
						{
							AN.shared.log2('No new replies.');
						}

						if(AN.data.bAutoRefreshPage)
						{
							AN.data.tGetPage = setTimeout(function(){ AN.func.getPage(); }, 30000);
							AN.shared.log2('Query again in 30s...');
						}
					});
				}
				else
				{
					if(bIsManual) AN.shared.log('Refresh is not needed.');
				}
			};

			var nCurPageNo = AN.shared.getCurPageNo();
			var jReplies = $('.repliers');

			AN.data.jReplies = {};
			AN.data.jReplies[nCurPageNo] = jReplies;
			AN.data.jEndTable = jReplies.filter(':last').next().next();
			AN.data.aPageBoxes = [];
			$('select[name=page]').each(function()
			{
				AN.data.aPageBoxes.push($(this).parents('table:first').get(0));
			});

			AN.func.addEvents();
			AN.data.bAutoRefreshPage = AN.shared.getOption('bAutoRefreshPage');
			if(AN.data.bAutoRefreshPage) AN.data.tGetPage = setTimeout(function(){ AN.func.getPage(); }, 30000);

			if(AN.shared.getOption('bAjaxifyReplying'))
			{
				$('#aspnetForm').submit(function(event)
				{
					event.preventDefault();
					clearTimeout(AN.data.tGetPage);
					AN.shared.log('Posting reply...');

					var sData = $('#aspnetForm').serialize() + '&ctl00%24ContentPlaceHolder1%24btn_Submit.x=0&ctl00%24ContentPlaceHolder1%24btn_Submit.y=0';
					$.post(location.href, sData, function()
					{
						$('#ctl00_ContentPlaceHolder1_messagetext').val('');
						$('#AN_divToToggle').hide();
						AN.shared.log('Reply completed.');
						AN.func.getPage(false);
					});
				});
			}

			if(AN.shared.getOption('booShowPageNo')) AN.shared.addInfo($.sprintf('Page: <a id="AN_spanCurPage" href="%s">%s</a>', location.href, nCurPageNo));

			$('<div id="AN_divAjaxRefresh">Refresh Now</div>').appendTo('#AN_divTopLeft').click(function()
			{
				clearTimeout(AN.data.tGetPage);
				AN.func.getPage(true);
			});

			$('<div id="AN_divToggleAutoRefresh">Disable Auto Refresh</div>').appendTo('#AN_divTopLeft').toggle(
			function()
			{
				clearTimeout(AN.data.tGetPage);
				AN.data.bAutoRefreshPage = false;
				$(this).html('Enable Auto Refresh');
				AN.shared.log2('Auto refresh disabled.');
			},
			function()
			{
				AN.data.tGetPage = setTimeout(function(){ AN.func.getPage(); }, 30000);
				AN.data.bAutoRefreshPage = true;
				$(this).html('Disable Auto Refresh');
				AN.shared.log2('Auto refresh enabled.');
			});
		}
	},

	removeLeftMenu:
	{
		disp: '移除左方連結欄',
		type: 4,
		page: ['all'],
		defaultOn: false,
		id: 29,
		once: function()
		{
			$('td[width=107]').remove();
			$('table,td').filter(function(){ return this.width.match(/^(?:806|800|792)$/); }).width('100%');
		}
	},

	removeUpperLogo:
	{
		disp: '移除上方Logo列',
		type: 4,
		page: ['all'],
		defaultOn: false,
		id: 30,
		once: function()
		{
			$('#ctl00_TopBarHomeLink').parents('tr:eq(1)').remove();
			$('td[height=144]').removeAttr('height');
		}
	},

	editQuoteOpacity:
	{
		disp: '改變引用半透明 (不適用於IE 7-)',
		type: 2,
		page: ['view'],
		defaultOn: false,
		id: 31,
		options: { strQuoteOpacity: { disp: '透明度 (10 = 移除半透明)', defaultValue: 10, type: 'select', choices: [10,9,8,7,6,5,4,3,2,1,0] } },
		once: function()
		{
			AN.shared.addStyle($.sprintf('blockquote { opacity: %s !important; }', AN.shared.getOption('strQuoteOpacity') / 10));
		}
	},

	removeNormalQuoteLink:
	{
		disp: '移除引用原文連結圖片',
		type: 4,
		page: ['view'],
		defaultOn: false,
		id: 32,
		infinite: function()
		{
			$.each(AN.shared.getReplies(), function()
			{
				this.jThis.find('a:last').remove();
			});
		}
	},

	removeStuffForCDRom:
	{
		disp: '移除引用連結圖片及登入提示 (CD-ROM專用)',
		type: 4,
		page: ['view'],
		defaultOn: true,
		id: 33,
		once: function()
		{
			$('#ctl00_ContentPlaceHolder1_QuickReplyLoginTable').remove();
		},
		infinite: function()
		{
			if(AN.shared.isLoggedIn()) return;

			$.each(AN.shared.getReplies(), function()
			{
				this.jThis.find('a:last').prev().andSelf().remove();
			});
		}
	},

	// 34 is moved up
	// 35 is moved up

	shortenTooLongReply:
	{
		disp: '縮短過長回覆',
		type: 4,
		page: ['view'],
		defaultOn: false,
		id: 36,
		options: { numMaxReplyHeight: { disp: '回覆最長許可值(px)', defaultValue: 5000, type: 'string' } },
		once: function()
		{
			$('<div>Restore Posts\' Length</div>').appendTo('#AN_divTopLeft').toggle(
			function()
			{
				$('.AN_divWrapper').css('max-height', 'none').scrollTop(0);
				$(this).html('Shorten All Posts');
				AN.shared.log('Posts length restored.');
			},
			function()
			{
				var nMaxReplyHeight = AN.shared.getOption('numMaxReplyHeight');
				$('.AN_divWrapper').css('max-height', nMaxReplyHeight).scrollTop(9999999);
				$(this).html('Restore Posts\' Length');
				AN.shared.log($.sprintf('All posts shortened to %spx or less.', nMaxReplyHeight));
			});
		},
		infinite: function()
		{
			var nMaxReplyHeight = AN.shared.getOption('numMaxReplyHeight');

			$.each(AN.shared.getReplies(), function()
			{
				var nOriHeight = this.jTdContent.height();
				if(nOriHeight <= nMaxReplyHeight) return;

				var $box = $($.sprintf('<div style="text-align: right; margin-bottom: 5px;"><span style="font-size: 10px;" class="AN_spanClickBox">原始高度: %spx</span></div>', nOriHeight)).click(function()
				{
					var $wrapper = $(this).siblings('.AN_divWrapper');
					if($wrapper.css('max-height') == 'none') $wrapper.css('max-height', AN.shared.getOption('numMaxReplyHeight')).scrollTop(9999999);
					else $wrapper.css('max-height', 'none').scrollTop(0);
				});

				this.jTdContent
				.wrapInner($.sprintf('<div class="AN_divWrapper" style="overflow: hidden; max-height: %spx" />', nMaxReplyHeight))
				.prepend($box.clone(true)).append($box)
				.children('.AN_divWrapper').scrollTop(9999999);
			});
		}
	},

	// 37 is moved up

	showTopicOpenerName:
	{
		disp: '顯示資料: 樓主名稱',
		type: 1,
		page: ['view'],
		defaultOn: true,
		id: 38,
		once: function()
		{
			AN.shared.getOpenerInfo(function(oInfo)
			{
				AN.shared.addInfo($.sprintf('Opener: <a target="_blank" href="/ProfilePage.aspx?userid=%s">%s</a>', oInfo.sId, oInfo.sName, true));
			});
		}
	},

	addEncodeProblemFixingButton:
	{
		disp: '加入亂碼修正按扭 (FF用戶無需啟用)',
		type: 3,
		page: ['sendpm'],
		defaultOn: true,
		id: 39,
		once: function()
		{
			$('<span style="vertical-align: top; margin-left: 2px;" class="AN_spanClickBox">還原</span>')
			.insertAfter('#ctl00_ContentPlaceHolder1_btn_Send').click(function()
			{
				$.each([$('#ctl00_ContentPlaceHolder1_txt_subject'),$('#ctl00_ContentPlaceHolder1_messagetext')], function()
				{
					var strValue = this.val();
					var aMatch;
					while(aMatch = strValue.match(/&#(\d+);/))
					{
						strValue = strValue.replace(aMatch[0], String.fromCharCode(aMatch[1]));
					}
					this.val(strValue);
				});
			});

			$('<span style="vertical-align: top; margin-left: 2px;" class="AN_spanClickBox">修正亂碼</span>')
			.insertAfter('#ctl00_ContentPlaceHolder1_btn_Send').click(function()
			{
				$.each([$('#ctl00_ContentPlaceHolder1_txt_subject'),$('#ctl00_ContentPlaceHolder1_messagetext')], function()
				{
					var arrValues = this.val().split('');
					$.each(arrValues, function(i, strValue)
					{
						if(strValue.charCodeAt(0) > 127) arrValues[i] = '&#' + strValue.charCodeAt(0) + ';' ;
					});
					this.val(arrValues.join(''));
				});
			});
		}
	},

	showOnlineTime:
	{
		disp: '顯示資料: 累計在線時間',
		type: 1,
		page: ['all'],
		defaultOn: true,
		id: 40,
		once: function()
		{
			var numCumulatedTime = AN.shared.data('numCumulatedTime') || 0;
			var numLastOnTime = AN.shared.data('numLastOnTime');

			if(numLastOnTime)
			{
				var numDifference = $.time() - numLastOnTime;
				if(numDifference >= 120000) numCumulatedTime += 120000;
				else numCumulatedTime += numDifference;
			}

			if(numCumulatedTime > 86400000)
			{
				var strCumulated = (numCumulatedTime / 86400000).toFixed(2) + ' days';
			}
			else if(numCumulatedTime > 3600000)
			{
				var strCumulated = (numCumulatedTime / 3600000).toFixed(2) + ' hours';
			}
			else
			{
				var strCumulated = (numCumulatedTime / 60000).toFixed(2) + ' minutes';
			}

			AN.shared.addInfo($.sprintf('Time Spent: <span id="AN_onlineTime">%s</span>', strCumulated), true);

			AN.shared.data('numLastOnTime', $.time());
			AN.shared.data('numCumulatedTime', numCumulatedTime);
		}
	},

	addShowOpenerPostsOnlyButton:
	{
		disp: '加入只顯示樓主發言按扭',
		type: 3,
		page: ['view'],
		defaultOn: false,
		id: 41,
		once: function()
		{
			$('<div>Opener\'s Posts Only</div>').appendTo('#AN_divTopLeft').click(function()
			{
				clearTimeout(AN.data.tGetPage);

				AN.shared.blockScreen(true);

				$(this).add('#AN_divAjaxRefresh, #AN_divToggleAutoRefresh').add($('#AN_spanCurPage').parent()).remove();

				AN.shared.getOpenerInfo(function(oInfo)
				{
					var
					nTime = $.time(),
					sName = oInfo.sName,
					sMaxPageNo = $('select[name=page]:first > :last').val(),
					nPageNo = AN.shared.getCurPageNo(),
					jEndTable;

					if(AN.data.bOuterOnly && AN.data.bOuterOnly[1]) delete AN.data.bOuterOnly[1];

					$('select[name=page]').each(function()
					{
						//$(this).children(':eq(0)').attr('selected', true).parents('table:eq(2)').hide();
						$(this).parents('table:eq(2)').hide();
					});

					$('.repliers')
					.fn(function()
					{
						jEndTable = this.filter(':last').next().next();
						return this;
					})
					.each(function()
					{
						$(this).next().andSelf().remove();
					});

					var recurseOnPages = function()
					{
						$.get(AN.shared.getURL(nPageNo), function(sHTML)
						{
							$.doc(sHTML).find('.repliers').each(function()
							{
								if($(this).find('a:first').html() == sName) jEndTable.before(this).before('<table><tr><td></td></tr></table>');
							})
							.end().fn(function()
							{
								if(this.find('select[name=page] > :last-child').val() >= ++nPageNo) recurseOnPages();
								else
								{
									$('<div>Return To Topic</div>').appendTo('#AN_divTopLeft').click(function()
									{
										location.assign(AN.shared.getURL(--nPageNo));
										$(this).remove();
									});
									if(AN.data.oFloor) AN.data.oFloor.nFloorNo = 1;
									AN.execFunc(false);
									AN.shared.blockScreen();
									AN.shared.log2($.sprintf('Time used: %s s', ($.time() - nTime) / 1000));
								}
							});
						});
					};

					recurseOnPages();
				});
			});
		}
	},

	removeAvatar:
	{
		disp: '移除高級會員頭像',
		type: 4,
		page: ['view'],
		defaultOn: false,
		id: 42,
		infinite: function()
		{
			this.find('img[alt=Logo]').remove();
		}
	},

	changeLogo:
	{
		disp: '更換Logo',
		type: 1,
		page: ['all'],
		defaultOn: false,
		id: 43,
		options: { sLogoSrc: { disp: '圖片網址', defaultValue: 'http://i3.6.cn/cvbnm/93/04/af/f1cb3700665e79e2d73a6392b585ef19.jpg', type: 'string' } },
		once: function()
		{
			$('#ctl00_TopBarHomeImage').attr('src', AN.shared.getOption('sLogoSrc'));
		}
	},

	removeQuickReplyComponents:
	{
		disp: '移除快速回覆組件',
		type: 4,
		page: ['view'],
		defaultOn: false,
		id: 44,
		options:
		{
			bRemoveSmileys: { disp: '移除表情圖示列', defaultValue: false, type: 'boolean' },
			bRemoveXMasSmileys: { disp: '移除聖誕表情圖示列', defaultValue: false, type: 'boolean' },
			bRemovePreview: { disp: '移除預覽列', defaultValue: false, type: 'boolean' }
		},
		once: function()
		{
			if(!AN.shared.isLoggedIn()) return;

			var jTbody = $('#ctl00_ContentPlaceHolder1_QuickReplyTable tbody:eq(2)');
			if(AN.shared.getOption('bRemoveSmileys')) jTbody.children('tr:eq(3)').remove();
			if(AN.shared.getOption('bRemoveXMasSmileys')) jTbody.find('td:contains(聖誕表情圖示:)').parent().next().andSelf().remove();
			if(AN.shared.getOption('bRemovePreview')) jTbody.children('tr:last').remove();
		}
	},

	// id 45 is moved up

	ajaxifyTopicsRefreshing:
	{
		disp: 'ajax化重新整理',
		type: 1,
		page: ['topics'],
		defaultOn: true,
		id: 46,
		options:
		{
			nTimeOut: { disp: '自動重新整理間隔(秒, < 30等於停用)', defaultValue: 0, type: 'string' }
		},
		once: function()
		{
			AN.func.refreshTopics = function()
			{
				clearTimeout(AN.data.tRefresh);
				AN.shared.log2('Querying lastest topics...');

				$.get(location.href, function(sHTML)
				{
					var aTopics = AN.shared.getTopicRows($.doc(sHTML));

					$.each(AN.shared.getTopicRows(), function(i)
					{
						this.jThis.replaceWith(aTopics[i].jThis);
					});

					AN.execFunc(false, aTopics[0].jThis.parent());

					$('#AN_divTopicFunctions').slideUp('slow', function(){ $(this).remove(); });

					AN.shared.log('Topics table updated.');

					var nTimeOut = AN.shared.getOption('nTimeOut');
					if(nTimeOut >= 30)
					{
						AN.shared.log2($.sprintf('Query again in %ss...', nTimeOut));
						AN.data.tRefresh = setTimeout(function(){ AN.func.refreshTopics(); }, nTimeOut * 1000);
					}
				});
			};

			$('<div id="AN_divRefreshTopics">Refresh Topics</div>').appendTo('#AN_divTopLeft').click(function(){ AN.func.refreshTopics(); });

			var nTimeOut = AN.shared.getOption('nTimeOut');
			if(nTimeOut >= 30) AN.data.tRefresh = setTimeout(function(){ AN.func.refreshTopics(); }, nTimeOut * 1000);
		}
	},

	addServerCheckingButton:
	{
		disp: '加入伺服器狀態檢查按扭',
		type: 3,
		page: ['all'],
		defaultOn: true,
		id: 47,
		once: function()
		{
			$('<div>Check Server Status</div>').appendTo('#AN_divTopLeft').click(function(){ AN.shared.checkServer(); });
		}
	},

	checkServerStatus:
	{
		disp: '自動顯示伺服器狀態檢查視窗 (部份頁面IE7, M2 w/ IE7, Opera無法使用)',
		type: 1,
		page: ['special'],
		defaultOn: true,
		id: 48,
		once: function()
		{
			AN.shared.checkServer();
		}
	},

	addTopicFunctions:
	{
		disp: '加入帖子功能按扭 (暫不適用於FF)',
		type: 3,
		page: ['topics'],
		defaultOn: false,
		id: 49,
		once: function()
		{
			AN.func.updateButtons = function(s)
			{
				var oTopic = AN.temp.oSelectedTopic;
				if(!oTopic) return $('#AN_divTopicFunctions').slideUp('slow', function(){ $(this).remove(); });

				if(!$('#AN_divTopicFunctions').length)
				{
					AN.func.addButtons();
				}

				var sTopicId = oTopic.sTopicId;
				var sUserName = oTopic.sUserName;
				var sTitle = oTopic.sTitle;
				var sData = $.sprintf('%s&DATA&%s&DATA&%s', sTopicId, sUserName, sTitle);

				var sHeader = (AN.temp.nSelectedIndex !== null) ? 'Topic #' + (AN.temp.nSelectedIndex + 1) + ':' : 'Sticky:';
				$('#AN_divTopicNo').html(sHeader);

				var sStickyPrefix = ($.inArray(sData, AN.shared.dataArray('aStickiedTopics')) != -1) ? 'Unsticky #' : 'Sticky #';
				$('#AN_divSticky').html(sStickyPrefix + sTopicId);

				var sBlockPrefix = ($.inArray(sUserName, AN.shared.dataArray('aBlockedTopics')) != -1) ? 'Unblock ' : 'Block ';
				$('#AN_divBlock').html(sBlockPrefix + sUserName);
			};

			AN.func.addButtons = function()
			{
				$('<div id="AN_divTopicFunctions"><div id="AN_divTopicNo" style="padding: 0 0 6px 5px" /></div>').appendTo('#AN_divTopLeft');

				$('<div id="AN_divBlock" style="padding: 0 0 0 5px" />').appendTo('#AN_divTopicFunctions').click(function()
				{
					var aBlocked = AN.shared.dataArray('aBlockedTopics');
					var sUserName = AN.temp.oSelectedTopic.sUserName;
					var nIndex = $.inArray(sUserName, aBlocked);

					if(nIndex == -1)
					{
						aBlocked.push(sUserName);
						AN.func.blockTopics(true, sUserName);
					}
					else
					{
						aBlocked.splice(nIndex, 1);
						AN.func.blockTopics(false, sUserName);
					}

					AN.shared.dataArray('aBlockedTopics', aBlocked);
					AN.func.updateButtons();
				});

				$('<div id="AN_divSticky" style="padding: 0 0 0 5px" />').appendTo('#AN_divTopicFunctions').click(function()
				{
					var aSticked = AN.shared.dataArray('aStickiedTopics');
					var sTopicId = AN.temp.oSelectedTopic.sTopicId;
					var sUserName = AN.temp.oSelectedTopic.sUserName;
					var sTitle = AN.temp.oSelectedTopic.sTitle;
					var sData = $.sprintf('%s&DATA&%s&DATA&%s', sTopicId, sUserName, sTitle);
					var nIndex = $.inArray(sData, aSticked);

					if(nIndex == -1)
					{
						aSticked.push(sData);
						AN.func.stickyTopic(true, sData);
					}
					else
					{
						aSticked.splice(nIndex, 1);
						AN.func.stickyTopic(false, sData);
						AN.temp.oSelectedTopic = null;
					}

					AN.shared.dataArray('aStickiedTopics', aSticked);
					AN.func.updateButtons();
				});
			};

			AN.func.blockTopics = function(bToBlock, sUserName)
			{
				var jToggle =
				$('<span>[ :) ] </span>')
				.appendTo('<span style="color: gray;" />')
				.after('<span>此用戶已被封鎖</span>')
				.css('cursor', 'pointer')
				.toggle(
				function()
				{
					var jThis = $(this);
					jThis.html('[ :( ] ').next().html(jThis.parent().parent().data('sOri'));
				},
				function()
				{
					$(this).html('[ :) ] ').next().html('此用戶已被封鎖');
				})
				.parent();

				$.each(AN.shared.getTopicRows(), function()
				{
					if(this.sUserName == sUserName)
					{
						var jTitleTd = this.jThis.children(':eq(1)');

						if(bToBlock)
						{
							jTitleTd.data('sOri', jTitleTd.html()).html(jToggle.clone(true));
						}
						else
						{
							jTitleTd.html(jTitleTd.data('sOri'));
						}
					}
				});
			};

			AN.func.stickyTopic = function(bToSticky, sData)
			{
				var aData = sData.split('&DATA&');
				var sTopicId = aData[0];
				var sUserName = aData[1];
				var sTitle = aData[2];

				if(bToSticky)
				{
					var jTr;

					if(AN.temp.oSelectedTopic !== undefined)
					{
						var jOriTr = AN.temp.oSelectedTopic.jThis;
						jTr = jOriTr.clone();

						var sOri = jOriTr.children(':eq(1)').data('sOri');
						if(sOri) jTr.children(':eq(1)').html(sOri);
					}
					else
					{
						var jOriTr = AN.shared.getTopicRows()[0].jThis;
						jTr = jOriTr.clone();

						var sOri = jOriTr.children(':eq(1)').data('sOri');
						if(sOri) jTr.children(':eq(1)').html(sOri);

						var jATopic = jTr.find('a:first');
						var jASearch = jTr.children(':eq(2)').children('a:first');

						jTr
						.children(':eq(1)').fn(function()
						{
							this
							.empty()
							.append(jATopic.attr('href', 'view.aspx?message=' + sTopicId).html(sTitle))
							.append(' ');
/*
							for(var i=2;i<sPageNo;i++)
							{
								this
								.append('[')
								.append(jATopic.clone().attr('href', $.sprintf('view.aspx?message=%s&page=%s', sTopicId, i)).html(i))
								.append('] ');
							}
*/
							return this;
						})
						.next().html(jASearch.attr('href', $.sprintf('search.aspx?st=A&searchstring=%s', escape(sUserName))).html(sUserName))
						.next().html('置頂項目')
						.next().html('?');
					}

					jTr
					.insertBefore(AN.shared.getTopicRows()[0].jThis)
					.data('sTopicId', sTopicId)
					.data('sUserName', sUserName)
					.data('sTitle', sTitle)
					.addClass('AN_trSticky')
					.children(':first').css('cursor', 'pointer').click(function()
					{
						var jTr = $(this).parent();
						AN.temp.oSelectedTopic =
						{
							sTopicId: jTr.data('sTopicId'),
							sUserName: jTr.data('sUserName'),
							sTitle: jTr.data('sTitle')
						};
						AN.temp.nSelectedIndex = null;
						AN.func.updateButtons();
					})
					.next().prepend('<span style="color: gray;">[ ^ ] </span>');
				}
				else
				{
					$('.AN_trSticky').each(function()
					{
						var jThis = $(this);
						if(jThis.data('sTopicId') == sTopicId)
						{
							jThis.remove();
							return false;
						}
					});
				}
			};

			$.each(AN.shared.dataArray('aStickiedTopics'), function()
			{
				AN.func.stickyTopic(true, this);
			});
		},
		infinite: function()
		{
			$.each(AN.shared.getTopicRows(), function(i)
			{
				this.jThis.children(':first').data('nIndex', i).css('cursor', 'pointer').click(function()
				{
					AN.temp.nSelectedIndex = $(this).data('nIndex');
					AN.temp.oSelectedTopic = AN.shared.getTopicRows()[AN.temp.nSelectedIndex];
					AN.func.updateButtons();
				});
			});

			$.each(AN.shared.dataArray('aBlockedTopics'), function()
			{
				AN.func.blockTopics(true, this);
			});
		}
	},

	addStickyButton:
	{
		disp: '加入置頂按扭 (須配合"加入帖子功能按扭"使用)',
		type: 3,
		page: ['view'],
		defaultOn: false,
		id: 50,
		once: function()
		{
			AN.shared.getOpenerInfo(function(oInfo)
			{
				var sTopicId = $window.messageid;
				var sUserName = oInfo.sName;
				var sTitle = AN.shared.getReplies()[0].jThis.find('td:eq(1)').html();
				AN.data.sStickyData = $.sprintf('%s&DATA&%s&DATA&%s', sTopicId, sUserName, sTitle);
				var sMsg = ($.inArray(AN.data.sStickyData, AN.shared.dataArray('aStickiedTopics')) != -1) ? 'Unsticky' : 'Sticky';

				$($.sprintf('<div>%s This Topic</div>', sMsg)).appendTo('#AN_divTopLeft').click(function()
				{
					var aData = AN.shared.dataArray('aStickiedTopics');
					var nIndex = $.inArray(AN.data.sStickyData, aData);
					var sMsg;

					if(nIndex != -1)
					{
						aData.splice(nIndex, 1);
						sMsg = 'Sticky';
					}
					else
					{
						aData.push(AN.data.sStickyData);
						sMsg = 'Unsticky';
					}

					AN.shared.dataArray('aStickiedTopics', aData);
					$(this).html(sMsg + ' This Topic');
				});
			});
		}
	},

	fixProfilePageChange:
	{
		disp: '轉頁後再次運行功能',
		type: 1,
		page: ['profilepage'],
		defaultOn: true,
		id: 51,
		once: function()
		{
			$window.Profile_ShowGoogleAds = function()
			{
				AN.execFunc(false);
				$('[id^=MsgInLineAd]').each(function(){ $(this).parents('tr:first').remove(); });
			};
		}
	}
};

///////////// END OF - [Main Fuctions] ///////////////////
///////////// START OF - [Initialization] ///////////////////

if(typeof unsafeWindow != 'undefined')
{
	AN.collectData();
	AN.execFunc(true);
}
else
{
	$(function()
	{
		AN.collectData();
		AN.execFunc(true);
	});
}

AN.data.benchmark.push(['Total', ($.time() - nStart)]);

///////////// END OF - [Initialization] ///////////////////
})();