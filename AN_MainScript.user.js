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

/////////////////// START OF - [Main Object Declaration] ///////////////////

// Will be merged with Initialization section
var $window, AN;

if(typeof unsafeWindow != 'undefined')
{
	$window = unsafeWindow;
	AN = unsafeWindow.AN = {};
}
else
{
	$window = window;
	AN = {};
}

AN.init = {};

/////////////////// END OF - [Main Object Declaration] ///////////////////
/////////////////// START OF - [jQuery] ///////////////////

// The code in this section will be changed into the content of jQuery once this project becomes stable
(function()
{
	var nodScript = document.createElement('script');
	nodScript.type = 'text/javascript';
	nodScript.src = 'http://jqueryjs.googlecode.com/files/jquery-1.2.6.pack.js';
	document.documentElement.firstChild.appendChild(nodScript);
})();

(function()
{
	if(!$window.$) return setTimeout(arguments.callee, 500);

	if(typeof unsafeWindow != 'undefined')
	{
		$ = unsafeWindow.$;
		AN.init.addPlugins();
	}
	else $(AN.init.addPlugins);
})();

/////////////////// END OF - [jQuery] ///////////////////
/////////////////// START OF - [jQuery Plugins] ///////////////////

AN.init.addPlugins = function()
{
	$.ajaxSetup({ cache: true });

/*
	$.getScript('http://jquery-ui.googlecode.com/svn/tags/1.6rc2/ui/ui.core.min.js', function()
	{
		$.getScript('http://jquery-ui.googlecode.com/svn/tags/1.6rc2/ui/ui.colorpicker.min.js');
	});
*/

	// (v)sprintf by Sabin Iacob
	(function(){
		var formats = {
			'%': function(val) {return '%';},
			'b': function(val) {return  parseInt(val, 10).toString(2);},
			'c': function(val) {return  String.fromCharCode(parseInt(val, 10));},
			'd': function(val) {return  parseInt(val, 10) ? parseInt(val, 10) : 0;},
			'u': function(val) {return  Math.abs(val);},
			'f': function(val, p) {return  (p > -1) ? Math.round(parseFloat(val) * Math.pow(10, p)) / Math.pow(10, p): parseFloat(val);},
			'o': function(val) {return  parseInt(val, 10).toString(8);},
			's': function(val) {return  val;},
			'x': function(val) {return  ('' + parseInt(val, 10).toString(16)).toLowerCase();},
			'X': function(val) {return  ('' + parseInt(val, 10).toString(16)).toUpperCase();}
		};

		var re = /%(?:(\d+)?(?:\.(\d+))?|\(([^)]+)\))([%bcdufosxX])/g;

		var dispatch = function(data){
			if(data.length == 1 && typeof data[0] == 'object') { //python-style printf
				data = data[0];
				return function(match, w, p, lbl, fmt, off, str) {
					return formats[fmt](data[lbl]);
				};
			} else { // regular, somewhat incomplete, printf
				var idx = 0; // oh, the beauty of closures :D
				return function(match, w, p, lbl, fmt, off, str) {
					return formats[fmt](data[idx++], p);
				};
			}
		};

		$.extend({
			sprintf: function(format) {
				var argv = Array.apply(null, arguments).slice(1);
				return format.replace(re, dispatch(argv));
			},
			vsprintf: function(format, data) {
				return format.replace(re, dispatch(data));
			}
		});
	})();

	AN.init.extend();
}

/////////////////// END OF - [jQuery Plugins] ///////////////////
/////////////////// START OF - [jQuery Extension] ///////////////////

