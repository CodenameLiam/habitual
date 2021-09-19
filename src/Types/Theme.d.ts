export interface Theme {
	text: string;
	background: string;
	card: string;
	grey: string;
	disabled: string;
}

export interface ThemeType {
	dark: Theme;
	light: Theme;
}

export interface Gradient {
	start: string;
	end: string;
	solid: string;
}

export type Colour =
	| 'MIDNIGHT'
	| 'PURPLE'
	| 'RED'
	| 'ORANGE'
	| 'TANGERINE'
	| 'YELLOW'
	| 'BLUE'
	| 'SKY'
	| 'AQUA'
	| 'GREEN'
	| 'LIME'
	| 'PINK';
