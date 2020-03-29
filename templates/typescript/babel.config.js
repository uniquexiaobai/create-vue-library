module.exports = {
	presets: [
		[
			'@babel/env',
			{
				corejs: '2',
				modules: false,
				useBuiltIns: 'usage',
			},
		],
	],
	plugins: ['@babel/external-helpers'],
};
