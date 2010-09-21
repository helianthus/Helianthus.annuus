annuus.add({
	id: '1c769cd2-51c4-4235-a608-5bbf3ccce455',
	title: '修正「部份」會員之頭像',
	description: 'IE/FF 3.5+/Chrome/Opera 10.5+/Safari 3.2+',
	pages: { on: [view] },
	tasks: {
		'1232db16-525f-4cf7-83ab-0278fce0d400': {
			run_at: 'document_start',
			css: 'a[href="/ProfilePage.aspx?userid=93457"] > img[alt="Logo"] { transform: rotate(30deg); }'
		}
	}
});
