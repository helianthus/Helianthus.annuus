(function($)
{
	function getPageName(url)
	{
		if(!url) return null;

		var uriSet = $.uriSet(url);
		return uriSet.filename ? uriSet.filename.replace(/\.[^.]+$/, '').toLowerCase() : 'default';
	}

	$.fn.pageName = function()
	{
		if(this.__pageName) return this.__pageName;

		if(!jQuery.isReady) {
			return getPageName(location.href);
		}
		else {
			var root = this.root();

			return (this.__pageName =
				root.find('#ctl00_ContentPlaceHolder1_SystemMessageBoard').length && 'message'
				|| getPageName(root.find('#aspnetForm').attr('action'))
				|| root.find('body > b:first-child') && 'terms'
				|| 'error'
			);
		}
	};

	$.fn.pageCode = function()
	{
		if(typeof this.__pageCode === 'number') return this.__pageCode;

		var pageName = this.pageName();

		for(var code in an.pages) {
			if(an.pages[code].action === pageName) {
				return pageCode = code * 1;
			}
		}
		return 0;
	};

	$d.one('priority4Start', function()
	{
		$d.__pageName = $d.__pageCode = null;
	});
})(jQuery);