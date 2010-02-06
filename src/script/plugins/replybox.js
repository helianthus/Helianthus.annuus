$.extend(an.plugins, {

'cb1917f9-4053-40b1-870d-e0e2c6a90b39':
{
	desc: '改變快速回覆的風格',
	pages: { on: [view] },
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
},

'a7484cf2-9cbd-47aa-ac28-472f55a1b8f4':
{
	desc: '需要時自動加入代碼插入按扭',
	pages: { on: [view | post | sendpm] },
	type: 6,
	queue: [{
		fn: function(job)
		{
			var rUrl, jUrlBtn, rImg, jImgBtn, text, match;
			var jTextarea = $('#ctl00_ContentPlaceHolder1_messagetext').bind('keyup mouseup change', function()
			{
				if(!rUrl)
				{
					var parts = {
						host: 'http://(?:[\\w-]+\\.)+[a-z]{2,4}(?![a-z])',
						codes: '\\[/?(?:img|url|quote|\\*|left|center|right|b|i|u|s|size|red|green|blue|purple|violet|brown|black|pink|orange|gold|maroon|teal|navy|limegreen)'
					};

					rUrl = new RegExp($.format('{0.host}(?:/(?:(?!{0.codes})\\S)*)?(?!(\\S*?| *)\\[/(?:img|url)])', parts), 'gi');
					jUrlBtn = $('<button type="button" style="vertical-align: top; margin-left: 5px; display: none;" />').insertAfter('#ctl00_ContentPlaceHolder1_btn_Submit').click(function()
					{
						jTextarea.val(text.replace(rUrl, '[url]$&[/url]')).change();
					});

					rImg = new RegExp($.format('{0.host}/(?:(?!{0.codes})\\S)+?\\.(?:bmp|jpe?g|png|gif)(?! *\\[/(?:img|url)])', parts), 'gi');
					jImgBtn = $('<button type="button" style="vertical-align: top; margin-left: 5px; display: none;" />').insertAfter(jUrlBtn).click(function()
					{
						jTextarea.val(text.replace(rImg, '[img]$&[/img]')).change();
					});
				}

				text = jTextarea.val();
				(match = text.match(rUrl)) ? jUrlBtn.html($.format('為{0}個連結加上[url]代碼', match.length)).show() : jUrlBtn.hide();
				(match = text.match(rImg)) ? jImgBtn.html($.format('為{0}個圖片連結加上[img]代碼', match.length)).show() : jImgBtn.hide();
			});
		}
	}]
},

'1fb17624-7c6f-43aa-af11-9331f1f948cb':
{
	desc: '強化表情圖示列',
	pages: { on: [view | post | sendpm] },
	type: 6,
	options: { sSmileySelectMethod: { desc: '圖示選擇方式', defaultValue: '列表', type: 'select', choices: ['列表', '連結'] } },
	queue: [{
		fn: function(job)
		{
			// jQuery('#TABLE_ID').outerhtml().replace(/>\s+</g, '><').replace(/&nbsp;\s+/g, '&nbsp;').replace(/'/g,'\\\'');
			if(!$('#ctl00_ContentPlaceHolder1_messagetext').length) return;

			var selector = '#ctl00_ContentPlaceHolder1_QuickReplyTable table table > tbody > tr:first-child + tr + tr + tr';
			if($('#ctl00_ContentPlaceHolder1_Forum_Type_Row').length) selector += '+ tr + tr';
			selector += '> td:first-child';

			$.ss('\
			'+selector+' { cursor: pointer; } \
			'+selector+':before { content: url('+an.resources['smiley-twist']+'); margin-right: 2px; vertical-align: middle; } \
			');

			$d.bind('click.smileyadder', function(event)
			{
				var jSmileyTr = $('#ctl00_ContentPlaceHolder1_messagetext').up('tr').next();

				if(jSmileyTr.length && jSmileyTr.children(':first')[0] !== event.target) return;

				$d.unbind('click.smileyadder');

				$.ss('\
				'+selector+' { cursor: default; } \
				'+selector+':before { content: ""; display: none; } \
				');

				jSmileyTr.children(':last').append(function()
				{
					var html = '';
					$.each(an.smileys, function(i, typeSet)
					{
						if(i === 0) return;

						html += '<table style="display: none" cellpadding="0" cellspacing="0"><tbody>';
						$.each(typeSet.table, function(rowNo, row)
						{
							html += '<tr>';
							$.each(row, function(cellNo, cell)
							{
								html += cellNo === 1 ? '<td valign="bottom" rowspan="2">' : typeSet.table[rowNo + 1] && typeSet.table[rowNo + 1][1] ? '<td colspan="2">' : '<td>';
								$.each(cell, function(i, smileySet)
								{
									html += $.format(
										'<a href="javascript:InsertText(\'{0.code}\',false)"><img src="{0.path}{0.filename}.gif" alt="{0.code}" /></a>&nbsp;',
										{ path: typeSet.path, code: smileySet[0], filename: smileySet[1] }
									);
								});
								html += '</td>';
							});
							html += '</tr>';
						});

						html += '</tbody></table>';
					});
					return html;
				});

				var isSelectMode = job.options('sSmileySelectMethod') === '列表';

				if(!isSelectMode) $.ss('#an-smileyselector { list-style: none; margin: 0; padding: 0; font-size: 80%; }');

				$((function()
				{
					var
					innerhtml = isSelectMode ? '<option>{0}</option>' : '<li><a href="javascript:">{0}</a></li>',
					html = isSelectMode ? '<select>' : '<ul id="an-smileyselector">';
					$.each(an.smileys, function()
					{
						html += $.format(innerhtml, this.desc);
					});
					html += isSelectMode ? '</select>' : '</ul>';

					return html;
				})())
				.bind(isSelectMode ? 'change' : 'click', function(event)
				{
					jSmileyTr.children(':last').children().hide().eq(isSelectMode ? this.selectedIndex : $(event.target).parent().index()).show();
				})
				.appendTo(jSmileyTr.children(':first').empty());
			});
		}
	}]
},

'e336d377-bec0-4d88-b6f8-52e122f4d1c9':
{
	desc: '加入自訂文字插入控件',
	pages: { on: [view | post | sendpm] },
	type: 5,
	queue: [{
		fn: function(job)
		{
			if(!$('#ctl00_ContentPlaceHolder1_messagetext').length) return;

			var snippets = job.db('snippets') || [
				['家姐潮文', '講起我就扯火啦\n我家姐一路都在太古廣場一間名店做sales\n間店有好多有錢人同名人幫襯\n做了很多年，已經是senior\n咁多年黎都好俾心機做，經理亦好 like佢\n因為收入不錯又隱定，家姐原本諗住同拍拖多年既bf結婚\n咁多年黎我家姐好少俾人投訴\n而且同好多大客既關係都唔錯\n前排關心研去過我家姐間店幫襯\n不過serve佢既不是我家姐，但佢一買就買左好多野\n過左個幾星期，佢又再去間店行\n上次serve果個Day-off, 咁我家姐就頂上serve佢\n開頭已經好有禮貌介紹d新貨俾佢, 仲話俾折頭佢\n佢就無乜反應，望一望另一堆客\n果堆客係大陸人，三至四個，講野好大聲\n關小姐就同我家姐講話可唔可以關左間鋪一陣\n等佢揀衫\n 我家姐同我講，佢公司一向唔俾佢地咁做\n驚做壞個頭，除非真係有乜大人物，好多記者好混亂先可以咁做\n但佢見到關小姐黑口黑面，都識做話打電話去問一問老闆\n老闆梗係話唔得啦，至多俾多d折頭她\n咁關小姐就發老脾，鬧到我家姐一面屁\nd說話勁難聽，又話自己買野既錢多過我家姐搵幾年既錢\n我家姐都唔敢得罪佢，一味道歉\n跟住關小姐就走左人，家姐就同老闆備案\n老闆瞭解左情況就無再追問\n過左兩日佢接到老闆電話話收到complaint \n話有人投訴佢態度唔好，唔理顧客感受\n公司policy一向唔話俾佢地知係邊次事件\n我家姐估黎估去都淨係得失過關小姐一人\n總之俾老闆話左兩句\n又過幾日，關小姐又黎\n這次和件西裝友一齊，但好在成店都無其他客\n我家姐怕又惹事，叫左個junior過去serve佢\n點知條老西友係要點番我家姐serve.\n根住關小姐就玩野，試衫，但話d衫俾其他人試過污糟\n要開新衫試，我家姐雖然知公司唔俾咁做，\n但怕左佢，唯有照做\n點知試左兩三件，件件佢都要咁試又無話要\n我家姐終於話唔好意思，其實唔可以咁做\n(根本明知她玩野啦.....)\n又係至多俾多d折頭佢\n跟住佢件西裝友就鬧我家姐話"係咪話我地無錢買你地d野?"\n我家姐話唔係，但佢照鬧\n鬧左十幾分鐘\nd同事見咁幫手，又照鬧\n最終打俾老闆備案\n之後連收兩封warning letter\n早兩日接埋大信封\n年尾俾人炒左']
			];
			var jSelect = $('<select></select>');

			function writeSelect()
			{
				var selectHTML = '<option>自訂文字</option>';
				$.each(snippets, function(textNo)
				{
					selectHTML += $.format('<option value="{0}">{1}</option>', textNo, this[0]);
				});
				selectHTML += '<option value="customize">自訂...</option>';

				jSelect.html(selectHTML);
			}

			writeSelect();

			var jSnippets;
			jSelect.insertBefore($('#ctl00_ContentPlaceHolder1_messagetext').prev()).change(function()
			{
				if(this.value == 'customize') {
					if(!jSnippets) {
						$.ss('\
						#an-snippets { padding: 5px; } \
						#an-snippets > ul { float: left; } \
						#an-snippets > ul > li { padding: 2px 0; } \
						#an-snippets > ul > li > span { margin-right: 5px; border: 1px solid black; padding: 0 5px; background-color: {0.sMainHeaderBgColor}; color: {0.sMainHeaderFontColor}; cursor: pointer; } \
						#an-snippets > div { float: right; margin-left: 10px; padding-left: 10px; text-align: center; border-left: 1px solid gray; } \
						#an-snippets > div > textarea { display: block; width: 400px; height: 300px; } \
						',
						job.options()
						);

						var index, editing, jDesc, jContent;
						jSnippets = $.box('an-snippets', '自訂文字', 700)
						.append('<ul></ul><div><input /><textarea></textarea><button type="button">ok</button><button type="button">cancel</button></div>')
						.click(function(event)
						{
							var jTarget = $(event.target);
							if(!jTarget.is('span,button')) return;

							var type = jTarget.text();
							if(type == 'cancel') {
								jSnippets.children('div').css('opacity', '0.5').children().attr('disabled', true);
							}
							else if(type == 'E' || type == '+') {
								editing = (type === 'E');
								index = jTarget.parent().index();
								jDesc.val(type == 'E' ? snippets[index][0] : '').next().val(type == 'E' ? snippets[index][1] : '').parent().css('opacity', '1').children().attr('disabled', false);
							}
							else {
								if(type == 'ok') {
									if(editing) {
										snippets[index] = [jDesc.val(), jContent.val()];
										editing = false;
									}
									else {
										snippets.push([jDesc.val(), jContent.val()]);
									}
								}
								else if(type == 'X' && confirm('確定移除?')) {
									snippets.splice(jTarget.parent().index(), 1);
								}
								job.db('snippets', snippets);
								writeSnippets();
								writeSelect();
							}
						});
					}
					jDesc = jSnippets.find('> div > input');
					jContent = jDesc.next();

					function writeSnippets()
					{
						var sHTML = '';
						$.each(snippets, function()
						{
							sHTML += '<li><span>X</span><span>E</span>' + this[0] + '</li>';
						});
						sHTML += '<li><span>+</span>...</li>';
						jSnippets.children('ul').html(sHTML).next().css('opacity', '0.5').children().val('').attr('disabled', true);
					}

					writeSnippets();
					$.gray(true, 'an-snippets');
				}
				else {
					window.InsertText(snippets[this.value][1], false);
				}

				this.selectedIndex = 0;
			});
		}
	}]
}

});