//////////////////// START OF - [jQuery Extension] ////////////////////

$.extend(
{
	time: function(nStart)
	{
		return nStart ? $.time() - nStart : +new Date;
	},

	correct: function(sTarget)
	{
		if(sTarget == 'true')
		{
			return true;
		}
		else if(sTarget == 'false')
		{
			return false;
		}
		else if(!isNaN(sTarget) && sTarget !== '')
		{
			return sTarget * 1;
		}
		else
		{
			return sTarget;
		}
	},

	doc: function(sHTML)
	{
		var eDiv = document.createElement('div');
		eDiv.innerHTML = sHTML;
		return $(eDiv);
	},

	getDoc: function(sURL, success)
	{
		var s =
		{
			url: sURL,
			dataType: 'text',
			success: function(sHTML)
			{
				var jNewDoc = $.doc(sHTML);
				jNewDoc.pageCode() & 65534 ? success.call(s, jNewDoc) : s.error();
			},
			error: function()
			{
				AN.shared('log', '頁面讀取失敗, 5秒後重新讀取...');
				setTimeout(function(){ $.getDoc(sURL, success); }, 5000);
			}
		};

		$.ajax(s);
	},

	getLength: function(uTarget)
	{
		if('length' in uTarget) return uTarget.length;

		for(var nCount in uTarget){}
		return nCount;
	},

	make: function(sType, uTarget)
	{
		$.each(arguments, function(i, sName)
		{
			if(i < 2) return;

			if(!uTarget[sName]) uTarget[sName] = (sType == 'o' ? {} : []);
			uTarget = uTarget[sName];
		});

		return uTarget;
	},

	isEmpty: function(uTarget)
	{
		if('length' in uTarget) return uTarget.length;
		for(var i in uTarget){ return false; }
		return true;
	},

	isRubbish: function(uTarget)
	{
		return (uTarget === undefined || uTarget === null || uTarget === NaN);
	},

	winWidth: function(nMutiply)
	{
		return Math.round($w.width() * (nMutiply || 1));
	},

	winHeight: function(nMutiply)
	{
		return Math.round($w.height() * (nMutiply || 1));
	}
});

