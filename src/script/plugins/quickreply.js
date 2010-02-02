$.extend(an.plugins, {

'cb1917f9-4053-40b1-870d-e0e2c6a90b39':
{
	desc: '改變快速回覆的風格',
	page: { 32: on },
	type: 8,
	options:
	{
		sQRHideMethod: { desc: '隱藏方式', type: 'select', choices: ['完全隱藏', '隱藏於中下方, 懸浮切換顯示', '隱藏於中下方, 點擊切換顯示', '隱藏於右下角'], defaultValue: '隱藏於中下方, 點擊切換顯示' },
		nQROpacity: { desc: '透明度 (10 = 移除半透明)', type: 'select', defaultValue: 10, choices: [10,9,8,7,6,5,4,3,2,1,0] }
	},
	queue: [{
		fn: function(job)
		{
			if(!$.isLoggedIn()) return;

			var
			hideMode = $.inArray(job.options('sQRHideMethod'), job.plugin.options.sQRHideMethod.choices),
			jQR = $('#newmessage'),
			jQRHeader = jQR.find('td:eq(1)').attr('id', 'an-qr-header').html('快速回覆'),
			jToggle = (hideMode === 0 ? jQR : jQR.find('tr:eq(2)')).hide(),
			jPreview = $('#previewArea'),
			jTextarea = $('#ctl00_ContentPlaceHolder1_messagetext'),
			nWidth = 938, //jQR.width() + 1,
			nRight = 50 - nWidth;

			$.ss('\
			#hkg_bottombar { z-index: 3; } \
			#newmessage { {0}; background-color: transparent; z-index: 2; position: fixed; width: {1}px; bottom: 0px; right: {2}px; } \
			#an-qr-header { cursor: pointer; text-align: center; } \
			#previewArea { display: block; overflow: auto; width: {3}px; } \
			#previewArea img[onload] { max-width: 300px; } \
			',
			$.cssText('opacity', job.options('nQROpacity') / 10),
			nWidth,
			hideMode === 3 ? nRight : Math.ceil(($.winWidth() - nWidth) / 2),
			nWidth - 149
			);

			function toggleQR(toShow, callback)
			{
				var isVisible = jToggle.is(':visible');
				if(toShow === undefined) toShow = !isVisible;
				else if(isVisible === toShow) return;

				function toggle()
				{
					jQR.css('z-index', toShow ? 4 : 2);
					jPreview.empty();
					jToggle.toggle(toShow);
					if(toShow) {
						window.moveEnd();
						jTextarea.scrollTop(99999);
					}
				}

				if(hideMode === 3) {
					if(toShow) {
						jQR.animate({ right: Math.ceil(($.winWidth() - nWidth) / 2) }, 'slow', toggle);
					}
					else {
						toggle();
						jQR.animate({ right: nRight }, 'slow');
					}
				}
				else {
					toggle();
				}
			};

			hideMode === 1
			? jQR.bind('mouseenter mouseleave', function(event){ toggleQR(event.type === 'mouseenter'); })
			: jQRHeader.click(function(){ toggleQR(); });

			$('#aspnetForm').submit(function()
			{
				toggleQR(false);
			});

			window.OnQuoteSucceeded = function(result)
			{
				jTextarea.val(unescape(result) + '\n');
				toggleQR(true);
			};

			window.doPreview = (function(_doPreview)
			{
				return function()
				{
					_doPreview();
					jPreview.css('max-height', $.winHeight() - jQR.height() - jPreview.height());
				};
			})(window.doPreview);
		}
	}]
}

});