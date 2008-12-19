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
// @name Helianthus.Annuus: Initializer
// @namespace http://forum.hkgolden.com/
// @description version 2.x.x_alpha by 向日
// @include http://forum*.hkgolden.com/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.min.js
// ==/UserScript==

/////////////////// START OF - [Preperation] ///////////////////

AN = { init: {}, func: {} };

(function()
{
	if(typeof jQuery == 'undefined')
	{
		return setTimeout(arguments.callee, 50);
	}

	if(typeof unsafeWindow != 'undefined')
	{
		$window = unsafeWindow;
		$window.$ = jQuery;
		$window.AN = AN;
	}
	else
	{
		$window = window;
	}

	$($window).unload(function(){ AN = null; });

	$(function(){ AN.init.addPlugins() });
})();

/////////////////// END OF - [Preperation] ///////////////////
/////////////////// START OF - [jQuery Plugins] ///////////////////

AN.init.addPlugins = function()
{
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
			if(this.length) return fnToCall.call(this);
			else return this;
		},

		outer: function()
		{
			if(this.get(0).outerHTML) return this.get(0).outerHTML;
			else return $('<div />').append(this.eq(0).clone()).html();
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
			// having some fucking issues with constructor on FF3, dont know why!!
			else if(!objToConvert.length) // Object
			{
				var arrTemp = [];
				$.each(objToConvert, function(strObjName, strValue)
				{
					if(strValue !== undefined) arrTemp.push(strObjName + '::=' + strValue);
				});
				return arrTemp;
			}
			else // String or Array
			{
				if(objToConvert.fixed) objToConvert = [objToConvert]; // convert string into array

				var objTemp = {};
				$.each(objToConvert, function(i, strValue)
				{
					var arrSplit = strValue.split('::=');
					if(!isNaN(arrSplit[1]))
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
		},

		getData: function(strUrl, funToCall)
		{
			var strDataName = strUrl.match(/[^\/.]+(?=\.js$)/);
			if(strDataName) strDataName = strDataName[0];
			else return;

			$.getScript(strUrl, function()
			{
				funToCall(AN.data[strDataName]);
				delete AN.data[strDataName];
			});
		}
	});

	AN.init.buildData();
}

/////////////////// END OF - [jQuery Extension] ///////////////////
/////////////////// START OF - [Page Recognition] ///////////////////

AN.init.buildData = function()
{
	AN.data =
	{
		strCurPage: ($('#aspnetForm').get(0)) ? $('#aspnetForm').attr('action').match(/[^.]+/).toString().toLowerCase() : 'special'
	};
}

/////////////////// END OF - [Page Recognition] ///////////////////
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
			// agin with the constructor problem!
			if(!objValue.length) // Object, convert it to an array
			{
				objValue = $.convertObj(objValue);
			}

			if(objValue.fixed) // String
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