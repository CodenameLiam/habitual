import { DefaultTheme, Theme as NavTheme } from '@react-navigation/native';
import { Theme } from '../Types/Theme';
import { ThemeColours } from './Colours';

export const DarkTheme: Theme = {
	text: ThemeColours.dark.text,
	grey: ThemeColours.dark.grey,
	background: ThemeColours.dark.background,
	card: ThemeColours.dark.card,
	disabled: ThemeColours.dark.disabled,
};

export const LightTheme: Theme = {
	text: ThemeColours.light.text,
	grey: ThemeColours.light.grey,
	background: ThemeColours.light.background,
	card: ThemeColours.light.card,
	disabled: ThemeColours.light.disabled,
};

export const NavDarkTheme: NavTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		...DarkTheme,
	},
};

export const NavLightTheme: NavTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		...LightTheme,
	},
};

declare module '@emotion/react' {
	export interface Theme extends Theme {}
}
