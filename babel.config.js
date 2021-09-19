module.exports = {
	presets: ['module:metro-react-native-babel-preset'],
	plugins: [
		'react-native-reanimated/plugin',
		'@babel/plugin-proposal-export-namespace-from',
		[
			'module-resolver',
			{
				root: ['./src'],
				extensions: [
					'.ios.ts',
					'.android.ts',
					'.ts',
					'.ios.tsx',
					'.android.tsx',
					'.tsx',
					'.jsx',
					'.js',
					'.json',
				],
				alias: {
					Components: './src/Components',
					Screens: './src/Screens',
					Hooks: './src/Hooks',
					Navigation: './src/Navigation',
					Reducers: './src/Reducers',
					Styles: './src/Styles',
					Types: './src/Types',
					Utils: './src/Utils',
				},
			},
		],
	],
};
