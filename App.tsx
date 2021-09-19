import PaperOnboarding, { PaperOnboardingItemType } from '@gorhom/paper-onboarding';
import React, { FC } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<PaperOnboarding data={data} />
			{/* <SafeAreaView>
				<Text>Hello</Text>
			</SafeAreaView> */}
		</GestureHandlerRootView>
	);
};

export default App;
