// Design tokens following Apple HIG
export const Colors = {
	// Primary - Couple Colors
	green: {
		primary: "#34C759",
		light: "#A8E6CF",
		dark: "#248A3D",
	},
	purple: {
		primary: "#AF52DE",
		light: "#D4A5E8",
		dark: "#8A2BE2",
	},
	// Semantic
	red: {
		completion: "#FF3B30",
		light: "#FF6961",
		dark: "#CC2F26",
	},
	// iOS System Colors
	system: {
		blue: "#007AFF",
		green: "#34C759",
		indigo: "#5856D6",
		orange: "#FF9500",
		pink: "#FF2D55",
		purple: "#AF52DE",
		red: "#FF3B30",
		teal: "#5AC8FA",
		yellow: "#FFCC00",
	},
	// Neutral Scale
	gray: {
		50: "#F2F2F7",
		100: "#E5E5EA",
		200: "#D1D1D6",
		300: "#C7C7CC",
		400: "#8E8E93",
		500: "#636366",
		600: "#48484A",
		700: "#3A3A3C",
		800: "#2C2C2E",
		900: "#1C1C1E",
	},
	// Background
	background: {
		primary: "#F2F2F7",
		surface: "#FFFFFF",
		secondary: "#F2F2F7",
	},
	// Text
	text: {
		primary: "#000000",
		secondary: "#8E8E93",
		tertiary: "#C7C7CC",
	},
	// Border
	border: {
		default: "#D1D1D6",
		light: "#E5E5EA",
	},
} as const;

// Spacing following 4pt grid
export const Spacing = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
	"2xl": 48,
	"3xl": 64,
} as const;

// Border radius
export const BorderRadius = {
	sm: 8,
	md: 12,
	lg: 16,
	xl: 20,
	full: 9999,
} as const;

// Typography scale
export const Typography = {
	fontFamily: {
		sans: "System",
		mono: "Menlo",
	},
	fontSize: {
		xs: 12,
		sm: 14,
		base: 16,
		lg: 18,
		xl: 20,
		"2xl": 24,
		"3xl": 30,
		"4xl": 36,
	},
	fontWeight: {
		normal: "400",
		medium: "500",
		semibold: "600",
		bold: "700",
	},
	lineHeight: {
		tight: 1.25,
		normal: 1.5,
		relaxed: 1.75,
	},
} as const;

// Shadows
export const Shadows = {
	sm: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 1,
	},
	md: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.07,
		shadowRadius: 6,
		elevation: 3,
	},
	lg: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.1,
		shadowRadius: 15,
		elevation: 5,
	},
} as const;

export const Theme = {
	colors: Colors,
	spacing: Spacing,
	borderRadius: BorderRadius,
	typography: Typography,
	shadows: Shadows,
} as const;

export default Theme;