$.fn.extend(
{
	toFlash: function(sURL, oAttrs, oParams)
	{
		if(!oAttrs) oAttrs = {};
		if(!oAttrs.id) oAttrs.id = this[0].id || 'an-flash-' + $.time(); // IE: must have an id in order to allow JS access
		if(!oAttrs.width) oAttrs.width = 0;
		if(!oAttrs.height) oAttrs.height = 0;

		if(!oParams) oParams = {};
		if(!oParams.allowscriptaccess) oParams.allowscriptaccess = 'always';

		if($.browser.msie)
		{
			oAttrs.classid = 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
			oParams.movie = sURL;
		}
		else
		{
			oAttrs.data = sURL;
			oAttrs.type = 'application/x-shockwave-flash';
		}

		var sAttrs = '';
		var sParams = '';

		$.each(oAttrs, function(sName, sValue)
		{
			sAttrs += $.sprintf('%s="%s" ', sName, sValue);
		});

		$.each(oParams, function(sName, sValue)
		{
			sParams += $.sprintf('<param name="%s" value="%s" />', sName, sValue);
		});

		var sHTML = $.sprintf('<object %s>%s</object>', sAttrs, sParams);

		if($.browser.msie) // IE: element must be created in this way in order to allow JS access
		{
			this[0].outerHTML = sHTML;
		}
		else
		{
			this.replaceWith(sHTML);
		}

		return $('#' + oAttrs.id);
	},

	fn: function(fToExec)
	{
		if(this.length) fToExec.call(this);
		return this;
	},

	outer: function()
	{
		if(!this[0]) return null;

		return this[0].outerHTML ? this[0].outerHTML : $('<div></div>').append(this.eq(0).clone()).html();
	},

	aO: function()
	{
		alert(this.outer());
		return this;
	},

	aL: function()
	{
		alert(this.length);
		return this;
	},

	fadeToggle: function(sSpeed)
	{
		if(!sSpeed) sSpeed = 'normal';
		return this.is(':hidden') ? this.fadeIn(sSpeed) : this.fadeOut(sSpeed);
	},

	up: function(sSelector, nTh)
	{
		if(!nTh) nTh = 1;
		return this.map(function()
		{
			var nCount = 0;
			var eCur = this;
			while(eCur && eCur.ownerDocument)
			{
				eCur = eCur.parentNode;
				if($(eCur).is(sSelector) && ++nCount >= nTh) return eCur;
			}
		});
	},

	own: function(target)
	{
		return this.is(target) || !!this.has(target).length;
	},

	top: function()
	{
		return this.offset().top;
	},

	right: function()
	{
		return this.offset().left + this.innerWidth();
	},

	bottom: function()
	{
		return this.offset().top + this.innerHeight();
	},

	left: function()
	{
		return this.offset().left;
	},

	//--------[AN Related]--------//

	pageName: function()
	{
		if(this.sPageName) return this.sPageName;

		return this.sPageName =
			$('#ctl00_ContentPlaceHolder1_SystemMessageBoard', this).length && 'message' ||
			$('#aspnetForm', this).length && $('#aspnetForm', this).attr('action').match(/[a-z0-9_]+(?=\.aspx)/i)[0].toLowerCase().replace(/_html$/, '') ||
			$('body > :first', this).is('b') && 'terms' ||
			$('#mytt', this).length && 'gogogame' ||
			$('form[action*=".aspx"]', this).length && 'unknown'||
			'error';
	},

	pageCode: function()
	{
		if('nPageCode' in this) return this.nPageCode;

		var sPageName = this.pageName();
		var nPageCode;

		$.each(AN.box.oPageMap, function(sPage)
		{
			if(this.action && (typeof this.action === 'string' ? this.action === sPageName : this.action.test(sPageName)))
			{
				nPageCode = sPage * 1;
				return false;
			}
		});
		if(!nPageCode) nPageCode = 0;

		return (this.nPageCode = nPageCode);
	},

	pageScope: function()
	{
		var jScope = this.closest('div');
		return jScope.length ? jScope : this;
	},

	pageNo: function()
	{
		return this.pageScope().find('select[name=page]:first').val() * 1;
	},

	replies: function(sSelector)
	{
		if(this.jReplies) return this.jReplies;

		var jContents = $();
		var jNameLinks = $();

		var jReplies = this.jReplies = this.find('.repliers')
		.filter(function()
		{
			var jThis = $(this), jTr = jThis.find('.repliers_left').parent();

			jThis.data({
				jContent: jTr.find('.repliers_right td:first'),
				jNameLink: jTr.find('a[href]:first'),
				sUserid: jTr.attr('userid'),
				sUserName: jTr.attr('username')
			});

			if(jThis.data('sUserid')) {
				jContents.push(jThis.data('jContent')[0]);
				jNameLinks.push(jThis.data('jNameLink')[0]);

				return true;
			}
		})
		.extend({
			jContents: jContents,
			jNameLinks: jNameLinks
		});

		return sSelector ? jReplies.filter(sSelector) : jReplies;
	},

	treeTop: function()
	{
		return (this[0] === document || $(document.documentElement).own(this)) ? $d : this;
	},

	topicTable: function()
	{
		if(this.jTopicTable) return this.jTopicTable;

		var jThis = this;
		this.treeTop().find('td,th').filter(function(){ return $(this).children().length === 0; }).each(function()
		{
			if(/\s*回覆/.test($(this).html()))
			{
				jThis.jTopicTable = $(this).up('table');
				return false;
			}
		});

		return this.jTopicTable;
	},

	topics: function(sSelector)
	{
		if(this.jTopics) return this.jTopics;

		var topicTable = this.topicTable();

		if(!topicTable) return;

		var jTopics = this.jTopics = topicTable.find('tr').filter(function(){ return !!$(this).children().children('a').length; });

		jTopics
		.extend(
		{
			jNameLinks: $([]),
			jTitleCells: $([]),
			jTbody: this.topicTable().children()
		})
		.each(function()
		{
			var jThis = $(this), jLinks = jThis.find('a');

			jThis
			.data('jNameLink', jLinks.filter(':last'))
			.data('jTitleCell', jLinks.eq(0).parent())
			.data('sTitle', jLinks.eq(0).html())
			.data('sTopicid', jLinks.eq(0).attr('href').replace(/.+?id=(\d+).*/, '$1'))
			.data('sUserName', jLinks.filter(':last').html());

			jTopics.jNameLinks.push(jThis.data('jNameLink')[0]);
			jTopics.jTitleCells.push(jThis.data('jTitleCell')[0]);
		});

		return sSelector ? jTopics.filter(sSelector) : jTopics;
	},

	defer: function(nPos, uArg, fHandler)
	{
		var oArg = (typeof uArg == 'string') ? { sDesc: uArg, aHandler: [fHandler] } : uArg;
		$.make('a', this, 'aDefer', nPos).push(oArg);

		return this;
	}
});

//////////////////// END OF - [jQuery Extension] ////////////////////
//////////////////// START OF - [AN Extension] ////////////////////

