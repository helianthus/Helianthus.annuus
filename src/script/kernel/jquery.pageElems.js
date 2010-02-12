$.fn.extend({
	replies: function()
	{
		return this.__replies || $.extend((this.__replies = this.find('.repliers')), {
			jInfos: this.__replies.children().children('tr[userid]'),
			jNameLinks: this.__replies.find('.repliers_left > div > a'),
			jContents: this.__replies.find('.repliers_right > tbody > tr:first-child > td')
		});
	},

	topics: function()
	{
		return this.topicTable().find('tr').has('td > a');
	},

	topicTable: function()
	{
		var jScope = $d.own(this) ? $d : this;
		return jScope.__topicTable || (jScope.__topicTable = jScope.find({
			topics: '#HotTopics > div > table',
			search: '#ctl00_ContentPlaceHolder1_topics_form > table + table > tbody > tr > td > table',
			tags: '#ctl00_ContentPlaceHolder1_topics_form > table + table > tbody > tr > td > table',
			profilepage: '#ctl00_ContentPlaceHolder1_UpdatePanelHistory .main_table1 > table > tbody > tr > td > table'
		}[jScope.pageName()]));
	}
});

$d.bind('priority1Start', function()
{
	$d.__replies = $d.__topics = $d.__topicTable = null;
});