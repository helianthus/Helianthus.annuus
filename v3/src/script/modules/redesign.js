AN.mod['Component Redesigner'] = { ver: 'N/A', author: '向日', fn: {

'8be1ac06-030a-42d4-a8f4-f2b7f4881300':
{
	desc: '改變引用風格',
	page: { 32: true },
	type: 8,
	defer: 1, // after linkify to improve effieciency, note: this is a part of layout changing
	options:
	{
		bOuterOnly: { desc: '隱蔵內層引用', type: 'checkbox', defaultValue: true },
		nOuterNum: { desc: '外層引用的顯示數目', type: 'text', defaultValue: 1 }
	},
	once: function(jDoc, oFn)
	{
		this.bGlobalOuterOnly = AN.util.getOptions('bOuterOnly');

		this.toggleAll = (function()
		{
			var sSelector = '.an-quote-outermostheader';
			var n = AN.util.getOptions('nOuterNum');
			while(--n)
			{
				sSelector += ' + div > blockquote > div:first-child';
			}

			return function()
			{
				oFn.toggleQuote($(sSelector), oFn.bGlobalOuterOnly);
			};
		})();

		this.toggleQuote = function(jTarget, bOuterOnly)
		{
			if(bOuterOnly === undefined) // jTarget now is actually the event object
			{
				jTarget = $(this.parentNode);
				bOuterOnly = !jTarget.hasClass('an-quote-header-hideinner');
			}

			jTarget.toggleClass('an-quote-header-hideinner', bOuterOnly).children('b').html(bOuterOnly ? '＋' : '－');
		};

		AN.shared('addButton', '切換最外層引用', function()
		{
			oFn.bGlobalOuterOnly = !oFn.bGlobalOuterOnly;
			oFn.toggleAll();
		});

		AN.util.stackStyle($.sprintf(' \
		.repliers_right blockquote { margin: 5px 0; border: 1px solid %s; } \
		.repliers_right blockquote blockquote { margin-top: 0; border-right: 0; } \
		.repliers_right blockquote > div { padding: 0 0 5px 2px; } \
		.an-quote-header { margin-bottom: 2px; padding: 0 3px !important; font-size: 12px; line-height: 15px; overflow: hidden; } \
		.an-quote-header > b { float: right; cursor: pointer; font-weight: 900; } \
		.an-quote-innermostheader > b { display: none; } \
		.an-quote-header-hideinner { margin-bottom: 5px; } \
		.an-quote-header-hideinner + div > blockquote { display: none; } \
		',
		AN.util.getOptions('sMainBorderColor')
		));
	},
	infinite: function(jDoc)
	{
		jDoc.find('blockquote').each(function()
		{
			var jQuote = $(this);

			while(true)
			{
				var eNext = this.nextSibling;

				if(eNext)
				{
					if($(eNext).is('br') || eNext.nodeType == 3 && /^\s+$/.test(eNext.nodeValue))
					{
						$(eNext).remove();
						continue;
					}
				}
				else if(jQuote.parent().parent('blockquote').length)
				{
					jQuote.parent().parent().replaceWith(jQuote); // is an empty quote && not outermost
					continue;
				}

				break;
			}

			var jHeader = $('<div class="an-forum-header an-quote-header">引用:<b>－</b></div>').prependTo(jQuote);

			if(!jQuote.find('blockquote').length) // innermost or single-layer
			{
				jHeader.addClass('an-quote-innermostheader');
			}
			if(!jQuote.parent().parent('blockquote').length) // outermost or single-layer
			{
				jHeader.addClass('an-quote-outermostheader');
			}
		});

		$('.an-quote-header > b').click(this.toggleQuote);

		if(this.bGlobalOuterOnly) jDoc.defer(3, '隱藏最外層以外的引用', this.toggleAll);
	}
},

'cb1917f9-4053-40b1-870d-e0e2c6a90b39':
{
	desc: '改變快速回覆的風格',
	page: { 32: true },
	type: 8,
	options:
	{
		bAlternativeHide: { desc: '隱藏於右下角 [必須點擊]', type: 'checkbox', defaultValue: false },
		bToggleOnClick: { desc: '必須點擊才顯示/隱藏', type: 'checkbox', defaultValue: true },
		nQROpacity: { desc: '透明度 (10 = 移除半透明)', type: 'select', defaultValue: 10, choices: [10,9,8,7,6,5,4,3,2,1,0] }
	},
	once: function()
	{
		if(!AN.util.isLoggedIn()) return;

		var jQR = $('#newmessage');
		var nWidth = 939;
		var nRight = 50 - nWidth;

		AN.util.stackStyle($.sprintf('\
		#newmessage { %s; z-index: 3; position: fixed; width: %spx; bottom: -2px; %s; } \
		#an-qr-header { cursor: pointer; text-align: center; } \
		#previewArea { display: block; overflow: auto; width: %spx; } \
		#previewArea img[onload] { width: 300px; } \
		',
		AN.util.getOpacityStr(AN.util.getOptions('nQROpacity')),
		nWidth,
		AN.util.getOptions('bAlternativeHide') ? $.sprintf('right: %spx', nRight) : $.sprintf('left: 50%; margin-left: -%spx', nWidth / 2),
		nWidth - 159
		));
		
		var jQRContent = jQR.find('tr:eq(2)').hide();
		var jQRHeader = jQR.find('td:eq(1)').attr('id', 'an-qr-header').html('快速回覆');

		var isNotNeeded = function(bToShow)
		{
			return typeof bToShow == 'boolean' && bToShow == (jQRContent.css('display') != 'none');
		};

		var isToShow = function(bToShow)
		{
			return typeof bToShow == 'boolean' ? bToShow : jQRContent.css('display') == 'none';
		};

		var toggleQR = function(bToShow, fCallback)
		{
			if(isNotNeeded(bToShow)) return;

			jQRContent.toggle(isToShow(bToShow));
			$('#previewArea').empty();
			if(fCallback) fCallback();
		};

		if(AN.util.getOptions('bAlternativeHide'))
		{
			toggleQR = (function(toggleDisplay)
			{
				return function(bToShow)
				{
					if(isNotNeeded(bToShow)) return;

					isToShow(bToShow) ? jQR.animate({ right: ($.winWidth() - nWidth) / 2 + 5 }, 'slow', toggleDisplay) : toggleDisplay(false, function(){ jQR.animate({ right: nRight }, 'slow'); });
				}
			})(toggleQR);
			jQRHeader.click(toggleQR);
		}
		else
		{
			AN.util.getOptions('bToggleOnClick') ? jQRHeader.click(toggleQR) : jQR.hover(toggleQR, toggleQR);
		}

		$('#aspnetForm').submit(function()
		{
			toggleQR(false);
		});

		window._OnQuoteSucceeded = function(result)
		{
			toggleQR(true);
			$('#ctl00_ContentPlaceHolder1_messagetext').val(unescape(result) + '\n').scrollTop(99999);
			window.moveEnd();
		};
		
		window.OnQuoteSucceeded = new window.Function('result', 'window._OnQuoteSucceeded(result);');
		
		window.doPreview = (function(_doPreview)
		{
			var jPreview = $('#previewArea');
			
			return function()
			{
				jPreview.css('max-height', $.winHeight() - jQR.height() - jPreview.height());
				_doPreview();
			};
		})(window.doPreview);
	}
}

}};