$.extend(AN,
{
	shared: function(sFnName)
	{
		if(AN.shared[sFnName]) return AN.shared[sFnName].apply(null, Array.prototype.slice.call(arguments, 1));
	},

	box:
	{
		aBenchmark: [],
		oTypeMap:
		{
			1: '核心設定',
			2: '樣式設定',
			3: '佈局設定',
			4: '修正修改',
			5: '加入物件',
			6: '其他功能',

			7: 'Ajax化',
			8: '元件重造',
			9: '組合按扭'
		},
		oPageMap:
		{
			65535: { action: null, desc: '所有頁' },
			65534: { action: null, desc: '所有正常頁' },
			1: { action: 'error', desc: '所有錯誤頁' },
			2: { action: 'default', desc: '主論壇頁' },
			4: { action: 'topics', desc: '標題頁' },
			8: {action: /^search\d*$/,  desc: '搜尋頁' },
			16: { action: 'tags', desc: '標籤搜尋頁' },
			32: { action: 'view', desc: '帖子頁' },
			64: { action: 'profilepage', desc: '用戶資料頁' },
			128: { action: 'sendpm', desc: '私人訊息發送頁' },
			256: { action: 'post', desc: '發表/回覆頁' },
			512: { action: 'login', desc: '登入頁' },
			1024: { action: 'giftpage', desc: '人氣頁' },
			2048: { action: 'blog', desc: '網誌頁' },
			4096: { action: 'message', desc: '系統信息頁' },
			8192: { action: 'bookmark', desc: '書籤頁' }
		}
	},

	//--------[Utility Functions]--------//

	util:
	{
		addFnType: function(uType, sDec)
		{
			AN.box.oTypeMap[uType] = sDec;
		},

		stackStyle: function(sStyle)
		{
			if(AN.util.stackStyle.sStyle === undefined)
			{
				AN.util.stackStyle.sStyle = '';
				$d.bind('defer5', function()
				{
					AN.util.addStyle(AN.util.stackStyle.sStyle);
					AN.util.stackStyle.sStyle = '';
				});
			}

			AN.util.stackStyle.sStyle += sStyle;
		},

		addStyle: function(sStyle)
		{
			if(!this.jStyle) this.jStyle = $('<style id="an-style" type="text/css"></style>').appendTo('head');

			if(AN.box.debugMode) sStyle = sStyle.replace(/(^|}|\*\/)\s+/g, '$1\n'); // indentation
			this.jStyle[0].styleSheet ? this.jStyle[0].styleSheet.cssText += sStyle : this.jStyle.append(sStyle);
		},

		cookie: function(sName, sValue, sDomain)
		{
			if(sValue === undefined) // GET
			{
				var match = document.cookie.match(new RegExp("(?:^|;\\s*)" + sName + "=([^;]*)"));
				return match && match[1];
			}
			else
			{
				var dExpire = new Date;
				dExpire.setFullYear(sValue ? 2999 : 1999); // SET : DEL
				document.cookie = $.sprintf('%s=%s; %s expires=%s; path=/', sName, sValue || '', sDomain ? 'domain=' + sDomain + ';': '', dExpire.toUTCString());

				return true;
			}
		},

		storage: function(sName, uToSet)
		{
			var storage = arguments.callee.storage || (arguments.callee.storage =
				AN.box.storageMode == 'Flash' && {
					get: function(sProfile, sName){ return AN.box.eLSO.get(sProfile, sName); },
					set: function(sProfile, sName, sData){ AN.box.eLSO.set(sProfile, sName, sData.replace(/\\/g, '\\\\')); }, // escape the backslash so that it will not be removed on GET
					remove: function(sProfile, sName){ AN.box.eLSO.remove(sProfile, sName); }
				}
				||
				AN.box.storageMode == 'DOM' && (function()
				{
					var LS = window.localStorage || window.globalStorage[location.hostname];
					return {
						get: function(sProfile, sName){ var r = LS[sProfile + '___' + sName]; return r && r.value || r; },
						set: function(sProfile, sName, sData){ LS[sProfile + '___' + sName] = sData; },
						remove: function(sProfile, sName){ LS.removeItem(sProfile + '___' + sName); }
					};
				})()
			);

			var sProfile = 'default';
			var sData = '';

			if(sName === undefined) // SHOW ALL
			{
				$.each(['an_data', 'an_switches', 'an_options'], function()
				{
					var uCookie = storage.get(sProfile, this + '');
					if(uCookie) sData += uCookie + '\n\n';
				});
				return sData;
			}
			else if(sName === null) // DEL ALL
			{
				$.each(['an_data', 'an_switches', 'an_options'], function()
				{
					storage.remove(sProfile, this + '');
					storage.remove(sProfile, this + '_backup');
				});
			}
			else if(uToSet === undefined) // GET
			{
				sData = storage.get(sProfile, sName);
				if(sData) sData = JSON.parse(sData);
				return sData || null;
			}
			else if(uToSet) // SET
			{
				sData = JSON.stringify(uToSet);
				storage.set(sProfile, sName, sData);
			}
			else // DEL
			{
				storage.remove(sProfile, sName);
			}

			return true;
		},

		data: function(sName, uValue)
		{
			var oData = AN.util.storage('an_data') || {};

			// GET
			if(uValue === undefined)
			{
				if(oData[sName] !== undefined)
				{
					return oData[sName];
				}
				return null;
			}
			// SET
			else
			{
				uValue === null ? delete oData[sName] : oData[sName] = uValue;
				return AN.util.storage('an_data', oData);
			}
		},

		getOpenerInfo: function(jDoc, fToExec)
		{
			var oInfo = arguments.callee.oInfo;

			if(oInfo)
			{
				if(oInfo.sId)
				{
					fToExec(oInfo);
				}
				else
				{
					return setTimeout(function(){ AN.util.getOpenerInfo(jDoc, fToExec); }, 100);
				}
			}
			else
			{
				oInfo = arguments.callee.oInfo = {};

				if(jDoc.pageNo() == 1)
				{
					var jOpener = jDoc.replies(':first');
					fToExec(oInfo = { sId: jOpener.data('sUserid'), sName: jOpener.data('sUserName') });
				}
				else
				{
					$.get('/view.aspx?message=' + window.messageid, function(sHTML)
					{
						var jTr = $.doc(sHTML).find('.repliers_left:first').parent();
						oInfo = { sId: jTr.attr('userid'), sName: jTr.attr('username') };
						fToExec(oInfo);
					});
				}
			}
		},

		getOpacityStr: function(nOpacity)
		{
			return $.support.opacity ? $.sprintf('opacity: %s', nOpacity / 10) : $.sprintf('filter: alpha(opacity=%s)', nOpacity * 10);
		},

		getOptions: function(sOptionName)
		{
			var oOptions = $.make('o', arguments.callee, 'oOptions');

			if($.isEmpty(oOptions))
			{
				$.each(AN.box.oOptions, function(sName)
				{
					$.each(this, function(sPage, uValue)
					{
						if($d.pageCode() & sPage)
						{
							oOptions[sName] = uValue;
							return false;
						}
					});
				});
			}

			return sOptionName ? oOptions[sOptionName] : oOptions;
		},

		getForum: function()
		{
			var match = location.hostname.match(/^[^.]+/);
			return match && match[0];
		},

		getPageNo: function(sURL)
		{
			var sExtract = sURL.replace(/.+?page=(\d+).*/i, '$1');
			return isNaN(sExtract) ? 1 : sExtract * 1;
		},

		getURL: function(oParam)
		{
			var oSearch = {};
			var aParam = location.search.substr(1).split('&');
			$.each(aParam, function()
			{
				var aPair = this.split('=');
				if(aPair[1]) oSearch[aPair[0]] = aPair[1];
			});

			$.extend(oSearch, oParam);

			return '?' + $.param(oSearch);
		},

		isLoggedIn: function()
		{
			return !!$('#ctl00_ContentPlaceHolder1_QuickReplyTable').length;
		}
	},

	//--------[Module Functions]--------//

	modFn:
	{
		getDB: function(bGetDefault)
		{
			var oDB = (!AN.box.oSwitches) ? AN.box : {};
			$.extend(oDB, (bGetDefault ? { oSwitches: {}, oOptions: {} } : { oSwitches: AN.util.storage('an_switches') || {}, oOptions: AN.util.storage('an_options') || {} }));

			$.each(AN.mod, function(sMod)
			{
				if(!AN.mod[sMod].fn) return;

				$.make('o', oDB.oSwitches, sMod);

				$.each(AN.mod[sMod].fn, function(sId, oFn)
				{
					if(!oDB.oSwitches[sMod][sId])
					{
						$.make('a', oDB.oSwitches[sMod], sId);

						$.each(oFn.page, function(sPage, uDefault)
						{
							if(uDefault === true || uDefault == 'comp') oDB.oSwitches[sMod][sId].push(sPage * 1);
						});
					}

					if(!oFn.options) return;

					$.each(oFn.options, function(sName, oOption)
					{
						$.make('o', oDB.oOptions, sName);

						$.each(oFn.page, function(sPage)
						{
							if(oDB.oOptions[sName][sPage] === undefined)
							{
								oDB.oOptions[sName][sPage] = oOption.defaultValue;
							}
						});
					});
				});
			});

			return oDB;
		},

		execMods: function(jDoc)
		{
			var nBegin = $.time();

			var execMod = function(sMod)
			{
				if(!(AN.mod[sMod] && AN.mod[sMod].fn)) return;

				AN.box.aBenchmark.push({ type: 'start', name: sMod });

				$.each(AN.mod[sMod].fn, function(sId, oFn)
				{
					$.each(AN.box.oSwitches[sMod][sId], function()
					{
						if(oFn.page[this] != 'disabled' && this in oFn.page && $d.pageCode() & this)
						{
							var aHandler = [];
							if(!AN.firstRan && oFn.once) aHandler.push(oFn.once);
							if(oFn.infinite) aHandler.push(oFn.infinite);

							if(aHandler.length)
							{
								var oArg =
								{
									sDesc: oFn.desc,
									aHandler: aHandler,
									oFn: oFn
								};
								oFn.defer ? jDoc.defer(oFn.defer, oArg) : execFn(oArg);
							}
							return false;
						}
					});
				});

				AN.box.aBenchmark.push({ type: 'end', name: sMod });
			};

			var execFn = function(oArg)
			{
				try
				{
					var nStart = $.time();

					$.each(oArg.aHandler, function()
					{
						this.call(oArg.oFn, jDoc, oArg.oFn);
					});

					AN.box.aBenchmark.push({ type: 'fn', name: oArg.sDesc, time: $.time(nStart) });
				}
				catch(err)
				{
					if(AN.shared.log)
					{
						AN.shared.log('請通知作者有關此錯誤');
						if(err.message) AN.shared.log('錯誤訊息: ' + err.message);
						if(err.type) AN.shared.log('錯誤類型: ' + err.type);
						if(err.lineNumber) AN.shared.log('錯誤行號: ' + err.lineNumber);
						AN.shared.log('出現位置: ' + oArg.sDesc);
						AN.shared.log('出現地址: ' + location.href);
						AN.shared.log($.sprintf('發生錯誤: %s', oArg.sDesc));
					}
					else if(AN.box.debugMode) alert($.sprintf('ERROR ON EXECUATION: %s\r\n%s', oArg.sDesc, err.message));
				}
			};

			if(!jDoc) jDoc = $(document.body);

			execMod('Kernel');
			execMod('User Interface');
			$.each(AN.mod, function(sMod)
			{
				if(sMod != 'Kernel' && sMod != 'User Interface') execMod(sMod);
			});

			setTimeout(function()
			{
				AN.box.aBenchmark.push({ type: 'start', name: '延期執行項目' });

				for(var i=1; i<=5; i++)
				{
					$d.trigger('defer' + i);
					if(jDoc.aDefer && jDoc.aDefer[i])
					{
						$.each(jDoc.aDefer[i], function(){ execFn(this); });
					}
				}
				jDoc.aDefer = null;

				AN.box.aBenchmark.push({ type: 'end', name: '延期執行項目' });

				AN.firstRan = true;
				AN.shared('log2', '所有功能執行完成');

				AN.box.aBenchmark.push({ type: 'final', time: $.time(nBegin) });
			}, 0);
		}
	}
});

