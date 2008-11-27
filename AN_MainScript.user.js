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
// @namespace http://forum.hkgolden.com/
// @description version 2.x.x_alpha by 向日
// @include http://forum*.hkgolden.com/*
// ==/UserScript==

/*	Some notes for developers:
 *
 *	jQuery - with plugins: jQuery UI, (v)sprintf
 *	Cross-brower - Theoretically. For now I have only tested it on {Maxthon 2 w/ IE 7} & {FF 3}, please let me know if there is a way to use scripts on other browsers
 *	No base64 encoded data - Not supported by IE 7- [sosad]
 *	Used unsafeWindow on GM - A lot easier for me to write the script
 *
 */

/////////////////// START OF - [Preperation] ///////////////////

if(typeof unsafeWindow != 'undefined')
{
	$window = unsafeWindow;
	$ = $window.$;
	AN = $window.AN;
}

(function()
{
	if(!AN.data) return setTimeout(arguments.callee, 500);
	AN.init.collectData();
})();

/////////////////// END OF - [Preperation] ///////////////////
/////////////////// START OF - [Data Collection] ///////////////////

AN.init.collectData = function()
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
		if(AN.data.settings1['other' + this.id] === undefined)
		{
			AN.data.settings1['other' + this.id] = this.defaultOn;
		}
	});

	$($window).unload(function(){ delete AN; });
	AN.init.execFunc(true);
}

/////////////////// END OF - [Data Collection] ///////////////////
/////////////////// START OF - [Functions Excuation] ///////////////////

AN.init.execFunc = function(booIsFirstTime)
{
	AN.temp = {};
	AN.data.benchmark = [];

	if(AN.data.strCurPage != 'special' && booIsFirstTime)
	{
		$.each(AN.comp, function(strFnName)
		{
			if(this.page[0] == 'all' || $.inArray(AN.data.strCurPage, this.page) != -1)
			{
				var numTime = $.time();
				this.once();
				AN.data.benchmark.push([strFnName, ($.time() - numTime)]);
			}
		});
	}

	$.each(AN.main, function()
	{
		if(AN.data.settings1['all' + this.id] || AN.data.settings1[AN.data.strCurPage + this.id])
		{
			if((booIsFirstTime && this.once) || this.infinite)
			{
				try
				{
					AN.shared.debug('excuting ' + this.disp);
					var numTime = $.time();
					if(booIsFirstTime && this.once) this.once();
					if(this.infinite) this.infinite();
					AN.data.benchmark.push([this.disp, ($.time() - numTime)]);
				}
				catch(err)
				{
					AN.shared.log('Please inform the author about this error.');
					AN.shared.log('Error message: ' + err.message);
					if(err.lineNumber) AN.shared.log('Line number: ' + err.lineNumber);
					AN.shared.log('An error occured: ' + this.disp);
				}
			}
		}
	});
}

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

	getReplies: function()
	{
		if(AN.temp.arrReplys) return AN.temp.arrReplys;

		AN.temp.arrReplys = [];

		$('.repliers')
		.each(function()
		{
			var $this = $(this), $a = $this.find('a:first');
			if(!$a.length) return;

			AN.temp.arrReplys.push(
			{
				strUserId: $a.attr('href').replace(/^[^=]+=/, ''),
				strUserName: $a.html(),
				$tdContent: $this.find('table:last td:first'),
				$repliers: $this
			});
		});
		return AN.temp.arrReplys;
	},

	getTopicRows: function()
	{
		if(AN.temp.arrTopicRows) return AN.temp.arrTopicRows;

		AN.temp.arrTopicRows = [];

		$('td').each(function()
		{
			if($(this).html().match(/^\s*最後回應時間$/))
			{
				$.each($(this).parent().nextAll('tr'), function()
				{
					var $this = $(this), $a = $this.find('a');
					if(!$a.length) return;

					AN.temp.arrTopicRows.push(
					{
						$trTopicRow: $this,
						strLinkId: $a.eq(0).attr('href').match(/\d+$/)[0],
						strUserName: $a.filter(':last').html()
					});
				});
				return false; // break;
			}
		});
		return AN.temp.arrTopicRows;
	},

	getCurPageNo: function()
	{
		return Number($('select[name=page]:first > :selected').val());
	},

	isLoggedIn: function()
	{
		if(AN.data.booIsLoggedIn) return AN.data.booIsLoggedIn;

		return AN.booIsLoggedIn = ($('#ctl00_ContentPlaceHolder1_lb_UserName a:first').attr('href').indexOf('login.aspx') == -1);
	}
}