AN.init.extend = function()
{
	$.fn.extend(
	{
		fn: function(fnToCall)
		{
			return fnToCall.call(this);
		},

		outer: function()
		{
			return $('<div />').append(this.eq(0).clone()).html();
		},

		alert: function(strToEval)
		{
			alert(eval('(' + strToEval + ')'));
			return this;
		},

		aO: function()
		{
			alert(this.outer());
			return this;
		},

		aL: function()
		{
			alert(this.length);
			return this;
		},

		goup: function(strName, numTimes)
		{
			return this.map(function()
			{
				var nodTarget = this;
				for(var i=0;i<numTimes;i++)
				{
					while((nodTarget = nodTarget.parentNode).nodeName.toLowerCase() != strName);
				}
				return nodTarget;
			});
		}
	});

	$.extend(
	{
		time: function()
		{
			return (new Date()).getTime();
		},

		convertObj: function(objToConvert)
		{
			if(!objToConvert)
			{
				return null;
			}
			else if(objToConvert.constructor == Object)
			{
				var arrTemp = [];
				$.each(objToConvert, function(strObjName, strValue)
				{
					arrTemp.push(strObjName + ':' + strValue);
				});
				return arrTemp;
			}
			else // Array
			{
				var objTemp = {};
				$.each(objToConvert, function(i, strValue)
				{
					var arrSplit = strValue.split(':');
					if(Number(arrSplit[1]) != NaN)
					{
						objTemp[arrSplit[0]] = Number(arrSplit[1]);
					}
					else
					{
						objTemp[arrSplit[0]] = arrSplit[1];
					}
				});
				return objTemp;
			}
		}
	});

	AN.init.start();
}

/////////////////// END OF - [jQuery Extension] ///////////////////
/////////////////// START OF - [Utility Functions] ///////////////////

AN.util =
{
	cookie: function(strName, objValue)
	{
		// GET
		if(objValue === undefined)
		{
			var numStart = document.cookie.indexOf(strName + '=');
			if(numStart == -1) return null;

			numStart += strName.length + 1;

			var numEnd = document.cookie.indexOf(';', numStart);
			if(numEnd == -1) numEnd = document.cookie.length;

			var strValue = document.cookie.substring(numStart,numEnd);

			if(strValue.indexOf(',') > 0) // Array
			{
				var arrValue = strValue.split(',');
				$.each(arrValue, function(i)
				{
					arrValue[i] = unescape(arrValue[i]);
				});
				return arrValue;
			}
			return unescape(strValue);
		}
		// SET
		else if(objValue)
		{
			if(objValue.constructor == Object) // convert it to an array
			{
				objValue = $.convertObj(objValue);
			}

			if(objValue.constructor == String)
			{
				var strValueToSave = escape(objValue);
			}
			else // Array
			{
				$.each(objValue, function(i)
				{
					objValue[i] = escape(objValue[i]);
				});
				var strValueToSave = objValue.toString();
			}

			var datExpire = new Date();
			datExpire.setFullYear(datExpire.getFullYear() + 1);

			document.cookie = strName + '=' + strValueToSave + '; domain=hkgolden.com; expires=' + datExpire.toUTCString() + '; path=/';
		}
		// DEL
		else
		{
			if(document.cookie.indexOf(strName + '=') == -1) return null;

			var datExpire = new Date();
			datExpire.setFullYear(1999);

			document.cookie = strName + '=xxx; domain=hkgolden.com; expires=' + datExpire.toUTCString() + '; path=/';
		}
	}
}

/////////////////// END OF - [Utility Functions] ///////////////////
/////////////////// START OF - [Initialization] ///////////////////

AN.init.start = function()
{
	AN.data =
	{
		settings1: $.convertObj(AN.util.cookie('AN_settings1')) || {},
		settings2: $.convertObj(AN.util.cookie('AN_settings2')) || {},
		strCurPage: $('#aspnetForm').attr('action').match(/[^.]+/).toString().toLowerCase()
	}

	// Seperate settings getting & execution into two operations because one option could be used by more than one function
	$.each(AN.main, function()
	{
		if(AN.data.settings1[this.id] === undefined)
		{
			AN.data.settings1[this.id] = (this.defaultOn) ? 1 : 0;
		}

		if(!this.options) return; // continue

		$.each(this.options, function(strOptionName, strOptionValue)
		{
			if(AN.data.settings2[strOptionName] === undefined)
			{
				AN.data.settings2[strOptionName] = strOptionValue;
			}
		});
	});

	$.each(AN.comp, function()
	{
		if(this.page[0] == 'all' || $.inArray(AN.data.strCurPage, this.page) != -1)
		{
			this.fn();
		}
	});

	$.each(AN.main, function()
	{
		if(this.page[0] == 'all' || $.inArray(AN.data.strCurPage, this.page) != -1)
		{
			if(AN.data.settings1[this.id])
			{
				this.fn.call(this);
			}
		}
	});
}

