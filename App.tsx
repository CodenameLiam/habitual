import PaperOnboarding, { PaperOnboardingItemType } from '@gorhom/paper-onboarding';
import React, { FC, useMemo } from 'react';
import { Appearance, ColorSchemeName, SafeAreaView, StatusBar, Text, View } from 'react-native';
import { GestureHandlerRootView, Switch, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import MMKVStorage, { create, useMMKVStorage } from 'react-native-mmkv-storage';
import { NavigationContainer } from '@react-navigation/native';
import { Full } from 'Styles/Globals';
import { DarkTheme, LightTheme, NavDarkTheme, NavLightTheme } from 'Styles/Themes';
import { Colour } from 'Types/Theme';
import useStorage from 'Hooks/useStorage';
import { ThemeProvider } from '@emotion/react';

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

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const Test: FC = () => {
	return (
		<View>
			<Text>Yoooo</Text>
		</View>
	);
};

const App: FC = () => {
	// MMKV.clearStore();
	const [theme, setTheme] = useStorage<ColorSchemeName>('theme', Appearance.getColorScheme());
	const [colour, setColour] = useStorage<Colour>('colour', 'GREEN');

	const dark = useMemo(() => theme === 'dark', [theme]);

	return (
		<GestureHandlerRootView style={Full}>
			<ThemeProvider theme={dark ? DarkTheme : LightTheme}>
				<NavigationContainer theme={dark ? NavDarkTheme : NavLightTheme}>
					<Stack.Navigator>
						<Stack.Screen name="Test" component={Test} />
					</Stack.Navigator>
					{/* <SafeAreaView style={[Full, { backgroundColor: 'white' }]}>
						<Text>{theme}</Text>
						<Switch value={theme === 'dark'} onChange={() => setTheme(dark ? 'light' : 'dark')} />
					</SafeAreaView> */}
				</NavigationContainer>
			</ThemeProvider>
		</GestureHandlerRootView>
	);
};

export default App;
