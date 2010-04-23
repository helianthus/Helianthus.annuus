(function($)
{
	$.fn.pageName = function()
	{
		if(this.__pageName) return this.__pageName;

		var root = this.root();

		if(root.find('#ctl00_ContentPlaceHolder1_SystemMessageBoard').length) {
			this.__pageName = 'message';
		}
		else {
			var name = /\w+/.exec($.uriSet(root.find('#aspnetForm').attr('action') || location.href).filename);
			this.__pageName = name ? name[0].toLowerCase() : 'default';
		}

		return this.__pageName;
	};

	$.fn.pageCode = function()
	{
		if(this.__pageCode != null) return this.__pageCode;

		var pageName = this.pageName();

		for(var code in bolanderi.get('PAGES')) {
			if(bolanderi.get('PAGES')[code].action === pageName) {
				return this.__pageCode = code * 1;
			}
		}

		return this.__pageCode = 0;
	};
})(jQuery);