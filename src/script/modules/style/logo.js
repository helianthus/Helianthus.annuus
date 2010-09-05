annuus.add({

'2f8ce225-424a-4846-b8ea-59ebaa3fe649': {
	title: '設定高登Logo',
	pages: { on: [all] },
	options: {
		uriHKGLogo: { title: 'Logo位置', type: 'text', defaultValue: '', access: 'public' }
	},
	tasks: {
		'8732054c-a7cd-4350-9d61-920bd5156e06': {
			service: 'theme',
			name: 'theme-logo',
			js: function(self, theme)
			{
				return theme.uriHKGLogo
				?	'\
						#ctl00_TopBarHomeLink { display: block; background-image: url("{0[uriHKGLogo]}"); } \
						#ctl00_TopBarHomeImage { visibility: hidden; } \
					'
				: '';
			}
		}
	}
}

});