//////////////////// END OF - [AN Extension] ////////////////////
//////////////////// START OF - [Initialization] ////////////////////

if(JSON.stringify(document.createElement("input").value)!== "" ) {
	(function(_stringify)
	{
		JSON.stringify = function(o, f, s)
		{
			return _stringify(o === '' ? '' : o , f, s);
		};
	})(JSON.stringify);
}

$.event.special.click = {
	add: function(handleObj)
	{
		handleObj.handler = (function(handler) {
			return function(event)
			{
				if(event.type === 'click' && !(handleObj.data && handleObj.data.disableCheck) && event.button > 0) return;
				handler.apply(this, arguments);
			};
		})(handleObj.handler);
	}
};

$d.bind('click', { disableCheck: true }, function(event)
{
	if($(event.target).closest('a').filter(function(){ return /^(?:#|javascript:)$/.test(this.getAttribute('href')); }).length) event.preventDefault();
});

$.support.localStorage = !!(window.localStorage || window.globalStorage || false);

$(function()
{
	$('<div id="an"><div id="an-lso"></div></div>').appendTo('body');

	function exec(sStorageType)
	{
		AN.box.storageMode = sStorageType;
		AN.modFn.getDB();
		AN.modFn.execMods();
	}

	exec('DOM');
});

//////////////////// END OF - [Initialization] ////////////////////
