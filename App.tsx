import PaperOnboarding, { PaperOnboardingItemType } from '@gorhom/paper-onboarding';
import React, { FC } from 'react';
import { SafeAreaView, StatusBar, Text, View } from 'react-native';
import { GestureHandlerRootView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import MMKVStorage, { create, useMMKVStorage } from 'react-native-mmkv-storage';

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

const MMKV = new MMKVStorage.Loader().initialize();
export const useStorage = create(MMKV);

const App: FC = () => {
	// MMKV.clearStore();
	// const [user, setUser] = useMMKVStorage<>('user', MMKV, { test: '1', test2: '3' });
	const [user, setUser] = useStorage<{ test: string; test2: string }>('user', { test: '', test2: '' });
	const [colour, setColour] = useStorage('colour', 'green');
	// setUser()

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
				{user && (
					<TextInput
						style={{ padding: 5, backgroundColor: 'salmon' }}
						onChangeText={text => setUser({ ...user, test2: text })}
					/>
				)}
				{user && (
					<TextInput
						style={{ padding: 5, backgroundColor: 'pink' }}
						onChangeText={text => setUser({ ...user, test: text })}
					/>
				)}
				<Text>{JSON.stringify(user)}</Text>
				<Text>{colour}</Text>

				<TouchableOpacity onPress={() => setColour('green')}>
					<Text>Green</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => setColour('orange')}>
					<Text>Orange</Text>
				</TouchableOpacity>
				<View style={{ padding: 10, backgroundColor: colour }} />
			</SafeAreaView>
			{/* <PaperOnboarding data={data} /> */}
			{/* <SafeAreaView> */}

			{/* </SafeAreaView> */}
		</GestureHandlerRootView>
	);
};

export default App;
