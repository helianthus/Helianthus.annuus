$.extend(an.plugins, {

'b7ef89eb-1190-4466-899a-c19b3621d6b1':
{
	desc: 'Opera: 修正無法使用Enter搜尋的錯誤',
	page: { 30: $.browser.opera || 'disabled' },
	type: 4,
	queue: [{
		fn: function()
		{
			$('#aspnetForm').submit(function(event)
			{
				event.preventDefault();
			});
		}
	}]
},

/*
'd4bf67cc-349c-4541-a8e4-9d9f9d0be267':
{
	desc: 'Opera: 修正特殊字符導致的顯示錯誤',
	page: { 92: $.browser.opera || 'disabled' },
	type: 4,
	queue: [{
		fn: function()
		{
		$j.topics().each(function()
		{
			var jNameCell = $(this).parent();
			if(jNameCell.nextAll().length !== 2)
			{
				jNameCell[0].outerHTML = jNameCell[0].outerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/<A.+?\/a>/, 'NAME_ERROR').replace(/=""/g, '');
			}
		});
	}
},
*/

'145fdc83-e1de-452d-90b3-cee0cc5e8336':
{
	desc: '修正站務台的顯示錯誤',
	page: { 4: on },
	type: 4,
	queue: [{
		type: always,
		fn: function()
		{
			if($.uriSet().querySet.type === 'MB') {
				$d.topicTable().find('td[colspan=5]').attr('colspan', 6);
			}
		}
	}]
},

'7f9780a6-395d-4b24-a0a8-dc58c4539408':
{
	desc: '修正字型大小/顏色插入控件',
	page: { 416: on },
	type: 4,
	queue: [{
		fn: function()
		{
			$('#ctl00_ContentPlaceHolder1_messagetext').siblings('select[onchange]').change(function()
			{
				this.selectedIndex = 0;
			});
		}
	}]
},

});