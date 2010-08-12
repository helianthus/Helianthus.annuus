annuus.addModules({

'8c6e0464-ab52-4bb1-8220-81c100eb70a5': {
	title: '論壇樣式設定',
	pages: { on: [all] },
	options: {
		bgColorContent2: { title: '內容背景顏色(二)', type: 'text', defaultValue: 'ffffff', access: 'public' },
		fcContent2: { title: '內容文字顏色(二)', type: 'text', defaultValue: '999999', access: 'public' },
		fcTime: { title: '時間文字顏色', type: 'text', defaultValue: '800000', access: 'public' },
		fcQuote: { title: '引用文字顏色', type: 'text', defaultValue: '0000a0', access: 'public' }
	},
	tasks: {
		'd15b72b1': {
			service: 'theme-bgfix',
			name: 'theme-forum',
			//----- Welcome to HELL! -----//
			css: '\
				/* anchor */ \
				a.hitsearch_link, \
				a[class^="blog"][class$="_link"], \
				.SideBar_Details_Box a, \
				div.hkg_bb_bookmarkItem, .hkg_bb_bookmarkItem a div \
					{ color: #{0[fcAnchorLink]}; } \
				a.hitsearch_link:hover, \
				a[class^="blog"][class$="_link"]:hover, \
				.SideBar_Details_Box a:hover, \
				.hkg_bb_bookmarkItem_Hover, .hkg_bb_bookmarkItem_Hover a div, .hkg_bb_bookmarkItem_Selected a div \
					{ color: #{0[fcAnchorHover]}; } \
				/* content color */ \
				body, p, td, \
				.txt_11pt_1A3448, /* footer */ \
				.HitSearchText, \
				.ajax__tab_tab, /* profilepage tab */ \
				.redhot_text, /* redhot topic panel */ \
				.PageMiddleFunctions, /* trad-simp conversion */ \
				.addthis_toolbox addthis_default_style, a.addthis_button_compact, /* addThis */ \
				a.BoxLink2, /* default page */ \
				a.hkg_bottombar_link, a.hkg_bottombar_link:hover, \
				a.terms_link, a.terms_link:hover, \
				a.encode_link, a.encode_link:hover, \
				a.redhot_link, a.redhot_link:hover \
					{ color: #{0[fcContent]}; } \
				a[style="color: black;"], /* topic opener */ \
				#txt_newtag, /* post page */ \
				td[style*="color: #333333"] /* blog page page fns */ \
					{ color: #{0[fcContent]} !important; } \
				\
				/* content color 2 */ \
				a.BlockedLink, a.BlockLink:link, a.BlockLink:hover, /* block msg */ \
				.forum_taglabel, .forum_taglabel a, .forum_taglabel a:hover, \
				.bloglabel, a[class].bloglabel_link, a[class].bloglabel_link:hover, \
				.hkg_bb_bookmarkItem_AddNew \
					{ color: #{0[fcContent2]}; } \
				span[style*="color:gray"], /* reply datetime */ \
				span[style*="color: #8C8C8C"] /* msg box remarks */ \
					{ color: #{0[fcContent2]} !important; } \
				\
				/* content border */ \
				div[style="border: solid 1px #000000;"], div[style="border: solid 1px #000000;"] > div, /* view page pagebox */ \
				table[style="border: solid 1px #CCCCCC;"] /* profilepage avater */ \
					{ border-color: #{0[borderColorContent]} !important; } \
				\
				table[border="1"] > tbody > tr > td, /* vote table */ \
				#divPMMessageBody, \
				div[align="center"] > table[width="220"], /* login box */ \
				.repliers > tbody > tr > td[style*="background-color: #F3F2F1"] /* sendpm page */ \
					{ border: 1px solid #{0[borderColorContent]}; } \
				\
				/* special backgrounds */ \
				td[bgcolor="#ccddea"] /* profile info, pm box */ \
					{ background-color: #{0[borderColorContent]}; } \
				\
				#HotTopics > div, /* topic page topic list */ \
				table[style*="background-color:"], /* typical tables */ \
				td[style*="background-color: #808080"] /* msg box */ \
					{ background-color: #{0[borderColorContent]} !important; } \
				\
				/* content 1 */ \
				.blogfunction_window, .blogarchive_window, .blogcategory_window \
					{ border: 1px solid #{0[borderColorContent]}; background: #{0[bgColorContent]}; } \
				\
				div[class^="hkg_"], [class^="hkg_bb_bookmarkItem"] a div \
					{ border-color: #{0[borderColorContent]}; background-color: #{0[bgColorContent]}; } \
				\
				tr[style*="background-color: #F8F8F8"] > td, td[style*="background-color: #F8F8F8"], /* topic row */ \
				[style*="background-color: #F7F3F7"], /* page box */ \
				td[style*="background-color: #F3F2F1"], /* view page replies */ \
				tr[style*="background-color: #F3F2F1"] > td, /* reply preview */ \
				option[style*="background-color: #F1F2F3"], /* msg box color select */ \
				td[style*="background-color: #EEEEEE"], /* login notice */ \
				span[id^="ctl00_ContentPlaceHolder1_tc_Profile_tb"][style*="background-color:"], /* profile info input */ \
				.blogmain_window > table > tbody > tr[style] > td /* newblog page */ \
					{ border-color: #{0[borderColorContent]} !important; background-color: #{0[bgColorContent]} !important; } \
				\
				.BlockedTR td \
					{ border: 1px solid #{0[borderColorContent]}; background-color: #{0[bgColorContent]}; } \
				\
				/* content 2 */ \
				body, \
				.DivMarkThread, \
				td.bloghead, td.blogmain_window, \
				[class*="Details"], \
				[class^="hkg_bbItem_"][class$="_Hover"] \
					{ border-color: #{0[borderColorContent]}; background-color: #{0[bgColorContent2]}; } \
				\
				tr[style*="background-color: #FFFFFF"] > td, td[style*="background-color: #FFFFFF"], \
				div[style*="border: solid 1px #CCCCCC"], /* default page search area */ \
				input[style*="background-color:"], /* post page */ \
				td[style="background-color: white;"] /* message page */ \
					{ border-color: #{0[borderColorContent]} !important; background-color: #{0[bgColorContent2]} !important; } \
				\
				#ctl00_ContentPlaceHolder1_ProfileForm > table > tbody > tr > td > table:first-child .main_table1, /* profile info */ \
				#ctl00_ContentPlaceHolder1_PMTable > tbody > tr > .main_table1, /* send pm table */ \
				.ListPMText, /* pm box */ \
				.ProfileGiftText, /* gift box */ \
				#ctl00_ContentPlaceHolder1_GiftForm .main_table1, /* gift page */ \
				.dialog_table1, /* new bookmark box */ \
				.repliers_left_user_details \
					{ border: 1px solid #{0[borderColorContent]}; background-color: #{0[bgColorContent2]}; } \
				\
				/* header */ \
				.blogmaintitle_link, \
				td[style*="color: white"] /* msg box */ \
					{ color: #{0[fcHeader]} !important; } \
				\
				[class$="title"], [class$="Title"], \
				#HotTopics th, \
				.repliers_header, \
				a.blogmaintitle_link, \
				td[bgcolor="#808080"], /* login box */ \
				div[class^="hkg_bb_bookmark_Title"], \
				a.BoxTitleLink, a.BoxTitleLink:visited, a.BoxTitleLink:hover \
					{ border-color: #{0[borderColorHeader]}; background-color: #{0[bgColorHeader]}; color: #{0[fcHeader]}; } \
				\
				[style*="background-color: #336699"], /* typical header */ \
				td[style*="background-color: #31659C"] /* message page */ \
					{ border: #{0[borderColorHeader]}; background-color: #{0[bgColorHeader]} !important; color: #{0[fcHeader]}; } \
				\
				.repliers > tbody > tr:nth-last-child(2) > td \
					{ border-width: 1px; border-style: solid; } \
				\
				/* corners */ \
				tr:first-child > td[style*="background-color:"]:first-child, \
				#HotTopics tr:first-child > th:first-child, \
				.repliers > tbody > tr:first-child > :first-child, \
				[class$="title"]:first-child \
					{ border-top-left-radius: {0[cornerRadius]}; } \
				\
				tr:first-child > td[style*="background-color:"]:last-child, \
				#HotTopics tr:first-child > th:last-child, \
				.repliers > tbody > tr:first-child > :last-child, \
				[class$="title"]:last-child \
					{ border-top-right-radius: {0[cornerRadius]}; } \
				\
				tr + tr:nth-last-child(2) > td[style*="background-color:"]:first-child, \
				tr + tr[style*="background-color:"]:last-child td:first-child, \
				.repliers > tbody > tr:last-child > :first-child, \
				tr:last-child > td[style*="background-color:"]:first-child, \
				#ctl00_ContentPlaceHolder1_UpdatePanelHistory tr:nth-last-child(2) > td:first-child /* this may not have expected effect */ \
					{ border-bottom-left-radius: {0[cornerRadius]}; } \
				\
				tr + tr:nth-last-child(2) > td[style*="background-color:"]:last-child, \
				tr + tr[style*="background-color:"]:last-child td:last-child, \
				.repliers > tbody > tr:last-child > :last-child, \
				tr:last-child > td[style*="background-color:"]:last-child, \
				#ctl00_ContentPlaceHolder1_UpdatePanelHistory tr:nth-last-child(2) > td:last-child \
					{ border-bottom-right-radius: {0[cornerRadius]}; } \
				\
				[class$="Title"], \
				div[style*="background-color: #336699"]:first-child /* view page page box */ \
					{ border-top-left-radius: {0[cornerRadius]}; border-top-right-radius: {0[cornerRadius]}; } \
				\
				[class*="Details"], \
				div[style*="background-color: #F7F3F7"], /* view page page box */ \
				#ctl00_ContentPlaceHolder1_ProfileForm > table > tbody > tr > td > table:first-child .main_table1, /* profile info */ \
				#divPMMessageBody, /* pm box */ \
				.main_table1, /* gift page */ \
				[class$="_window"], /* blog page */ \
				.dialog_table1 /* add bookmark box */ \
					{ border-bottom-left-radius: {0[cornerRadius]}; border-bottom-right-radius: {0[cornerRadius]}; } \
				\
				table[style*="background-color"], \
				div[style*="border:"], \
				#HotTopics > div, /* topic page topic list */ \
				.ListPMText, /* pm box */ \
				.ProfileGiftText, /* gift box */ \
				.ajax__tab_tab, \
				div[align="center"] > table[width="220"], /* login box */ \
				[class^="hkg_"] \
					{ border-radius: {0[cornerRadius]}; } \
				/* hot people */ \
				td.redhottitle { border-color: #{0[borderColorError]}; background-color: #{0[bgColorError]}; color: #{0[fcError]}; } \
				table[style*="background-color: #ff5560"] { background-color: #{0[borderColorError]} !important; border-top-left-radius: 0; border-top-right-radius: 0; } \
				tr[style*="background-color: #ff5560"] > td { background-color: #{0[bgColorError]}; } \
				td[style*="color: #003366"] { color: #{0[fcError]} !important; } \
				td[style*="color: #003366"] > table td:first-child, td[style="border-right: solid 1px #ff5560;"][style] { border-right: 1px solid #{0[borderColorError]} !important; } \
				td[style*="color: #003366"][style*="width: 70%"], td[style*="color: #003366"] > table { height: 100%; padding: 0; } \
				\
				/* profile info */ \
				#ctl00_ContentPlaceHolder1_tc_Profile { margin-top: 5px; } \
				.p__tab_xp .ajax__tab_tab { border: 1px solid #{0[borderColorDefault]}; background-color: #{0[bgColorDefault]}; color: #{0[fcDefault]}; } \
				.p__tab_xp .ajax__tab_hover .ajax__tab_tab { border-color: #{0[borderColorHover]}; background-color: #{0[bgColorHover]}; color: #{0[fcHover]}; } \
				.p__tab_xp .ajax__tab_active .ajax__tab_tab { border-color: #{0[borderColorActive]}; background-color: #{0[bgColorActive]}; color: #{0[fcActive]}; } \
				\
				/* time */ \
				span[style="color: maroon;"], span[style*="color: #800000"] { color: #{0[fcTime]} !important; } \
				/* quote */ \
				div[style="color: #0000A0;"] { color: #{0[fcQuote]} !important; } \
				\
				/* highlighted background */ \
				td[style*="background-color: #E9EC6C"] { border-color: #{0[borderColorHighlight]} !important; background-color: #{0[bgColorHighlight]} !important; } \
				.repliers_left + td[style*="background-color: #E9EC6C"] td { color: #{0[fcHighlight]}; } \
				/* forum service channel */ \
				td[style*="background-color: #FF0000"] { background-color: #{0[bgColorError]} !important; color: #{0[fcError]} !important; } \
				/* overlay */ \
				.TransparentGrayBackground { background-color: #{0[bgColorOverlay]}; } \
				/* footer */ \
				.FooterPanel > div:first-child { background-color: #{0[borderColorHighlight} !important; } \
				\
				#ctl00_ContentPlaceHolder1_QuickReplyTable td[style*="background-color: #F3F2F1"], /* msg box */ \
				#ctl00_ContentPlaceHolder1_PMMsgTable td[style*="background-color: #F3F2F1"] /* msg box */ \
					{ border-top-left-radius: 0; border-top-right-radius: 0; border-bottom-left-radius: 0; border-bottom-right-radius: 0; } \
				\
				br + .repliers tr[username] > td, \
				#ctl00_ContentPlaceHolder1_ProfileForm .main_table1 > table, #ctl00_ContentPlaceHolder1_ProfileForm .main_table1 tr:first-child > td[style*="background-color:"] /* profilepage lists */ \
					{ border-top-left-radius: 0; border-top-right-radius: 0; } \
				\
				.ProfileBoxDetails, /* bookmark panel */ \
				.hkg_bb_bookmark_TitleBox, .hkg_bb_bookmarkItem_AddNew \
					{ border-bottom-left-radius: 0; border-bottom-right-radius: 0; } \
				\
				tr, \
				#ctl00_ContentPlaceHolder1_QuickReplyTable, /* msg box */ \
				td[bgcolor="#f8f8f8"] /* login page */ \
					{ background-color: transparent !important; } \
				\
				#ctl00_ContentPlaceHolder1_ProfileForm .main_table1,  /* profilepage extra borders */ \
				.hkg_bb_leftpanel > div > div, #btn_hkg_bb_bookmark_item2_AddNewLink \
					{ border: 0; } \
				\
				/* vote table */ \
				table[border="1"] { border-collapse: collapse; border: 0; } \
				/* sendpm page */ \
				.repliers { border: 0 !important; border-collapse: separate !important; border-spacing: 0; } \
				/* view page */ \
				.repliers_left, .repliers > tbody > tr > td[style*="border-right:"] { border-right: 0 !important; } \
				.repliers_left > div > a { outline: 0; } \
				/* default page */ \
				.SideBar_Container + div > img { padding: 0 16px 14px 0; width: 0; height: 0; } \
				/* pm box */ \
				#divPMMessageBody { padding: 0.5em; } \
				/* login box */ \
				div[align="center"] > table[width="220"] { border-spacing: 5px; } \
				/* gender text */ \
				#ctl00_ContentPlaceHolder1_tc_Profile_tb0_lb_sex, .repliers_left > div > a { text-shadow: #fff 0 0 2em; } \
			'
		},

		'b766aea7': {
			option: {
				title: '同時套用於表單元件',
				defaultValue: true
			},
			service: 'theme',
			name: 'style-forms',
			css: '\
				input, textarea, select \
					{ border: 1px inset #{0[borderColorContent]}; background-color: #{0[bgColorContent2]}; color: #{0[fcContent]}; } \
				input:hover, textarea:hover, select:hover, \
				input:focus, textarea:focus, select:focus \
					{ border-style: solid; border-color: #3d7bad #a4c9e3 #b7d9ed #b5cfe7; } \
				\
				#txt_newtag:hover, #txt_newtag:focus /* post page */ \
					{ border-color: #3d7bad #a4c9e3 #b7d9ed #b5cfe7 !important; } \
				\
				button, input[type="button"], input[type="submit"], input[type="reset"] \
					{ border: 1px solid #{0[borderColorDefault]}; background-color: #{0[bgColorDefault]}; color: #{0[fcDefault]}; margin: 2px; cursor: pointer; } \
				button:hover, input[type="button"]:hover, input[type="submit"]:hover, input[type="reset"]:hover \
					{ border: 1px solid #{0[borderColorHover]}; background-color: #{0[bgColorHover]}; color: #{0[fcHover]}; } \
				button:focus, input[type="button"]:focus, input[type="submit"]:focus, input[type="reset"]:focus, \
				button:active, input[type="button"]:active, input[type="submit"]:active, input[type="reset"]:active \
					{ border: 1px solid #{0[borderColorActive]}; background-color: #{0[bgColorActive]}; color: #{0[fcActive]}; } \
				button, input, textarea \
					{ border-radius: {0[cornerRadius]}; } \
				input[type="image"] \
					{ border-radius: 0; } \
			'
		},

		'16fc2c9f': {
			condition: {
				page: profilepage
			},
			condition: {
				is: !$.browser.mozilla
			},
			css: '\
				td[style*="color: #003366"] { padding: 4px; } \
				td[style*="color: #003366"][style*="width: 70%"] { padding: 0; } \
			',
			js: function()
			{
				$('#ctl00_ContentPlaceHolder1_HotPeoples table[cellspacing="1"][cellpadding="4"]').attr('cellpadding', 0);
			}
		}
	}
}

});
