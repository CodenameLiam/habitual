import PaperOnboarding, { PaperOnboardingItemType } from '@gorhom/paper-onboarding';
import React, { FC } from 'react';
import { Appearance, ColorSchemeName, SafeAreaView, StatusBar, Text, View } from 'react-native';
import { GestureHandlerRootView, Switch, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import MMKVStorage, { create, useMMKVStorage } from 'react-native-mmkv-storage';
import { NavigationContainer } from '@react-navigation/native';
import { Full } from 'Styles/Globals';
import { NavDarkTheme, NavLightTheme } from 'Styles/Themes';
import { Colour } from 'Types/Theme';
import useStorage from 'Hooks/useStorage';

const data: PaperOnboardingItemType[] = [
	{
		title: 'Hotels',
		description: 'All hotels and hostels are sorted by hospitality rating',
		backgroundColor: '#698FB8',
		//   image: /* IMAGE COMPONENT */,
		//   icon: /* ICON COMPONENT */,
		//   content: /* CUSTOM COMPONENT */,
	},
	{
		title: 'Banks',
		description: 'We carefully verify all banks before add them into the app',
		backgroundColor: '#6CB2B8',
		//   image: /* IMAGE COMPONENT */,
		//   icon: /* ICON COMPONENT */,
		//   content: /* CUSTOM COMPONENT */,
	},
	{
		title: 'Stores',
		description: 'All local stores are categorized for your convenience',
		backgroundColor: '#9D8FBF',
		//   image: /* IMAGE COMPONENT */,
		//   icon: /* ICON COMPONENT */,
		//   content: /* CUSTOM COMPONENT */,
	},
];

const App: FC = () => {
	// MMKV.clearStore();
	const [theme, setTheme] = useStorage<ColorSchemeName>('theme', Appearance.getColorScheme());
	const [colour, setColour] = useStorage<Colour>('colour', 'GREEN');

	return (
		<GestureHandlerRootView style={Full}>
			<NavigationContainer theme={theme === 'dark' ? NavDarkTheme : NavLightTheme}>
				<SafeAreaView style={[Full, { backgroundColor: 'white' }]}>
					<Text>{theme}</Text>
					<Switch value={theme === 'dark'} onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
				</SafeAreaView>
			</NavigationContainer>
		</GestureHandlerRootView>
	);
};

export default App;
