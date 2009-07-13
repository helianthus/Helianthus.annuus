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
// @name Helianthus.Annuus 3: Main Script
// @namespace http://code.google.com/p/helianthus-annuus/
// @description by 向日
// @include http://forum*.hkgolden.com/*
// @run-at document-start
// ==/UserScript==

(function()
{

var window = (typeof contentWindow != 'undefined') ? contentWindow : ((typeof unsafeWindow != 'undefined') ? unsafeWindow : this);
var AN = window.AN || (window.AN = { temp: [], mod: {} });

if(AN.initialized) return; // for Chrome which interestingly executes user scripts even when injecting xhr HTML into an element

AN.temp.push(function()
{
	var JSON = window.JSON;
	var $ = AN.jQuery;

	AN.mod['Main Script'] =
	{
		ver: '3.6.0',
		author: '向日',
		fn: {

// 佈局設定 //
'63d2407a-d8db-44cb-8666-64e5b76378a2':
{
	desc: '移除廣告',
	page: { 65534: true },
	type: 3,
	once: function()
	{
		AN.util.addStyle('\
		.an-ads, \
		#HKGTopAd, \
		.Topic_TopRightAdPanel, \
		.Topic_ForumInfoPanel tr:first-child + tr ~ tr, \
		#ctl00_ContentPlaceHolder1_MiddleAdSpace1 > a, #ctl00_ContentPlaceHolder1_MiddleAdSpace1 > a + br, \
		.ContentPanel > table > tbody > tr > td + td, \
		#LeftSide_GoogleAd, /* blog */\
		td[height="250"], td[width="302"], /* main & newmessages */\
		img[width="20"][height="25"], /* newmessages & search */\
		#dummy \
				{ display: none; } \
		.ContentPanel > table { width: 100%; } \
		.ContentPanel > table > tbody > tr > td:first-child { width: 100% !important; } \
		.Topic_ForumInfoPanel { padding-right: 0; } \
		.Topic_ForumInfoPanel table td { padding-bottom: 5px; } \
		');

		$('#MainPageAd2').up('tr', AN.box.nCurPage & ~36 && 2 || 1).prev().andSelf().addClass('an-ads');
	},
	infinite: function()
	{
		$('#HKGHeaderGoogleAd,#HKGTopGoogleAd,#HKGBottomGoogleAd').add($('span').filter('[id^=PMInLineAd],[id^=MsgInLineAd]')).up('tr').remove();//.addClass('an-ads');
	}
},

// 修正修改 //
'11f1c5ca-9455-4f8e-baa7-054b42d9a2c4':
{
	desc: '自動轉向正確頁面',
	page: { 2: true },
	type: 4,
	once: function()
	{
		if(document.referrer.indexOf('/login.aspx') > 0) location.replace('/topics.aspx?type=BW');
		else if(!location.pathname.match(/^\/(?:default.aspx)?$/i)) location.reload();
	}
},

'b7ef89eb-1190-4466-899a-c19b3621d6b1':
{
	desc: 'Opera: 修正無法使用Enter搜尋的錯誤',
	page: { 30: $.browser.opera || 'disabled' },
	type: 4,
	once: function()
	{
		$('#aspnetForm').submit(function(event)
		{
			event.preventDefault();
		});
	}
},

'2d4e139c-224c-44fb-824e-606170276c76':
{
	desc: '修正用戶名稱搜尋連結',
	page: { 92: true },
	type: 4,
	infinite: function(jDoc)
	{
		jDoc.topics().jNameLinks.each(function()
		{
			this.href = '/search.aspx?st=A&searchstring=' + escape($(this).html());
		});
	}
},

'30673b05-557d-4343-a873-bf88c2247525':
{
	desc: '修正頁數跳轉連結地址',
	page: { 4: true },
	type: 4,
	once: function()
	{
		var sType = location.search.match(/type=[^&]+/i);
		if(sType)
		{
			$('#filter').attr('action', '/topics.aspx?' + sType[0])
			.up('tr').find('a').each(function()
			{
				this.href = this.href.replace(/\?/, '?' + sType[0] + '&');
			});
		}
	}
},

'c2d9eedb-bb6c-4cb4-be11-ea2ec9612f63':
{
	desc: '修正底部失效的論壇功能',
	page: { 28: true },
	type: 4,
	once: function()
	{
		$('#filter select').change(function(event)
		{
			event.preventDefault();

			var jParent = $(this).parent();
			location.assign($.sprintf('/topics.aspx?type=%s&md=%s&page=%s', jParent.find('[name=type]').val(), jParent.find('[name=md]').val(), jParent.find('[name=page]').val()));
		});
	}
},

'0293c9da-468f-4ed5-a2d7-ecb0067e713f':
{
	desc: '去除引用半透明',
	page: { 32: !$.browser.msie || 'disabled' },
	type: 4,
	once: function()
	{
		AN.util.addStyle('blockquote { opacity: 1 !important; }');
	}
},

'd563af32-bd37-4c67-8bd7-0721c0ab0b36':
{
	desc: '優化頁數跳轉連結地址',
	page: { 32: true },
	type: 4,
	once: function()
	{
		window.changePage = function(nPageNo)
		{
			var sPage = (nPageNo) ? ('&page=' + nPageNo) : '';
			var sHighlight = (window.highlight_id) ? ('&highlight_id=' + window.highlight_id) : '';
			location.assign($.sprintf('/view.aspx?message=%s%s%s', window.messageid, sPage, sHighlight));
		};
	},
	infinite: function(jDoc)
	{
		jDoc.find('select[name=page]').up('tr').find('a').each(function()
		{
				this.href = this.href.replace(/&(?:page=1(?!\d)|highlight_id=0)/g, '');
		});
	}
},

'b6b232c8-1f26-449e-bb0d-2b7826bf95ef':
{
	desc: '優化圖片縮放',
	page: { 32: true },
	type: 4,
	once: function(jDoc)
	{
		window.DrawImage = $.blank;

		AN.util.addStyle('img[onLoad] { width: auto; height: auto; max-width: 100% }');
	}
},

'52ebe3d3-bf98-44d2-a101-180ec69ce290':
{
	desc: '移除帖子連結高亮部份',
	page: { 64: false },
	type: 4,
	infinite: function(jDoc)
	{
		jDoc.topics().jTitleCells.find('a').each(function()
		{
				this.href = this.href.replace(/&highlight_id=\d+/, '');
		});
	}
},

'87a6307e-f5c2-405c-8614-af60c85b101e':
{
	desc: '搜尋開新頁',
	page: { 20: false, 8: false },
	type: 4,
	once: function()
	{
		window.Search = function()
		{
			window.open($.sprintf('/search.aspx?st=%s&searchstring=%s', $('#st option:selected')[0].value, escape($('#searchstring').val())), '_blank'); // FF: bug of jQuery?
			$('#searchstring').val('');
		};
	}
},

'a93f1149-d11b-4b72-98dd-c461fd9ee754':
{
	desc: '連結開新頁',
	page: { 8: false, 20: false, 64: false },
	type: 4,
	options: { bTopicLinksOnly: { desc: '只限帖子連結', defaultValue: false, type: 'checkbox' } },
	infinite: function(jDoc)
	{
		if(AN.util.getOptions('bTopicLinksOnly'))
		{
			jDoc.topics().jTitleCells.find('a').attr('target', '_blank');
		}
		else
		{
			$('#aspnetForm a').filter(function(){ return /(?:ProfilePage|newmessages|view|search)\.aspx/.test(this.href); }).attr('target', '_blank');
		}
	}
},

'2ab2f404-0d35-466f-98a5-c88fdbdaa031':
{
	desc: '外鏈連結開新頁',
	defer: 1, // after links are created
	page: { 32: true },
	type: 4,
	infinite: function(jDoc)
	{
		jDoc.replies().jContents.find('a').attr('target', '_blank');
	}
},

'6e978310-e87b-4043-9def-076a13377c19':
{
	desc: '更換favicon(小丑icon) [部份瀏覽器無效]',
	page: { 65534: false },
	type: 4,
	once: function()
	{
		$('head').append('<link rel="shortcut icon" href="http://helianthus-annuus.googlecode.com/svn/other/hkg.ico" />');
	}
},

'e54d5c5f-47ae-4839-b4e8-6fc3733edfef':
{
	desc: '改進公司模式(假扮為Google)',
	page: { 65534: true },
	type: 4,
	once: function()
	{
		if(AN.util.cookie('companymode') == 'Y')
		{
			$('head').append('<link rel="shortcut icon" href="http://www.google.com/favicon.ico" />');
			document.title = 'Google';
		}
	}
},

// 加入物件 //
'231825ad-aada-4f5f-8adc-5c2762c1b0e5':
{
	desc: '顯示資料: 樓主名稱',
	page: { 32: false },
	type: 5,
	once: function(jDoc)
	{
		AN.util.getOpenerInfo(jDoc, function(oInfo)
		{
			AN.shared('addInfo', $.sprintf('樓主: <a target="_blank" href="/ProfilePage.aspx?userid=%s">%s</a>', oInfo.sId, oInfo.sName));
		});
	}
},

'9e181e79-153b-44d5-a482-5ccc6496a172':
{
	desc: '顯示資料: 累計在線時間',
	page: { 65534: false },
	type: 5,
	once: function()
	{
		var nLastOnTime = AN.util.data('nLastOnTime');
		var nCumulatedTime = AN.util.data('nCumulatedTime') || 0;

		if(nLastOnTime)
		{
			var nDifference = $.time() - nLastOnTime;
			nCumulatedTime += (nDifference >= 120000) ? 120000 : nDifference;
		}

		var sCumulated;
		if(nCumulatedTime > 86400000)
		{
			sCumulated = (nCumulatedTime / 86400000).toFixed(2) + ' days';
		}
		else if(nCumulatedTime > 3600000)
		{
			sCumulated = (nCumulatedTime / 3600000).toFixed(2) + ' hours';
		}
		else
		{
			sCumulated = (nCumulatedTime / 60000).toFixed(2) + ' minutes';
		}

		AN.shared('addInfo', $.sprintf('在線時間: %s', sCumulated));

		AN.util.data('nLastOnTime', $.time());
		AN.util.data('nCumulatedTime', nCumulatedTime);
	}
},

'f47e77c8-6f1a-43b2-8493-f43de222b3b4':
{
	desc: '加入伺服器狀態顯示按扭',
	page: { 65534: true },
	type: 5,
	once: function()
	{
		AN.shared('addButton', '伺服器狀態', AN.shared.serverTable);
	}
},

'7de28ca9-9c44-4949-ad4a-31f38a984715':
{
	desc: '加入一鍵留名按扭',
	page: { 32: false },
	type: 5,
	options: { sLeaveNameMsg: { desc: '回覆內容', defaultValue: '留名', type: 'text' } },
	once: function()
	{
		if(!AN.util.isLoggedIn()) return;

		AN.shared('addButton', '一鍵留名', function()
		{
			$('#ctl00_ContentPlaceHolder1_messagetext').val(AN.util.getOptions('sLeaveNameMsg'));
			$('#ctl00_ContentPlaceHolder1_btn_Submit').click();
		});
	}
},

'69260bc4-4f43-4dda-ba0f-87ba804a866c':
{
	desc: '加入同步登入所有server的按扭 [未完成]',
	page: { 65534: false },
	type: 5,
	once: function()
	{
		AN.shared('addButton', '登入所有server', function()
		{
			var sEmail, sPass;
			if(!(sEmail = prompt('請輸入電郵地址', ''))) return;
			if(!(sPass = prompt('請輸入密碼', ''))) return;

			var login = function()
			{
				var doc = this.contentWindow.document;
				var jThis = $(this);

				if(!doc.getElementById('#aspnetForm')) // error page
				{
					jThis.remove();
					return;
				}

				var $$ = this.contentWindow.AN.jQuery;

				$$('#ctl00_ContentPlaceHolder1_txt_email').val(sEmail);
				$$('#ctl00_ContentPlaceHolder1_txt_pass').val(sPass);

				$$.post('login.aspx', $$('#aspnetForm').serialize() + '&ctl00%24ContentPlaceHolder1%24linkb_login=', function()
				{
					jThis.remove();
				});
			};

			var sHTML = '';
			for(var i=1; i<=8; i++)
			{
				sHTML += '<iframe style="display: none;"></iframe>';
			}

			$(sHTML)
			.appendTo('#an')
			.each(function(i)
			{
				this.src = $.sprintf('http://forum%s.hkgolden.com/login.aspx', i + 1);
			})
			.load(login)
		});
	}
},

'aad1f3ac-e70c-4878-a1ef-678539ca7ee4':
{
	desc: '加入前往吹水台的快速連結',
	page: { 65534: true },
	type: 5,
	once: function()
	{
		//if(AN.box.sCurPage == 'topics') return;
		AN.shared('addLink', '吹水台', '/topics.aspx?type=BW', 1);
	}
},

'd0d76204-4033-4bd6-a9a8-3afbb807495f':
{
	desc: '加入前往最頂/底的按扭',
	page: { 32: true },
	type: 5,
	once: function()
	{
		AN.shared('addLink', '最頂', function(){ scrollTo(0,0); }, 0);
		AN.shared('addLink', '最底', function(){ $('body')[0].scrollIntoView(false); }, 2);
	}
},

'b78810a2-9022-43fb-9a9b-f776100dc1df':
{
	desc: '加入樓層編號',
	page: { 32: true },
	type: 5,
	infinite: function(jDoc)
	{
		var nCurPageNo = jDoc.pageNo();
		var nFloor = ((nCurPageNo == 1) ? 0 : 50 * (nCurPageNo - 1) + 1) + jDoc.pageScope().find('.an-content-floor').length;

		jDoc.replies().each(function()
		{
			$(this).find('span:last').append($.sprintf(' <span class="an-content-floor an-content-box">#%s</span>', nFloor++));
		});
	}
},

// 其他功能 //
'3f693a9e-e79d-4d14-b639-a57bee36079a':
{
	desc: '自動顯示伺服器狀態檢查視窗',
	page: { 1: true },
	type: 6,
	once: function()
	{
		AN.shared('serverTable');
	}
},

'4cdce143-74a5-4bdb-abca-0351638816fa':
{
	desc: '發表新帖子的主旨過長時進行提示',
	page: { 256: true },
	type: 6,
	once: function(jDoc)
	{
		if(location.search.indexOf('mt=N') != -1)
		{
			$('#aspnetForm').submit(function()
			{
				var sTitle = $('#ctl00_ContentPlaceHolder1_messagesubject').val();
				var n = 0;
				for(var i=0; i<sTitle.length; i++)
				{
					n += sTitle.charCodeAt(i) > 255 ? 2 : 1;
				}
				if(n > 50 && !confirm('主旨過長!(位元組 > 50)\n將導致帖子發表失敗或主旨被裁剪!\n\n確定要進行發表?'))
				{
					return false;
				}
			});
		}
	}
},

'86d24fc8-476a-4de3-95e1-5e0eb02b3353':
{
	desc: '轉換表情碼為圖片',
	page: { 92: true },
	type: 6,
	infinite: function(jDoc)
	{
		var rSmiley = /[#[](hehe|love|ass|sosad|good|hoho|kill|bye|adore|banghead|bouncer|bouncy|censored|flowerface|shocking|photo|fire|yipes|369|bomb|slick|no|kill2|offtopic)[\]#]/g;

		var aConvertMap =
		[
			{ regex: /O:-\)/g, result: 'angel' },
			{ regex: /xx\(/g, result: 'dead' },
			{ regex: /:\)/g, result: 'smile' },
			{ regex: /:o\)/g, result: 'clown' },
			{ regex: /:-\(/g, result: 'frown' },
			{ regex: /:~\(/g, result: 'cry' },
			{ regex: /;-\)/g, result: 'wink' },
			{ regex: /:-\[/g, result: 'angry' },
			{ regex: /:-]/g, result: 'devil' },
			{ regex: /:D/g, result: 'biggrin' },
			{ regex: /:O/g, result: 'oh' },
			{ regex: /:P/g, result: 'tongue' },
			{ regex: /^3^/g, result: 'kiss' },
			{ regex: /\?_\?/g, result: 'wonder' },
			{ regex: /#yup#/g, result: 'agree' },
			{ regex: /#ng#/g, result: 'donno' },
			{ regex: /#oh#/g, result: 'surprise' },
			{ regex: /#cn#/g, result: 'chicken' },
			{ regex: /Z_Z/g, result: 'z' },
			{ regex: /@_@/g, result: '@' },
			{ regex: /\?\?\?/g, result: 'wonder2' },
			{ regex: /fuck/g, result: 'fuck' }
		];

		jDoc.topics().jTitleCells.find('a:first-child').each(function()
		{
			var jThis = $(this);
			var sOri = sText = jThis.html();

			sText = sText.replace(rSmiley, '<img style="border-width:0px;vertical-align:middle" src="/faces/$1.gif" alt="$&" />');

			$.each(aConvertMap, function()
			{
				sText = sText.replace(this.regex, '<img style="border-width:0px;vertical-align:middle" src="/faces/' + this.result + '.gif" alt="$&" />');
			});

			if(sText != sOri) jThis.html(sText);
		});
	}
},

'e24ec5f6-5734-4c2c-aa54-320ca29a3932':
{
	desc: '移除死圖',
	page: { 32: false },
	type: 6,
	defer: 1, // after all images are created
	once: function()
	{
		this.removeDead = function()
		{
			$(this).parent().css('text-decoration', 'none').html('<a href="javascript:" class="an-content-line">死圖已被移除</a>');
		};
	},
	infinite: function(jDoc, oFn)
	{
		jDoc.replies().jContents.find('img[onLoad]').each(function()
		{
			var sSrc = this.src;
			$(this).error(oFn.removeDead).attr('src', sSrc);
		});
	}
},

'd7adafa8-cc14-45f9-b3e9-bc36eab05d4f':
{
	desc: '縮小引用中的圖片',
	page: { 32: false },
	type: 6,
	options: { nQuoteImgMaxHeight: { desc: '圖片最大高度(px)', defaultValue: 100, type: 'text' } },
	once: function()
	{
		AN.util.addStyle($.sprintf('.repliers_right blockquote img { max-height: %spx; }', AN.util.getOptions('nQuoteImgMaxHeight')));
	}
},

'8e1783cd-25d5-4b95-934c-48a650c5c042':
{
	desc: '屏蔽圖片 (點擊顯示)',
	page: { 32: false },
	type: 6,
	defer: 1, // after all images are created
	once: function(jDoc, oFn)
	{
		oFn.bAreMasked = true;

		AN.shared('addButton', '切換屏蔽圖片', function()
		{
			(oFn.bAreMasked = !oFn.bAreMasked) ? $('.an-maskimg').fadeOut().next().show() : $('.an-maskimg').next().hide().end().fadeIn();
		});

		this.unmaskIt = function()
		{
			var jBox = $(this).children('a');
			if(jBox.is(':visible'))
			{
				jBox.hide().prev().fadeIn();
				return false;
			}
		};
	},
	infinite: function(jDoc, oFn)
	{
		if(!this.bAreMasked) return;

		jDoc.replies().jContents.find('img[onLoad]').addClass('an-maskimg').hide().after('<a class="an-content-box" href="javascript:">點擊顯示圖片</a>').parent().css('text-decoration', 'none').click(oFn.unmaskIt);
	}
},

'e33bf00c-9fc5-46ab-866a-03c4c7ca5056':
{
	desc: '智能地將文字轉換成連結',
	page: { 32: true },
	type: 6,
	infinite: function(jDoc)
	{
		var rLink = /(?:ftp|https?):\/\/[\w./?:;~!@#$%^&*()+=-]+/i;
		var aMatch;

		var checkNode = function(nTarget)
		{
			if(nTarget.nextSibling) checkNode(nTarget.nextSibling);

			if(nTarget.nodeType == 3)
			{
				if(aMatch = rLink.exec(nTarget.data))
				{
					nTarget.splitText(RegExp.leftContext.length + aMatch[0].length);
					$(nTarget.splitText(RegExp.leftContext.length)).wrap($.sprintf('<a href="%s"></a>', aMatch[0])).parent().before('<span class="an-content-note" title="文字已轉換為連結">[L]</span>');
				}
			}
			else if(nTarget.firstChild && !$(nTarget).is('a,button,script,style'))
			{
				checkNode(nTarget.firstChild);
			}
		};

		jDoc.replies().jContents.each(function()
		{
			checkNode(this.firstChild);
		});
	}
},

'7b36188f-c566-46eb-b48d-5680a4331c1f':
{
	desc: '轉換論壇連結的伺服器位置',
	page: { 32: true },
	type: 6,
	infinite: function(jDoc)
	{
		var rForum = /forum\d*.hkgolden\.com/i;

		jDoc.replies().jContents.find('a').each(function()
		{
			var jThis = $(this);
			if(!jThis.children().length && rForum.test(this.hostname) && this.hostname != location.hostname)
			{
				jThis.attr('href', this.href.replace(rForum, location.hostname)).before('<span class="an-content-note" title="已轉換伺服器位置">[C]</span>');
			}
		});
	}
},

'8db8b611-e229-4d60-a74b-6142af1bacd8':
{
	desc: '提示可疑連結',
	page: { 32: false },
	type: 6,
	options:
	{
		sSusKey:
		{
			desc: '可疑關鍵字 [regular expression]',
			defaultValue: '[?&]r(?:ef(?:er[^=]+)?)?=|logout|tinyurl|urlpire|linkbucks|seriousurls|qvvo|viraldatabase|youfap|qkzone\\.com/t\\?',
			type: 'text'
		},
		sSusColor: { desc: '可疑關鍵字顏色', defaultValue: '#FF0000', type: 'text' }
	},
	infinite: function(jDoc, oFn)
	{
		var addBox = function()
		{
			AN.util.addStyle($.sprintf(' \
			#an-alertbox { display: none; position: absolute; border-width: 1px; } \
			#an-alertbox div { height: 2px; } \
			#an-alertbox p { margin: 0; padding: 0 0.2em; } \
			#an-alertbox span { color: %s; } \
			',
			AN.util.getOptions('sSusColor')
			));

			$('#an').append('<div id="an-alertbox" class="an-forum"><div class="an-forum-header"></div><p>發現可疑連結! keyword: <span></span></p></div>');

			oFn.showAlert = function(event)
			{
				$('#an-alertbox').find('span').text($(this).data('an-suskeyword'));
				$(document).bind('mousemove.an-alert', function(event)
				{
					var jAlert = $('#an-alertbox');
					jAlert.show().css({ top: event.pageY - jAlert.height() - 10, left: event.pageX - jAlert.width() / 2 });
				});
			};

			oFn.hideAlert = function()
			{
				$(document).unbind('.an-alert');
				$('#an-alertbox').fadeOut('fast');
			};
		};

		var rSus = RegExp(AN.util.getOptions('sSusKey'), 'i');
		var aMatch;

		jDoc.replies().jContents.find('a').each(function()
		{
			if(aMatch = rSus.exec(this.href))
			{
				if(!$('#an-alertbox').length) addBox();
				$(this).data('an-suskeyword', aMatch[0]).hover(oFn.showAlert, oFn.hideAlert);
			}
		});
	}
},

'039d820f-d3c7-4539-8647-dde974ceec0b':
{
	desc: '轉換視頻網站連結為影片',
	page: { 32: true },
	type: 6,
	defer: 2, // after layout is fixed
	options:
	{
		bConvertOnClick: { desc: '點擊連結才轉換', defaultValue: false, type: 'checkbox' }
	},
	once: function()
	{
		var aSites =
		[{
			regex: 'youtube\\.com/watch\\?',
			fn: function()
			{
				if(nWidth > 640) nWidth = 640;
				nHeight = nWidth / 16 * 9 + 25;
				sUrl = $.sprintf('http://www.youtube.com/v/%s&fs=1&rel=0&ap=%2526fmt%3D22', sUrl.replace(/.+?v=([^&]+).*/i, '$1'));
			}
		},
		{
			regex: 'vimeo\\.com/\\d',
			fn: function()
			{
				if(nWidth > 504) nWidth = 504;
				nHeight = nWidth / 1.5;
				sUrl = $.sprintf('http://vimeo.com/moogaloop.swf?clip_id=%s&show_title=1&fullscreen=1', sUrl.replace(/.+vimeo\.com\/(\d+).*/i, '$1'));
			}
		},
		{
			regex: 'youku\\.com/v_show/',
			fn: function()
			{
				if(nWidth > 480) nWidth = 480;
				nHeight = nWidth / 4 * 3 + 40;
				sUrl = $.sprintf('http://player.youku.com/player.php/sid/%s/v.swf', sUrl.replace(/.+?id_([^\/]+).*/i, '$1'));
			}
		},
		{
			regex: 'tudou\\.com/program/',
			fn: function()
			{
				if(nWidth > 400) nWidth = 400;
				nHeight = nWidth / 4 * 3 + 40;
				sUrl = $.sprintf('http://www.tudou.com/v/%s', sUrl.replace(/.+?view\/([^\/]+).*/i, '$1'));
			}
		}];

		this.rLink = (function()
		{
			var aReg = [];
			$.each(aSites, function(){ aReg.push(this.regex); });
			return RegExp(aReg.join('|'), 'i');
		})();

		var nWidth, nHeight, sUrl;
		this.convert = function(event)
		{
			if(event.preventDefault) event.preventDefault();

			sUrl = this.href;
			nWidth = $(this).up('td,div').width();
			$.each(aSites, function()
			{
				if(RegExp(this.regex, 'i').test(sUrl))
				{
					this.fn();
					return false;
				}
			});

			$(this).toFlash(sUrl, { width: nWidth, height: nHeight.toFixed(0) }, { wmode: 'opaque' });
		};
	},
	infinite: function(jDoc, oFn)
	{
		var jVideoLinks = jDoc.replies().jContents.find('a').filter(function(){ return oFn.rLink.test(this.href); });
		AN.util.getOptions('bConvertOnClick') ? jVideoLinks.click(oFn.convert) : jVideoLinks.each(oFn.convert);
	}
},

'd761d6f7-8ef7-4d5b-84e9-db16a274f616':
{
	desc: '轉換圖片連結為圖片',
	page: { 32: false },
	type: 6,
	infinite: function(jDoc)
	{
		jDoc.replies().jContents.find('a').each(function()
		{
			if(!$(this).children().length && /jpg|gif|png|bmp/i.test(this.href))
			{
				$(this).attr('target', '_blank').html($.sprintf('<img style="border-style: none" onLoad="DrawImage(this)" src="%s" alt="死圖" />', this.href, this.href)).before('<span class="an-content-note" title="已轉換連結為圖片">[P]</span>');
			}
		});
	}
},

'85950fa3-c5f0-4456-a81a-30a90ba6425c':
{
	desc: '顯示防盜鏈/域名被禁圖片 [FF: 建議改用RefControl]',
	page: { 32: !$.browser.mozilla },
	type: 6,
	// http://www.pomo.cn/showpic.asp?url=
	// http://www.mysea.net/download/js/get163.asp?url=
	options: { sImgProxy: { desc: '圖片代理', defaultValue: 'http://www.pomo.cn/showpic.asp?url=', type: 'text' } },
	infinite: function(jDoc)
	{
		var sImgProxy = AN.util.getOptions('sImgProxy');

		jDoc.replies().jContents.find('img').each(function()
		{
			if(/imageshack\.us|hiphotos\.baidu\.com|\.tianya\.cn/i.test(this.src))
			{
				this.src = sImgProxy + encodeURIComponent(this.src);
			}
		});
	}
},

'ea19d7f6-9c2c-42de-b4f9-8cab40ccf544':
{
	desc: '限制回覆格高度',
	page: { 32: false },
	type: 6,
	defer: 2, // after layout is fixed
	options: { nMaxReplyHeight: { desc: '最大回覆高度(px)', defaultValue: 2000, type: 'text' } },
	once: function(jDoc)
	{
		var nWidth = jDoc.replies().jContents.eq(0).width();

		AN.util.addStyle($.sprintf('\
		.repliers_right { overflow-x: visible; } \
		.an-replywrapper { overflow-y: auto; position: relative; z-index: 2; max-height: %spx; width: %spx; } \
		.an-replywrapper > div { padding-right: 1px; width: %spx; } \
		',
		AN.util.getOptions('nMaxReplyHeight'), nWidth + 30, nWidth));
	},
	infinite: function(jDoc)
	{
		jDoc.replies().jContents.wrapInner('<div class="an-replywrapper"><div></div></div>');
	}
},

'fc07ccda-4e76-4703-8388-81dac9427d7c':
{
	desc: '強制顯示空白用戶名連結',
	page: { 32: true },
	type: 6,
	infinite: function(jDoc)
	{
		jDoc.replies().each(function()
		{
			if(/^\s*$/.test($(this).data('sUserName')))
			{
				$(this).data('jNameLink').html('<span style="color: black">&lt;空白名稱&gt;</span>');
			}
		});
	}
},

'b2be12c7-8c97-4293-b283-51232cf91746':
{
	desc: '強制鎖定用戶名於一行',
	page: { 28: 'disabled' },
	type: 6,
	infinite: function(jDoc)
	{
		/*
		jDoc.topics().jNameLinks.each(function()
		{
			this.parent().css('white-space', 'nowrap');
		});
		*/
	}
},

'e19a8d96-151f-4f86-acfc-0af12b53b99b':
{
	desc: '快速3擊左鍵關閉頁面 [FF: 只能配合連結開新頁使用]',
	page: { 32: false },
	type: 6,
	once: function()
	{
		var down = 0;
		var reset = function(){ down = 0; };

		$(document).mousedown(function(event)
		{
			if(down == 0) setTimeout(reset, 500);

			if(++down == 3)
			{
				window.open('', '_parent');
				window.close();
			}
		});
	}
}

}}; // end mod

}); // end push

})(); // end anonymous