/////////////////// END OF - [Shared Functions] ///////////////////
/////////////////// START OF - [Compulsory Functions] ///////////////////

AN.comp =
{
	addMainStyle:
	{
		page: ['all'],
		once: function()
		{
			AN.shared.addStyle(' \
			#AN_menuCollection div div { min-width: 80px; color: gray; cursor: pointer; } \
			#AN_menuCollection div div:hover, #AN_menuCollection a:hover { color: YellowGreen !important; } \
			#AN_menuCollection a { color: gray !important; text-decoration: none; } \
			\
			#AN_divTopLeft { position: fixed; top: 50px; left: 0; padding-left: 5px; } \
			#AN_divTopLeft div { border-left: 5px solid gray; padding: 3px 0 3px 5px; font-style: italic; } \
			\
			#AN_divLeft { position: fixed; top: 50%; left: 0; text-align: right; } \
			#AN_divLeft div { border: 0 solid gray; padding: 5px 0; } \
			#AN_divLeftMiddle { display: none; border-width: 1px 0 !important; } \
			\
			#AN_divRight { position: fixed; top: 15%; right: 0; text-align: left; } \
			#AN_divRight div { border-bottom: 1px solid gray; padding: 10px 5px 3px 0; } \
			\
			.AN_spanBox, .AN_spanClickBox { display: inline-block; color: gray; border: 1px solid gray; padding: 1px 2px; cursor: default; } \
			.AN_spanClickBox { cursor: pointer; } \
			.AN_spanClickBox:hover { color: YellowGreen; } \
			.AN_spanLine { display: inline-block; color: gray; border-bottom: 1px dotted gray; margin-bottom: 3px; font-size: 10px; font-style: italic; cursor: default; } \
			.AN_divBox { display: none; z-index: 2; position: fixed; background-color: #F3F2F1; border: 1px solid black; } \
			.AN_divBoxHeader { height: 20px; padding-left: 3px; background-color: #336699; border-bottom: 1px solid black; color: white; } \
			\
			#AN_divGrayLayer { display: none; z-index: 1; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: gray; opacity: 0.7; filter: alpha(opacity=70); } \
			#AN_divMiddleBox { top: 50%; left: 50%; width: 486px; height: 290px; margin: -150px 0 0 -243px; padding-bottom: 10px; cursor: default; } \
			#AN_divMiddleBoxContent { width: 466px; height: 259px; padding: 10px 10px 0 10px; overflow: auto; } \
			#AN_divMiddleBoxContent table { width: 444px; border: 1px solid black; border-collapse: collapse; } \
			#AN_divMiddleBoxContent td { padding: 3px; border: 0 solid black; border-bottom-width: 1px; } \
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
		page: ['all'],
		once: function()
		{
			$('body').append(' \
			<div id="AN_menuCollection"> \
				<div id="AN_divTopLeft" /> \
				<div id="AN_divLeft"><div id="AN_divLeftMiddle" /></div> \
				<div id="AN_divRight" /> \
			</div> \
			<div id="AN_divGrayLayer" /> \
			<div id="AN_divMiddleBox" class="AN_divBox"><div class="AN_divBoxHeader" /><div id="AN_divMiddleBoxContent" /></div> \
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
				$('html').css('overflow', 'hidden');
				$('#AN_divGrayLayer').show().fadeTo('slow', 0.7);
				$('#AN_divSettingsFrame').fadeIn('slow');
			});

			$('body').append('<div id="AN_divSettingsFrame" class="AN_divBox"><div id="AN_divAccordion" /><div id="AN_divFinishButtons" /></div>');

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
						options: this.options
					}
				}
			});

			$.each(AN.settings, function()
			{
				AN.data.settingsStructure['other'][6][this.id] =
				{
					disp: this.disp,
					options: this.options
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
						var strSwitchId = 'AN_switch_' + strFnId;
						var strChecked = (AN.data.settings1[strPageName + strFnId]) ? 'checked="checked"' : '';

						arrDivHTML.push($.sprintf('<li><input class="AN_switch" type="checkbox" id="%s" %s />', strSwitchId, strChecked));
						arrDivHTML.push($.sprintf('<label for="%s">%s</label>', strSwitchId, this.disp));

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
				var numFrameH = $(window).height() * 0.9;

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
					var strPageId = this.id.replace(/AN_div_/, '');

					$.each($(this).find('.AN_switch'), function()
					{
						objSettings1[strPageId + this.id.replace('AN_switch_', '')] = (this.checked) ? 1 : 0;
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
					var strObjName = (this.nodeName.toLowerCase() == 'input') ? this.type : this.nodeName.toLowerCase();
					objSettings2[this.id.replace('AN_option_', '')] = objOptionMap[strObjName];
				});
				AN.util.cookie('AN_settings2', objSettings2);

				location.reload();
			})
			.next().click(function()
			{
				$('html').css('overflow', '');
				$('#AN_divGrayLayer').add('#AN_divSettingsFrame').fadeOut('slow');
			});
		}
	},

	addBenchmarkResult:
	{
		page: ['all'],
		once: function()
		{
			$('<div>Benchmark</div>').appendTo('#AN_divRight').click(function()
			{
				var arrHTML = ['<table><tr style="background-color: #336699; font-weight: bold"><td style="color: white">功能</td><td style="color: white; border-left-width: 1px; text-align: right">執行時間</td></tr>'];
				$.each(AN.data.benchmark, function()
				{
					arrHTML.push($.sprintf('<tr><td>%s</td><td style="border-left-width: 1px; text-align: right">%s ms</td></tr>', this[0], this[1]));
				});
				arrHTML.push('</table>');

				$('#AN_divMiddleBox')
				.children(':first').html('Benchmark Result')
				.end()
				.children(':last').html(arrHTML.join(''));

				$('html').css('overflow', 'hidden');
				$('#AN_divGrayLayer').show().fadeTo('slow', 0.7).one('click', function()
				{
					$('html').css('overflow', '');
					$(this).add('#AN_divMiddleBox').fadeOut('slow');
				});
				$('#AN_divMiddleBox').fadeIn('slow');
			});
		}
	},

	addLog:
	{
		page: ['all'],
		once: function()
		{
			AN.shared.log = function(strLog)
			{
				if(AN.data.settings1.other1) $('#AN_divLog:hidden').fadeIn('fast');
				$('<div>' + strLog + '</div>').prependTo('#AN_divLogContent').slideDown('slow');
			}

			AN.shared.debug = function(strLog)
			{
				if(AN.data.settings1.other2) AN.shared.log('debug: ' + strLog);
			}

			$.fn.debug = function(strToEval)
			{
				AN.shared.log('debug: ' + eval('(' + strToEval + ')'));
				return this;
			}

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

				$('html').css('overflow', 'hidden');
				$('#AN_divGrayLayer').show().fadeTo('slow', 0.7).one('click', function()
				{
					$('html').css('overflow', '');
					$(this).add('#AN_divMiddleBox').fadeOut('slow');
				});
				$('#AN_divMiddleBox').fadeIn('slow');
			});
		}
	},

	convertData:
	{
		page: ['view'],
		once: function()
		{
			var arrMatch;

			$.each(AN.shared.getReplies(), function(i, objReply)
			{
				if(objReply.strUserId == '148720') // me :P
				{
					objReply.$tdContent.find('a').each(function(i, nodA)
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
	},

	removeTextAd:
	{
		page: ['all'],
		once: function()
		{
			$('#ctl00_ContentPlaceHolder1_MiddleAdSpace1').fn(function()
			{
				this.children('table:first').prevAll().remove();
				var nodSpan = this.get(0);
				if(nodSpan.firstChild.nodeType == 3) nodSpan.removeChild(nodSpan.firstChild);
			});
		}
	}
}

/////////////////// END OF - [Compulsory Functions] ///////////////////
/////////////////// START OF - [Special Settings] ///////////////////

AN.settings =
{
	autoShowLog:
	{
		disp: '自動顯示記錄視窗 (log)',
		defaultOn: true,
		id: 1
	},

	enableDebugLog:
	{
		disp: '顯示除錯資訊 (developer專用)',
		defaultOn: false,
		id: 2
	}
}

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
				//if($(this).html() == '最近刊登的文章')
				if($(this).css('fontWeight') == 'bold' && $(this).css('fontSize') == '8pt')
				{
					$(this).parents('tr:eq(1)').remove();
					return false; // break;
				}
			});
		}
	},

	removeDuplicateImages:
	{
		disp: '移除同一回覆內重複的圖片',
		type: 4,
		page: ['view'],
		defaultOn: true,
		id: 34,
		infinite: function()
		{
			$.each(AN.shared.getReplies(), function()
			{
				var arrSrcs = [];
				this.$tdContent.find('img[onload]').each(function()
				{
					if($(this).width() <= 100) return;

					if($.inArray(this.src, arrSrcs) == -1) arrSrcs.push(this.src);
					else $(this).parent().after('<span class="AN_spanLine">重複圖片已被移除</span>').remove();
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
			$('<div>Unmask all</div>').appendTo('#AN_divTopLeft').click(function()
			{
				AN.data.unmasked = true;
				$('.AN_maskedLink').click();
				$(this).fadeOut('slow');
			});
		},
		infinite: function()
		{
			if(AN.data.unmasked) return;

			$.each(AN.shared.getReplies(), function()
			{
				this.$tdContent
				.find('img[onload]').hide().after('<span class="AN_spanClickBox">點擊顯示圖片</span>')
				.parent().addClass('AN_maskedLink').one('click', function()
				{
					this.blur();
					$(this).removeClass('AN_maskedLink').children(':first').fadeIn('slow').next().remove();
					if(AN.data.settings1.view11) DrawImage(this.firstChild, true);

					return false;
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
		},
		infinite: function()
		{
			var strLinkColor = AN.shared.getOption('strLinkColor');

			$('a').filter(function()
			{
				return (this.href.match(/javascript:|http:\/\/forum\d+\.hkgolden\.com/i));
			})
			.addClass('aForumLink')
			.filter(function()
			{
				return (this.href.match(/javascript:|(?:blog|default|newmessages|topics)\.aspx/i) && !this.href.match(/redhotpage=|fanti=/i));
			})
			.add('#ctl00_ContentPlaceHolder1_lb_UserName > a')
			.css('color', strLinkColor);
		}
	},

	removeRedHotRanking:
	{
		disp: '移除紅人榜',
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
			$('a[href*=&highlight_id=0]').each(function()
			{
				this.href = $(this).attr('href').replace(/&highlight_id=0/i, '') // using jQuery to fix an IE 7 bug
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
				window.open('search.aspx?st=' + strType + '&searchstring=' + escape($('#searchstring').val()), '_blank');
				$('#searchstring').val('');
			}
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
				this.$trTopicRow.find('a:last').attr('href', '/search.aspx?st=A&searchstring=' + escape(this.strUserName));
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
			AN.func.toggleAllQuotes = function(nodB)
			{
				var booShow = (nodB) ? ($(nodB).next().html() == '+') : false;
				$('.AN_outermostFirstB').next().each(function(){ AN.func.toggleThisQuote({ nodB: this, booShow: booShow }) });
			}

			AN.func.toggleThisQuote = function(objData)
			{
				$b = $(objData.nodB);
				var $divToToggle = $b.parents('blockquote:first').find('blockquote:first');

				var booShow = (objData.booShow === undefined) ? ($b.html() == '+') : objData.booShow;

				if(booShow)
				{
					$divToToggle.show();
					$b.html('-');
					$b.parents('div:first').css('marginBottom', '2px');
				}
				else
				{
					$divToToggle.hide();
					$b.html('+');
					$b.parents('div:first').css('marginBottom', '5px');
				}
			}

			AN.shared.addStyle(' \
			blockquote { margin: 5px 0 5px 0; border: 1px solid black; } \
			blockquote blockquote { margin-top: 0; border-right: 0; } \
			blockquote div { padding: 0 0 5px 2px; } \
			.AN_quoteHeader { padding: 0 0 0 3px; color: white; font-size: 12px; background-color: #336699; border-bottom: 1px solid black; margin-bottom: 2px; } \
			.AN_quoteHeader span { display: inline-block; width: 49.8%; } \
			.AN_quoteHeader b { font-family: "Courier New"; cursor: pointer; margin-right: 3px; } \
			');
		},
		infinite: function()
		{
			$('blockquote').each(function()
			{
				$quote = $(this);

				while(true)
				{
					var nodTemp = this.nextSibling;

					if(nodTemp)
					{
						if(nodTemp.nodeName.toLowerCase() == 'br' || (nodTemp.nodeValue && nodTemp.nodeValue.match(/^\s+$/)))
						{
							$(nodTemp).remove();
							continue;
						}
					}
					else
					{
						if($quote.parent('div').length) // is an empty quote && not outermost
						{
							var $div = $quote.parent();
							$div.prev().find('b:last').css('visibility', 'hidden');
							$div.replaceWith($quote.children());
							return;
						}
					}
					break;
				}

				$quote.prepend('<div class="AN_quoteHeader"><span>引用:</span><span style="text-align:right"><b style="Toggle this" onclick="AN.func.toggleThisQuote({nodB:this})">-</b></span>');

				if(!$quote.find('blockquote').length) // innermost or single-layer
				{
					$quote.find('b').css('visibility', 'hidden');
				}
				if(!$quote.parent('div').length) // outermost
				{
					$quote.find('b').before('<b title="Toggle all outermost quotes" class="AN_outermostFirstB" onclick="AN.func.toggleAllQuotes(this)">O</b>');
				}
			});

			if(AN.shared.getOption('booOuterOnly')) AN.func.toggleAllQuotes();
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
			$window.DrawImage = function(nodImg, booForceResize)
			{
				if(!$(nodImg).width() || (AN.data.settings1.view35 && !booForceResize)) return; // for ajaxify & maskedImages

				nodImg.setAttribute('onload','');
				nodImg.alt = '[AN]DEADIMAGE';

				var imgTemp = new Image();
				imgTemp.src = nodImg.src;

				var numWidth = imgTemp.width;
				if(!numWidth || !imgTemp.complete) return; // dead

				var numHeight = imgTemp.height;

				var numMaxWidth = AN.shared.getOption('numImageWidth');
				var numMaxWidthAllowed = $(nodImg.offsetParent).width() - nodImg.offsetLeft - 5;
				if(numMaxWidth > numMaxWidthAllowed) numMaxWidth = numMaxWidthAllowed;

				if(numWidth > 100) nodImg.style.display = 'block';

				if(numHeight / numWidth > AN.shared.getOption('numMaxRatio'))
				{
					nodImg.width = 30;
					nodImg.height = 30;
					nodImg.title = ';)';
					$(nodImg).parent().after($.sprintf('<span class="AN_spanLine">圖片長闊比例 &gt; %s, 金箍棒已被壓成廢鐵!</span>', AN.shared.getOption('numMaxRatio')));
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
			}
		},
		infinite: function()
		{
			if(AN.data.settings1.view35) return;

			$.each(AN.shared.getReplies(), function()
			{
				this.$tdContent.find('img[onload]').each(function(){ DrawImage(this, true); });
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
			$('#AN_divLeft')
			.find('#AN_divLeftMiddle').show().append('<div><a href="/topics.aspx?type=BW">Topics</a></div>')
			.end().fn(function()
			{
				this.css('margin-top', -(this.outerHeight() / 2));
			});
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
			.append('<div onclick="scrollTo(0,99999)">Bottom</div>')
			.fn(function()
			{
				if($('#AN_divLeftMiddle:hidden').length) this.children(':first').css('border-bottom-width', '1px');
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

			//$('#ctl00_ContentPlaceHolder1_messagetext').css('max-width', '95%');

			$window.OnQuoteSucceeded = function(result)
			{
				$('#ctl00_ContentPlaceHolder1_messagetext').val(unescape(result) + '\n');
				$('#AN_divToToggle:hidden').show();
			}
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
			]

			$.each(AN.shared.getTopicRows(), function()
			{
				var $a = this.$trTopicRow.find('td:eq(1) a:first');
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
		disp: '修正下方選單位置 (IE Only)',
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
			var numPageNo = AN.shared.getCurPageNo();
			var numFloorNum = (numPageNo == 1) ? 0 : 50 * (numPageNo - 1) + 1;
			$.each(AN.shared.getReplies(), function()
			{
				this.$repliers.find('span:last').append($.sprintf(' <span class="AN_spanBox">#%s</span>', numFloorNum++));
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
				this.$tdContent.find('a').each(function()
				{
					if(this.href.match(/[?&](?:r(?:ef(?:er[^=]+)?)?|uid)=|logout|shortlink|tinyurl|urlpire/i))
					{
						$(this).data('keyword', RegExp.lastMatch).hover(
							function()
							{
								var $this = $(this);
								$('#AN_divAlertBox')
								.css({ top: ($this.offset().top - $this.height() - 10), left: $this.offset().left })
								.html('發現可疑連結! keyword: <span style="color: black">' + $this.data('keyword') + '</span>')
								.show();
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
			//if(!AN.data.strCurPage.match(/^(?:topics|view|search|newmessages|default)$/)) return;
			$('table,td').filter(function(){ return this.width.match(/^(?:955|937|806|800|792)$/); }).width('100%');
		}
	},

	removeDeadAvatar:
	{
		disp: '移除高級會員頭像死圖 (Admin已修正)',
		type: 4,
		page: ['view'],
		defaultOn: false,
		id: 22,
		infinite: function()
		{
			$('img[alt=Logo]')
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
				this.$tdContent.css({ wordWrap: 'break-word', overflow: 'hidden' }).parents('table:first').css('table-layout', 'fixed');
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
			var regLink = /(?:(h\w{2}ps?[:\/]+?)|[\w-]+?@)?((?:(?:\d{1,3}\.){3}\d{1,3}|(?:[\w-]+?\.){0,4}[\w-]{2,}\.(?:biz|cn|cc|co(?=\.)|com|de|eu|gov|hk|info|jp(?!g)|net|org|ru|tk|us)(?:\.[a-z]{2,3})?)(?::\d{1,5})?(?:\/[\w~./%?&=#+:-]*)?)/i;

			var funWrap = function(nodToWrap)
			{
				nodToWrap.splitText(RegExp.leftContext.length + RegExp.lastMatch.length);
				nodToWrap = nodToWrap.splitText(RegExp.leftContext.length);

				var strHref = (RegExp.$1 || 'http://') + RegExp.$2;
				$(nodToWrap)
				.wrap($.sprintf('<a href="%s" />', strHref))
				.parent().before('<span style="cursor: default; color: gray; margin-right: 2px" title="Characters Linkified">[L]</span>');
			}

			var funSearch = function(nodToTest)
			{
				if(nodToTest.nodeType == 3)
				{
					if(nodToTest.nodeValue.match(regLink)) funWrap(nodToTest);
				}
				else if(nodToTest.firstChild && !nodToTest.nodeName.match(/^(?:a|button|script|style)/i))
				{
					funSearch(nodToTest.firstChild);
				}

				if(nodToTest.nextSibling) funSearch(nodToTest.nextSibling);
			}

			$.each(AN.shared.getReplies(), function()
			{
				funSearch(this.$tdContent.get(0).firstChild);
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
				this.$tdContent.find('a').each(function()
				{
					if(this.hostname.match(/forum\d*.hkgolden\.com/i) && this.firstChild.nodeName.toLowerCase() != 'img' && RegExp.lastMatch != location.hostname)
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
		disp: 'Ajax化頁面讀取 (freeze on FF!)',
		type: 1,
		page: ['view'],
		defaultOn: false,
		id: 28,
		once: function()
		{
			AN.func.getURL = function(numPageNo)
			{
				return location.href.replace(/&page=\d+/, '') +  '&page=' + numPageNo;
			}

			AN.func.changeReplies = function($html, numPageNo)
			{
				AN.data.jPages[numPageNo] = $('<div />').append($html.find('select[name=page]:first').parents('table:eq(2)').prev().nextAll('table'));
				AN.data.jPages[AN.shared.getCurPageNo()].after(AN.data.jPages[numPageNo]).remove();
				AN.init.execFunc(false);
			}

			AN.func.afterPageChanging = function(numCurPageNo)
			{
				AN.func.addEvents();
				scrollTo(0,0);
				AN.shared.log($.sprintf('Successfully changed to page %s.', numCurPageNo));
				clearTimeout(AN.data.timeGetPage);
				AN.data.timeGetPage = setTimeout(function(){ AN.func.getPage(); }, 30000);
			}

			AN.func.goToPage = function(event, numPageNo)
			{
				event.preventDefault();

				AN.shared.log($.sprintf('Changing to page %s, please wait...', numPageNo));

				if(!AN.data.jPages[numPageNo])
				{
					if(AN.data.jCache[numPageNo])
					{
						AN.func.changeReplies(AN.data.jCache[numPageNo], numPageNo);
						AN.data.jCache[numPageNo] = null;
						AN.func.afterPageChanging(numPageNo);
					}
					else
					{
						$.get(AN.func.getURL(numPageNo), function(strHTML)
						{
							AN.func.changeReplies($(strHTML), numPageNo);
							AN.func.afterPageChanging(numPageNo);
						});
					}
				}
				else
				{
					AN.data.jPages[AN.shared.getCurPageNo()].after(AN.data.jPages[numPageNo]).remove();
					AN.func.afterPageChanging(numPageNo);
				}
			}

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
						var numCurPageNo = $('select[name=page]').not(this).children(':selected').val();
						$(this).children().eq(numCurPageNo - 1).attr('selected', true);
						AN.func.goToPage(event, numSelected);
					});
				});
			}

			/// cacheNextPage & autoAddReplies ///
			AN.func.getPage = function()
			{
				var numCurPageNo = AN.shared.getCurPageNo();
				var booHasNextPage = $('select[name=page]:first :selected').next().length;

				if(!booHasNextPage)
				{
					if(numCurPageNo == 21) return; // 1001

					AN.shared.log('Querying lastest replies...');
					$.get(AN.func.getURL(numCurPageNo), function(strHTML)
					{
						var
						$html = $(strHTML),
						numRepliesLength = $('.repliers').length,
						booIsRepliesMax = (numCurPageNo == 1) ? (numRepliesLength == 51) : (numRepliesLength == 50),
						$select = $html.find('select[name=page]:first'),
						booHasNextPage_new = $select.find(':selected').next().length;

						if($html.find('strong:first').text() != $('strong:first').text() || (booIsRepliesMax && booHasNextPage_new))
						{
							var $temp = $('<div />').append($select.parents('table:eq(2)').prev().nextAll('table'));
							AN.data.jPages[numCurPageNo].after($temp).remove();
							AN.data.jPages[numCurPageNo] = $temp;

							AN.init.execFunc(false);
							AN.func.addEvents();

							if(booHasNextPage_new)
							{
								if(!booIsRepliesMax) AN.shared.log('New reply(s) added.');
								AN.shared.log('Found next page, page links added.');
								return;
							}
							else AN.shared.log('New reply(s) added, query again in 30s...');
						}
						else if(booIsRepliesMax) AN.shared.log('Next page not found, query again in 30s...');
						else AN.shared.log('No new replies, query again in 30s...');

						clearTimeout(AN.data.timeGetPage);
						AN.data.timeGetPage = setTimeout(function(){ AN.func.getPage(); }, 30000);
					});
				}
				else
				{
					var numPageToGet = numCurPageNo + 1;

					if(AN.data.jPages[numPageToGet] || AN.data.jCache[numPageToGet]) return AN.shared.log('Next page is already in cache, no caching needed.');
					AN.shared.log('Querying next page for caching...');
					$.get(AN.func.getURL(numPageToGet), function(strHTML)
					{
						AN.data.jCache[numPageToGet] = $(strHTML);
						AN.shared.log($.sprintf('Next page (%s) is cached.', numPageToGet));
					});
				}
			}

			var numCurPageNo = AN.shared.getCurPageNo();
			$.ajaxSetup({ cache: false });
			AN.data.jCache = {};
			AN.data.jPages = {};
			AN.data.jPages[numCurPageNo] = $('select[name=page]:first').parents('table:eq(2)').prev().nextAll('table').wrapAll('<div />').parent();
			AN.func.addEvents();
			AN.data.timeGetPage = setTimeout(function(){ AN.func.getPage(); }, 30000);

			$('<div>Refresh Now</div>').appendTo('#AN_divTopLeft').click(function()
			{
				clearTimeout(AN.data.timeGetPage);
				AN.func.getPage();
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
				this.$repliers.find('a:last').remove();
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
				this.$repliers.find('a:last').prev().andSelf().remove();
			});
		}
	}

	// 34 is moved up
	// 35 is moved up
}

///////////// END OF - [Execute Fuctions] ///////////////////