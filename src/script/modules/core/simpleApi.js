bolanderi.addModules(function(){ return {

'0b721576-57a8-46b0-b0e5-6fec32e4aafa':
{
	title: 'Simple API',
	pages: { comp: [all] },
	api: [
		{
			type: 'generic',
			js: function()
			{
				$.isLoggedIn = function()
				{
					return !!$.cookie('username');
				};
			}
		},
		{
			page: view,
			type: 'generic',
			js: function() // need fix
			{
				var info = { readyState: 'uninitialized', callbacks: [] };

				$.fn.openerInfo = function(callback)
				{
					if(info.readyState === 'complete') {
						return info;
					}

					info.callbacks.push(callback);

					if(info.readyState === 'uninitialized') {
						info.readyState = 'loading';

						function getInfo(jScope)
						{
							info.readyState = 'complete';
							var jInfo = jScope.replies().jInfos.eq(0);
							$.extend(info, { userid: jInfo.attr('userid'), username: jInfo.attr('username') });

							$.each(info.callbacks, function(){ this(info); });
							delete info.callbacks;
						}

						if(this.pageNo() === 1) {
							getInfo(this);
						}
						else {
							$.getDoc('?message=' + window.messageid, getInfo);
						}
					}
				};
			}
		},
		{
			page: view,
			type: 'generic',
			js: function()
			{
				$.fn.isReplyContent = function()
				{
					return !!this.closest('.repliers_right > tbody > tr:first-child > td').length;
				};
			}
		}
	]
}

}; });
