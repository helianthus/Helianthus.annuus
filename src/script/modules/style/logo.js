annuus.add({

'2f8ce225-424a-4846-b8ea-59ebaa3fe649': {
	title: '設定高登Logo',
	pages: { on: [all] },
	options: {
		uriHKGLogo: { title: 'Logo位置', type: 'text', defaultValue: '', access: 'public' }
	},
	tasks: {
		'07e7e30d': {
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
