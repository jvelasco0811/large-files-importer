export default [
	{
		env: {
			browser: true,
			es2021: true,
			node: true,
		},
		extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
		overrides: [
			{
				env: {
					node: true,
				},
				files: ['.eslintrc.{js,cjs}'],
				// parserOptions: {
				// 	project: './tsconfig.json',
				// },
			},
		],
		parser: '@typescript-eslint/parser',
		parserOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
		},
		plugins: ['@typescript-eslint'],
		rules: {},
	},
]
