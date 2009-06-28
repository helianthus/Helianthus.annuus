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
// @name Helianthus.Annuus 3: Component Redesigner
// @namespace http://code.google.com/p/helianthus-annuus/
// @description by 向日
// @include http://forum*.hkgolden.com/*
// @run-at document-start
// ==/UserScript==

(function()
{

var window = (typeof unsafeWindow != 'undefined') ? unsafeWindow : (typeof contentWindow != 'undefined') ? contentWindow : this;
var AN = window.AN || (window.AN = { temp: [], mod: {} });

if(AN.initialized) return; // for Chrome which interestingly executes user scripts even when injecting xhr HTML into an element

AN.temp.push(function()
{
	var JSON = window.JSON;
	var $, jQuery = $ = window.jQuery;

	AN.mod['Component Redesigner'] =
	{
		ver: '1.0.6',
		fn: {

'8be1ac06-030a-42d4-a8f4-f2b7f4881300':
{
	desc: '改變引用風格',
	page: { 32: true },
	type: 8,
	defer: 1, // after linkify to improve effieciency, note: this is a part of layout changing
	options: { bOuterOnly: { desc: '只顯示最外層的引用', type: 'checkbox', defaultValue: true } },
	once: function(jDoc)
	{
		AN.box.toggleQuote = function(jTarget, bOuterOnly)
		{
			if(bOuterOnly === undefined) bOuterOnly = (jTarget.html() == '-');

			if(bOuterOnly)
			{
				jTarget.each(function()
				{
					$(this)
					.html('+')
					.parent().css('margin-bottom', '5px')
					.next().children('blockquote').hide();
				});
			}
			else
			{
				jTarget.each(function()
				{
					$(this)
					.html('-')
					.parent().css('margin-bottom', '2px')
					.next().children('blockquote').show();
				});
			}
		};

		var bOuterOnly = AN.util.getOptions('bOuterOnly');
		AN.shared('addButton', '切換最外層引用', function()
		{
			AN.box.toggleQuote($('.an-outerquote'), (bOuterOnly = !bOuterOnly));
		});

		AN.util.addStyle($.sprintf(' \
		.repliers_right blockquote { margin: 5px 0; border: 1px solid %(sMainBorderColor)s; } \
		.repliers_right blockquote blockquote { margin-top: 0; border-right: 0; } \
		.repliers_right blockquote div { padding: 0 0 5px 2px; } \
		.an-quoteheader { padding: 0 3px !important; font-size: 12px; margin-bottom: 2px; overflow: hidden; } \
		.an-quoteheader span { float: left; } \
		.an-quoteheader b { float: right; cursor: pointer; } \
		',
		AN.util.getOptions()
		));
	},
	infinite: function(jDoc)
	{
		var jTempHeader = $('<div class="an-forum-header an-quoteheader"><span>引用:</span><b onclick="AN.box.toggleQuote($(this))">-</b></div>');

		jDoc.find('blockquote').each(function()
		{
			jQuote = $(this);

			while(true)
			{
				var eTemp = this.nextSibling;

				if(eTemp)
				{
					if($(eTemp).is('br') || (eTemp.nodeValue && eTemp.nodeValue.match(/^\s+$/)))
					{
						$(eTemp).remove();
						continue;
					}
				}
				else if(jQuote.parent().parent().is('blockquote')) // is an empty quote && not outermost
				{
					jQuote.parent().parent().replaceWith(jQuote);
				}
				break;
			}

			var jHeader = jTempHeader.clone(true).prependTo(jQuote);

			if(!jQuote.find('blockquote').length) // innermost or single-layer
			{
				jHeader.children('b').remove();
			}
			if(!jQuote.parent().parent().is('blockquote')) // outermost or single-layer
			{
				jHeader.css('margin-bottom', '5px').children('b').addClass('an-outerquote');
			}
		});

		if(AN.util.getOptions('bOuterOnly')) jDoc.defer(3, '隱藏最外層以外的引用', function(){ AN.box.toggleQuote(jDoc.find('.an-outerquote'), true); });
	}
},

'cb1917f9-4053-40b1-870d-e0e2c6a90b39':
{
	desc: '改變快速回覆的風格',
	page: { 32: true },
	type: 8,
	options:
	{
		bToggleOnClick: { desc: '心須點擊才顯示/隱藏', type: 'checkbox', defaultValue: true },
		nQROpacity: { desc: '透明度 (10 = 移除半透明)', type: 'select', defaultValue: 7, choices: [10,9,8,7,6,5,4,3,2,1,0] }
	},
	once: function()
	{
		if(!AN.util.isLoggedIn()) return;

		var jQR = $('#newmessage');

		jQR
		.css(
		{
			position: 'fixed',
			'z-index': 10,
			width: '806px',
			left: ($.winWidth() - 806) / 2 + 'px',
			bottom: '-2px'
		})
		.fadeTo(0, AN.util.getOptions('nQROpacity') / 10)		
		.prevAll('br:lt(2)').remove();
		
		var jQRContent = jQR.find('tr:eq(2)').hide();
		var jQRClickbar = jQR.find('td:eq(1)').css('text-align', 'center');
		
		if(AN.util.getOptions('bToggleOnClick'))
		{
			jQRClickbar.html('點擊顯示/隱藏快速回覆').css('cursor', 'pointer').click(function()
			{
				jQRContent.css('display') == 'none' ? jQRContent.show() : jQRContent.hide();
				$('#previewArea').empty();
			});
		}
		else
		{
			jQRClickbar.html('快速回覆');
			jQR.hover(
				function()
				{
					jQRContent.show();
				},
				function()
				{
					jQRContent.hide();
					$('#previewArea').empty();
				}
			);
		}

		$('#aspnetForm').submit(function()
		{
			jQRContent.hide();
		});

		window.OnQuoteSucceeded = function(result)
		{
			jQRContent.show();
			$('#ctl00_ContentPlaceHolder1_messagetext').val(unescape(result) + '\n')[0].scrollIntoView(false);
			window.moveEnd();
		};
	}
}

}}; // end mod

}); // end push

})(); // end anonymous