/////////////////// END OF - [Initialization] ///////////////////
/////////////////// START OF - [Helper Functions] ///////////////////

AN.helper =
{
	addStyle: function(strStyle)
	{
		$('<style type="text/css">' + strStyle + '</style>').prependTo('head');
	},

	getOptions: function(strOptionName)
	{
		return AN.data.settings2[strOptionName];
	}
}

/////////////////// END OF - [Helper Functions] ///////////////////
/////////////////// START OF - [Compulsory Functions] ///////////////////

AN.comp =
{
	addSettings:
	{
		page: ['all'],
		fn: function()
		{
			AN.helper.addStyle(' \
			#AN_divRight { position: fixed; top: 15%; right: 0; text-align: right; } \
			#AN_divRight div { width: 70px; color: gray; border-bottom: 1px solid gray; padding: 10px 5px 3px 0; cursor: pointer; } \
			#AN_divRight div:hover { color: YellowGreen; } \
			#AN_divGrayLayer { display: none; z-index: 1; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: gray; opacity: 0.7; filter: alpha(opacity=70); } \
			#AN_divSettingsFrame { display: none; z-index: 2; position: fixed; top: 50%; left: 50%; width: 800px; height: 600px; margin: -300px 0 0 -400px; background-color: #F3F2F1; border: 1px solid black; } \
			#AN_divAccordion { overflow: hidden; height: 550px; border-bottom: 1px solid black; } \
			#AN_divAccordion h3 { line-height: 25px; height: 25px; margin: 0; padding: 0 5px; background-color: #336699; border-top: 1px solid black; color: white; cursor: pointer; } \
			#AN_divAccordion div { padding: 10px 20px 0; border-top: 1px solid black; overflow: auto; } \
			#AN_divAccordion ul { list-style: none; } \
			#AN_divAccordion li { margin-bottom: 5px; } \
			#AN_divAccordion fieldset { margin-bottom: 10px; } \
			#AN_divOkButton, #AN_divCancelButton { position: absolute; width: 100px; height: 25px; bottom: 12.5px; border: 1px solid black; line-height: 25px; text-align: center; cursor: pointer; } \
			#AN_divOkButton { left: 280px; } \
			#AN_divCancelButton { right: 280px; } \
			');

			$('<div id="AN_divRight"><div>Settings</div></div>').appendTo('body').children().click(function()
			{
				//$('html').css('overflow', 'hidden');
				$('#AN_divGrayLayer').show().fadeTo('slow', 0.7);
				$('#AN_divSettingsFrame').fadeIn('slow');
			});

			$('body')
			.append('<div id="AN_divGrayLayer" />')
			.append('<div id="AN_divSettingsFrame"><div id="AN_divAccordion" /><div id="AN_divFinishButtons" /></div>');

			AN.data.settingsStructure = {};

			var objPageMap =
			{
				all: '全局設定',
				topics: '標題頁',
				view: '帖子頁',
				profilepage: '用戶資料頁',
				search: '搜尋頁',
				'default': '主論壇頁',
				special: '特殊頁'
			}

			var objTypeMap =
			{
				1: '原創功能',
				2: '優化、修正原有功能',
				3: '加入物件',
				4: '移除物件',
				5: '美化頁面',
				6: '其他'
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
						switchedOn: AN.data.settings1[this.id],
						options: AN.data.settings2[this.id]
					}
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
						var strSwitchId = 'AN_inputSwitch_' + strFnId;
						var strChecked = (this.switchedOn) ? 'checked="checked"' : '';

						arrDivHTML.push($.sprintf('<li><input type="checkbox" id="%s" %s />', strSwitchId, strChecked));
						arrDivHTML.push($.sprintf('<label for="%s">%s</label></li>', strSwitchId, this.disp));
					});
					arrDivHTML.push('</ul></fieldset>');
				});
				arrDivHTML.push('</div>');

				$('#AN_divAccordion')
				.append('<h3>' + objPageMap[strPageName] + '</h3>')
				.append(arrDivHTML.join(''))
			});

			$('#AN_divAccordion')
			.append('<h3>其他選項</h3><div><ul /></div>')
			.children('h3:first').css('borderTop', '0')
			.fn(function()
			{
				this.siblings('div').height(550 - 10 - (25 + 1) * this.siblings('h3').andSelf().length); // may be able to be optimised, based on my final decision
				return this;
			})
			.end()
			.children('div:gt(0)').hide()
			.end()
			.children('h3').click(function()
			{
				$(this).next(':hidden').slideDown('slow').siblings('div:visible').slideUp('slow');
			});

			$('#AN_divFinishButtons')
			.append('<div id="AN_divOkButton">確定</div><div id="AN_divCancelButton">取消</div>')
			.children(':first-child').click(function()
			{
				$('#AN_divAccordion :checkbox')
				.each(function()
				{
					AN.data.settings1[this.id.replace('AN_inputSwitch_', '')] = (this.checked) ? 1 : 0;
				});

				AN.util.cookie('AN_settings1', AN.data.settings1);
				location.reload();
			})
			.next().click(function()
			{
				//$('html').css('overflow', '');
				$('#AN_divGrayLayer').fadeOut('slow');
				$('#AN_divSettingsFrame').fadeOut('slow');
			});
		}
	},

	addAbout:
	{
		page: ['all'],
		fn: function()
		{
			$('<div>About</div>').appendTo('#AN_divRight').click(function()
			{
				alert('Helianthus.Annuus\nversion: 2.x.x_alpha\nauthor: 向日');
			});
		}
	}
}

/////////////////// END OF - [Compulsory Functions] ///////////////////
/////////////////// START OF - [Main Functions] ///////////////////

AN.main =
{
	autoRedirect:
	{
		disp: '自動轉向正確頁面',
		type: 6,
		page: ['default'],
		defaultOn: true,
		id: 1,
		fn: function()
		{
			if(document.referrer.indexOf('/login.aspx') > 0) location.replace('/topics.aspx?type=BW');
			else if(!location.pathname.match(/^\/(?:default.aspx)?$/i)) location.reload();
		}
	},

	removeLeftArticles:
	{
		disp: '移除左側最近刊登的文章',
		type: 4,
		page: ['all'],
		defaultOn: true,
		id: 2,
		fn: function()
		{
			$('td:contains("最近刊登的文章"):last').goup('tr',2).remove();
		}
	},

	optimizeForumLinks:
	{
		disp: '美化論壇連結',
		type: 5,
		page: ['all'],
		defaultOn: true,
		id: 3,
		options: { color_forumLinks: '#1066d2' },
		fn: function()
		{
			var strLinkColor = AN.helper.getOptions('color_forumLinks');
			AN.helper.addStyle('a:link { color: ' + strLinkColor + '}');

			$('a').filter(function()
			{
				return (this.href.match(/javascript:|^http:\/\/forum\d+\.hkgolden\.com\//i) && this.href.indexOf('#') == -1);
			})
			.css({textDecoration: 'none'})
			.filter(function()
			{
				return (this.href.match(/javascript:|(?:blog|default|newmessages|topics)\.aspx/i) && !this.href.match(/redhotpage=|fanti=/i));
			})
			.add('#ctl00_ContentPlaceHolder1_lb_UserName > a')
			.css('color', strLinkColor);

			$('#ctl00_ContentPlaceHolder1_lb_bloglink span').css({textDecoration: 'none'})
		}
	},

	removeRedHotRanking:
	{
		disp: '移除紅人榜',
		type: 4,
		page: ['topics'],
		defaultOn: false,
		id: 4,
		fn: function()
		{
			$('#ctl00_ContentPlaceHolder1_HotPeoples').remove();
		}
	},

	betterFavicon:
	{
		disp: '採用更好的favicon (may not work)',
		type: 5,
		page: ['all'],
		defaultOn: true,
		id: 5,
		fn: function()
		{
			$('head').append('<link rel="shortcut icon" href="http://supergolden.m2.googlepages.com/hkg.ico" />');
		}
	}
}

/////////////////// END OF - [Execute Functions] ///////////////////